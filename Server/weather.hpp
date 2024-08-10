#ifndef WEATHER_HPP
#define WEATHER_HPP

#include <time.h>
#include <Arduino.h>

typedef struct {
    int x;
    int y;
} Vector2;

typedef struct {
    Vector2 x;
    Vector2 y;
} Vector2_2;

typedef struct {
    char tempBeforePoint;
    char tempAfterPoint;
    char humBeforePoint;
    char humAfterPoint;
    unsigned int time;
} Weather;

class WeatherVector {
private:

    const int items;
    int firstItemP, lastItemP;
    Weather* weather;

public:

    WeatherVector(int items) :
        items(items), firstItemP(-2), lastItemP(-1), weather(new Weather[items])
    {}

    ~WeatherVector() {
        delete[] weather;
    }

    // Return: false if no item overriden, true if item overriden
    bool addWeather(float temp, float hum, time_t currentTime) {
      
        lastItemP = (lastItemP + 1) % items;

        weather[lastItemP].tempBeforePoint = (char)temp;
        weather[lastItemP].tempAfterPoint = (temp - (char)temp) * 100;
        weather[lastItemP].humBeforePoint = (char)hum;
        weather[lastItemP].humAfterPoint = (hum - (char)hum) * 100;
        weather[lastItemP].time = currentTime;

        if (lastItemP == firstItemP) {
            firstItemP = (firstItemP + 1) % items;
            return true;
        }
        else if (firstItemP < 0) {
            firstItemP++;
            return false;
        }
        else {
            return false;
        }
    }

    Weather getWeather(int index) {
        if (index < 0 || index >= items) return { 0, 0 };
        if (index > firstItemP && index > lastItemP) return { 0, 0 };
        return weather[index];
    }

    Vector2_2 getAvailableIndexesNTimes(){

      Vector2_2 index_time = { {-1, -1}, {-1, -1} };

      if(firstItemP < 0 && lastItemP < 0) return index_time;
      else if(firstItemP < 0 && lastItemP == 0){
        index_time.x.x = lastItemP;
        index_time.x.y = weather[lastItemP].time;
        index_time.y.x = lastItemP;
        index_time.y.y = weather[lastItemP].time;
        return index_time;
      }
      else{
        if(lastItemP > firstItemP){
          index_time.x.x = firstItemP;
          index_time.x.y = weather[firstItemP].time;
          index_time.y.x = lastItemP;
          index_time.y.y = weather[lastItemP].time;
        }
        else{
          index_time.x.x = firstItemP;
          index_time.x.y = weather[firstItemP].time;
          index_time.y.x = lastItemP;
          index_time.y.y = weather[lastItemP].time;
        }
      }

      return index_time;

    }

    int getIndexFromTime(unsigned int time){
      if(firstItemP < 0 && lastItemP < 0) return -1;
      else if(firstItemP < 0 && lastItemP == 0){
        if(weather[lastItemP].time == time) return lastItemP;
        else return -1;
      }
      else{
        if(lastItemP > firstItemP){
          for(int i = firstItemP; i <= lastItemP; i++){
            if(weather[i].time == time) return i;
          }
        }
        else{
          for(int i = firstItemP; i < items; i++){
            if(weather[i].time == time) return i;
          }
          for(int i = 0; i <= lastItemP; i++){
            if(weather[i].time == time) return i;
          }
        }
      }
      return -1;
    }
      

    int getAvailableItems(){
      if(firstItemP < 0 && lastItemP < 0) return 0;
      else if(firstItemP < 0 && lastItemP == 0) return 1;                
      else if(lastItemP > firstItemP) return lastItemP - firstItemP + 1; 
      else return items - firstItemP + lastItemP + 1;                    
    }

    int getItems() {
        return items;
    }

    int getFirstItemP() {
        return firstItemP;
    }

    int getLastItemP() {
        return lastItemP;
    }

    String getWeatherString(int index) {
      if (index < 0 || index >= items) return "No data available.";
        // Ensure two decimal places by padding with leading zero if necessary
        String tempAfterPointStr = (weather[index].tempAfterPoint < 10) ? "0" + String((int) weather[index].tempAfterPoint) : String((int) weather[index].tempAfterPoint);
        String humAfterPointStr = (weather[index].humAfterPoint < 10) ? "0" + String((int) weather[index].humAfterPoint) : String((int) weather[index].humAfterPoint);

        return ("{\"index\":" + String(index) + 
                ",\"temp\":" + String((int) weather[index].tempBeforePoint) + "." + tempAfterPointStr +
                ",\"hum\":" + String((int) weather[index].humBeforePoint) + "." + humAfterPointStr +
                ",\"time\":" + String(weather[index].time) + "}");
    }
    

    void sendWeather(void (*sendFunc)(const String &)){
      if(firstItemP < 0 && lastItemP < 0) {
        sendFunc("No data available.");
        return;
      }
        
      else if(firstItemP < 0 && lastItemP == 0)
        sendFunc(getWeatherString(lastItemP));
      else{
        if(lastItemP > firstItemP){
          for(int i = firstItemP; i <= lastItemP; i++){
            sendFunc(getWeatherString(i));
          }
        }
        else{
          for(int i = firstItemP; i < items; i++){
            sendFunc(getWeatherString(i));
          }
          for(int i = 0; i <= lastItemP; i++){
            sendFunc(getWeatherString(i));
          }
        }
      }
    }

};

#endif