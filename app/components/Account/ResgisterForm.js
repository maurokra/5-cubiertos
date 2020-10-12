import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

export default function RegisterForm(props) {

    const { toastRef } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const onSubmit = () => {

        if (
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.repeatPassword)
        ) {
            // console.log("todos los campos son obligatorios");
            toastRef.current.show("todos los campos son obligatorios");
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show("email no es");
        } else if (formData.password !== formData.repeatPassword) {
            toastRef.current.show("las contraseñas tiene que ser iguales!");
        } else if (size(formData.password) < 6) {
            toastRef.current.show("la contraseña tiene que tener almenos 6 caracterres");

        } else {
            setLoading(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    setLoading(false);
                    navigation.navigate("Account");
                })
                .catch(err => {
                    setLoading(false);
                    toastRef.current.show("El mail ya esta en uso, pruebe en otro");

                })
        }


    };

    const onChange = (e, type) => {
        //console.log(type);
        //console.log(e.nativeEvent.text);
        //setFormData({ [type]: e.nativeEvent.text })
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={(e => onChange(e, "email"))}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e => onChange(e, "password"))}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }

            />
            <Input
                placeholder="repetir contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showRepeatPassword ? false : true}
                onChange={(e => onChange(e, "repeatPassword"))}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    />
                }
            />
            <Button
                title="Unirse"
                containerStyle={styles.btnContainRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Creando cuenta" />
        </View>
    )
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
        repeatPassword: ""
    };
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainRegister: {
        marginTop: 20,
        width: "95%"
    },
    btnRegister: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
});