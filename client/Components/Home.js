import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet, FlatList, TextInput } from "react-native"; // Added FlatList import
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../App";
import { AuthContext } from "../App";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { decode } from "base-64";
// import  jwtDecode  from "jsonwebtoken";

export default function HomeScreen(props) {
  const [activeTab, setActiveTab] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const { token } = useContext(AuthContext);
  const [recipeName, setRecipeName] = useState(""); // Define recipeName state
  const [ingredients, setIngredients] = useState(""); 
  const [instructions, setInstructions] = useState(""); 
  const [editingRecipeId, setEditingRecipeId] = useState(null);


  useEffect(() => {
    fetchRecipes(token);
    fetchUserRecipes(token);
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

  const fetchAndDecodeToken = async () => {
    try {
        // Fetch the token from /users/verify
        const verifyResponse = await axios.get(BASE_URL + "/users/verify", {
            withCredentials: true,
        });

        if (verifyResponse.status !== 200) {
            console.error("Failed to verify user.");
            return null;
        }

        const token = verifyResponse.data.token; // Assuming the token is present in the response data

        // Decode the token to get the user's ID
        const decodedToken = jwtDecode(token);
        const useremail = decodedToken?.useremail; // Extract user email safely
      
        if (!useremail) {
            console.error("User email not found in token.");
            return null;
        }

        return { token, useremail };
    } catch (error) {
        console.error("Error fetching and decoding token:", error);
        return null;
    }
};


const fetchUserRecipes = async () => {
  try {
    const tokenData = await fetchAndDecodeToken();

    if (!tokenData) {
      console.error("Failed to fetch and decode token.");
      return;
    }

    const { token, useremail } = tokenData;

    // Make the API request with the user's email and token
    const response = await axios.get(`${BASE_URL}/recipes/${useremail}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the fetched token here
        user_email: useremail, // Include the user_email in the headers
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
  if (index === 0) {
    fetchRecipes(token); // Call fetchRecipes if the index is 0
  } else if (index === 1) {
    fetchUserRecipes(token); // Call fetchUserRecipes if the index is 1
  } else if (index === 3) {
    // Clear form fields when user clicks on the tab with index 3
    setRecipeName("");
    setIngredients("");
    setInstructions("");
  }
};

const handleSubmit = async () => {
  try {
    // Fetch the token data to get the user's email
    const tokenData = await fetchAndDecodeToken();

    if (!tokenData) {
      console.error("Failed to fetch and decode token.");
      return;
    }

    const { token, useremail } = tokenData;

    // Prepare the recipe data
    const recipeData = {
      recipeName: recipeName,
      ingredients: ingredients,
      instructions: instructions,
      user_email: useremail,
    };

    // Send the API request to create a recipe
    const response = await axios.post(`${BASE_URL}/recipes/create`, recipeData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the fetched token here
      },
      withCredentials: true,
    });

    if (response && response.data) {
      console.log("Recipe created successfully:", response.data);
      // Optionally, you can update the recipes state to refresh the recipe list
      fetchRecipes(token)
    } else {
      console.error("Failed to create recipe.");
    }
  } catch (error) {
    console.error("Error creating recipe:", error);
  }
};

const handleDeleteRecipe = async (recipeId) => {
  try {
    // Fetch the token data to get the user's email
    const tokenData = await fetchAndDecodeToken();

    if (!tokenData) {
      console.error("Failed to fetch and decode token.");
      return;
    }

    const { token, useremail } = tokenData;

    // Send the API request to delete the recipe
    const response = await axios.delete(`${BASE_URL}/recipes/${recipeId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the fetched token here
      },
      withCredentials: true,
    });

    if (response && response.data) {
      console.log("Recipe deleted successfully:", response.data);
      // Optionally, you can update the recipes state to refresh the recipe list
      fetchRecipes(token);
    } else {
      console.error("Failed to delete recipe.");
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};

const handleSubmitEditedRecipe = async () => {
  try {
    // Fetch the token data to get the user's email
    const tokenData = await fetchAndDecodeToken();

    if (!tokenData) {
      console.error("Failed to fetch and decode token.");
      return;
    }

    const { token } = tokenData;

    // Prepare the updated recipe data
    const updatedRecipeData = {
      recipeName: recipeName,
      ingredients: ingredients.split(',').map(ingredient => ingredient.trim()), // Convert ingredients string to array
      instructions: instructions,
    };

    // Send the PUT request to update the recipe
    const response = await axios.put(`${BASE_URL}/recipes/${editingRecipeId}`, updatedRecipeData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the fetched token here
      },
      withCredentials: true,
    });

    if (response && response.data) {
      console.log("Recipe updated successfully:", response.data);
      // Optionally, you can update the recipes state to refresh the recipe list
      fetchRecipes(token);
      // Clear the form fields and editing state
      setEditingRecipeId(null);
      setRecipeName("");
      setIngredients("");
      setInstructions("");
    } else {
      console.error("Failed to update recipe.");
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
};


const handleEditRecipe = (recipeId) => {
  // Set the editing recipe ID and load its data
  const recipe = recipes.find((r) => r.recipe_id === recipeId);
  if (recipe) {
    setEditingRecipeId(recipeId);
    setRecipeName(recipe.recipe_name);
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
    setActiveTab(4); // Set the active tab to 4 to show the edit form
  }
};

const handleEditSubmit = async () => {
  try {
    // Fetch the token data to get the user's email
    const tokenData = await fetchAndDecodeToken();

    if (!tokenData) {
      console.error("Failed to fetch and decode token.");
      return;
    }

    const { token } = tokenData;

    // Prepare the updated recipe data
    const updatedRecipeData = {
      recipeName: recipeName,
      ingredients: ingredients.split(',').map(ingredient => ingredient.trim()), // Convert ingredients string to array
      instructions: instructions,
    };

    // Send the PUT request to update the recipe
    const response = await axios.put(`${BASE_URL}/recipes/${editingRecipeId}`, updatedRecipeData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the fetched token here
      },
      withCredentials: true,
    });

    if (response && response.data) {
      console.log("Recipe updated successfully:", response.data);
      // Optionally, you can update the recipes state to refresh the recipe list
      fetchRecipes(token);
      // Clear the form fields and editing state
      setEditingRecipeId(null);
      setRecipeName("");
      setIngredients("");
      setInstructions("");
    } else {
      console.error("Failed to update recipe.");
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
};

const handleLikeRecipe = async (recipeId) => {
  try {
    // Fetch the token data to get the user's email
    const tokenData = await fetchAndDecodeToken();

    if (!tokenData) {
      console.error("Failed to fetch and decode token.");
      return;
    }

    const { token } = tokenData;

    // Fetch the current recipe data
    const response = await axios.get(`${BASE_URL}/recipes/id/${recipeId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the fetched token here
      },
      withCredentials: true,
    });

    if (response && response.data && response.data.length > 0) {
      const currentLikes = response.data[0].likes || 0; // Handle null likes
      const updatedLikes = currentLikes + 1;

      // Send the PUT request to update the recipe likes
      const updateResponse = await axios.put(
        `${BASE_URL}/recipes/${recipeId}`,
        { likes: updatedLikes }, // Update likes with the new value
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the fetched token here
          },
          withCredentials: true,
        }
      );

      if (updateResponse && updateResponse.data) {
        console.log("Recipe liked successfully:", updateResponse.data);
        // Optionally, you can update the recipes state to refresh the recipe list
        fetchRecipes(token);
      } else {
        console.error("Failed to like recipe.");
      }
    } else {
      console.error("Failed to fetch recipe data for liking or recipe not found.");
    }
  } catch (error) {
    console.error("Error liking recipe:", error);
  }
};




const renderItem = ({ item }) => (
  <View style={styles.row}>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRecipe(item.recipe_id)}>
        <Ionicons name="close" size={24} color="#ff0000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditRecipe(item.recipe_id)}>
        <Ionicons name="create-outline" size={24} color="#0000ff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.likeButton} onPress={() => handleLikeRecipe(item.recipe_id)}>
        <Ionicons name="heart-outline" size={24} color="#ff0000" />
      </TouchableOpacity>
      <Text style={styles.likes}>{item.likes}</Text>
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

    {/* Form */}{/* Form for creating a new recipe */}
      {activeTab === 3 && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Recipe Name"
            onChangeText={(text) => setRecipeName(text)}
            value={recipeName}
          />
          <TextInput
            style={styles.input}
            placeholder="Ingredients"
            onChangeText={(text) => setIngredients(text)}
            value={ingredients}
          />
          <TextInput
            style={styles.input}
            placeholder="Instructions"
            onChangeText={(text) => setInstructions(text)}
            value={instructions}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Form for editing an existing recipe */}
      {activeTab === 4 && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Recipe Name"
            onChangeText={(text) => setRecipeName(text)}
            value={recipeName}
          />
          <TextInput
            style={styles.input}
            placeholder="Ingredients"
            onChangeText={(text) => setIngredients(text)}
            value={ingredients}
          />
          <TextInput
            style={styles.input}
            placeholder="Instructions"
            onChangeText={(text) => setInstructions(text)}
            value={instructions}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitEditedRecipe}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

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
likes: {
  padding: 20,
  fontSize: 25,
  color: "#555",
  marginLeft: 10,
  fontWeight: "bold",
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
  flexDirection: "row",
  alignItems: "center",
},
recipeName: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 5,
  flex: 1,
},
ingredients: {
  marginBottom: 5,
  flex: 1,
},
instructions: {
  fontStyle: "italic",
  flex: 1,
},
formContainer: {
  padding: 20,
  borderTopWidth: 1,
  borderTopColor: "#ccc",
},
input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
},
submitButton: {
  backgroundColor: "#29fd",
  padding: 10,
  borderRadius: 5,
  alignItems: "center",
},
submitButtonText: {
  color: "#fff",
  fontWeight: "bold",
},
deleteButton: {
  position: "absolute",
  top: 5,
  right: 5,
},
});

