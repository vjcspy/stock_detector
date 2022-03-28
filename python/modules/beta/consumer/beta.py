import json

from modules.beta.calculate.beta import cal_beta
from modules.core.mongo.connection import connect_mongo_db
from modules.core.rabbitmq.connection import get_rabbit_connection
from modules.job_sync.document.JobResult import JobResult

connect_mongo_db()
rabbit_connection = get_rabbit_connection()
channel = rabbit_connection.channel()

# make sure exchange existed
channel.exchange_declare(exchange='finan.analysis.calculate.beta', exchange_type='topic', durable=True)

# declare queue
result = channel.queue_declare('compute.beta.queue', exclusive=False, durable=True)
queue_name = result.method.queue

# bind queue to exchange
channel.queue_bind(exchange='finan.analysis.calculate.beta', queue=queue_name, routing_key='finan.analysis.beta.cor')

print(' [*] Waiting for calculate beta. To exit press CTRL+C')


def callback(ch, method, properties, body):
	# print(" [x] %r:%r" % (method.routing_key, body.decode("utf-8")))
	data: dict = json.loads(body.decode("utf-8"))

	if isinstance(data, dict):
		code = data.get('code')
		period = data.get('code')
		prices: dict = data.get('prices')

		if isinstance(prices, dict):
			index_prices = prices.get('index_prices')
			stock_prices = prices.get('stock_prices')
			beta = cal_beta(stock_prices, index_prices)
			print(f"{code}|{period}|{beta}")
			job_result = JobResult(jobKey=f"calculate_beta_{code}_{period}")
			job_result.result = {"beta": beta}
			job_result.save()


channel.basic_consume(
	queue=queue_name, on_message_callback=callback, auto_ack=True)
channel.basic_qos(prefetch_count=1)
channel.start_consuming()
