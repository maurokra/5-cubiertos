import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account/Account";
import Login from "../screens/Account/Login";
import Register from "../screens/Account/Register";

const Stack = createStackNavigator();

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="account"
                component={Account}
                options={{ title: "Cuenta" }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ title: "Iniciar sessión" }}

            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{ title: "registro" }}

            />
        </Stack.Navigator>
    )
}