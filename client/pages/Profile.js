import React, {useContext, useEffect, useState} from "react";
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Button, Overlay} from "react-native-elements";
import {
    colors,
    diets,
    findIConImage,
    useScreenDimensions
} from "../constants/helpers";
import Login from './Login'
import Admin from './Admin'
import {Context} from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {updateField} from "../http/userApi";

const Profile = ({navigation}) => {

    const {user} = useContext(Context)
    const [modalVisible, setModalVisible] = useState(false)

    const [userAuth, setUserAuth] = useState()
    const [token, setToken] = useState('')

    const clearStorageToken = async () => {
        try {
            await AsyncStorage.clear()
        } catch (e) {
            console.log('err clearStorageToken', e)
        }
    }

    const checkToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token')
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

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        setUserAuth(false)
        setToken('')
    }

    const dietText = (str) => {
        if(str === undefined) {
            return (<Text style={{fontSize: 16, fontWeight:'600'}}>{'Ваша дієта: ' + 'str'}</Text>)
        }
        if (str.indexOf(' ') >= 0) {
            return (
                <>
                    <Text style={{fontSize: 16, fontWeight:'600'}}>Ваша дієта:</Text>
                    <Text style={{fontSize: 16, fontWeight:'600'}}>{`${str} ${findIConImage(str)}`}</Text>
                </>
            )
        }
        return (<Text style={{fontSize: 16, fontWeight:'600'}}>{`Ваша дієта: ${str} ${findIConImage(str)}`}</Text>)
    }

    const putNewDiet = async (value) => {
        try {
            const updatedUser = await updateField(token.id, value.name, null)
            user.setUser(updatedUser)
            setModalVisible(!modalVisible)
            checkToken().then()
        } catch (e) {
            console.log('err putNewDiet -', e)
        }
    }

    const toggleModalOverlay = () => {
        setModalVisible(!modalVisible)
    }

    const goPFCScreen = () => {
        navigation.navigate('PFCScreen');
    }

    const goAdmin = () => {
        navigation.navigate('Admin');
    }

    const goToForm = () => {
        navigation.navigate('Login');
    }

    const screenData = useScreenDimensions();

    return (
        <View style={styles.mainContainer}>
            <View style={{backgroundColor: colors.beige, marginTop: 50}}>
                <View style={styles.headerContent}>
                    <Image style={styles.avatar}
                           source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>

                    <Text style={{fontSize:22, fontWeight:'600'}}>
                        Вітаю {
                        token.userName !== null || undefined ?
                            token.userName :
                            null
                    }
                    </Text>
                    {
                        userAuth ?
                            <>
                                { dietText(token.diet) }
                            </>
                            :
                            <Text style={{fontSize:16, fontWeight:'600'}}>
                                Увійдіть, щоб побачити інформацію
                            </Text>
                    }
                </View>
            </View>
            <View style={{
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
                    marginTop: 100,
                    fontSize: screenData.isLandscape ? 18 : 20,
                    width: screenData.isLandscape ?
                        Dimensions.get('screen').width / 2 :
                        '54%'
                }}>
                    { userAuth ?
                        <>
                            <Button
                                title='LogOut'
                                buttonStyle={styles.authBtn}
                                containerStyle={{ width: 200, marginBottom: 25}}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={ () => {
                                    logOut()
                                    clearStorageToken().then()
                                }}
                            />
                            <View>
                                <TouchableOpacity onPress={toggleModalOverlay} style={styles.statusTouchContainer}>
                                    <View style={styles.statusContainer}>
                                        <Text style={styles.statusText}>Змінити</Text>
                                        <Text style={styles.statusIcon}>{findIConImage(token.diet)}</Text>
                                    </View>
                                </TouchableOpacity>
                                <Overlay isVisible={modalVisible} onBackdropPress={toggleModalOverlay}>
                                    <View style={styles.modalContainer}>
                                        <View style={styles.headerContainer}>
                                            <Text style={styles.modalH1Text}>Нажміть щоб змінити</Text>
                                            <MaterialCommunityIcons
                                                size={30}
                                                style={styles.modalIcon}
                                                name="exit-to-app"
                                                onPress={() => setModalVisible(!modalVisible)}
                                            />
                                        </View>
                                        <View style={styles.dietsListContainer}>
                                            {
                                                diets.map( (value, i) => {
                                                    return (
                                                        <TouchableOpacity onPress={() => putNewDiet(value)}>
                                                            <View style={styles.listContainer}>
                                                                <View style={styles.txtListContainer}>
                                                                    <Text style={styles.txtList}>{value.name}</Text>
                                                                    <Text style={styles.txtList}>{value.icon}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </Overlay>
                            </View>
                            <Button
                                title='Розрахувати БЖВ'
                                buttonStyle={styles.PFC_btn}
                                containerStyle={{ width: 200, marginBottom: 25}}
                                titleStyle={{ fontWeight: 'bold', color: colors.beige}}
                                onPress={goPFCScreen}
                            />
                        </>
                        :
                        <Button
                            title='LogIn'
                            buttonStyle={styles.authBtn}
                            containerStyle={{ width: 200, marginBottom: 25}}
                            titleStyle={{ fontWeight: 'bold' }}
                            onPress={goToForm}
                        />
                    }
                    {
                        token.role !== null || undefined ?
                            token.role === 'ADMIN' ?
                            <Button
                                title="ADMIN"
                                onPress={goAdmin}
                                icon={{
                                    name: 'home',
                                    type: 'font-awesome',
                                    size: 15,
                                    color: 'white',
                                }}
                                iconContainerStyle={{ marginRight: 10 }}
                                titleStyle={{ fontWeight: '700' }}
                                buttonStyle={{
                                    backgroundColor: colors.shadowBlue,
                                    borderColor: 'transparent',
                                    borderWidth: 0,
                                    borderRadius: 30,
                                }}
                                containerStyle={{ width: 200, marginBottom: 25}}
                            />
                            : null : null
                    }
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
    headerContent:{
        padding:30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
    },
    infoContent:{
        flex:1,
        alignItems:'flex-start',
        paddingLeft:5
    },
    iconContent:{
        flex:1,
        alignItems:'flex-end',
        paddingRight:5,
    },
    icon:{
        width:30,
        height:30,
        marginTop:20,
    },
    info:{
        fontSize:18,
        marginTop:20,
        color: "#FFFFFF",
    },
    statusTouchContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    statusContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        height: 40,
        width: 200,
        backgroundColor: colors.shadowBlue,
        borderRadius: 30
    },
    statusText: {
        fontSize: 18,
        color: colors.beige,
        marginLeft: 45,
        fontWeight: 'bold',
        alignSelf: 'center',
        display: "flex",
        flexDirection: "column",
    },
    statusIcon: {
        fontSize: 25,
        marginRight: 40,
        alignSelf: 'center',
        display: "flex",
        flexDirection: "column",
    },
    // modal
    modalContainer: {
        width: '90%',
        backgroundColor: colors.beige,
    },
    headerContainer: {
        display: "flex", flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 10,
    },
    modalH1Text: {
        display: "flex", flexDirection: 'column',
        marginLeft: 20,
        fontSize: 25,
    },
    modalIcon: {
        display: "flex", flexDirection: 'column',
        marginRight: 20,
        alignSelf: 'center',
        color: colors.shadowBlue,
    },
    dietsListContainer: {
        marginTop: 15,
        marginBottom: 20,
        display: "flex", flexDirection: "row",
        flexWrap: "wrap",
        alignSelf: 'flex-start',
    },
    listContainer: {
        alignSelf: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 12,
        display: 'flex', flexDirection: 'column',
        backgroundColor: colors.shadowBrown
    },
    txtListContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    txtList: {
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        fontSize: 16,
        marginRight: 10
    },
    authBtn: {
        backgroundColor: colors.pastelGray,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
    },
    PFC_btn: {
        backgroundColor: colors.pastelGray,
        borderRadius: 30,
    },
});

export default Profile
