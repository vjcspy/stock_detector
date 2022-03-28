from modules.core.rabbitmq.connection import get_rabbit_connection


def get_connection():
	return get_rabbit_connection()
