from modules.job_sync.model.job_worker import JobWorker


class TestWorker(JobWorker):
	@property
	def job_id(self):
		return "compute.ge.test"

	def handle(self, ch, method, properties, body):
		print('Run test worker')
