import React from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {colors} from "../../constants/helpers";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RecipeDetail = ({route}) => {

    const {recipe, recipeInfo} = route.params

    const capitalizedFirstLetterInText = (txt) => {
        return txt.charAt(0).toUpperCase() + txt.slice(1)
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={{height: Dimensions.get('screen').height}}>
                <View>
                    <Image
                        style={{
                            alignSelf: 'center',
                            width: '100%',
                            height: 300,
                        }}
                        source={{uri: recipe.img}}
                    />
                </View>

                <Text style={styles.title}>{recipe.name}</Text>

                <View style={styles.iconContainer}>
                    <View style={{display: "flex", flexDirection: "column", marginTop: -5,}}>
                        <MaterialCommunityIcons
                            size={35}
                            style={styles.icon}
                            name="fire"
                            onPress={() => console.log('hello')}
                        />
                        <Text style={{fontSize: 14, textAlign: 'center'}}>{recipe.calories} kcal</Text>
                    </View>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        <MaterialCommunityIcons
                            size={30}
                            style={styles.icon}
                            name="clock"
                            onPress={() => console.log('hello')}
                        />
                        <Text style={styles.txt}>{recipeInfo.time} minutes</Text>
                    </View>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        <MaterialCommunityIcons
                            size={30}
                            style={styles.icon}
                            name="weight-lifter"
                            onPress={() => console.log('hello')}
                        />
                        <Text style={{fontSize: 14, textAlign: 'center'}}>{recipeInfo.cookingLevel}</Text>
                    </View>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{capitalizedFirstLetterInText(recipe.shortInfo)}</Text>
                </View>

                <View>
                    <Text style={styles.recipeTitle}>Рецепт:</Text>
                </View>

                <View style={styles.cookingPlanContainer}>
                    <View style={styles.cookingPlanTextContainer}>
                        <Text style={styles.descriptionText}>{recipeInfo.recipeGuide}</Text>
                    </View>
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
    title: {
        width: 250,
        margin: 25,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    iconContainer: {
        height: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-around',
    },
    icon: {
        marginBottom: 8,
        alignSelf: 'center',
        color: colors.shadowBlue,
    },
    txt: {
        fontSize: 14,
        textAlign: 'center',
    },
    descriptionContainer: {
        width: '90%',
        marginLeft: 25,
        marginTop: 25,
    },
    descriptionText: {
        fontSize: 20,
        textAlign: 'left',
    },
    recipeTitle: {
        width: 250,
        margin: 25,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    recipeText: {
        fontSize: 20,
        textAlign: 'left',
    },
    cookingPlanContainer: {
        width: '90%',
        marginLeft: 25,
        marginBottom: 100,
    },
    cookingPlanTextContainer: {

    },
    cookingPlanText: {
        fontSize: 20,
        textAlign: 'left',
    }
})

export default RecipeDetail;
