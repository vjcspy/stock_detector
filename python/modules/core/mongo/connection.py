from mongoengine import connect
from dotenv import load_dotenv, dotenv_values

load_dotenv()
config = dotenv_values(".env")


def connect_db():
    connect(
        'nstock',
        host=config.get('MONGO_HOST'),
        port=int(config.get('MONGO_PORT')),
        username=config.get('MONGO_DEFAULT_USER'),
        password=config.get('MONGO_DEFAULT_PASS')
    )
