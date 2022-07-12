import React from 'react';
import {View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import Calendar from '../pages/Calendar'
import Recipes from '../pages/Recipes'
import Profile from "../pages/Profile";
import Login from "../pages/Login"
import Registration from "../pages/Registration"
import Admin from "../pages/Admin"
import RecipeDetail from '../components/recipesByFilter/RecipeDetail'
import {colors, useScreenDimensions} from "../constants/helpers";
import RecipesByCalories from "../components/recipesByFilter/RecipesByCalories";
import RecipesByDiet from '../components/recipesByFilter/RecipesByDiet'
import AddRecipe from "../components/AddRecipe";
import RecipesByCategory from "../components/recipesByFilter/RecipesByCategory";
import RecipeByDifficulty from "../components/recipesByFilter/RecipeByDifficulty";
import StatisticsForProducts from "../components/StatisticsForProducts";
import PFCScreen from "../components/PFCScreen";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const CalendarStackScreen = () => {
    return(
        <Stack.Navigator initialRouteName="Calendar" screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="Calendar"
                component={Calendar}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Calendar',
                    tabBarIcon: () => (
                        <View>
                            <Icon
                                name={'search'}
                            />
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="StatisticsForProducts"
                component={StatisticsForProducts}
            />
            <Stack.Screen
                name="RecipeDetailInCalendar"
                component={RecipeDetail}
            />
        </Stack.Navigator>
    )
}

const RecipeStackScreen = () => {
    return(
        <Stack.Navigator initialRouteName="Recipes" screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="Recipes"
                component={Recipes}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Recipes',
                    tabBarIcon: () => (
                        <View>
                            <Icon
                                name={'search'}
                            />
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="RecipeByDifficulty"
                component={RecipeByDifficulty}
            />
            <Stack.Screen
                name="RecipesByDiet"
                component={RecipesByDiet}
            />
            <Stack.Screen
                name="RecipesByCategory"
                component={RecipesByCategory}
            />
            <Stack.Screen
                name="RecipesByCalories"
                component={RecipesByCalories}
            />
            <Stack.Screen
                name="RecipeDetail"
                component={RecipeDetail}
            />
        </Stack.Navigator>
    )
}

const LoginStackScreen = () => {
    return(
        <Stack.Navigator initialRouteName="Profile" screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Profile',
                    tabBarIcon: () => (
                        <View>
                            <Icon
                                name={'ra'}
                            />
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="PFCScreen"
                component={PFCScreen}
            />
            <Stack.Screen
                name="AddRecipe"
                component={AddRecipe}
            />
            <Stack.Screen
                name="Login"
                component={Login}
            />
            <Stack.Screen
                name="Registration"
                component={Registration}
            />
            <Stack.Screen
                name="Admin"
                component={Admin}
            />
        </Stack.Navigator>
    )
}

const RootNavigator = () => {
    const screenData = useScreenDimensions()
    return (
        <NavigationContainer>
            <Tab.Navigator shifting={true}
                           sceneAnimationEnabled={true}
                           initialRouteName="Recipes"
                           activeColor="#EAE7ED"
                           labelStyle={{ fontSize: 12 }}
                           barStyle={{
                               backgroundColor: colors.shadowBlue,
                               height: screenData.isLandscape ? '9%' : '9%'
                           }}
            >
                <Tab.Screen
                    name='Calendar'
                    options={{
                        tabBarLabel: 'Календар',
                        tabBarIcon: () => (
                            <View>
                                <Icon
                                    style={[{color: '#F9F3E7'}]}
                                    size={25}
                                    name={'search'}
                                />
                            </View>
                        ),
                    }}
                    component={CalendarStackScreen}
                />
                <Tab.Screen
                    name='Recipes'
                    options={{
                        tabBarLabel: 'Рецепти',
                        tabBarIcon: () => (
                            <View>
                                <Icon
                                    style={[{color: '#F9F3E7'}]}
                                    size={23}
                                    name={'ra'}
                                />
                            </View>
                        ),
                    }}
                    component={RecipeStackScreen}
                />
                <Tab.Screen
                    name='Profile'
                    options={{
                        tabBarLabel: 'Профіль',
                        tabBarIcon: () => (
                            <View>
                                <Icon
                                    style={[{color: '#F9F3E7'}]}
                                    size={28}
                                    name={'user'}
                                />
                            </View>
                        ),
                    }}
                    component={LoginStackScreen}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default RootNavigator
