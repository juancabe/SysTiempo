import requests as rq
from datetime import datetime, timedelta
import pandas as pd

class WeatherData:
	def __init__(self, index, temp, hum, time):
		self.index = index
		self.temp = temp
		self.hum = hum
		self.time = time
		self.formattedTime = self.time_to_human_readable(2)

	@classmethod
	def from_string(cls, data_string):
		if data_string == "":
			return None
		data_string = data_string.replace("{", "").replace("}", "")
		data_parts = data_string.split(",")
		index = int(data_parts[0].split(":")[1])
		temp = float(data_parts[1].split(":")[1])
		hum = float(data_parts[2].split(":")[1])
		time = int(data_parts[3].split(":")[1])
		return cls(index, temp, hum, time)

	def time_to_human_readable(self, timeZone = 0):
		start_of_year = datetime(datetime.now().year, 1, 1)
		total_minutes = self.time * 10
		measurement_time = start_of_year + timedelta(minutes=total_minutes)
		measurement_time += timedelta(hours=timeZone)
		return measurement_time.strftime('%Y-%m-%d %H:%M:%S')
	
	def __str__(self):
		return (f"Index: {self.index}, Temp: {self.temp}°C, "
				f"Humidity: {self.hum}%, Time: {self.time_to_human_readable(2)}")

def receive_data(url):
	r = rq.get(url)

	expectedResponse = url.split("//")[1].split(".")[0]
	if(r.text != expectedResponse):
		raise Exception("Error: wrong response")

	url += "weathervector"
	r = rq.get(url)
	toParse = r.text.split("\r\n")
		
	for obj in toParse:
		if obj == "--44Mp--":
			toParse.remove(obj)
		
	listOfWeatherData = []

	for obj in toParse:
		weatherData = WeatherData.from_string(obj)
		if weatherData is not None:
			listOfWeatherData.append(weatherData)
	
	return listOfWeatherData

	

def main():
	
	listOfWeatherData_fuera = receive_data("http://esp8266fuera.local/")
	listOfWeatherData_dentro = receive_data("http://esp8266dentro.local/")

	# Represent the data in a pandas graph x = date y = temp
	# save it as an image in rsc folder
	df_fuera = pd.DataFrame([vars(obj) for obj in listOfWeatherData_fuera])
	df_fuera.plot(x='formattedTime', y='temp', kind='line').get_figure().savefig('rsc/fuera/tem.png')
	df_fuera.plot(x='formattedTime', y='hum', kind='line').get_figure().savefig('rsc/fuera/hum.png')

	df_dentro = pd.DataFrame([vars(obj) for obj in listOfWeatherData_dentro])
	df_dentro.plot(x='formattedTime', y='temp', kind='line').get_figure().savefig('rsc/dentro/tem.png')
	df_dentro.plot(x='formattedTime', y='hum', kind='line').get_figure().savefig('rsc/dentro/hum.png')
	

	




if __name__ == "__main__":
	main()