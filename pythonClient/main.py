import requests as rq
from datetime import datetime, timedelta
import pandas as pd
import sys
from PIL import Image

class WeatherData:
	def __init__(self, index, temp, hum, time, year):
		self.index = index
		self.temp = temp
		self.hum = hum
		self.time = time
		self.year = year

	@classmethod
	def from_req_string(cls, data_string, year):
		if data_string == "":
			return None
		data_string = data_string.replace("{", "").replace("}", "")
		data_parts = data_string.split(",")
		index = int(data_parts[0].split(":")[1])
		temp = float(data_parts[1].split(":")[1])
		hum = float(data_parts[2].split(":")[1])
		time = int(data_parts[3].split(":")[1])
		return cls(index, temp, hum, time, year)
	
	@classmethod
	def from_string(cls, data_string):
		if data_string == "":
			return None
		data_parts = data_string.split(",")
		index = int(data_parts[0])
		temp = float(data_parts[1])
		hum = float(data_parts[2])
		time = int(data_parts[3])
		year = int(data_parts[4])
		return cls(index, temp, hum, time, year)

	def time_to_human_readable(self, timeZone = 0):
		start_of_year = datetime(self.year, 1, 1)
		total_minutes = self.time * 10
		measurement_time = start_of_year + timedelta(minutes=total_minutes)
		measurement_time += timedelta(hours=timeZone)
		return measurement_time.strftime('%Y-%m-%d %H:%M:%S')
	
	def __str__(self):
		return (f"{self.index},{self.temp},{self.hum},{self.time},{self.year}")

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
	lastTime = 0
	year = datetime.now().year

	for obj in toParse:
		weatherData = WeatherData.from_req_string(obj, year)
		if weatherData is not None:
			if weatherData.time > lastTime:
				lastTime = weatherData.time
			else:
				year -= 1
				lastTime = 0

	lastTime = 0

	for obj in toParse:
		weatherData = WeatherData.from_req_string(obj, year)
		if weatherData is not None:
			listOfWeatherData.append(weatherData)
			if weatherData.time > lastTime:
				lastTime = weatherData.time
			else:
				year += 1
				lastTime = 0


	
	return listOfWeatherData

def save_data(listOfWeatherData, filename):
	with open(filename, 'w') as f:
		for obj in listOfWeatherData:
			f.write(str(obj) + "\n")

def read_data(filename):
	listOfWeatherData = []
	with open(filename, 'r') as f:
		for line in f:
			listOfWeatherData.append(WeatherData.from_string(line))
	return listOfWeatherData

def merge_data(listOfWeatherData1, listOfWeatherData2):
	mergedList = listOfWeatherData2
	try:
		maxTime = listOfWeatherData1[-1].time
		minTime = listOfWeatherData1[0].time
		maxYear = listOfWeatherData1[-1].year
		minYear = listOfWeatherData1[0].year
	except:
		maxTime = 0
		minTime = -1
		maxYear = 0
		minYear = 0

	for obj in listOfWeatherData1:
		if obj.year > maxYear and obj.time > maxTime:
			mergedList.append(obj)
		elif obj.time < minTime and obj.year < minYear:
			mergedList.insert(0, obj)
	
	return mergedList

def updateDataFile():

	try:
		listOfWeatherDataFromFile_fuera = read_data("fuera.txt")
	except:
		listOfWeatherDataFromFile_fuera = []
	try:
		listOfWeatherDataFromFile_dentro = read_data("dentro.txt")
	except:
		listOfWeatherDataFromFile_dentro = []

	return listOfWeatherDataFromFile_fuera, listOfWeatherDataFromFile_dentro

def updateDataReq(listOfWeatherDataFromFile_fuera, listOfWeatherDataFromFile_dentro):

	listOfWeatherDataReq_fuera = receive_data("http://esp8266fuera.local/")
	listOfWeatherDataReq_dentro = receive_data("http://esp8266dentro.local/")

	listOfWeatherData_fuera = merge_data(listOfWeatherDataFromFile_fuera, listOfWeatherDataReq_fuera)
	listOfWeatherData_dentro = merge_data(listOfWeatherDataFromFile_dentro, listOfWeatherDataReq_dentro)

	save_data(listOfWeatherData_fuera, "fuera.txt")
	save_data(listOfWeatherData_dentro, "dentro.txt")

	return listOfWeatherData_fuera, listOfWeatherData_dentro

def see_data(listOfWeatherData_fuera, listOfWeatherData_dentro):
	df_fuera = pd.DataFrame([vars(obj) for obj in listOfWeatherData_fuera])
	df_dentro = pd.DataFrame([vars(obj) for obj in listOfWeatherData_dentro])
	df_fuera.plot(x='time', y='temp', kind='line').get_figure().savefig('rsc/fuera/tem.png')
	df_fuera.plot(x='time', y='hum', kind='line').get_figure().savefig('rsc/fuera/hum.png')
	df_dentro.plot(x='time', y='temp', kind='line').get_figure().savefig('rsc/dentro/tem.png')
	df_dentro.plot(x='time', y='hum', kind='line').get_figure().savefig('rsc/dentro/hum.png')

	# Join all images in one
	# https://stackoverflow.com/questions/30227466/combine-several-images-horizontally-with-python

	images = [Image.open('rsc/fuera/tem.png'), Image.open('rsc/fuera/hum.png'), Image.open('rsc/dentro/tem.png'), Image.open('rsc/dentro/hum.png')]
	widths, heights = zip(*(i.size for i in images))

	total_width = sum(widths)
	max_height = max(heights)

	new_im = Image.new('RGB', (total_width, max_height))

	x_offset = 0
	for im in images:
		new_im.paste(im, (x_offset,0))
		x_offset += im.size[0]

	new_im.save('rsc/all.png')
	new_im.show()

def printData(listOfWeatherData):
	for obj in listOfWeatherData:
		print(f"Index: {obj.index} Temperature: {obj.temp} Humidity: {obj.hum} Time: {obj.time_to_human_readable(2)}")

def main():
	listOfWeatherData_fuera, listOfWeatherData_dentro = updateDataFile()
	while True:
		print("1. Update data from sensors")
		print("2. See data img")
		print("3. See data terminal")
		print("4. Exit")
		option = input("Select an option: ")
		if option == "1":
			listOfWeatherData_fuera, listOfWeatherData_dentro = updateDataReq(listOfWeatherData_fuera, listOfWeatherData_dentro)
			print("Data updated")
		elif option == "2":
			see_data(listOfWeatherData_fuera, listOfWeatherData_dentro)
		elif option == "3":
			print("Data from fuera:")
			printData(listOfWeatherData_fuera)
			print("Data from dentro:")
			printData(listOfWeatherData_dentro)
		elif option == "4":
			break
			
		else:
			print("Invalid option")
	
		

def mainDep():
	
	listOfWeatherData_fuera, listOfWeatherData_dentro = updateDataFile()
	listOfWeatherData_fuera, listOfWeatherData_dentro = updateDataReq(listOfWeatherData_fuera, listOfWeatherData_dentro)
	
	save_data(listOfWeatherData_fuera, "fuera.txt")
	save_data(listOfWeatherData_dentro, "dentro.txt")

	see_data(listOfWeatherData_fuera, listOfWeatherData_dentro)

	




if __name__ == "__main__":
	main()