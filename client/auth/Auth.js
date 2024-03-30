import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { BASE_URL } from "../App";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from 'react-native';
import Login from '../Components/Login';
import Home from "../Components/Home";


const Auth = (props) => {
    const { setToken } = useContext(AuthContext);
    const [redirect, setRedirect] = useState(false); 
    const navigation = useNavigation(); 
    useEffect(() =>{
        verify();
    }, []);

    const verify = async() => {
        try {
            const response = await axios.get(BASE_URL + "/users/verify", {
                withCredentials: true,
            });
            if(response.status === 200) {
                setToken(response.data);
                navigation.navigate("Home");
            }
            
        } catch (error) {
            setRedirect(false);
            navigation.navigate("Login");
        }
    }

    return redirect ? props.children : <Text style={styles.text}>Not authorized</Text>;
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Auth;
