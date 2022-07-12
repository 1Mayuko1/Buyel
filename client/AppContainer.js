import {ActivityIndicator, View, StyleSheet} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import RootNavigator from './navigation/RootNavigator';
import {Context} from "./App";
import {check} from "./http/userApi";
import {colors} from "./constants/helpers";

const AppContainer = () => {

    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        check().then(() => {
            user.setUser(true)
            user.setIsAuth(true)
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return  (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return ( <RootNavigator /> );
}

export default AppContainer

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.beige,
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});



