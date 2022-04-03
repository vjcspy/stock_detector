from datetime import datetime

from mongoengine import StringField, DateTimeField, DictField, DynamicDocument


class JobResultDocument(DynamicDocument):
	jobId = StringField(required=True)
	jobKey = StringField(required=True)
	result = DictField()
	createdAt = DateTimeField(default=datetime.now)

	meta = {
		'collection': 'jobresults'
	}
