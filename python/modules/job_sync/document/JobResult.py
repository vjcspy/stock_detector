from datetime import datetime

from mongoengine import StringField, DateTimeField, DictField, DynamicDocument


class JobResult(DynamicDocument):
	jobKey = StringField(required=True)
	result = DictField()
	createdAt = DateTimeField(default=datetime.now)

	meta = {
		'collection': 'jobresults'
	}
