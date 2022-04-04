import json

from modules.job_sync.model.job_logger import consumer_logger
from modules.job_sync.model.job_worker import JobWorker


class GrossProfitWorker(JobWorker):
	@property
	def job_id(self):
		return 'fun.ana.gp'

	def handle(self, ch, method, properties, body):
		consumer_logger.info(f"[worker] start calculate gross profit for fundamental analysis")
		data: dict = json.loads(body.decode("utf-8"))
		print(data)

		if not isinstance(data, dict):
			return

		payload = data.get('payload')

		if not isinstance(payload, dict):
			return

		# KHÔNG CHỈ LÀM VỚI GP, MÀ PHẢI LÀM VỚI TOÀN BỘ CÁC CHỈ SỐ KHÁC CẦN TÍNH THEO KIỂU NÀY
		# Với mỗi một cổ phiếu trong sector, tính ra tỷ suất lợi nhuận gộp biên
		# 1. đi từng năm và tính bình quân của cả sector trong năm đó
		# 2. tính độ lệch chuẩn của tỷ suất này qua các năm

		fiSector = payload.get('fiSector')

		gpSectorData = [
			# Tổ chức dữ liệu của sector, cái này sẽ save xuống result {} bao gồm key: all_sector, theo từng mã
		]

		if not isinstance(fiSector, dict):
			return

		# stockFi là list fi-indicator của cổ phiếu qua các năm
		for code, stockFi in fiSector.items():
			if not isinstance(stockFi, list):
				break

			listGPM = [
				fi['grossProfitMargin'] for fi in stockFi if
				isinstance(fi.get('grossProfitMargin'), str) and fi.get('grossProfitMargin').isnumeric()]

			# Tính độ lệch chuẩn của list gross profit margin

			for fi in stockFi:
				if not isinstance(fi, dict):
					break

				# Lấy list các bản ghi indicator của ngành trong năm này
				# Tìm xem trong gpSectorData đã có giá trị trung bình của ngành ở năm này chưa,
				# Nếu chưa có thì: Tính giá trị trung bình của ngành trong năm này và lưu vào gpSectorData
				year = fi.get('year')
