import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import Home from './Components/Home';
import LoginRegister from './Components/LoginRegister';
import Auth from './auth/Auth';
import React, { useState, createContext } from 'react';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const AuthContext = createContext();

const Stack = createNativeStackNavigator(); 

export default function App() {
  const [token, setToken] = useState(null); 
  return (
    <NavigationContainer> 
      <AuthContext.Provider value={{ token, setToken }}>
        <Stack.Navigator> 
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="LoginRegister" component={LoginRegister} />
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
