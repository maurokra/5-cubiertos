import React, { useState, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddRestaurantForm from "../../components/Restaurants/AddRestaurantForm";


export default function AddRestaurant(props) {

    const { navigation } = props;
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    console.log(props);

    return (
        <View>
            <AddRestaurantForm

                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}

            />
            <Toast ref={toastRef} position="center" opacity={0.5} />
            <Loading isVisible={isLoading} Text="creando restaurante" />
        </View>
    );
}
