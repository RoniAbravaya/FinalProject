import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Auth from './auth/Auth';
import React, { useState, createContext } from 'react';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const AuthContext = createContext();

const Stack = createNativeStackNavigator(); 

export default function App() {
  const [token, setToken] = useState(null); 
  console.log(AuthContext)
  return (
    <AuthContext.Provider value={{ token, setToken }}>
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    </NavigationContainer>
  </AuthContext.Provider>
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
