import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopRestaurants from "../screens/TopRestaurants";

const Stack = createStackNavigator();

export default function TopRestauratsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="TopRestaurants"
                component={TopRestaurants}
                options={{ title: "top" }}
            />

        </Stack.Navigator>
    )
}