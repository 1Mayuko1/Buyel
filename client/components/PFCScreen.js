import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, Alert, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {BtnTheme, colors, round} from "../constants/helpers";
import {Button, CheckBox} from "react-native-elements";
import {updateField} from "../http/userApi";
import {Context} from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const PFCScreen = ({navigation}) => {

    const {user} = useContext(Context)

    const [userAuth, setUserAuth] = useState()
    const [token, setToken] = useState('')

    const [man, setMan] = useState(false)
    const [woman, setWoman] = useState(false)
    const [noOne, setNoOne] = useState(false)

    const [low, setLow] = useState(false)
    const [medium, setMedium] = useState(false)
    const [strong, setStrong] = useState(false)

    const [heightTxt, setHeightTxt] = useState('')
    const [weight, setWeight] = useState('')
    const [years, setYears] = useState('')

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
        })
    }, [navigation])

    const capitalizedFirstLetterInText = (txt) => {
        return txt.charAt(0).toUpperCase() + txt.slice(1)
    }

    const onInputHeightHandler = (value) => {
        setHeightTxt(value)
    }
    const onInputWeightHandler = (value) => {
        setWeight(value)
    }
    const onInputYearsHandler = (value) => {
        setYears(value)
    }

    const goToProfile = () => {
        navigation.navigate('Profile');
    }

    const calculate = async () => {
        if (heightTxt.trim().length === 0) {
            return Alert.alert("???? :(", `???????? ???????????? ?????????? ?????? ?????????????? ???????????? ??????????????`)
        } else if (weight.trim().length === 0) {
            return Alert.alert("???? :(", `???????? ???????? ?????????? ?????? ?????????????? ???????????? ??????????????`)
        } else if (years.trim().length === 0) {
            return Alert.alert("???? :(", `???????? ?????????? ?????????? ?????? ?????????????? ???????????? ??????????????`)
        } else if (!+heightTxt) {
            return Alert.alert("???? :(", `???????? ???????????? ?????????????? ???????? ????????????????`)
        } else if (!+years) {
            return Alert.alert("???? :(", `???????? ?????????? ?????????????? ???????? ????????????????`)
        } else if (!+weight) {
            return Alert.alert("???? :(", `???????? ???????? ?????????????? ???????? ????????????????`)
        } else if (low === false && medium === false && strong === false) {
            return Alert.alert("???? :(", `???????????????? ?????????????? ????????????????????`)
        } else if (man === false && woman === false && noOne === false) {
            return Alert.alert("???? :(", `???????????????? ??????????`)
        }

        let calories

        if (man) {
            if (low) {
                calories = 6.25 * +heightTxt + 10 * +weight - 4.92 * +years + 5 * 1.2
            }
            if (medium) {
                calories = 6.25 * +heightTxt + 10 * +weight - 4.92 * +years + 5 * 1.375
            }
            if (strong) {
                calories = 6.25 * +heightTxt + 10 * +weight - 4.92 * +years + 5 * 1.6375
            }
        }

        if (woman || noOne) {
            calories = 6.25 * +heightTxt + 10 * +weight - 4.92 * +years - 161
        }

        let proteinPercent = 45
        let fatPercent = 20
        let carbsPercent = 35

        let resObj = {
            proteins: round(calories * proteinPercent / 100),
            fats: round(calories * fatPercent / 100),
            carbs: round(calories * carbsPercent / 100),
        }


        try {
            const updatedUser = await updateField(token.id, null, JSON.stringify(resObj))
            user.setUser(updatedUser)
            goToProfile()
            Alert.alert("???? :(", `?????????? ?????????????????? ??????????????????`)
        } catch (e) {
            console.log('err putNewDiet -', e)
        }

    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={{height: Dimensions.get('screen').height}}>
                <View style={{marginTop: '10%'}}>

                    <Text style={styles.h1Text}>?????????? ???????? ??????????</Text>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <CheckBox
                                center
                                containerStyle={{backgroundColor: colors.beige, borderColor: colors.beige}}
                                title="??????????????"
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checked={man}
                                onPress={() => {
                                    setMan(!man)
                                    setNoOne(false)
                                    setWoman(false)
                                }}
                            />
                        </View>
                        <View style={styles.column}>
                            <CheckBox
                                center
                                containerStyle={{backgroundColor: colors.beige, borderColor: colors.beige}}
                                title="??????????"
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checked={woman}
                                onPress={() => {
                                    setWoman(!woman)
                                    setNoOne(false)
                                    setMan(false)
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.noOneContainer}>
                        <CheckBox
                            center
                            containerStyle={{backgroundColor: colors.beige, borderColor: colors.beige}}
                            title="???? ??????????????"
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={noOne}
                            onPress={() => {
                                setNoOne(!noOne)
                                setMan(false)
                                setWoman(false)
                            }}
                        />
                    </View>

                    <Text style={styles.h1Text}>?????????????? ???????????????????? ?</Text>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <CheckBox
                                center
                                containerStyle={{backgroundColor: colors.beige, borderColor: colors.beige}}
                                title="??????????"
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checked={low}
                                onPress={() => {
                                    setLow(!low)
                                    setStrong(false)
                                    setMedium(false)
                                }}
                            />
                        </View>
                        <View style={styles.column}>
                            <CheckBox
                                center
                                containerStyle={{backgroundColor: colors.beige, borderColor: colors.beige}}
                                title="3 ???????? ?? ?????????????? +- 2 ??????"
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checked={medium}
                                onPress={() => {
                                    setMedium(!medium)
                                    setStrong(false)
                                    setLow(false)
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.noOneContainer}>
                        <CheckBox
                            center
                            containerStyle={{backgroundColor: colors.beige, borderColor: colors.beige}}
                            title="?????????? ????????"
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={strong}
                            onPress={() => {
                                setStrong(!strong)
                                setMedium(false)
                                setLow(false)
                            }}
                        />
                    </View>


                    <Text style={styles.h1Text}>?????????? ???????? ???????? ?? ????</Text>
                    <View style={{ flex: 0, justifyContent: 'center'}}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='100'
                                style={styles.input}
                                onChangeText={e => onInputHeightHandler(e)}
                                value={heightTxt}
                            />
                        </View>
                    </View>

                    <Text style={styles.h1Text}>???????? ???????? ?? ????</Text>
                    <View style={{ flex: 0, justifyContent: 'center'}}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='60'
                                style={styles.input}
                                onChangeText={e => onInputWeightHandler(e)}
                                value={weight}
                            />
                        </View>
                    </View>

                    <Text style={styles.h1Text}>?????????? ???????? ?????? ?? ??????????</Text>
                    <View style={{ flex: 0, justifyContent: 'center'}}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='25'
                                style={styles.input}
                                onChangeText={e => onInputYearsHandler(e)}
                                value={years}
                            />
                        </View>
                    </View>

                    <View style={styles.submitBtnContainer}>
                        <Button
                            title="??????????????????????" theme={BtnTheme}
                            onPress={e => calculate()}
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
    },
    row: {
        justifyContent: 'space-evenly',
        display: "flex", flexDirection: 'row',
    },
    column: {
        display: "flex", flexDirection: 'column',
    },
    noOneContainer: {
        alignSelf: 'center'
    },
    h1Text: {
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 15
    },
    h2Text: {
        marginLeft: 30,
        fontSize: 25,
        textAlign: 'left',
        marginTop: 20,
        marginBottom: 15,
    },
    inputContainer: {
        borderRadius: 15,
        textAlign: 'center',
        alignSelf: 'center',
        width: '50%',
        height: 42,
        borderWidth: 2,
        borderColor: colors.wildBlue
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        marginTop: 7,
    },
    submitBtnContainer: {
        marginTop: 30,
        backgroundColor: colors.beige,
        alignItems: 'center'
    },
})

export default PFCScreen;
