import {$host} from "./index";

export const createUserProducts = async (formData, userId) => {
    const body = {
        productsValues: formData.productsValues,
        date: formData.date
    }
    return await $host.post(`api/users_products/user/${+userId}/`, body)
}

export const fetchAllUsersProducts = async () => {
    const {data} = await $host.get('api/users_products')
    return data
}

export const fetchUserProducts = async (userId) => {
    const {data} = await $host.get(`api/users_products/${+userId}/`)
    console.log('in userProductsApi')
    return data
}
