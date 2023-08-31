import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/ChatScreen';
import VideoScreen from '../screens/VideoScreen';
import RatingScreen from '../screens/RatingScreen';
import HomeScreen from '../screens/HomeScreen';
import { Avatar, Image } from 'react-native-elements';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

function HomeScreens() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
  

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#008642',
        
      }}>
     <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Videos"
        component={VideoScreen}
        options={{
          tabBarLabel: 'Videos',
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../assets/video-outline.png')} style={{ width: size, height: size, tintColor: color }} />
          ),
        }}
      />
       <Tab.Screen
        name="Rate Our App"
        component={RatingScreen}
        options={{
          tabBarLabel: 'Rate',
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../assets/star-david.png')} style={{ width: size, height: size, tintColor: color }} />
          ),
        }}
      /> */}
       <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../assets/chat-outline.png')} style={{ width: size, height: size, tintColor: color }} />
          ),
        }}
      /> 
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
