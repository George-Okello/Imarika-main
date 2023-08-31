import React from 'react';
import { View, Text , ScrollView} from 'react-native'
import { Image } from 'react-native'
import { weatherImages } from '../constants';
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { theme } from '../theme/Index';

export default function Forecast({data, weather}) {
  const { location, current } = data;
  const { temp_c, condition, wind_kph, humidity } = current;

  // Extracted location properties
  const { name, country } = location;
  return (
    <View className="mx-4 flex justify-around flex-1 mb-2m relative z-50">
    {/* location */}
      <Text className="text-white text-center text-2xl font-bold ">
        {name}
        <Text className="text-lg font-semibold text-gray-300">{" "+","+country}</Text>
      </Text>
      {/* weather image */}
      <View  className="flex flex-row justify-evenly ">
      <Image 
        source={weatherImages[condition.text]} 
        className="w-20 h-20" />
    
      {/* degree celcius */}
      <View className="space-y-2">
        <Text className="text-center font-bold text-white text-6xl ml-5">
          {temp_c}&#176;
        </Text>
        <Text className="text-center text-white text-xl tracking-widest">
        {condition.text}
        </Text>
      </View>
      </View>

      
      {/* other stats */}
      <View className="flex-row justify-between mx-4">
        <View className="flex-row space-x-2 items-center">
          <Image source={require('../assets/icons/wind.png')} className="w-6 h-6" />
          <Text className="text-white font-semibold text-base">{wind_kph}kph</Text>
        </View>
          <View className="flex-row space-x-2 items-center">
            <Image source={require('../assets/icons/drop.png')} className="w-6 h-6" />
            <Text className="text-white font-semibold text-base">{humidity}%</Text>
          </View>
        <View className="flex-row space-x-2 items-center">
          <Image source={require('../assets/icons/sun.png')} className="w-6 h-6" />
          <Text className="text-white font-semibold text-base">
            8:00am
          </Text>
        </View>
      </View>
      {/* forecast for next days */}
      <View className="mb-2 space-y-3">
        <View className="flex-row items-center mx-5 space-x-2">
          <CalendarDaysIcon size="22" color="white" />
          <Text className="text-white text-base">Daily forecast</Text>
        </View>
        <ScrollView   
          horizontal
          contentContainerStyle={{paddingHorizontal: 15}}
          showsHorizontalScrollIndicator={false}
        >
                  {
                    weather?.forecast?.forecastday?.map((item,index)=>{
                      const date = new Date(item.date);
                      const options = { weekday: 'long' };
                      let dayName = date.toLocaleDateString('en-US', options);
                      dayName = dayName.split(',')[0];

                      return (
                        <View 
                          key={index} 
                          className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4" 
                          style={{backgroundColor: theme.bgWhite(0.15)}}
                        >
                          <Image 
                            // source={{uri: 'https:'+item?.day?.condition?.icon}}
                            source={weatherImages[item?.day?.condition?.text || 'other']}
                              className="w-11 h-11" />
                          <Text className="text-white">{dayName}</Text>
                          <Text className="text-white text-xl font-semibold">
                            {item?.day?.avgtemp_c}&#176;
                          </Text>
                        </View>
                      )
                    })
                  }
          </ScrollView>
          </View>

    </View>
  )
}

