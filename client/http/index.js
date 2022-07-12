import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from "react";

const $host = axios.create({
    baseURL: 'http://localhost:5000/'
})

const $authHost = axios.create({
    baseURL: 'http://localhost:5000/'
})

const authInterceptor = config => {

    const [token, setToken] = useState('')

    useEffect(() => {
        _retrieveData().then()
    }, []);

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                setToken(value)
            }
        } catch (e) {
            console.log('err - ', e)
        }
    };

    config.headers.autorization = `Bearer ${token}`
    console.log('token token - ', token)
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}
