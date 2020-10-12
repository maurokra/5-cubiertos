import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeDisplayNameForm(props) {
    const { displayName, setShowModal, toastRef, setReloadUserInfo } = props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoagin, setIsLoading] = useState(false)

    const onSubmit = () => {
        console.log(newDisplayName);
        setError(null);
        if (!newDisplayName) {
            setError("El nombre no puede estar vacio.")
        } else if (displayName === newDisplayName) {
            setError("El nombre no puede ser igual al actual.")
        } else {
            setIsLoading(true);
            const update = {
                displayName: newDisplayName
            }
            firebase
                .auth()
                .currentUser.updateProfile(update)
                .then(() => {
                    console.log("OK!!!!!!!!!!!!")
                    setIsLoading(false);
                    setShowModal(false);
                    setReloadUserInfo(true);
                })
                .catch(() => {
                    setError("error al actualizar el nombre!")
                    setIsLoading(false);
                });
        }
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Nombre y apellido"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2"
                }}
                defaultValue={displayName || ""}
                onChange={e => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button
                title="Cambiar Nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoagin}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }

});