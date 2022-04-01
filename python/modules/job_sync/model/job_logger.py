# create logger with 'spam_application'
import logging

from modules.core.logging.custom_formatter import CustomFormatter

consumer_logger = logging.getLogger("CONSUMER")
consumer_logger.setLevel(logging.DEBUG)

# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

ch.setFormatter(CustomFormatter())

consumer_logger.addHandler(ch)
