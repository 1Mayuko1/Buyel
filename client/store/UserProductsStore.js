import {makeAutoObservable} from "mobx";

export default class UserProductsStore {

    constructor() {
        this._userProducts = []
        makeAutoObservable(this)
    }

    setUserProducts(userProducts) {
        this._userProducts = userProducts
    }

    get getUserProducts() {
        return this._userProducts
    }
}
