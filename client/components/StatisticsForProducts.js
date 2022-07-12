import React, {useEffect, useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
    checkPeriodOfDates,
    colors,
    getRecipeInfoById,
    round,
    getRecipeByFilter,
    truncate,
    shuffle
} from "../constants/helpers";
import {fetchProducts, fetchRecipeInfo, fetchRecipes} from "../http/recipeApi";
import {fetchUserProducts} from "../http/userProductsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const StatisticsForProducts = ({route, navigation}) => {

    const {userId} = route.params
    const {objectValue} = route.params

    const [userAuth, setUserAuth] = useState()
    const [token, setToken] = useState('')

    const [statisticsValues, setStatisticsValues] = useState([])
    const [productsFromBD, setProductsFromBD] = useState([])
    const [recipesData, setRecipesData] = useState([])
    const [recipesInfoData, setRecipesInfoData] = useState([])

    const checkToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null || undefined) {
                setUserAuth(true)
                setToken(jwtDecode(value))
            } else {
                setUserAuth(false)
            }
        } catch (e) {
            console.log('err checkToken', e)
        }
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            checkToken().then()

            setStatisticsValues([])
            fetchUserProducts(userId).then(data => {
                setStatisticsValues(data)
            })
            fetchProducts().then(data => {
                setProductsFromBD(data)
            })
            fetchRecipes().then(data => {
                setRecipesData(data.rows)
            })
            fetchRecipeInfo().then(data => {
                setRecipesInfoData(data)
            })
        })
    }, [navigation])

    let normal = {}
    if(token.pfc !== undefined) {
        normal = JSON.parse(token.pfc) // from bd ( user.pfc )
    }

    const renderRecipeList = (item) => {
        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    onPress={() => {
                        getRecipeInfoById(item.id, recipesInfoData)
                        navigation.navigate(
                            'RecipeDetailInCalendar',
                            {
                                recipe: item,
                                recipeInfo: getRecipeInfoById(item.id, recipesInfoData)
                            }
                        )
                    }}
                >
                    <View style={styles.carouselImageContainer}>
                        <Image
                            style={{
                                borderTopRightRadius: 15,
                                borderTopLeftRadius: 15,
                                alignSelf: 'center',
                                height: '60%',
                                width: '100%',
                            }}
                            source={{uri: item.img}}
                        />

                        <Text style={styles.carouselName}>{truncate(item.name, 17)}</Text>

                        <View style={styles.carouselRowContainer}>
                            <Text style={styles.carouselColumnItem}>{item.calories} kcal</Text>
                            <Text style={styles.carouselColumnItem}>{getRecipeInfoById(item.id, recipesInfoData).time} хв</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    let _objectData = checkPeriodOfDates(userId, statisticsValues)

    // Білки
    const checkForProteins = (normal, current) => {
        if (normal === [] || current === []) {
            return []
        }

        let comparison = normal.proteins > current.proteins // true - замало, false - забагато

        let productsByProtein = []

        if (comparison && current !== []) {

            productsFromBD.map(value => {
                if (value.proteins >= 10) {
                    productsByProtein = [
                        ...productsByProtein,
                        value.name
                    ]
                }
            })

            let recipesArrayByName = getRecipeByFilter('proteins', recipesInfoData, recipesData)

            return {
                productsTxt: 'Враховуючи те, що вони у вас в недостачі радимо в звернути увагу на такі продукти:',
                recipesTxt: 'Щодо рецептів для вас є такі варіанти:',
                products: productsByProtein.length > 8 ? productsByProtein.slice(0, 8) : productsByProtein,
                recipes: recipesArrayByName.length > 5 ? recipesArrayByName.slice(0, 5) : recipesArrayByName
            }
        } else if (!comparison) {
            productsFromBD.map(value => {
                if (value.carbs >= 10) {
                    productsByProtein = [
                        ...productsByProtein,
                        value.name
                    ]
                }
            })

            let recipesArrayByName = getRecipeByFilter('carbs', recipesInfoData, recipesData)

            return {
                productsTxt: 'Враховуючи те, що вони у вас в надлишку' +
                    ' радимо звернути увагу на продукти багаті вуглеводами:',
                recipesTxt: 'Щодо рецептів для вас є такі варіанти:',
                products: productsByProtein.length > 8 ? productsByProtein.slice(0, 8) : productsByProtein,
                recipes: recipesArrayByName.length > 5 ? recipesArrayByName.slice(0, 5) : recipesArrayByName
            }
        }
    }

    // Жири
    const checkForFats = (normal, current) => {
        if (normal === [] || current === []) {
            return []
        }

        let comparison = normal.fats > current.fats

        let productsByFats = []

        if (comparison && current !== []) {
            productsFromBD.map(value => {
                if (value.fats >= 10) {
                    productsByFats = [
                        ...productsByFats,
                        value.name
                    ]
                }
            })

            let recipesArrayByName = getRecipeByFilter('fats', recipesInfoData, recipesData)

            return {
                productsTxt: 'Вони у вас в недостачі радимо звернути увагу на такі продукти:',
                recipesTxt: 'Щодо рецептів для вас є такі варіанти:',
                products: productsByFats.length > 8 ? productsByFats.slice(0, 8) : productsByFats,
                recipes: recipesArrayByName.length > 5 ? recipesArrayByName.slice(0, 5) : recipesArrayByName
            }
        } else if (!comparison) {
            productsFromBD.map(value => {
                if (value.proteins >= 10) {
                    productsByFats = [
                        ...productsByFats,
                        value.name
                    ]
                }
            })

            let recipesArrayByName = getRecipeByFilter('proteins', recipesInfoData, recipesData)

            return {
                productsTxt: 'Враховуючи те, що жири у вас в надлишку' +
                    ' радимо в звернути увагу на продукти багаті білками:',
                recipesTxt: 'Щодо рецептів для вас є такі варіанти:',
                products: productsByFats.length > 8 ? productsByFats.slice(0, 8) : productsByFats,
                recipes: recipesArrayByName.length > 5 ? recipesArrayByName.slice(0, 5) : recipesArrayByName
            }
        }
    }

    // Вуглеводи
    const checkForCarbs = (normal, current) => {
        if (normal === [] || current === []) {
            return []
        }

        let comparison = normal.carbs > current.carbs

        let productsByFats = []

        if (comparison && current !== []) {
            productsFromBD.map(value => {
                if (value.carbs >= 10) {
                    productsByFats = [
                        ...productsByFats,
                        value.name
                    ]
                }
            })

            let recipesArrayByName = getRecipeByFilter('carbs', recipesInfoData, recipesData)

            return {
                productsTxt: 'Їх у вас недостатньо, зверніть увагу на продукти багаті вуглеводами:',
                recipesTxt: 'Щодо рецептів для вас є такі варіанти:',
                products: productsByFats.length > 8 ? productsByFats.slice(0, 8) : productsByFats,
                recipes: recipesArrayByName.length > 5 ? recipesArrayByName.slice(0, 5) : recipesArrayByName
            }
        } else if (!comparison) {

            productsFromBD.map(value => {
                if (value.carbs < 10 && value.fats <= 15 || value.proteins >= 10) {
                    productsByFats = [
                        ...productsByFats,
                        value.name
                    ]
                }
            })

            let recipesArrayByFats = getRecipeByFilter('fats', recipesInfoData, recipesData)
            let recipesArrayByProtein = getRecipeByFilter('proteins', recipesInfoData, recipesData)
            let comparedArray = shuffle([...recipesArrayByFats, ...recipesArrayByProtein])

            let recipesArrayByName = comparedArray.filter((item, pos, self) => {
                return self.indexOf(item) === pos;
            })

            return {
                productsTxt: 'Вони у вас в надлишку,' +
                    ' радимо в звернути увагу на продукти багаті білками чи жирами :',
                recipesTxt: 'Щодо рецептів для вас є такі варіанти:',
                products: productsByFats.length > 8 ? productsByFats.slice(0, 8) : productsByFats,
                recipes: recipesArrayByName.length > 5 ? recipesArrayByName.slice(0, 5) : recipesArrayByName
            }
        }
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={{height: Dimensions.get('screen').height}}>
                <Text style={styles.h1Text}>Статистика</Text>

                <View style={styles.mainHeader}>
                    <Text style={styles.h2Text}>Показники за вибрані дати</Text>
                    <View style={styles.mainHeaderContainer}>
                        <View style={styles.mainHeaderBlock}>
                            <Text style={styles.txtInHeader}>
                                Білки
                            </Text>
                            <Text style={styles.txtInHeader}>
                                {round(_objectData.proteins * objectValue.date.length)}
                            </Text>
                        </View>

                        <View style={styles.mainHeaderBlock}>
                            <Text style={styles.txtInHeader}>
                                Жири
                            </Text>
                            <Text style={styles.txtInHeader}>
                                {round(_objectData.fats * objectValue.date.length)}
                            </Text>
                        </View>

                        <View style={styles.mainHeaderBlock}>
                            <Text style={styles.txtInHeader}>
                                Вуглеводи
                            </Text>
                            <Text style={styles.txtInHeader}>
                                {round(_objectData.carbs * objectValue.date.length)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h2Text}>За нормою повинно бути</Text>
                    <View style={styles.mainHeaderContainer}>
                        <View style={styles.mainHeaderBlock}>
                            <Text style={styles.txtInHeader}>
                                Білки
                            </Text>
                            <Text style={styles.txtInHeader}>
                                {round(normal.proteins * objectValue.date.length)}
                            </Text>
                        </View>

                        <View style={styles.mainHeaderBlock}>
                            <Text style={styles.txtInHeader}>
                                Жири
                            </Text>
                            <Text style={styles.txtInHeader}>
                                {round(normal.fats * objectValue.date.length)}
                            </Text>
                        </View>

                        <View style={styles.mainHeaderBlock}>
                            <Text style={styles.txtInHeader}>
                                Вуглеводи
                            </Text>
                            <Text style={styles.txtInHeader}>
                                {round(normal.carbs * objectValue.date.length)}
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.h2Text}>Корисні поради :</Text>

                <View>
                    <Text style={styles.h3Text}>Білки:</Text>
                    <Text style={styles.h4Text}>
                        {
                            checkForProteins(normal, _objectData) !== undefined ?
                                checkForProteins(normal, _objectData).productsTxt : null
                        }
                    </Text>
                    <View style={styles.listContainer}>
                        {
                            checkForProteins(normal, _objectData) !== undefined ?
                                checkForProteins(normal, _objectData).products.map( (value, i) => {
                                    return (
                                        <View key={i} style={styles.listItemsContainer}>
                                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                                <Text style={{ color: colors.text, fontSize: 16}}>
                                                    {value}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }) : null
                        }
                    </View>
                    <Text style={styles.h4Text}>
                        {
                            checkForProteins(normal, _objectData) !== undefined ?
                                checkForProteins(normal, _objectData).recipesTxt : null
                        }
                    </Text>
                    <View>
                        <ScrollView horizontal showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}>
                            {
                                checkForProteins(normal, _objectData) !== undefined ?
                                    checkForProteins(normal, _objectData).recipes.map(value =>{
                                        return renderRecipeList(value)
                                    }) : null
                            }
                        </ScrollView>
                    </View>
                </View>

                <View>
                    <Text style={styles.h3Text}>Жири:</Text>
                    <Text style={styles.h4Text}>
                        {
                            checkForFats(normal, _objectData) !== undefined ?
                                checkForFats(normal, _objectData).productsTxt : null
                        }
                    </Text>
                    <View style={styles.listContainer}>
                        {
                            checkForFats(normal, _objectData) !== undefined ?
                                checkForFats(normal, _objectData).products.map( (value, i) => {
                                    return (
                                        <View key={i} style={styles.listItemsContainer}>
                                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                                <Text style={{ color: colors.text, fontSize: 16}}>
                                                    {value}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }) : null
                        }
                    </View>
                    <Text style={styles.h4Text}>
                        {
                            checkForFats(normal, _objectData) !== undefined ?
                                checkForFats(normal, _objectData).recipesTxt : null
                        }
                    </Text>
                    <View>
                        <ScrollView horizontal showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}>
                            {
                                checkForFats(normal, _objectData) !== undefined ?
                                    checkForFats(normal, _objectData).recipes.map(value =>{
                                        return renderRecipeList(value)
                                    }) : null
                            }
                        </ScrollView>
                    </View>
                </View>

                <View>
                    <Text style={styles.h3Text}>Вуглеводи:</Text>
                    <Text style={styles.h4Text}>
                        {
                            checkForCarbs(normal, _objectData) !== undefined ?
                                checkForCarbs(normal, _objectData).productsTxt : null
                        }
                    </Text>
                    <View style={styles.listContainer}>
                        {
                            checkForCarbs(normal, _objectData) !== undefined ?
                                checkForCarbs(normal, _objectData).products.map( (value, i) => {
                                    return (
                                        <View key={i} style={styles.listItemsContainer}>
                                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                                <Text style={{ color: colors.text, fontSize: 16}}>
                                                    {value}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }) : null
                        }
                    </View>
                    <Text style={styles.h4Text}>
                        {
                            checkForCarbs(normal, _objectData) !== undefined ?
                                checkForCarbs(normal, _objectData).recipesTxt : null
                        }
                    </Text>
                    <View>
                        <ScrollView horizontal showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}>
                            {
                                checkForCarbs(normal, _objectData) !== undefined ?
                                    checkForCarbs(normal, _objectData).recipes.map(value =>{
                                        return renderRecipeList(value)
                                    }) : null
                            }
                        </ScrollView>
                    </View>
                </View>

                <View style={{marginBottom: 100}}>

                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.beige,
        height: Dimensions.get('screen').height,
    },
    h1Text: {
        marginTop: 70,
        marginBottom: 15,
        fontSize: 25,
        textAlign: 'center',
        alignSelf: 'center',
    },
    h2Text: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 25,
        textAlign: 'center',
        alignSelf: 'center',
    },
    h3Text: {
        marginTop: 20,
        marginBottom: 15,
        fontSize: 23,
        marginLeft: 20,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    h4Text: {
        marginBottom: 15,
        fontSize: 20,
        marginLeft: 20,
        marginRight: 10,
        textAlign: 'center',
    },
    mainHeader: {
        alignSelf: 'center',
        width: '90%',
        paddingBottom: 20,
        borderRadius: 20,
        backgroundColor: colors.pastelGray
    },
    mainHeaderContainer: {
        justifyContent: 'space-evenly',
        display: "flex", flexDirection: 'row',
    },
    mainHeaderBlock: {
        display: "flex", flexDirection: 'column',
    },
    txtInHeader: {
        fontSize: 15,
        alignSelf: 'center',
        alignItems: 'center'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 15,
    },
    listItemsContainer: {
        alignSelf: 'center',
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
        padding: 12,
        display: 'flex', flexDirection: 'column',
        backgroundColor: colors.shadowBrown
    },
    cardContainer: {
        justifyContent: 'center',
    },
    secCard: {
        backgroundColor: 'floralwhite',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 20,
        width: 200,
        height: 200,
    },
    recipeImage: {
        borderRadius: 20,
        alignSelf: 'center',
        height: '100%',
        width: '100%',
    },
    recipeText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 25,
    },
    carouselImageContainer: {
        backgroundColor:'floralwhite',
        marginBottom: 30,
        borderRadius: 15,
        width: 230,
        height: 250,
        marginLeft: 28,
        marginRight: 28,
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
        fontSize: 22,
        marginLeft: 10,
        textAlign: 'left',
    },
    carouselRowContainer: {
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

export default StatisticsForProducts;
