import datetime


class Time:
	day: str = "day"
	night: str = "night"

	def get() -> str:
		hours = datetime.datetime.now().hour
		if hours >= 18:
			return Time.night
		elif hours > 8:
			return Time.day
		else:
			return Time.night