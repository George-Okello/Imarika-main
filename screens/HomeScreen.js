import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { PermissionsAndroid } from 'react-native';
import Tts from "react-native-tts";
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import {
  Text,
  Modal,
  Button,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

/**
 * @author: Joseph Ridge
 * AsyncStorage  
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { G } from "react-native-svg";


export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(true);
  const [t3, setT3] = useState("");
  const [t2, setT2] = useState("");
  const [t5, setT5] = useState("");
  const [t20, setT20] = useState("");
  const [t6, setT6] = useState(""); // wind speed

  const [icon, setIcon] = useState("");
  const [icon_1, setIcon_1] = useState("");
  const [icon_2, setIcon_2] = useState("");
  const [icon_3, setIcon_3] = useState("");
  const [icon_4, setIcon_4] = useState("");
  const [icon_5, setIcon_5] = useState("");
  const [t7, setT7] = useState("");
  const [t16, setT16] = useState("");
  const [t18, setT18] = useState("");
  const [t19, setT19] = useState("");
  const [t22, setT22] = useState("");
  const [t25, setT25] = useState("");
  const [t28, setT28] = useState("");
  const [t21, setT21] = useState("");
  const [t8, setT8] = useState("");
  const [t24, setT24] = useState("");
  const [t27, setT27] = useState("");
  const [t30, setT30] = useState("");
  const [t4, setT4] = useState("");
  let latitude;
  let longitude;
  /**
   * @author - Joseph Ridge
   * objective: caching last location
   */
  // let previousLatitude  = useState();
  // let previousLongitude  = useState();
  const [previousLongitude, setPreviousLong] = useState(0);
  const [previousLatitude, setPreviousLat] = useState(0);

  const [z1, setZ1] = useState("");


  useEffect(() => {
    []
    /**
     * @author: Joseph Ridge
     * Feature: Caching using AsyncStorage
     * Goal: Cache last location before actual fetching
     * */
    const storeCurrentLocation = async (lat, lng) => {
      try {
        await AsyncStorage.setItem('cachedLatitude', lat.toString())
        await AsyncStorage.setItem('cachedLongitude', lng.toString())
      }
      catch (error) {
        console.error(`Error ==>: ${error}`);
      }
    }

    const getPreviousLocations = async () => {
      console.log("getting storeed*")
      try {
        let lat =  await AsyncStorage.getItem('cachedLatitude');
        let lng = await AsyncStorage.getItem('cachedLongitude');
        latitude = previousLatitude;
        setPreviousLong(lat);
        setPreviousLat(lng);
        longitude = previousLongitude;
        requestLocationPermission(lat,lng);
      } catch (error) {
        console.log("Error ", error)
      }
    }
    const requestLocationPermission = async (previousLatitude,previousLongitude) => {
        // if location is cached run fecth location first then proceed to fetchDataHandler else getCurrentLocations
      if ((previousLatitude == undefined || previousLatitude == 0 ) 
       && previousLongitude == undefined || previousLongitude == 0) {
        console.log("** Equal to null ***")
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              position => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);
                storeCurrentLocation(latitude, longitude); // @author - Joseph Ridge : USE: Cache location details using AsyncStorage 
                fetchDataHandler(); // intial one
                //fetchDataHandlerTest(); // test to see how data is fetched from openweather data - objective is to run this then hit translations API in background
   
              },
              error => {
                console.log('Error getting location:', error);
              }
            );
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        latitude = previousLatitude;
        longitude = previousLongitude; 
         fetchDataHandler(); // intial one
         //fetchDataHandlerTest(); // test to see how data is fetched from openweather data - objective is to run this then hit translations API in background
   
      }

    };

    getPreviousLocations(); 
    // requestLocationPermission(); // commented out and added to getPreviousLocation Query

    return () => {
      Geolocation.clearWatch();
    };
  }, []);


  // let lon = you_long;
  // let lat = you_lat;

  const api = {
    key: "5a25fa09a706b01556255c12de8174fa",
  };

  let [started, setStarted] = useState(false);
  //let t2 = data?.current_weather?.city_name + ", " + data?.current_weather?.country_name;

  const t15 = "Utabiri wa siku 5 zijazo";
  let t1 = moment(new Date()).format("dddd, MMMM D YYYY");

  /**
   * @author:JosephRidge
   * Test Version
   * Approach: Query Weather Data then Pass in the values required ( temp, hum, lat,lng) to AWS
   * 
   */

     const fetchDataHandlerTest = useCallback(()=>{
      let base_url = "https://api.openweathermap.org/data/2.5/forecast?";
      let api_key = "8ef9f127dcefc79f9cc837599ca96e97";

      let openWeatherUrl = `${base_url}lat=${latitude}&lon=${longitude}&appid=${api_key}&unit=metric`;
      console.log("URL ==> ",openWeatherUrl); // debugging purposes
     
      console.log(latitude);
      axios({
        method: "Get",
        url: openWeatherUrl
      })
        .then((res, d1) => {
          console.log(`RESPONSE ==> ${JSON.stringify(res.data)}`)
            })
             .catch(error => console.error(error))
        .finally(() => setLoading(false));
     }, [latitude, longitude]);


/**
 * working version by @author GeorgeOkello
 * 
 *  */ 
  const fetchDataHandler = useCallback(() => {
  
    console.log(latitude);
    console.log(longitude);
    setLoading(true);
    let weatherApi = `http://13.39.36.89:80/location/${longitude}/${latitude}`;
    console.log("i'm at the fetch"),
      // setInput("");
      axios({
        method: "Get",
        url: weatherApi
      })
        .then((res, d1) => {
          // console.log("here")
          console.log(res.data.list);
          setData(res.data);
          let t2 = res.data?.list[0]?.current_weather?.city_name + ", " + res.data?.list[0]?.current_weather?.country_name;
          let m3 = res.data?.list[0]?.current_weather?.temp_forecast;
          let m5 = res.data.list[0].current_weather.humidity;
          let m7 = res.data.list[0].current_weather.weather_icon;
          let m8 = res.data.list[0].current_weather.percentage_of_precipitation;
          let m6 = res.data.list[0].current_weather.wind_speed;
          let m20 = res.data.list[0].current_weather.weather_description;

          let date_1 = res.data?.list[0]?.forecast1[0]?.date;
          let date_2 = res.data?.list[0]?.forecast2[0]?.date;
          let date_3 = res.data?.list[0]?.forecast3[0]?.date;
          let date_4 = res.data?.list[0]?.forecast4[0]?.date;
          let date_5 = res.data?.list[0]?.forecast5[0]?.date;

          let m9 = res.data?.list[0]?.forecast1[0]?.temp_forecast;
          let m10 = res.data?.list[0]?.forecast2[0]?.temp_forecast;
          let m11 = res.data?.list[0]?.forecast3[0]?.temp_forecast;
          let m12 = res.data?.list[0]?.forecast4[0]?.temp_forecast;
          let m13 = res.data?.list[0]?.forecast5[0]?.temp_forecast;

          let m14 = res.data?.list[0]?.forecast1[0]?.weather_icon;
          let m15 = res.data?.list[0]?.forecast2[0]?.weather_icon;
          let m16 = res.data?.list[0]?.forecast3[0]?.weather_icon;
          let m17 = res.data?.list[0]?.forecast4[0]?.weather_icon;
          let m18 = res.data?.list[0]?.forecast5[0]?.weather_icon;

          let p1 = res.data?.list[0]?.current_weather?.sentence;

          setIcon_1(m14);
          setIcon_2(m15);
          setIcon_3(m16);
          setIcon_4(m17);
          setIcon_5(m18);

          setT30(Math.round(m13) + '°C');
          setT27(Math.round(m12) + '°C');
          setT24(Math.round(m11) + '°C');
          setT21(Math.round(m10) + '°C');

          setT28(moment(date_5).format("dddd") + '\n' + moment(date_5).format("MMMM D"));
          setT25(moment(date_4).format("dddd") + '\n' + moment(date_4).format("MMMM D"));
          setT22(moment(date_3).format("dddd") + '\n' + moment(date_3).format("MMMM D"));
          setT19(moment(date_2).format("dddd") + '\n' + moment(date_2).format("MMMM D"));
          setT18(Math.round(m9) + '°C');
          setT16(moment(date_1).format("dddd") + '\n' + moment(date_1).format("MMMM D"));
          setT3(Math.round(m3) + '°C');
          setT5("Unyevu" + '\n' + Math.round(m5) + "%");
          setT6("Kasi ya Upepo" + '\n' + Math.round(m6) + " Km/h");
          setT8("Mvua" + '\n' + Math.round(m8) + "%");
          setT7(m8);
          setT2(t2)
          setIcon(m7);
          setZ1(p1);
          setT20(m20)
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
  }, [latitude, longitude]);

  const name = [
    t1,
    t2,
    t3,
    t4,
    t5,
    t6,
    t7,
    t8,
    z1,
  ];

  const speakGreeting = () => {
    Tts.speak(z1);
    setStarted(true);
  };
  const stop = () => {
    Tts.stop(z1);
    setStarted(false);
  };


  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "#008462"
    }}>
      <ScrollView>


        {loading && (
          <Modal transparent={true}>
            <View style={styles.indicatorWrapper}>
              <View style={styles.modalContent}>
                <ActivityIndicator size={"large"} color="#000" animating={true} />
                <Text style={styles.indicatorText}>Loading Weather</Text>
              </View>
            </View>
          </Modal>
        )}
        {data && (
          <View>

            <Text style={{ color: "white", fontWeight: "bold", fontSize: 17, marginTop: 10, marginLeft: 10 }} >
              {t1}
            </Text>
            <View style={styles.row}>
              {/* <Ionicons name="location" size={20} color="black" type="Ionicons"/> */}
              <Image source={require('../assets/map-marker-outline.png')} style={{ width: 23, height: 25, tintColor: 'white' }} />
              <Text style={{ fontSize: 17, fontWeight: "500", color: "white" }}> {t2}</Text>
            </View>
            <View style={styles.cardContainer}>
              <View
                style={
                  // Try setting `flexDirection` to `"row"`.
                  {
                    flex: 1,

                    marginTop: 20,

                    flexDirection: "row",
                    marginBottom: 15,
                    marginLeft: 4,
                    marginRight: 4,
                  }
                }
              >
                <View style={{ flex: 1, backgroundColor: "white", justifyContent: 'flex-start' }}>
                  <Text
                    style={{ fontSize: 30, fontWeight: "500", marginLeft: 10 }}>
                    {t3}
                  </Text>

                  <Text style={{
                    textTransform: 'capitalize',
                    marginTop: 8,
                    marginLeft: 10,
                    fontSize: 17,
                    fontWeight: "500",
                  }}>
                    {t20}
                  </Text>
                </View>

                <View style={styles.row2}>
                  <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                    <Image
                      style={styles.stretch}

                      source={{ uri: `http://openweathermap.org/img/wn/${icon}@2x.png` }}
                    />


                  </View>
                </View>
              </View>
            </View>

            {/* humidity, wind,chance of rain */}

            <View style={styles.cardHWC}>
              {/* humidity */}
              <View style={styles.viewH}>

                <Image source={require('../assets/water-outline.png')} style={{ width: 23, height: 25, tintColor: 'white' }} />
                <Text
                  style={{
                    margin: 5,
                    // marginLeft: 8,
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: 'center',
                    color: 'white',
                    //fontWeight:'600',

                  }}
                >
                  {t5}
                </Text>


              </View>

              {/* wind */}

              <View style={styles.viewHWC}>

                <Image source={require('../assets/weather-windy.png')} style={{ width: 23, height: 25, tintColor: 'white' }} />
                <Text
                  style={{
                    margin: 5,
                    // marginLeft: 8,
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: 'center',
                    color: 'white',
                    //fontWeight:'600',

                  }}
                >
                  {t6}
                </Text>


              </View>


              {/* rain */}
              <View style={styles.viewHWC}>
                <Image source={require('../assets/weather-pouring.png')} style={{ width: 23, height: 25, tintColor: 'white' }} />
                <Text
                  style={{
                    margin: 5,
                    // marginLeft: 8,
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: 'center',
                    color: 'white',
                    //fontWeight:'600',

                  }}
                >
                  {t8}
                </Text>


              </View>

            </View>


            {/*next forecast*/}

            <View style={styles.rowDate}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 17 }}
              >
                {t15}
              </Text>
            </View>
            {/* forecast1 */}
            <View style={styles.cardContainer3}>
              <View
                style={[
                  styles.container,
                  {
                    // Try setting `flexDirection` to `"row"`.
                    flexDirection: "row",
                    backgroundColor: 'white',
                    marginLeft: 4,
                    marginRight: 4,
                    borderStyle: 'solid',
                    borderBottomColor: "#008462",
                    borderBottomWidth: 0.5,
                  },
                ]}
              >
                {/* forecast1 date */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{
                      // marginTop: 15,
                      marginLeft: 10,
                      fontSize: 15,
                      textAlignVertical: 'auto',
                      fontWeight: "bold",
                    }}
                  >
                    {t16}
                  </Text>
                </View>
                {/* forecast1 temp */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{ fontSize: 17, fontWeight: 'normal', textAlign: 'center' }}
                  >
                    {t18}

                  </Text>
                </View>

                {/* forecast1 image */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Image
                    style={styles.stretch1}
                    source={{ uri: `http://openweathermap.org/img/wn/${icon_1}@2x.png` }}
                  />
                </View>
              </View>
              {/* forecast2 */}
              <View
                style={[
                  styles.container,
                  {
                    // Try setting `flexDirection` to `"row"`.
                    flexDirection: "row",


                    marginLeft: 4,
                    marginRight: 4,
                    borderStyle: 'solid',
                    borderBottomColor: "#008462",
                    borderBottomWidth: 0.5,
                  },
                ]}
              >
                {/* forecast2 date */}
                <View style={{ flex: 1, }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {t19}
                  </Text>
                </View>
                {/* forecast2 temp */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{ fontSize: 17, fontWeight: 'normal', textAlign: 'center' }}
                  >
                    {t21}

                  </Text>
                </View>
                {/* forecast2 image */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Image
                    style={styles.stretch1}
                    source={{ uri: `http://openweathermap.org/img/wn/${icon_2}@2x.png` }}
                  />
                </View>
              </View>
              {/* forecast3 */}
              <View
                style={[
                  styles.container,
                  {
                    // Try setting `flexDirection` to `"row"`.
                    flexDirection: "row",
                    backgroundColor: 'white',
                    marginLeft: 4,
                    marginRight: 4,
                    borderStyle: 'solid',
                    borderBottomColor: "#008462",
                    borderBottomWidth: 0.5,
                  },
                ]}
              >
                {/* forecast3 date */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{

                      marginLeft: 10,
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {t22}
                  </Text>

                </View>
                {/* forecast3 temp */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{ fontSize: 17, fontWeight: 'normal', textAlign: 'center' }}
                  >
                    {t24}

                  </Text>
                </View>
                {/* forecast3 icon */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Image
                    style={styles.stretch1}
                    source={{ uri: `http://openweathermap.org/img/wn/${icon_3}@2x.png` }}
                  />
                </View>
              </View>
              {/* forecast4 */}
              <View
                style={[
                  styles.container,
                  {
                    alignContent: 'center',
                    flexDirection: "row",
                    backgroundColor: 'white',
                    marginLeft: 4,
                    marginRight: 4,
                    borderStyle: 'solid',
                    borderBottomColor: "#008462",
                    borderBottomWidth: 0.5,
                  },
                ]}
              >
                {/* forecast4 date */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {t25}
                  </Text>
                </View>
                {/* forecast4 temp */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "500",
                      textAlign: 'center',
                    }}
                  >
                    {t27}

                  </Text>
                </View>
                {/* forecast4 icon */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Image
                    style={styles.stretch1}
                    source={{ uri: `http://openweathermap.org/img/wn/${icon_4}@2x.png` }}
                  />
                </View>
              </View>
              {/* forecast5 */}
              <View
                style={[
                  styles.container,
                  {
                    // Try setting `flexDirection` to `"row"`.
                    flexDirection: "row",
                    backgroundColor: 'white',
                    marginLeft: 4,
                    marginRight: 4,
                    marginBottom: 8,

                  },
                ]}
              >
                {/* forecast5 date */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 15,
                      fontWeight: "bold",
                      textAlign: 'left'
                    }}
                  >
                    {t28}
                  </Text>
                </View>
                {/* forecast5 temp */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "500",

                      textAlign: 'center'
                    }}
                  >
                    {t30}

                  </Text>
                </View>
                {/* forecast5 icon */}
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Image
                    style={styles.stretch1}
                    source={{ uri: `http://openweathermap.org/img/wn/${icon_5}@2x.png` }}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      {/* <Footer/> */}
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.circle}>
          {!started ? (
            <Icon1 name="speaker-notes" size={24} color="white"
              onPress={speakGreeting}
            />
          ) : undefined}
          {started ? (
            <Icon1
              name="speaker-notes-off"
              color="white"
              size={24}
              onPress={stop}
            />
          ) : undefined}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const deviceWidth = Math.round(Dimensions.get("window").width);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 20,

  },
  textInput: {
    borderBottomWidth: 3,
    Padding: 5,
    paddingVertical: 20,
    marginVertical: 15,
    marginHorizontal: 10,
    backgroundColor: "white",
    fontSize: 19,
    borderRadius: 16,
    borderBottomColor: "#eb9c5c",
  },
  circle: {
    backgroundColor: "#eb9c5c",

    width: 60,
    height: 60,
    position: "absolute",
    bottom: 40,
    right: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: deviceWidth - 20,
    backgroundColor: "white",
    //opacity: 0.95,
    marginTop: 10,
    height: 100,
    borderRadius: 20,
    margin: 10,
  },
  cardHWC: {
    width: deviceWidth - 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  viewHWC: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: "white",
    borderStyle: 'solid',
    borderLeftWidth: 1,
    //borderWidth:0.5,
    borderLeftColor: 'white',
    marginTop: 10,
    justifyContent: 'center',
    height: 100,
    margin: 5,
    marginTop: 10,

  },
  viewH: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    height: 100,
    margin: 5,
    marginTop: 10,

  },
  cardContainer2: {
    width: deviceWidth - 20,
    backgroundColor: "white",
    //opacity: 0.9,
    marginTop: 10,
    height: 250,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,

  },
  cardContainer3: {
    width: deviceWidth - 20,
    backgroundColor: "white",
    //opacity:0.95,

    marginTop: 10,
    height: 330,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,

  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "left",
    paddingLeft: 10,
    height: 30,
  },
  rowDate: {
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "left",
    //paddingRight: 24,
    height: 20,
    marginLeft: 15,
    marginTop: 20,
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 24,
    backgroundColor: "white",
    //height: 50,
  },
  goodrow: {
    flexDirection: "row",
    // alignItems: 'left',
    // justifyContent: 'left',
    paddingRight: 24,
    height: 50,
    marginLeft: 5,
    marginTop: 25,
  },
  stretch: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: 'flex-end',
  },
  stretch1: {
    width: 50,
    height: 50,
    justifyContent: 'center',

    marginLeft: 40,
    marginTop: -14,
    //resizeMode: 'stretch',


  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    //color: '',
    //textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 10,
  },
  indicatorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

    // height:200,
    // weight:200,
    // margin:30,
    // marginTop:300,
    // borderRadius:20,
    //flexDirection:'row',
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
    fontWeight: 'bold',
    color: '#000'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    // width:350
    height: 100
  },
});