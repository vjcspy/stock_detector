import pika


def get_connection():
	credentials = pika.PlainCredentials('rabbitmq', '123456aA@')
	connection = pika.BlockingConnection(pika.ConnectionParameters(
		host="vm", port=5672, credentials=credentials))

	return connection
