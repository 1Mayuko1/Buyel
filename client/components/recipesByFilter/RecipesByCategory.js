import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors, getRecipeInfoById, SearchBarTheme, truncate} from "../../constants/helpers";
import { Appbar } from 'react-native-paper';
import SearchBar from "react-native-dynamic-search-bar";
import Icon from "react-native-vector-icons/FontAwesome";
import {Context} from "../../App";

const RecipesByCategory = ({route, navigation}) => {

    const {recipes} = useContext(Context)

    const [term, setTerm] = React.useState('')
    const [recipeData, setRecipeData] = useState([])
    const [recipesInfoData, setRecipesInfoData] = useState([])

    const {categoryName} = route.params

    const stackEffect = () => {
        setRecipeData(recipes.recipes)
        setRecipesInfoData(recipes.recipesInfo)
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            stackEffect()
        })
        stackEffect()
    },[])

    const onChangeSearch = (value) => {
        setTerm(value)
    }

    const goBeck = () => {
        navigation.navigate('Recipes');
    }

    let resArr = []

    recipeData.map(e => e).map(value => {
        if (value.kindId === 1) {
            resArr = [...resArr, value]
        }
    })

    const renderRecipe = (item) => {
        return (
            <TouchableOpacity onPress={() => {
                getRecipeInfoById(item.id, recipesInfoData)
                navigation.navigate(
                    'RecipeDetail',
                    {
                        recipe: item,
                        recipeInfo: getRecipeInfoById(item.id, recipesInfoData)
                    }
                )}}
            >
                <View style={styles.carouselImageContainer}>
                    <Image
                        style={styles.carouselImg}
                        source={{uri: item.img}}
                    />

                    <Text style={styles.carouselName}>{truncate(item.name, 40)}</Text>

                    <View style={styles.carouselRowContainer}>
                        <Text style={styles.carouselColumnItem}>{item.calories} kcal</Text>
                        <Text style={styles.carouselColumnItem}>{getRecipeInfoById(item.id, recipesInfoData).time} хв</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={{
                height: Dimensions.get('screen').height,
            }}>
                <View>
                    <Appbar.Header theme={SearchBarTheme}>
                        <Appbar.Action icon="home" onPress={goBeck}/>
                        <SearchBar
                            placeholder="Search here"
                            onChangeText={(text) =>
                                onChangeSearch(text)
                            }
                            style={{flex: 1}}
                            onClearPress={() => setTerm('')}
                        />
                        <Appbar.Action
                            icon={
                                () => (
                                    <View>
                                        <Icon
                                            onPress={() => {
                                                console.log('hello')
                                            }}
                                            style={[{color: '#000'}]}
                                            size={20}
                                            name={'search'}
                                        />
                                    </View>
                                )
                            }
                        />
                    </Appbar.Header>
                </View>
                <View>
                    <Text style={styles.h1Text}>За категорією {categoryName}</Text>
                </View>
                <View>
                    <ScrollView>
                        <View>
                            {resArr.map(recipe => {return renderRecipe(recipe)})}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    )
}

export default RecipesByCategory

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.beige,
        height: Dimensions.get('screen').height,
    },
    h1Text: {
        marginTop: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 28,
        textAlign: 'center',
    },
    carouselImageContainer: {
        alignSelf: 'center',
        backgroundColor:'floralwhite',
        marginBottom: 30,
        borderRadius: 15,
        width: '70%',
        height: 250,
    },
    carouselImg: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        alignSelf: 'center',
        height: '60%',
        width: '100%',
    },
    carouselName: {
        marginTop: 10,
        marginRight: 10,
        fontSize: 22,
        marginLeft: 10,
        textAlign: 'center',
    },
    carouselRowContainer: {
        alignSelf: 'center',
        display: "flex", flexDirection: "row",
        marginTop: 10,
        marginLeft: 10,
    },
    carouselColumnItem: {
        fontSize: 14,
        color: '#333',
        marginRight: 10,
        display: "flex", flexDirection: "column"
    },
})

