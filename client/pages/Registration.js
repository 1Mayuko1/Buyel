import React, {useState, useContext} from "react";
import {
    View, Text,
    StyleSheet, Dimensions,
} from 'react-native'
import { Button } from "react-native-elements";
import {BtnTheme, colors, useScreenDimensions} from "../constants/helpers";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import {Context} from "../App";
import {validateRegistration} from '../constants/helpers'
import {registration} from "../http/userApi";

const Registration = ({navigation}) => {

    const {user} = useContext(Context)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')
    const [note, setNote] = useState('')

    const checkHandler = async () => {

        let validationRes = validateRegistration(password, repeatedPassword, email, userName)

        if (typeof validationRes === 'string' || validationRes instanceof String) {
            setNote(validationRes)
        } else if (!validationRes) {
            try {
                const capitalizedFirstLetterInText = email.charAt(0).toUpperCase() + email.slice(1)

                let data = await registration(capitalizedFirstLetterInText, password, userName)
                user.setUser(data)
                user.setIsAuth(true)
                navigation.navigate('Profile');
            }catch (e) {
                Alert.alert(
                    "Err",
                    `${e.response.data.message}`,
                    [
                        {text: "OK"}
                    ]
                );
            }
        }
    }

    const onChangeEmailHandler = (value) => {
        setEmail(value)
    }

    const onChangePasswordHandler = (value) => {
        setPassword(value)
    }

    const onChangeRepeatedPasswordHandler = (value) => {
        setRepeatedPassword(value)
    }

    const onChangeUserNameHandler = (value) => {
        setUserName(value)
    }

    const screenData = useScreenDimensions();


    return (
        <View style={styles.mainContainer}>
            <View style={{
                marginTop: screenData.isLandscape ?
                    Dimensions.get('screen').width / 2 :
                    '60%',
                flex: 0,
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: screenData.isLandscape ? '95%' : '90%',
                alignSelf: 'center',
                justifyContent: 'space-evenly',
                marginBottom: screenData.isLandscape ? 0 : '5%',
            }}>
                <View style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontSize: screenData.isLandscape ? 10 : 20,
                    width: screenData.isLandscape ?
                        Dimensions.get('screen').width / 2 :
                        '80%'
                }}>
                    <Input
                        placeholder='Пошта'
                        onChangeText={e => onChangeEmailHandler(e)}
                        value={email}
                        leftIcon={
                            <Icon
                                style={{marginRight: 10}}
                                name='mail-forward'
                                size={24}
                                color='black'
                            />
                        }
                    />
                    <Input
                        placeholder='Пароль'
                        onChangeText={e => onChangePasswordHandler(e)}
                        value={password}
                        secureTextEntry={true}
                        leftIcon={
                            <Icon
                                style={{marginRight: 10}}
                                name='lock'
                                size={24}
                                color='black'
                            />
                        }
                    />
                    <Input
                        placeholder='Повторіть пароль'
                        onChangeText={e => onChangeRepeatedPasswordHandler(e)}
                        value={repeatedPassword}
                        secureTextEntry={true}
                        leftIcon={
                            <Icon
                                style={{marginRight: 10}}
                                name='lock'
                                size={24}
                                color='black'
                            />
                        }
                    />
                    <Input
                        placeholder='Як вас звуть ?'
                        onChangeText={e => onChangeUserNameHandler(e)}
                        value={userName}
                        secureTextEntry={true}
                        leftIcon={
                            <Icon
                                style={{marginRight: 10}}
                                name='star'
                                size={24}
                                color='black'
                            />
                        }
                    />
                    {
                        note !== '' ?
                            <View style={styles.noteContainer}>
                                <Text style={styles.errText}>Note: </Text>
                                <Text style={styles.note}>{note}</Text>
                            </View>
                            : null
                    }
                </View>
                <View style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginTop: 100,
                    fontSize: screenData.isLandscape ? 18 : 20,
                    width: screenData.isLandscape ?
                        Dimensions.get('screen').width / 2 :
                        '50%'
                }}>
                    <Button
                        title="Зареєструватись"
                        theme={BtnTheme}
                        onPress={checkHandler}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.beige,
        height: Dimensions.get('screen').height,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: colors.beige,
    },
    link: {
        fontWeight: 'bold',
        color: colors.almond,
    },
    noteContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    note: {
        flexDirection: 'column',
        color: colors.shadowBlue,
        fontSize: 18,
        textAlign: 'center',
    },
    errText: {
        color: colors.shadowBlue,
        fontWeight: 'bold',
        flexDirection: 'column',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default Registration
