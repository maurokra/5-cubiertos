import React, { useRef } from "react";
import { View, StyleSheet, Image } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import Toast from "react-native-easy-toast";
import ResgiterForm from "../../components/Account/ResgisterForm";


export default function Register() {
    const toastRef = useRef();



    return (
        <KeyboardAwareScrollView>
            <View>
                <Image
                    source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <View style={styles.viewForm}>
                    <ResgiterForm toastRef={toastRef} />

                </View>
                <Toast ref={toastRef} position="center" opacity={0.9} />
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20
    },
    viewForm: {
        marginRight: 40,
        marginLeft: 40
    }
})