import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native"; // Added FlatList import
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../App";

export default function HomeScreen(props) {
  const [activeTab, setActiveTab] = useState(0);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/all`, {
        headers: {
          "Content-Type": "application/json",
          withCredentials: true
        },
      });
      setRecipes(response.data); // Access data directly from the response
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === item.recipe_id && styles.activeTab]}
      onPress={() => handleTabPress(item.recipe_id)}
    >
      <Text>{item.recipe_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Your main content here */}

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={activeTab === 0 ? "#29fd" : "#000"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={activeTab === 1 ? "#29fd" : "#000"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 3 && styles.activeTab]}
          onPress={() => handleTabPress(3)}
        >
          <Text style={[styles.plusIcon, activeTab === 3 && styles.activeTabText]}>+</Text>
        </TouchableOpacity>
        
        <View style={styles.indicator}>
          <View style={styles.indicatorInner} />
        </View>
      </View>

      {/* Display Recipes */}
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.recipe_id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    opacity: 0.75,
  },
  plusIcon: {
    fontSize: 32, // Adjusted font size for a bigger plus sign
    color: "#000",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    width: "20%",
    height: 4,
    backgroundColor: "#29fd",
    borderRadius: 2,
  },
  indicatorInner: {
    position: "absolute",
    bottom: -8,
    width: 16,
    height: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#29fd",
  },
});
