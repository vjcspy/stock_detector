from abc import ABC, abstractmethod, abstractproperty


class JobWorker(ABC):
	@property
	@abstractmethod
	def job_id(self):
		pass

	@abstractmethod
	def handle(self, ch, method, properties, body):
		pass
