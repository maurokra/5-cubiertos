import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/api";

export default function ChangePasswordForm(props) {
    const { setShowModal, toastRef } = props

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        console.log(e.nativeEvent.text);
        console.log(type);
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    };

    const onSubmit = async () => {
        let isSetErrors = true;
        let errorsTemp = {};

        setErrors({})
        if (!formData.password ||
            !formData.newPassword ||
            !formData.repeatPassword) {
            errorsTemp = {
                password: !formData.password ? "La contraseña No puede estar vacia" : "",
                newpassword: !formData.newPassword ? "La contraseña No puede estar vacia" : "",
                repeatPassword: !formData.repeatPassword ? "La contraseña No puede estar vacia" : "",
            };
        } else if (formData.newPassword !== formData.repeatPassword) {
            errorsTemp = {
                newpassword: "La contraseña No son igual",
                repeatPassword: "La contraseña No son igual",

            }
        } else if (size(formData.newPassword) < 6) {
            errorsTemp = {
                newPassword: "La contraseña tiene que ser mayor a 6 caracteres",
                repeatPassword: "La contraseña tiene que ser mayor a 6 caracteres"
            };

        } else {
            setIsLoading(true);
            await reauthenticate(formData.password)
                .then(async () => {
                    await firebase
                        .auth()
                        .currentUser.updatePassword(formData.newPassword)
                        .then(() => {
                            isSetErrors = false;
                            setIsLoading(false);
                            setShowModal(false);
                            firebase.auth().signOut();
                        }).catch(() => {
                            errorsTemp = {
                                other: "Error al acualizar la contraseña"
                            };
                            setIsLoading(false);
                        });

                }).catch((err) => {
                    console.log(err);
                    errorsTemp = {
                        password: "La contraseña no es correcta"
                    }
                    setIsLoading(false);
                });
        }


        isSetErrors && setErrors(errorsTemp);
    };

    return (
        <View styles={styles.view}>
            <Input
                placeholder="contraseña actual"
                containerStyle={StyleSheet.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={e => onChange(e, "password")}
                errorMessage={errors.password}
            />
            <Input
                placeholder="Nueva contraseña "
                containerStyle={StyleSheet.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={e => onChange(e, "newPassword")}
                errorMessage={errors.newPassword}
            />
            <Input
                placeholder="confirmar contraseña "
                containerStyle={StyleSheet.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)

                }}
                onChange={e => onChange(e, "repeatPassword")}
                errorMessage={errors.repeatPassword}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{errors.other}</Text>
        </View>
    )
}

function defaultValue() {
    return {
        password: "",
        newPassword: "",
        repeatPassword: ""
    }

}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,

    },
    btnContainer: {
        marginTop: 20,
        width: "95%",

    },
    btn: {
        backgroundColor: "#00a680"
    }
})