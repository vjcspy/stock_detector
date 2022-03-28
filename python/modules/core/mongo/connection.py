from mongoengine import connect

from modules.core.util.cfg import cfg

config = cfg()


def connect_mongo_db():
	connect(
		'nstock',
		host=config.get('MONGO_HOST'),
		port=int(config.get('MONGO_PORT')),
		username=config.get('MONGO_DEFAULT_USER'),
		password=config.get('MONGO_DEFAULT_PASS')
	)
