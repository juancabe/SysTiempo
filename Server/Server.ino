#include <NTPClient.h>

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <string.h>
#include <Adafruit_AHT10.h>

#include "weather.hpp"
#include "creds.hpp"


#ifndef STASSID
#define STASSID "YOUR_SSID"
#define STAPSK "YOUR_PASS"
#endif

WeatherVector * weatherVector;

const char* ssid = STASSID;
const char* password = STAPSK;

ESP8266WebServer server(80);
Adafruit_AHT10 aht;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");


sensors_event_t humidity, temp;
uint unixTime;


const int led = 13;

void handleWeatherVector() {
  server.setContentLength(CONTENT_LENGTH_UNKNOWN);
  server.send(200, "multipart/x-mixed-replace; boundary=44Mp");
  
  weatherVector->sendWeather([](const String &data) {
    server.sendContent(data + "\r\n");
  });
  
  server.sendContent("--44Mp--\r\n");
}

void handleWeather(){
  server.send(200, "text/plain", String(temp.temperature) + "," + String(humidity.relative_humidity));
}

void handleRoot(){
  server.send(200, "text/plain", "Hello, world!");
}

void handleNotFound() {
  digitalWrite(led, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) { message += " " + server.argName(i) + ": " + server.arg(i) + "\n"; }
  server.send(404, "text/plain", message);
  digitalWrite(led, 0);
}

int lastMin = -1;
void setup(void) {
 
  pinMode(led, OUTPUT);
  digitalWrite(led, 0);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait WIFI for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Time Client
  timeClient.begin();
  timeClient.setTimeOffset(2);

  // MDNS
  if (MDNS.begin("esp8266")) { Serial.println("MDNS responder started"); }

  // Web Server
  server.on("/", handleRoot);
  server.on("/weather", handleWeather);
  server.on("/weathervector", handleWeatherVector);

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
  
  // AHT10
  if (! aht.begin()) {
    Serial.println("Could not find AHT? Check wiring");
    while (1) delay(10);
  }
  Serial.println("AHT10 found");

  // Weather vector
  auto items = (system_get_free_heap_size() / 4 * 3)/sizeof(Weather);
  weatherVector = new WeatherVector(items);
  Serial.print("Weather vector size: ");
  Serial.println(items);

  // Initial time
  timeClient.update();
  aht.getEvent(&humidity, &temp);
  lastMin = timeClient.getMinutes()%10+100;
}


void loop(void) {
  timeClient.update();
  aht.getEvent(&humidity, &temp);  

  int actualMin = timeClient.getSeconds();
  if((actualMin > lastMin || actualMin < lastMin) && actualMin%10 == lastMin%10){
    lastMin = actualMin;
    weatherVector->addWeather(temp.temperature, humidity.relative_humidity, timeClient.getEpochTime());
    Weather w = weatherVector->getWeather(weatherVector->getLastItemP());
    Serial.println("Last item | Temp: " + String((int)w.tempBeforePoint) + "." + String((int)w.tempAfterPoint) +
    ", Hum: " + String((int)w.humBeforePoint) + "." + String((int)w.humAfterPoint) +
    ",Time: " + String(w.time));
    Serial.println("Vector last item: " + String(weatherVector->getLastItemP()) + " first item: " + String(weatherVector->getFirstItemP()));
    //Serial.print(weatherVector->toString());
    weatherVector->sendWeather([](const String &data){
      Serial.println(data);
    });
    
  }
  server.handleClient();
  MDNS.update();

}
