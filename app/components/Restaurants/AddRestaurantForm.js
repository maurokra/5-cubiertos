import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { map, size, filter } from "lodash";
import Modal from "../Modal";
import * as Location from "expo-location";
import MapView from "react-native-maps";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

import uuid from "random-uuid-v4";

const db = firebase.firestore(firebaseApp);

const widhScreen = Dimensions.get("window").width;


export default function AddRestaurantForm(props) {
    const { toastRef, setIsLoading, navigation } = props;

    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescrition, setRestaurantDescrition] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    console.log(imageSelected);

    const addRestaurant = () => {
        if (!restaurantName || !restaurantDescrition || !restaurantAddress) {
            toastRef.current.show("Todos los campos del formulario son obligatorios");
        } else if (size(imageSelected) === 0) {
            toastRef.current.show("el Restaurante tiene que tener al menos una foto.");
        } else if (!locationRestaurant) {
            toastRef.current.show("Tienes que localizar el restaurante en el mapa.");
        } else {

            setIsLoading(true);
            uploadImageStorage().then((response) => {

                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescrition,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,


                    })
                    .then(() => {
                        setIsLoading(false);
                        navigation.navigate("restaurants");
                    }).catch(() => {
                        setIsLoading(false);
                        toastRef.current.show("Error al subir el restaurante, intentolo mas tarde!.");
                    });
            });
        }
    };

    const uploadImageStorage = async () => {
        console.log(imageSelected);
        const imageBlob = [];

        await Promise.all(

            map(imageSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`restaurants/${result.metadata.name}`)
                        .getDownloadURL()
                        .then(photoUrl => {
                            imageBlob.push(photoUrl);
                        });
                });
            })
        );
        return imageBlob;
    };

    return (
        <ScrollView styles={styles.scrollView}>
            <ImageRestaurant imageRestaurant={imageSelected[0]} />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescrition={setRestaurantDescrition}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UpdateImage
                toastRef={toastRef}
                setImageSelected={setImageSelected}
                imageSelected={imageSelected}

            />
            <Button
                title="Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    );

}

function ImageRestaurant(props) {
    const { imageRestaurant } = props;
    return (
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imageRestaurant ?
                        { uri: imageRestaurant }
                        : require("../../../assets/img/no-image.png")
                }
                style={{ width: widhScreen, height: 380 }}
            />
        </View>
    );
}

function FormAdd(props) {
    const { setRestaurantName,
        setRestaurantAddress,
        setRestaurantDescrition,
        locationRestaurant,
        setIsVisibleMap } = props;
    return (
        <View styles={styles.viewForm}>
            <Input
                placeholder="Nombre del Restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />

            <Input
                placeholder="Dirección"
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
            />
            <Input
                placeholder="Descripción de restaurante"
                containerStyle={styles.input}
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescrition(e.nativeEvent.text)}
            />
        </View>
    );
}

function Map(props) {
    const {
        isVisibleMap,
        setIsVisibleMap,
        setLocationRestaurant,
        toastRef } = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const resultPermissions = await Location.requestPermissionsAsync();
            const statusPermissions = resultPermissions.status;

            if (statusPermissions !== "granted") {
                toastRef.current.show("Debes aceptar los permisos de localización para crear un restaurante"
                    , 3000);
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                console.log(loc);
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                });
            }
        })();
    }, []);

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localización guarda correctamente");
        setIsVisibleMap(false);
    };

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}  >
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,

                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>

            </View>

        </Modal>
    );
}

function UpdateImage(props) {
    const { toastRef, setImageSelected, imageSelected } = props;

    const removeImage = (image) => {
        const arrayImages = imageSelect;

        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(
                            filter(imageSelected, (imageUrl) => imageUrl !== image)
                        );
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );


        if (resultPermissions === "denied") {
            toastRef.current.show(
                "Es necesario aceptar los permisos de la galeria, si los has rechazado, tiene que ir ajustes y activarlos manualmente."
                , 3000);

        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            if (result.cancelled) {
                toastRef.current.show(
                    "Has cerrado la geleria sin seleccionar ninguna imagen"
                    , 2000);

            } else {

                setImageSelected([...imageSelected, result.uri]);


            }
        }

    };

    return (
        <View style={styles.viewImages}>
            {size(imageSelected) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imageSelected, (imageRestaurant, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{ uri: imageRestaurant }}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,

    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20

    },
    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"

    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 200
    },
    mapStyle: {
        width: "100%",
        height: 550,

    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }

});