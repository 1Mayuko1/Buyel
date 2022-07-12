import {makeAutoObservable} from "mobx";

export default class RecipeStore {
    constructor() {
        this._kinds = []
        this._types = []
        this._products = []
        this._recipes = []
        this._recipesInfo = []
        makeAutoObservable(this)
    }

    setProducts(products) {
        this._products = products
    }
    setKinds(kinds) {
        this._kinds = kinds
    }
    setTypes(types) {
        this._types = types
    }
    setRecipes(recipes) {
        this._recipes = recipes
    }
    setRecipesInfo(info) {
        this._recipesInfo = info
    }

    get kinds() {
        return this._kinds
    }
    get products() {
        return this._products
    }
    get types() {
        return this._types
    }
    get recipes() {
        return this._recipes
    }
    get recipesInfo() {
        return this._recipesInfo
    }
}
