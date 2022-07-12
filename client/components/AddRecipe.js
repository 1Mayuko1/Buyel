import React, {useContext, useEffect, useState} from "react";
import {Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native'
import {AddBtnTheme, BtnTheme, CancelBtnTheme, colors} from "../constants/helpers";
import * as ImagePicker from 'expo-image-picker';
import {Button} from "react-native-elements";
import {Context} from "../App";
import {createRecipe} from "../http/recipeApi";

const AddRecipe = () => {

    const [kindTxt, setKindTxt] = useState('')
    const [typeTxt, setTypeTxt] = useState('')
    const [kindList, setKindList] = useState([])
    const [typeList, setTypeList] = useState([])
    const [nameTxt, setNameTxt] = useState('')
    const [caloriesTxt, setCaloriesTxt] = useState('')
    const [shortInfoTxt, setShortInfoTxt] = useState('')
    const [imageStatus, setImageStatus] = useState('Файл не вибрано')
    const [image, setImage] = useState(null)
    const [info, setInfo] = useState([])

    // get data from bd

    const {recipes} = useContext(Context)

    useEffect(() => {
        setTypes()
        setKinds()
    },[])

    const selectKindData = recipes.kinds.map(k => k).map((kind, i) => {
        return {
            id: i,
            text: kind.name,
            value: kind.name,
        }
    })


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

    const kindVisibleHandler = (value) => {
        setKindTxt(value)
    }

    const onTypeNameHandler = (value) => {
        setTypeTxt(value)
    }

    const onChangeNameHandler = (value) => {
        setNameTxt(value)
    }

    const onChangeCalorieHandler = (value) => {
        setCaloriesTxt(value)
    }

    const onChangeShorInfoHandler = (value) => {
        setShortInfoTxt(value)
    }

    const addInfo = () => {
        setInfo([...info, {title: '', description: '', number: Date.now()}])
    }
    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number))
    }
    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ?
            {
                ...i,
                [key]: value
            } : i
        ))
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            setImageStatus('Файл вибрано ✔')
        }
    }

    const capitalizedFirstLetterInText = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    const LowerCaseFirstLetterInTitle = (arr) => {
        if (arr.length === 0) {
            return []
        }

        return arr.map(value => {
            return {
                title: value.title.charAt(0).toLowerCase() + value.title.slice(1),
                description: value.description.charAt(0).toLowerCase() + value.description.slice(1),
                number: value.number
            }
        })
    }

    const validateRecipe = () => {
        if (typeTxt.trim().length === 0) {
            return 'Поле Тип пусте або містить тільки пробіл'
        } else if (!typeList.includes(capitalizedFirstLetterInText(typeTxt))) {
            return 'Такого типу немає в базі'
        } else if (kindTxt.trim().length === 0) {
            return 'Поле Вид пусте або містить тільки пробіл'
        } else if (!kindList.includes(capitalizedFirstLetterInText(kindTxt))) {
            return 'Такого виду немає в базі'
        }else if (nameTxt.trim().length === 0) {
            return 'Поле Назва пусте або містить тільки пробіл'
        } else if (caloriesTxt.trim().length === 0) {
            return 'Поле Калорії пусте або містить тільки пробіл'
        } else if(!+caloriesTxt) {
            return 'Значення поля калорії має бути числовим'
        } else if(imageStatus === 'Файл не вибрано') {
            return 'Виберіть зображення для рецепту'
        } else if(image === null) {
            return 'Спробуйте додати нове зображення'
        } else if (shortInfoTxt.trim().length === 0) {
            return 'Поле інформації про рецепт пусте або містить тільки пробіл'
        } else if(shortInfoTxt.length < 10) {
            return 'Будь ласка ввведіть більше інформації про рецепт'
        } else {
            return ''
        }
    }

    const postRecipe = () => {

        if (validateRecipe().length !== 0) {
            return Alert.alert("Ой :(", validateRecipe())
        }

        const typesNames = recipes.types.map(t => t).map(type => type.name)
        let typeId = (typesNames.indexOf(typeTxt) + 1).toString()

        const kindsNames = recipes.kinds.map(k => k).map(kind => kind.name)
        let kindId = (kindsNames.indexOf(kindTxt) + 1).toString()

        try {

            const recipe = {
                'name': capitalizedFirstLetterInText(nameTxt),
                'shortInfo': capitalizedFirstLetterInText(shortInfoTxt),
                'calories': +caloriesTxt,
                'kindId': +kindId,
                'typeId': +typeId,
                'img': image,
                'info': JSON.stringify(LowerCaseFirstLetterInTitle(info))
            }

            // console.log(recipe)

            createRecipe(recipe).then(data => {
                // navigation.navigate('Recipes')
                console.log('newRecipe', data)
            })

        } catch (e) {
            console.log('err in postRecipe', e)
        }
    }

    return (
        <View style={styles.mainContainer}>

            <ScrollView style={{marginBottom: 70}}>
                <Text style={styles.h1Text}>Додати Рецепт</Text>

                <View style={styles.textInputContainer}>
                    <TextInput
                        placeholder='Вид'
                        style={styles.input}
                        onChangeText={e => kindVisibleHandler(e)}
                        value={kindTxt}
                    />
                </View>

                <View style={styles.textInputContainer}>
                    <TextInput
                        placeholder='Тип'
                        style={styles.input}
                        onChangeText={e => onTypeNameHandler(e)}
                        value={typeTxt}
                    />
                </View>

                <View style={styles.textInputContainer}>
                    <TextInput
                        placeholder='Назва'
                        style={styles.input}
                        onChangeText={e => onChangeNameHandler(e)}
                        value={nameTxt}
                    />
                </View>


                <View style={styles.textInputContainer}>
                    <TextInput
                        placeholder='Калорії'
                        style={styles.input}
                        onChangeText={e => onChangeCalorieHandler(e)}
                        value={caloriesTxt}
                    />
                </View>


                <View style={styles.imagePickerContainer}>
                    <Button theme={BtnTheme} style={{width: 100}}
                            title="Вибрати" onPress={pickImage} />
                    <Text style={styles.txt}>{imageStatus}</Text>
                </View>

                <View style={styles.textAreaContainer}>
                    <TextInput
                        placeholder='Додайте коротку інформацію про рецепт та його приготування'
                        multiline={true}
                        numberOfLines={10}
                        style={styles.textAreaInput}
                        onChangeText={e => onChangeShorInfoHandler(e)}
                        value={shortInfoTxt}
                    />
                </View>

                <View style={{marginTop: 30}}>
                    <Button theme={BtnTheme}
                            style={styles.addPropertyBtn}
                            title="Додати властивість"
                            onPress={addInfo}
                    />

                    {
                        info.map(value =>
                            <View style={styles.propertyComponent}>
                                <View style={styles.propertyColumn} >
                                    <View style={styles.inputBlock}>
                                        <View style={styles.propertyInput}>
                                            <TextInput
                                                placeholder='Назва властивості'
                                                style={styles.inputColumn}
                                                onChangeText={item => changeInfo(
                                                    'title',
                                                    item,
                                                    value.number
                                                )}
                                                value={value.title}
                                            />
                                        </View>
                                        <View style={styles.propertyInput}>
                                            <TextInput
                                                placeholder='Значення'
                                                style={styles.inputColumn}
                                                onChangeText={item => changeInfo(
                                                    'description',
                                                    item,
                                                    value.number
                                                )}
                                                value={value.description}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.delBtnContainer}>
                                    <Button theme={CancelBtnTheme}
                                            title="Видалити"
                                            onPress={e => removeInfo(value.number)}
                                    />
                                </View>
                            </View>
                        )
                    }

                </View>

                <View style={styles.submitBtn}>
                    <View>
                        <Button theme={AddBtnTheme}
                                style={{alignSelf: 'center', width: 100}}
                                title="Додати"
                                onPress={postRecipe}
                        />
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
        width: Dimensions.get('screen').width,
    },
    h1Text: {
        marginTop: 60,
        marginBottom: 30,
        fontSize: 25,
        textAlign: 'center',
        alignSelf: 'center',
    },
    selectContainer: {
        alignSelf: 'center',
        zIndex: 2
    },
    textInputContainer: {
        width: '70%',
        alignSelf: 'center',
        height: 42,
        borderWidth: 2,
        marginTop: 20,
        borderColor: colors.wildBlue,
        borderRadius: 10,
    },
    input: {
        borderRadius: 100,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 7,
    },
    textAreaContainer: {
        width: '70%',
        alignSelf: 'center',
        height: 100,
        borderWidth: 2,
        marginTop: 20,
        borderColor: colors.wildBlue,
        borderRadius: 10,
    },
    textAreaInput: {
        textAlignVertical: 'top',
        borderRadius: 100,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 7,
    },
    imagePickerContainer:{
        display: "flex",
        alignSelf: 'center',
        flexDirection: "row",
        marginTop: 30,
    },
    txt:{
        marginTop: 10,
        marginLeft: 30,
        display: "flex",
        flexDirection: "column",

    },
    addPropertyBtn: {
        alignSelf: 'center',
        width: 200,
    },
    propertyComponent: {
        justifyContent: 'space-around',
        alignSelf: 'center',
        marginTop: 40,
        display: "flex",
        flexDirection: "row",
    },
    propertyColumn: {
        display: "flex",
        flexDirection: "column",
    },
    inputBlock: {
        display: "flex",
        flexDirection: "column",
    },
    propertyInput: {
        marginBottom: 10,
        height: 42,
        borderWidth: 2,
        borderColor: colors.wildBlue,
        borderRadius: 10,
    },
    inputColumn: {
        marginLeft: 10,
        width: 200,
        borderRadius: 100,
        fontSize: 20,
        marginTop: 7,
        display: "flex",
        flexDirection: "column",
    },
    delBtnContainer: {
        width: 100,
        marginLeft: 15,
        marginTop: '9%',
        display: "flex",
        flexDirection: "column",
    },
    submitBtn:{
        marginBottom: 20,
        marginTop: 30,
    },
})

export default AddRecipe
