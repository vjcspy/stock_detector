from modules.compute.worker.fundalmental_analysis.gross_profit import GrossProfitWorker
from modules.job_sync.model.job_consumer import JobConsumer

EXCHANGE = 'fi.analysis.compute'
QUEUE = 'fi.analysis.compute.fundamental-analysis.queue'
ROUTING_KEY = 'fi.analysis.compute.fundamental-analysis.*'

WORKERS = [GrossProfitWorker()]

coms = JobConsumer(exchange=EXCHANGE, queue=QUEUE, routing_key=ROUTING_KEY, workers=WORKERS)
coms.run()
