import React, {useState} from "react";
import {View, Text, StyleSheet, Dimensions, Alert, TextInput} from 'react-native'
import { Button, Overlay } from 'react-native-elements';
import {AddBtnTheme, BtnTheme, CancelBtnTheme, colors} from "../constants/helpers";
import AddRecipe from "../components/AddRecipe";
import {createKind, createProduct, createType} from "../http/recipeApi";

const Admin = ({ navigation }) => {

    const [kindVisible, setKindVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [productVisible, setProductVisible] = useState(false)
    const [kindInput, setKindInput] = useState('')
    const [typeInput, setTypeInput] = useState('')
    const [productInput, setProductInput] = useState('')

    const goToAddRecipe = () => {
        navigation.navigate('AddRecipe')
    }

    const capitalizedFirstLetterInText = (text) => {
        if (text.length === 0) {
            return false
        }

        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    const addKind = async () => {
        let text = capitalizedFirstLetterInText(kindInput)
        if (!text) {
            return Alert.alert("Ой :(", `Ви нічого не ввели`)
        }
        try {
            createKind(text).then(kind => {
                toggleKindOverlay()
                setKindInput('')
                console.log('newKind', kind)
            })
        } catch (e) {
            console.log('err in AddKind', e)
        }
    }

    const addType = () => {
        let text = capitalizedFirstLetterInText(typeInput)
        if (!text) {
            return Alert.alert("Ой :(", `Ви нічого не ввели`)
        }
        try {
            createType(text).then(type => {
                toggleTypeOverlay()
                setTypeInput('')
                console.log('newType', type)
            })
        } catch (e) {
            console.log('err in AddType', e)
        }
    }

    const addProduct = () => {
        let text = capitalizedFirstLetterInText(productInput)
        if (!text) {
            return Alert.alert("Ой :(", `Ви нічого не ввели`)
        }
        try {
            createProduct(text).then(product => {
                toggleProductOverlay()
                setProductInput('')
                console.log('newProduct', product)
            })
        } catch (e) {
            console.log('err in AddProduct', e)
        }
    }

    const onChangeKindHandler = (value) => {
        setKindInput(value)
    }

    const onChangeTypeHandler = (value) => {
        setTypeInput(value)
    }

    const onChangeProductHandler = (value) => {
        setProductInput(value)
    };

    const toggleKindOverlay = () => {
        setKindVisible(!kindVisible);
    };

    const toggleTypeOverlay = () => {
        setTypeVisible(!typeVisible);
    };

    const toggleProductOverlay = () => {
        setProductVisible(!productVisible)
    };

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.h1Text}>Меню</Text>
            <View>
                <View style={styles.buttons}>
                    <Button title="Додати Вид" onPress={toggleKindOverlay} theme={BtnTheme}/>
                    <Overlay isVisible={kindVisible} onBackdropPress={toggleKindOverlay}>
                        <View style={styles.mainBlock}>
                            <Text style={styles.inputText}>Додати Вид</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Вид'
                                    style={styles.input}
                                    onChangeText={e => onChangeKindHandler(e)}
                                    value={kindInput}
                                />
                            </View>

                            <View style={styles.btnContainer}>
                                <View style={styles.addBtn}>
                                    <Button theme={AddBtnTheme}
                                            style={{width: 80}}
                                            title="Додати"
                                            onPress={addKind}
                                    />
                                </View>
                                <View style={styles.cancelBtn}>
                                    <Button theme={CancelBtnTheme}
                                            style={{width: 80}}
                                            title="Вийти"
                                            onPress={toggleKindOverlay}
                                    />
                                </View>
                            </View>
                        </View>
                    </Overlay>
                </View>

                <View style={styles.buttons}>
                    <Button title="Додати тип" onPress={toggleTypeOverlay} theme={BtnTheme}/>
                    <Overlay isVisible={typeVisible} onBackdropPress={toggleTypeOverlay}>
                        <View style={styles.mainBlock}>
                            <Text style={styles.inputText}>Додати Тип</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Тип'
                                    style={styles.input}
                                    onChangeText={e => onChangeTypeHandler(e)}
                                    value={typeInput}
                                />
                            </View>

                            <View style={styles.btnContainer}>
                                <View style={styles.addBtn}>
                                    <Button theme={AddBtnTheme}
                                            style={{width: 80}}
                                            title="Додати"
                                            onPress={addType}
                                    />
                                </View>
                                <View style={styles.cancelBtn}>
                                    <Button theme={CancelBtnTheme}
                                            style={{width: 80}}
                                            title="Вийти"
                                            onPress={toggleTypeOverlay}
                                    />
                                </View>
                            </View>
                        </View>
                    </Overlay>
                </View>

                <View style={styles.buttons}>
                    <Button title="Додати продукт" onPress={toggleProductOverlay} theme={BtnTheme}/>
                    <Overlay isVisible={productVisible} onBackdropPress={toggleProductOverlay}>
                        <View style={styles.mainBlock}>
                            <Text style={styles.inputText}>Додати Продукт</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Продукт'
                                    style={styles.input}
                                    onChangeText={e => onChangeProductHandler(e)}
                                    value={productInput}
                                />
                            </View>

                            <View style={styles.btnContainer}>
                                <View style={styles.addBtn}>
                                    <Button theme={AddBtnTheme}
                                            style={{width: 80}}
                                            title="Додати"
                                            onPress={() => {
                                                Alert.alert("Ой :(", `Метод потрыбно доробити`)
                                                // addProduct()
                                            }}
                                    />
                                </View>
                                <View style={styles.cancelBtn}>
                                    <Button theme={CancelBtnTheme}
                                            style={{width: 80}}
                                            title="Вийти"
                                            onPress={toggleProductOverlay}
                                    />
                                </View>
                            </View>
                        </View>
                    </Overlay>
                </View>

                <View style={styles.buttons}>
                    <Button title="Додати рецепт" onPress={goToAddRecipe} theme={BtnTheme}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.beige,
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
    },
    mainBlock: {
        width: 300,
        height: 260,
        backgroundColor: colors.beige,
    },
    h1Text: {
        marginTop: 100,
        marginBottom: 30,
        fontSize: 25,
        textAlign: 'center',
        alignSelf: 'center',
    },
    buttons:{
        marginBottom: 50,
        alignSelf: 'center',
        width: 200,
    },
    inputText: {
        marginTop: 40,
        marginBottom: 15,
        fontSize: 25,
        textAlign: 'center',
        alignSelf: 'center',
    },
    inputContainer: {
        alignSelf: 'center',
        width: 200,
        height: 42,
        borderWidth: 2,
        marginTop: 20,
        borderColor: colors.wildBlue,
        borderRadius: 10,
        marginBottom: 30,
        zIndex: 1,
    },
    input:{
        borderRadius: 100,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 7,
    },
    btnContainer:{
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'flex-end',
    },
    addBtn: {
        display: "flex",
        flexDirection: "column",
    },
    cancelBtn: {
        marginRight: 20,
        marginLeft: 20,
        display: "flex",
        flexDirection: "column",
    }
})

export default Admin
