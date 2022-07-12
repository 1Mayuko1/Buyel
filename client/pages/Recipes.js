import React, {useEffect, useState, useContext} from "react";
import {
    View, Text,
    StyleSheet, Dimensions,
    Image, SafeAreaView,
    ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native'
import Carousel from 'react-native-snap-carousel';
import RecipeDetail from '../components/recipesByFilter/RecipeDetail'
import {
    colors,
    calories,
    diets,
    findIConImage, methods, getRecipeInfoById, getImage,
} from "../constants/helpers";
import {Context} from "../App";
import {fetchTypes, fetchKinds, fetchRecipes, fetchRecipeInfo} from "../http/recipeApi";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Recipes = ({ navigation }) => {

    const {recipes} = useContext(Context)

    const [recipeData, setRecipeData] = useState([])
    const [recipesInfoData, setRecipesInfoData] = useState([])
    const [kindList, setKindList] = useState([])
    const [typeList, setTypeList] = useState([])
    const [loading, setLoading] = useState(false)


    const [userAuth, setUserAuth] = useState()
    const [token, setToken] = useState('')

    const stackEffect = () => {
        fetchKinds().then(data => recipes.setKinds(data))
        fetchTypes().then(data => recipes.setTypes(data))

        fetchRecipes().then(data => {
            recipes.setRecipes(data.rows)
            setRecipeData(data.rows)
        })
        fetchRecipeInfo().then(data => {
            recipes.setRecipesInfo(data)
            setRecipesInfoData(data)
        })

        setKinds()
        setTypes()
    }

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
            console.log('error in checkToken', e)
        }
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            stackEffect()
            checkToken().then()
        })

        stackEffect()
    },[])

    const setTypes = () => {
        const typesNames = recipes.types.map(t => t).map((type) => {
            return type.name
        })
        setTypeList(typesNames)
    }

    const setKinds = () => {
        const kindsNames = recipes.kinds.map(k => k).map((kind) => {
            return kind.name
        })
        setKindList(kindsNames)
    }

    const getPopularCategories = () => {
        const kindsNames = recipes.kinds.map(k => k).map((kind, i) => {
            return {
                icon: findIConImage(kind.name),
                name: kind.name
            }
        })
        const allTypeNames = recipes.types.map(t => t).map((type, i) => {
            return {
                icon: findIConImage(type.name),
                name: type.name
            }
        })

        if([...allTypeNames, ...kindsNames].length === 1) {
            return []
        }

        const slicedTypes = allTypeNames.slice(Math.max(allTypeNames.length - 4, 0))
        return [...slicedTypes, ...kindsNames]
    }

    const _renderPopularCategories = (item) => {
        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate(
                        'RecipesByCategory',
                        {
                            categoryName: item.name,
                        }
                    )
                }}>
                    <View style={styles.card}>
                        <Text style={styles.emg_title}>{item.icon}</Text>
                        <Text style={styles.title}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const truncate = (str, maxlength) => {
        return (str.length > maxlength) ? str.slice(0, maxlength - 1) + '…' : str
    }

    const capitalizedFirstLetterInText = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    const getRecipeByDiet = () => {
        if (token.id === undefined || token.diet === []) {
            return []
        }

        let resArr = []

        recipesInfoData.filter(x => x.title === 'specialty').map(objDescription => {
            // capitalizedFirstLetterInText(txt)
            let capitalized = capitalizedFirstLetterInText(objDescription.description)
            if (capitalized.indexOf(token.diet) >= 0) {
                resArr = [...resArr, objDescription.recipeId]
            }
        })

        let recipesId = resArr.filter((item, pos, self) => {
            return self.indexOf(item) === pos && self.indexOf(item) !== null;
        })

        let recipesArrayByDiet = []

        recipesId.map(value => {
            if (recipeData.filter(x => x.id === value)) {
                recipesArrayByDiet = [...recipesArrayByDiet, ...recipeData.filter(x => x.id === value)]
            }
        })

        if (recipesArrayByDiet.length > 5) {
            return recipesArrayByDiet.slice(0, 5)
        }

        return recipesArrayByDiet
    }

    const renderRecipeForYou = ({item, index}) => {
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
        )
    }

    const renderGetInspired = ({item, index}) => {
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
                        style={{
                            borderTopRightRadius: 15,
                            borderTopLeftRadius: 15,
                            alignSelf: 'center',
                            height: '60%',
                            width: '100%',
                        }}
                        // source={require('../static/img/misoSoup.jpeg')}
                        source={{uri: item.img}}
                    />

                    <Text style={styles.carouselName}>{truncate(item.name, 17)}</Text>

                    <View style={styles.carouselRowContainer}>
                        <Text style={styles.carouselColumnItem}>{item.calories} kcal</Text>
                        <Text style={styles.carouselColumnItem}>{getRecipeInfoById(item.id, recipesInfoData).time} хв</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const BlockItemForCalories = (item) => (
        <TouchableOpacity onPress={() => {
            getRecipeInfoById(item.id, recipesInfoData)
            navigation.navigate(
                'RecipesByCalories',
                {
                    recipeCalories: item.counter
                }
            )}}
        >
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.emg_title}>{item.icon}</Text>
                    <Text style={styles.title}>{item.counter}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const BlockItemDiets = (item) => (
        <TouchableOpacity onPress={() => {
            navigation.navigate(
                'RecipesByDiet',
                {
                    recipeDiet: item.name
                }
            )}}
        >
            <View style={styles.cardContainer}>
                <View style={styles.dietCard}>
                    <Text style={styles.dietIcon}>{item.icon}</Text>
                    <Text style={styles.dietTxt}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderCalories = (item) => {
        return (
            <>
                <View style={{display: "flex", flexDirection: "row"}}>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        {item[0] && BlockItemForCalories(item[0])}
                        {item[1] && BlockItemForCalories(item[1])}
                    </View>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        {item[2] && BlockItemForCalories(item[2])}
                        {item[3] && BlockItemForCalories(item[3])}
                    </View>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        {item[4] && BlockItemForCalories(item[4])}
                        {item[5] && BlockItemForCalories(item[5])}
                    </View>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        {item[6] && BlockItemForCalories(item[6])}
                        {item[7] && BlockItemForCalories(item[7])}
                    </View>
                </View>
            </>
        )
    }

    const renderKindOfMeal = (item) => {
        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(
                            'RecipesByCategory',
                            {
                                categoryName: item,
                            }
                        )
                    }}
                >
                    <View style={styles.secCard}>
                        <Image
                            style={styles.kindOfMealImage}
                            source={getImage(item)}
                            // source={{uri: item.img}}
                        />
                        <View
                            opacity={0.5}
                            style={styles.kindOfMealTextContainer}>
                            <Text style={styles.kindOfMealText}>{item}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderGetMethod = (item) => {
        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(
                            'RecipeByDifficulty',
                            {
                                recipeDifficulty: item.name,
                            }
                        )
                    }}
                >
                    <View style={styles.secCard}>
                        <Image
                            style={styles.kindOfMealImage}
                            source={item.image}
                            // source={{uri: item.img}}
                        />
                        <View
                            opacity={0.5}
                            style={styles.kindOfMealTextContainer}>
                            <Text style={styles.kindOfMealText}>{item.name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderPickDiet = (item) => {
        return (
            <>
                <View style={styles.row}>
                    <View style={styles.column}>
                        {item[0] && BlockItemDiets(item[0])}
                        {item[1] && BlockItemDiets(item[1])}
                    </View>
                    <View style={styles.column}>
                        {item[2] && BlockItemDiets(item[2])}
                        {item[3] && BlockItemDiets(item[3])}
                    </View>
                    <View style={styles.column}>
                        {item[4] && BlockItemDiets(item[4])}
                        {item[5] && BlockItemDiets(item[5])}
                    </View>
                    <View style={styles.column}>
                        {item[6] && BlockItemDiets(item[6])}
                        {item[7] && BlockItemDiets(item[7])}
                    </View>
                    <View style={styles.column}>
                        {item[8] && BlockItemDiets(item[8])}
                        {item[9] && BlockItemDiets(item[9])}
                    </View>
                    <View style={styles.column}>
                        {item[10] && BlockItemDiets(item[10])}
                        {item[11] && BlockItemDiets(item[11])}
                    </View>
                </View>
            </>
        )
    }

    return (
        <ScrollView style={styles.mainContainer}>
            {
                loading ? <ActivityIndicator
                        color={colors.shadowBlue}
                        size="large"
                        animating={loading}
                        style={{marginTop: '100%'}}
                    /> :
                <>
                    <View>
                        <Text style={styles.h1Text}>Рецепти</Text>
                    </View>
                    <SafeAreaView style={styles.safeArea}>

                        <Text style={styles.h2Text}>Радимо саме вам</Text>

                        <View style={styles.carouselContainer}>
                            <Carousel
                                layout={"default"}
                                data={getRecipeByDiet()}
                                sliderWidth={100}
                                itemWidth={300}
                                renderItem={renderRecipeForYou}
                            />
                        </View>

                        <Text style={styles.h2Text}>Популярні категорії</Text>
                        <View>
                            <ScrollView horizontal showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}>
                                {getPopularCategories().map(arr => {
                                    return _renderPopularCategories(arr)
                                })}
                            </ScrollView>
                        </View>

                        <Text style={styles.h2Text}>Надихнись рецептом</Text>
                        <View style={styles.carouselContainer}>
                            <Carousel
                                layout={"default"}
                                data={recipeData.length !== 0 ? recipeData.slice(0, 5) : recipeData}
                                sliderWidth={100}
                                itemWidth={300}
                                renderItem={renderGetInspired}
                            />
                        </View>

                        <Text style={styles.h2Text}>Калораж</Text>
                        <View>
                            <ScrollView horizontal showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}>
                                {renderCalories(calories)}
                            </ScrollView>
                        </View>

                        <Text style={styles.h2Text}>Вибери вид їжі</Text>
                        <View>
                            <ScrollView horizontal showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}>
                                {kindList.map(kind => {return renderKindOfMeal(kind)})}
                            </ScrollView>
                        </View>

                        <Text style={styles.h2Text}>Вибери складність</Text>
                        <View>
                            <ScrollView horizontal showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}>
                                {methods.map(method => { return renderGetMethod(method)})}
                            </ScrollView>
                        </View>

                        <Text style={styles.h2Text}>Особливі потреби</Text>
                        <View>
                            <ScrollView horizontal showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}>
                                {renderPickDiet(diets)}
                            </ScrollView>
                        </View>

                    </SafeAreaView>
                </>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.beige,
        height: Dimensions.get('screen').height,
    },
    row: {
        display: "flex", flexDirection: "row"
    },
    column: {
        display: "flex", flexDirection: "column"
    },
    h1Text: {
        marginTop: 70,
        marginLeft: 30,
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 30,
        textAlign: 'left',
    },
    h2Text: {
        marginLeft: 30,
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'left',
    },
    safeArea: {
        flex: 1,
        backgroundColor: colors.beige,
        marginTop: 30
    },
    carouselContainer: {
        flexDirection:'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    carouselImageContainer: {
        backgroundColor:'floralwhite',
        marginBottom: 30,
        borderRadius: 15,
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
    title: {
        marginBottom: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emg_title: {
        marginBottom: 8,
        marginTop: 24,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardContainer: {
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fffbee',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 30,
        width: 100,
        height: 100,
    },
    dietCard: {
        backgroundColor: '#fffbee',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 30,
        width: 135,
        height: 135,
    },
    dietTxt: {
        width: '80%',
        marginBottom: 24,
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dietIcon: {
        marginBottom: 5,
        marginTop: 20,
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
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
    kindOfMealImage: {
        borderRadius: 20,
        alignSelf: 'center',
        height: '100%',
        width: '100%',
    },
    kindOfMealTextContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 20,
        width: '100%',
        height: '100%',
    },
    kindOfMealText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 25,
    },
});

export default Recipes
