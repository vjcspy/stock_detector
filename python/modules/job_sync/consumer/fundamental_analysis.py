from modules.compute.worker.fundalmental_analysis.analysis_sector import AnalysisSectorWorker
from modules.job_sync.model.job_consumer import JobConsumer

# Queue này chưa tất cả những job liên quan đến fundamental analysis

EXCHANGE = 'fi.analysis.compute'
QUEUE = 'fi.analysis.compute.fundamental-analysis.queue'
ROUTING_KEY = 'fi.analysis.compute.fundamental-analysis.*'

WORKERS = [AnalysisSectorWorker()]

coms = JobConsumer(exchange=EXCHANGE, queue=QUEUE, routing_key=ROUTING_KEY, workers=WORKERS)
coms.run()
