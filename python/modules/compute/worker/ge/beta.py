import json

from modules.compute.calculate.ge.beta import cal_beta
from modules.job_sync.document.job_result import JobResultDocument
from modules.job_sync.model.job_logger import consumer_logger
from modules.job_sync.model.job_worker import JobWorker


class BetaWorker(JobWorker):
	@property
	def job_id(self):
		return "compute.ge.beta"

	def handle(self, ch, method, properties, body):
		consumer_logger.info(f"[worker] start calculate beta")
		beta = None
		data: dict = json.loads(body.decode("utf-8"))

		if isinstance(data, dict):
			payload = data.get('payload')

			if isinstance(payload, dict):
				code = payload.get('code')
				period = payload.get('period')
				prices: dict = payload.get('prices')

				if isinstance(prices, dict):
					error = False
					try:
						index_prices = prices.get('index_prices')
						stock_prices = prices.get('stock_prices')
						beta = cal_beta(stock_prices, index_prices)
						consumer_logger.info(f"{code}|{period}|{beta}")
					except:
						error = True
						print("Error")

					job_result = JobResultDocument(jobKey=f"calculate|beta|{code}|{period}", jobId=self.job_id)
					job_result.result = {"beta": beta, "is_error": error, "period": period, "code": code}
					job_result.save()

					return

		consumer_logger.error(f"[worker] calculate beta error wrong data format")
