from datetime import datetime

from mongoengine import Document, StringField, MapField, DateTimeField, DictField


class JobResult(Document):
    jobKey = StringField(required=True)
    result = DictField()
    createdAt = DateTimeField(default=datetime.now)
