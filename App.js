import * as React from "react";
import BottomNavigation from "./navigators/BottomNavigation";
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <BottomNavigation/>
   </NavigationContainer>
  );
}