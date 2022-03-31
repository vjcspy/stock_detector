import json
from abc import abstractmethod, ABC
from termcolor import colored

from modules.core.mongo.connection import connect_mongo_db
from modules.core.rabbitmq.connection import get_rabbit_connection
from modules.job_sync.model.job_worker import JobWorker


class JobConsumer(ABC):
	__acceptable_keys_list = ['exchange', 'queue', 'routing_key', 'workers']

	def __init__(self, **kwargs):
		[self.__setattr__(key, kwargs.get(key)) for key in self.__acceptable_keys_list]

	def _handle_message(self, ch, method, properties, body):
		data: dict = json.loads(body.decode("utf-8"))

		if isinstance(data, dict):
			job_id = data.get('job_id')
			print(f'receive job: {colored(job_id, "blue")}')
			if isinstance(job_id, str) and job_id != '':
				worker: JobWorker = next(filter(lambda w: w.job_id == job_id, self.workers), None)
				if worker:
					worker.handle(ch, method, properties, body)

	def run(self) -> None:
		EXCHANGE = self.exchange
		QUEUE = self.queue
		ROUTING_KEY = self.routing_key

		connect_mongo_db()
		rabbit_connection = get_rabbit_connection()
		channel = rabbit_connection.channel()

		# make sure exchange existed
		channel.exchange_declare(exchange=EXCHANGE, exchange_type='topic', durable=True)

		# declare queue
		result = channel.queue_declare(QUEUE, exclusive=False, durable=True)
		queue_name = result.method.queue

		# bind queue to exchange
		channel.queue_bind(exchange=EXCHANGE, queue=queue_name, routing_key=ROUTING_KEY)

		print(
			f' [*] Waiting for queue {colored(QUEUE, "blue")} routing key {colored(ROUTING_KEY, "blue")}. To exit press CTRL+C')

		channel.basic_consume(
			queue=queue_name, on_message_callback=self._handle_message, auto_ack=True)
		channel.basic_qos(prefetch_count=1)
		channel.start_consuming()
