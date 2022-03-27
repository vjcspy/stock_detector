import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host="vm",port=5672))
channel = connection.channel()
