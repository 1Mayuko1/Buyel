import {$host, $authHost} from "./index";
import jwtDecode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registration = async (email, password, userName) => {
    const {data} = await $host.post('api/user/registration',
        {email, password, role: 'USER', userName})
    try {
        await AsyncStorage.setItem('token', data.token)
    } catch (e) {
        console.log('err from userApi', e)
    }
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login',
        {email, password})
    try {
        await AsyncStorage.setItem('token', data.token)
    } catch (e) {
        console.log('err from userApi', e)
    }
    return jwtDecode(data.token)
}

export const updateField = async (id, diet, pfc) => {

    if (id && diet) {
        const {data} = await $host.put(`api/user/${+id}`,
            {diet})
        try {
            await AsyncStorage.setItem('token', data.token)
        } catch (e) {
            console.log('err from userApi', e)
        }
        return jwtDecode(data.token)
    }

    if (id && pfc) {
        const {data} = await $host.put(`api/user/${+id}`, {pfc})
        try {
            await AsyncStorage.setItem('token', data.token)
        } catch (e) {
            console.log('err from userApi', e)
        }
        return jwtDecode(data.token)
    }
}

export const check = async () => {
    const {data} = await $authHost.post('api/user/auth')
    try {
        await AsyncStorage.setItem('token', data.token)
    } catch (e) {
        console.log('err from userApi', e)
    }
    return jwtDecode(data.token)
}
