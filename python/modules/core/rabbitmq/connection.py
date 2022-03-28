import pika

from modules.core.util.cfg import cfg

config = cfg()


def get_rabbit_connection():
    credentials = pika.PlainCredentials(config.get('RABBITMQ_DEFAULT_USER'), config.get('RABBITMQ_DEFAULT_PASS'))
    connection = pika.BlockingConnection(pika.ConnectionParameters(
        host=config.get('RABBITMQ_HOST'), port=config.get('RABBITMQ_PORT'), credentials=credentials))

    return connection
