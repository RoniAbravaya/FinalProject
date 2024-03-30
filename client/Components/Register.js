import React, { useState } from "react";
import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../App";
import { Home } from "./Home"

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            const response = await axios.post(BASE_URL + "/users/register", {
                email,
                password
            });
            if (response && response.status === 200) {
                setErrorMessage("");
                navigation.navigate("Home");
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.msg) {
                setErrorMessage(error.response.data.msg);
            } else {
                setErrorMessage("An error occurred during registration.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Register</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                    />
                </View>
                <Pressable style={styles.signUpButton} onPress={handleRegister}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </Pressable>
                {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
                <View style={styles.loginTextContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#282a36",
    },
    formContainer: {
        width: "80%",
    },
    title: {
        fontSize: 35,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        width: "100%",
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    signUpButton: {
        height: 50,
        width: "100%",
        borderRadius: 10,
        backgroundColor: "#4caf50",
        justifyContent: "center",
        alignItems: "center",
    },
    signUpButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    loginTextContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginText: {
        color: "#fff",
    },
    loginLink: {
        color: "#4caf50",
        marginLeft: 5,
    },
    errorMessage: {
        marginTop: 20,
        color: "#ff0000",
    },
});

export default Register;
