import React, { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../App";
import { Register } from "./Register"
import { AuthContext } from "../App";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigation = useNavigation();

    const { setToken } = useContext(AuthContext);

    const handleLogin = async () => {
      try {
          const response = await axios.post(BASE_URL + "/users/login", {
              email,
              password
          },{
              withCredentials: true
          });
  
          if (response && response.data) {
              setMessage("");
              setToken(response.data);
              navigation.navigate("Home");
          } else {
              setMessage("Login failed. Please try again.");
          }
      } catch (error) {
          console.log(error);
          setMessage("An error occurred while logging in.");
      }
  };
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Form</Text>
            <View style={styles.form}>
                <View style={styles.field}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                </View>
                <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.passLink}>Forgot password?</Text>
                </Pressable>
                <Pressable onPress={handleLogin} style={styles.btn}>
                    <View style={styles.btnLayer}></View>
                    <Text style={styles.btnText}>Login</Text>
                </Pressable>
                <View style={styles.signupLink}>
                    <Text>
                        Not a member?{" "}
                        <Pressable onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.signUpLink}>Signup now</Text>
                        </Pressable>
                    </Text>
                </View>
            </View>
            <Text style={styles.message}>{message}</Text>
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
    form: {
        width: "80%",
    },
    title: {
        fontSize: 35,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
    },
    field: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        width: "100%",
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    passLink: {
        marginTop: 5,
        textAlign: "right",
        color: "#fff",
    },
    btn: {
        height: 50,
        width: "100%",
        borderRadius: 10,
        backgroundColor: "#4caf50",
        justifyContent: "center",
        alignItems: "center",
    },
    btnText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    signUpLink: {
        color: "#4caf50",
        marginLeft: 5,
    },
    message: {
        marginTop: 20,
        color: "#ff0000",
    },
});

export default Login;
