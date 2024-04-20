import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native"; // Added FlatList import
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../App";
import { AuthContext } from "../App";

export default function HomeScreen(props) {
  const [activeTab, setActiveTab] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchRecipes(token);
  }, []);

  const fetchRecipes = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
  
      if (response && response.data) {
        setRecipes(response.data);
      } else {
        console.error("Failed to fetch recipes.");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
  
  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.recipeName}>{item.recipe_name}</Text>
      <Text style={styles.ingredients}>{item.ingredients}</Text>
      <Text style={styles.instructions}>{item.instructions}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
    fontSize: 32,
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
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ingredients: {
    marginBottom: 5,
  },
  instructions: {
    fontStyle: "italic",
  },
});
