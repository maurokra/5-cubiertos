import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {

    const navigation = useNavigation();
    console.log(navigation);

    return (
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.titles} >
                Consulta tu perfil de 5 cubiertos
            </Text>
            <Text style={styles.desription}>
                ¿como describir tu mejor restaurante? Buscar y visualizar los mejores
                restaurantes de forma sencilla, vota cual te ha gustado más y
                comenta como ha sito tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    buttonStyle={styles.btnStyles}
                    containerStyle={styles.btnContainer}
                    title="Ver tu perfil"
                    onPress={() => navigation.navigate("Login")}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40
    },
    titles: {
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center"
    },
    desription: {
        textAlign: "center",
        marginBottom: 20
    },
    viewBtn: {
        flex: 1,
        alignItems: "center"
    },
    btnStyles: {
        backgroundColor: "#00a680"
    },
    btnContainer: {
        width: "70%"

    }
});