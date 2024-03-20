import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native"; 
import { AuthContext } from "../App";
import { BASE_URL } from "../App";

const LoginRegister = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const { setToken } = useContext(AuthContext);
    const navigation = useNavigation(); 
    const handleLoginRegister = async () => {
        if (props.page === "Login") {
            try {
                const response = await axios.post(BASE_URL + "/users/login", {
                    email,
                    password
                }, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    console.log(response.data)
                    setToken(response.data);
                    setMessage("");
                    navigation.navigate("Home"); 
                }
            } catch (error) {
                console.log(error);
                setMessage(error.response.data.msg);
            }
            
        } else {
            try {
                const response = await axios.post(BASE_URL + "/users/register", {
                    email,
                    password
                }, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setMessage("");
                    navigation.navigate("Login"); 
                }
            } catch (error) {
                console.log(error);
                setMessage(error.response.data.msg);
            }
        }
    };

    const { page } = props;

    return (
        <View>
            <Text>{page}</Text>
            <TextInput
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                id="password"
                placeholder="Enter Your Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <Button onPress={handleLoginRegister} title={String(page)} />
            <Text>{message}</Text>
        </View>
    );
};

export default LoginRegister;
