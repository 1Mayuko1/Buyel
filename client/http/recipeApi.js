import {$host} from "./index";

export const createKind = async (kind) => {
    const body = {
        name: kind
    }
    return await $host.post(`api/kind`, body)
}

export const fetchKinds = async () => {
    const {data} = await $host.get('api/kind')
    return data
}

export const createType = async (type) => {
    const body = {
        name: type
    }
    return await $host.post(`api/type`, body)
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}

export const createProduct = async (product) => {
    const body = {
        name: product
    }
    return await $host.post(`api/products`, body)
}

export const fetchProducts = async () => {
    const {data} = await $host.get('api/products')
    return data
}

export const fetchRecipeInfo = async () => {
    const {data} = await $host.get('api/recipe_info')
    return data
}

export const createRecipe = async (recipe) => {
    const body = {
        name: recipe.name,
        shortInfo: recipe.shortInfo,
        calories: recipe.calories,
        kindId: recipe.kindId,
        typeId: recipe.typeId,
        img: recipe.img,
        info: recipe.info
    }
    return await $host.post(`/api/recipe`, body)
}

export const fetchRecipes = async () => {
    const {data} = await $host.get('api/recipe')
    return data
}

export const fetchOneRecipe = async (id) => {
    return await $host.get(`api/recipe/${+id}/`)
}
