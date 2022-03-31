from abc import ABC

from modules.job_sync.model.job_worker import JobWorker


class BetaWorker(JobWorker):
	@property
	def job_id(self):
		return "compute.ge.beta"

	def handle(self, ch, method, properties, body):
		print('compute beta')
