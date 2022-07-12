import React, {createContext} from 'react';
import { LogBox } from "react-native";
import UserStore from './store/UserStore'
import UserProductsStore from "./store/UserProductsStore";
import RecipeStore from "./store/RecipeStore";
import AppContainer from "./AppContainer";

LogBox.ignoreLogs([""]);

export const Context = createContext(null)

export default function App() {

  return (
      <Context.Provider value={{
        user: new UserStore(),
        userProducts: new UserProductsStore(),
        recipes: new RecipeStore()
      }}>
        <AppContainer />
      </Context.Provider>
  );
}



