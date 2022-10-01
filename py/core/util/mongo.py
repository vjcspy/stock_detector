from mongoengine import connect

from core.util.cfg import cfg

config = cfg()


def connect_mongo_db():
    connect(
        config.get('MONGO_DATABASE'),
        host=config.get('MONGO_HOST'),
        port=int(config.get('MONGO_PORT')),
        username=config.get('MONGO_DEFAULT_USER'),
        password=config.get('MONGO_DEFAULT_PASS')
    )
