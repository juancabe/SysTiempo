#ifndef WEATHER_HPP
#define WEATHER_HPP

#include <time.h>
#include <Arduino.h>

typedef struct {
    char tempBeforePoint;
    char tempAfterPoint;
    char humBeforePoint;
    char humAfterPoint;
    unsigned short time;
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
        if (items == 0) return false;    
        // Get the current local time
        tm *ltm = localtime(&currentTime);

        // Get the current year
        int currentYear = 1900 + ltm->tm_year;  // tm_year is years since 1900

        // Calculate the start of the current year in seconds since the epoch
        tm startOfYear = {0};
        startOfYear.tm_year = currentYear - 1900;  // Set to the current year
        startOfYear.tm_mon = 0;   // January
        startOfYear.tm_mday = 1;  // 1st day
        startOfYear.tm_hour = 0;
        startOfYear.tm_min = 0;
        startOfYear.tm_sec = 0;

        time_t startOfYearTime = mktime(&startOfYear);

        // Calculate the number of seconds since the start of the current year
        time_t secondsSinceStartOfYear = currentTime - startOfYearTime;
        unsigned long secondsThisYear = secondsSinceStartOfYear;
        unsigned long minutesThisYear = secondsThisYear / 60;
        unsigned short tenMinsThisYear = minutesThisYear / 10;

        lastItemP = (lastItemP + 1) % items;

        weather[lastItemP].tempBeforePoint = (char)temp;
        weather[lastItemP].tempAfterPoint = (temp - (char)temp) * 100;
        weather[lastItemP].humBeforePoint = (char)hum;
        weather[lastItemP].humAfterPoint = (hum - (char)hum) * 100;
        weather[lastItemP].time = tenMinsThisYear;

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

        return ("{index:" + String(index) + 
                ",temp:" + String((int) weather[index].tempBeforePoint) + "." + tempAfterPointStr +
                ",hum:" + String((int) weather[index].humBeforePoint) + "." + humAfterPointStr +
                ",time:" + String(weather[index].time) + "}");
    }


    // Shouldn't be used as it will occupy all the memory
    String toString() {
        String str = "\n--VECTOR--\n";
        if(firstItemP < 0 && lastItemP < 0) return str;

        else if(firstItemP < 0 && lastItemP == 0)
          str += getWeatherString(lastItemP) + "\n";
        else{
          if(lastItemP > firstItemP){
            for(int i = firstItemP; i <= lastItemP; i++){
              str += getWeatherString(i) + "\n";
            }
          }
          else{
            for(int i = firstItemP; i < items; i++){
              str += getWeatherString(i) + "\n";
            }
            for(int i = 0; i <= lastItemP; i++){
              str += getWeatherString(i) + "\n";
            }
          }
        }
        
        str += "--VECTOR--\n";
        return str;
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