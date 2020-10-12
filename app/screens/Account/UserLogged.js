import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOption from "../../components/Account/AccountOption";


export default function UserLogged() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [reloadUserInfo, setReloadUserInfo] = useState(false);
    const toastRef = useRef();

    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })();
        setReloadUserInfo(false);
    }, [reloadUserInfo])

    return (
        <View styles={styles.viewUserInfo} >
            {userInfo && <InfoUser
                userInfo={userInfo}
                toastRef={toastRef}
                setLoading={setLoading}
                setLoadingText={setLoadingText}
            />}


            <AccountOption
                userInfo={userInfo}
                toastRef={toastRef}
                setReloadUserInfo={setReloadUserInfo} />
            <Button
                title="Cerrar sessión"
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading text={loadingText} isVisible={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 3,
        borderBottomColor: "#3e3e3e",
        paddingTop: 10,
        paddingBottom: 10
    },
    btnCloseSessionText: {
        color: "#00a680"
    }

});