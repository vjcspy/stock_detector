import os
import sys

sys.path.insert(1, os.getcwd())

from modules.core.mongo.connection import connect_db
from modules.job_sync.document.JobResult import JobResult

connect_db()

job_result = JobResult(jobKey="test_from_python")
job_result.result = {"ok": 123}
job_result.save()
