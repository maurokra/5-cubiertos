import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Favorites from "../screens/Favorites";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="favorites"
                component={Favorites}
                options={{ title: "Favoritos" }}
            />

        </Stack.Navigator>
    )
}