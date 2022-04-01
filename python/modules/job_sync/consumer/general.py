from modules.compute.worker.ge.beta import BetaWorker
from modules.compute.worker.ge.test import TestWorker
from modules.job_sync.model.job_consumer import JobConsumer

EXCHANGE = 'fi.analysis.compute'
QUEUE = 'fi.analysis.compute.queue'
ROUTING_KEY = 'fi.analysis.compute.ge.*'  # Có thể là computed.general.beta/computed.general.indicator...

WORKERS = [TestWorker(), BetaWorker()]

generalComputed = JobConsumer(exchange=EXCHANGE, queue=QUEUE, routing_key=ROUTING_KEY, workers=WORKERS)
generalComputed.run()
