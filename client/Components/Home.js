import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";

const BASE_URL = "YOUR_BASE_URL_HERE";

const Home = (props) => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      getUsers();
    }, []); 
  
    const getUsers = async () => {
      try {
        const response = await axios.get(BASE_URL + "/users", {
          withCredentials: true 
        });
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <>
        <h2>Home</h2>
        {users.map((item) => (
          <div key={item.id}>{item.email}</div> 
        ))}
      </>
    );
  };

export default Home;
