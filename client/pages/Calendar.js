import React, {useEffect, useState, useContext} from "react";
import {
    View, Text,
    StyleSheet, Dimensions,
    TextInput, Alert, ScrollView,
} from 'react-native'
import {Button, Icon, Overlay} from "react-native-elements";
import {
    BtnTheme,
    colors,
    useScreenDimensions,
    CalendarTheme,
} from "../constants/helpers";
import {Calendar as CalendarComponent} from 'react-native-calendars';
import {Context} from "../App";
import {fetchProducts} from "../http/recipeApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import {createUserProducts, fetchUserProducts} from "../http/userProductsApi";
import UserProductsListModal from "../components/UserProductsListModal";

const Calendar = ({ navigation }) => {

    const {recipes} = useContext(Context)
    const {userProducts} = useContext(Context)

    const [product, setProduct] = useState(['Почніть додавати'])
    const [text, setText] = useState('')
    const [gramText, setGramText] = useState('')
    const [productsFromBD, setProductsFromBD] = useState([])
    const [userProductsState, setUserProductsState] = useState([])
    const [startingDay, setStartingDay] = useState()
    const [endingDay, setEndingDay] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [productsModal, setProductsModal] = useState(false)

    const [userAuth, setUserAuth] = useState()
    const [token, setToken] = useState('')

    const screenData = useScreenDimensions();

    // Отримуємо данні про юзера та робимо запит на ссервер з отриманим userId

    const checkToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null || undefined) {
                setUserAuth(true)
                setToken(jwtDecode(value))

                let userId = jwtDecode(value).id
                setUserProductsState([])

                fetchUserProducts(userId).then(data => {
                    userProducts.setUserProducts(data)
                    setUserProductsState(data)
                })

            } else {
                setUserAuth(false)
            }
        } catch (e) {
            console.log('error in checkToken', e)
        }
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            checkToken().then()
        })

        fetchProducts().then(data => {
            recipes.setProducts(data)
            setProductsFromBD(data)
        })

    }, [navigation])

    // Обробка данних обєкту дата

    const currentDate = (date = new Date()) => {
        return date.toISOString().split('T')[0]
    }

    // Функція яка робить мерджить всі продукти по даті в один масив

    const mergeArrays = (date, array) => {
        let filteredArray = array
            .filter(obj => {
                return obj.date === date
            })
            .map(obj => {
                return (obj.products)
            })

        const mergedArray = filteredArray.flat(1);
        return mergedArray.filter((item, pos, self) => {
            return self.indexOf(item) === pos;
        })
    }

    // Робить масив обєктів для поміток в календарі

    const makeObjectsArray = () => {
        let pointsArray = []

        if (userProductsState[1] === undefined) {
            return false
        } else {
            userProductsState.map(value => {
                pointsArray = [
                    ...pointsArray,
                    {
                        date: value.date,
                        products: JSON.parse(value.productsValues)
                    }
                ]
            })
        }

        let resArr = []

        pointsArray.map(v => v.date).map(value => value).map((value) => {
            if (resArr.find(x => x.date === value) === undefined) {
                resArr = [
                    ...resArr,
                    {
                        date: value,
                        products: mergeArrays(value, pointsArray)
                    }
                ]
            }
        })

        return resArr
    }

    const getDatesInRange = (startDate, endDate) => {

        let creationDate = [startDate, endDate];
        let sortedDates = creationDate.sort((a, b) => {
            return Date.parse(a) - Date.parse(b)
        })

        let start = new Date(sortedDates[0])
        const end = new Date(sortedDates[1])

        const dates = []

        if (start === end) {
            return [start, end]
        }

        const date = new Date(start.getTime())

        while (date <= end) {
            dates.push(new Date(date).toISOString().split('T')[0])
            date.setDate(date.getDate() + 1)
        }

        if (dates === []) {
            return [currentDate(), currentDate()]
        }

        if (dates.length === 1) {
            return [
                ...dates,
                ...dates
            ]
        }

        return dates
    }


    const getMarkedDates = () => {

        const markedDates = {};

        if (startingDay === undefined || endingDay === undefined) {
            setStartingDay(currentDate())
            setEndingDay(currentDate())
        }

        let arrayOfDates = getDatesInRange(startingDay, endingDay)

        arrayOfDates.map(value => {
            if (startingDay === endingDay) {
                markedDates[value] = {color: '#B89276', startingDay: true, endingDay: true}
            } else if (value === arrayOfDates[0]) {
                markedDates[value] = {startingDay: true, color: '#B89276'}
            } else if (value === arrayOfDates[arrayOfDates.length - 1]) {
                markedDates[value] = {endingDay: true, color: '#B89276'}
            } else {
                markedDates[value] = {color: '#B89276', endingDay: false}
            }
        })

        if (!makeObjectsArray() || !Array.isArray(makeObjectsArray())) {
            return markedDates
        }

        makeObjectsArray().forEach((appointment) => {
            const formattedDate = currentDate(new Date(appointment.date));
            markedDates[formattedDate] = {
                ...markedDates[formattedDate],
                marked: true,
            };
        })

        return markedDates
    }

    // Change Handlers

    const onInputChangeHandler = (value) => {
        setText(value)
    }

    const onInputGramHandler = (value) => {
        setGramText(value)
    }

    const toggleModalOverlay = () => {
        if (!userAuth) {
            return Alert.alert("Ой :(", `Увідіть щоб мати змогу додати продукти`)
        }

        if (product[0] === 'Почніть додавати' || product.length === 0) {
            return Alert.alert("Ой :(", `Схоже ви ще не додали нічого до списку`)
        }
        return setModalVisible(!modalVisible);
    }

    const toggleProductsModalOverlay = () => {
        if (!userAuth) {
            return Alert.alert("Ой :(", `Увідіть щоб побачити інформацію`)
        }

        return setProductsModal(!productsModal);
    }

    // Взаємодія з продуктами

    console.log('123', product)

    const setToListProducts = () => {
        // Зберігає продуктовий список в масив у стейті і відображає на екрані

        let productsNames = productsFromBD.map(name => {
            return name.name
        }) // bd

        let capitalizedFirstLetterInText = text.charAt(0).toUpperCase() + text.slice(1)

        if (text.length === 0) {
            return Alert.alert("Ой :(", `Ви нічого не ввели`)
        }

        if (!productsNames.includes(capitalizedFirstLetterInText)) {
            return Alert.alert("Ой :(", `Продукту " ${capitalizedFirstLetterInText} " немає в базі`)
        }

        if (product.length === 1 && product[0] !== 'Почніть додавати') {
            return Alert.alert("Ой :(", `Закінчіть додавати "${product[0]}"`,
                [
                    {text: "OK", onPress: () => setText('')}
                ]
            )
        }

        if (product.includes(capitalizedFirstLetterInText)) {
            return Alert.alert("Ой :(", `Ви вже додали " ${capitalizedFirstLetterInText} " до списку`)
        }

        product[0] === 'Почніть додавати' ? product.shift() : null
        setText('')

        return setProduct([...product, capitalizedFirstLetterInText])

    }

    const deleteFromList = () => {
        setProduct([])
    }

    const txtWithDate = (startDate, endDate) => {

        const monthNames = ["січня", "лютого", "березня", "квітня", "травня", "червня",
            "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
        ]

        const dt = (date = currentDate()) => {
            let spl = date.split('-')
            const dateS = new Date(+spl[0], +spl[1] - 1, +spl[2])
            return {
                dd: +spl[2],
                mm: monthNames[dateS.getMonth()],
                yy: +spl[0]
            }
        }

        if (startDate === endDate) {
            return `Бажаєш додати продукт за ${dt(startDate).dd} ${dt(startDate).mm} ${dt(startDate).yy}?`
        } else {
            return `Бажаєш додати продукт на період від ${dt(startDate).dd} ${dt(startDate).mm} по ${dt(endDate).dd} ${dt(endDate).mm} ${dt(startDate).yy} - го року ?`
        }
    }

    // POST запит на сервер

    const round = (num) => {
        if (num.toString().indexOf('.') !== -1) {
            let spl = num.toString().split('.')
            if (spl[1].length >= 2) {
                return Math.round(num * 10) / 10
            }
        }
        return num
    }

    const postProducts = () => {

        if (productsFromBD === []) {
            return Alert.alert("Ой :(", `Данні про продукти не прийшли`)
        }
        if (gramText.trim().length === 0) {
            return Alert.alert("Ой :(", `Значення грамовки пусте або містить тільки пробіли`)
        }
        if (!+gramText) {
            return Alert.alert("Ой :(", `Значення грамовки повинно бути числовим`)
        }

        let foundedObject = productsFromBD.find(p => p.name === product[0])

        let proteins = foundedObject.proteins
        let fats = foundedObject.fats
        let carbs = foundedObject.carbs

        let resOfPFC = {}

        if (+gramText !== 100) {
            resOfPFC = {
                proteins: round(+gramText * proteins / 100),
                fats: round(+gramText * fats / 100),
                carbs: round(+gramText * carbs / 100),
            }
        } else if (+gramText === 100) {
            resOfPFC = {
                proteins: proteins,
                fats: fats,
                carbs: carbs
            }
        }

        let datesForMap = []

        if (startingDay === endingDay) {
            datesForMap = [startingDay]
        } else {
            datesForMap = getDatesInRange(startingDay, endingDay)
        }

        if (datesForMap.length === 1) {
            let productsValuesData = {
                name: foundedObject.name,
                proteins: resOfPFC.proteins,
                fats: resOfPFC.fats,
                carbs: resOfPFC.carbs
            }
            try {
                let formData = {
                    'productsValues': JSON.stringify(productsValuesData),
                    'date': datesForMap[0]
                }

                return createUserProducts(formData, token.id).then(data => {
                    setProduct(['Почніть додавати'])
                    getMarkedDates()
                })

            } catch (e) {
                console.log('err in post userProduct', e)
            }
        }
        if (datesForMap.length > 1) {

            let numOf = +datesForMap.length
            let Pr = +resOfPFC.proteins / numOf
            let Ft = resOfPFC.fats / numOf
            let Cr = resOfPFC.carbs / numOf

            let productsValuesData = {
                name: foundedObject.name,
                proteins: round(Pr),
                fats: round(Ft),
                carbs: round(Cr)
            }

            datesForMap.map(value => {
                try {
                    let formData = {
                        'productsValues': JSON.stringify(productsValuesData),
                        'date': value
                    }

                    return createUserProducts(formData, token.id).then(data => {
                        setProduct(['Почніть додавати'])
                    })

                } catch (e) {
                    console.log('err in post userProduct', e)
                }
            })
        }
    }

    const checkPeriodOfDates = (id, arr) => {

        let arrOfDates = []
        if (startingDay === endingDay) {
            arrOfDates = [startingDay]
        } else {
            arrOfDates = getDatesInRange(startingDay, endingDay)
        }

        if (id === null || id === undefined) {
            return {
                countOfDays: arrOfDates.length,
                date: arrOfDates
            }
        }
        if (arr.length === 0 || arr === []) {
            return {
                countOfDays: arrOfDates.length,
                date: arrOfDates
            }
        }

        let userProductsById = arr.filter(value => value.userId === id)

        if (userProductsById === [] || arrOfDates === []) {
            return {
                countOfDays: arrOfDates.length,
                date: arrOfDates
            }
        }

        let arrOfObjectByDateInArray = []
        userProductsById.map(value => {
            if (arrOfDates.includes(value.date)) {
                arrOfObjectByDateInArray = [
                    ...arrOfObjectByDateInArray,
                    value
                ]
            }
        })

        let productValuesObject = arrOfObjectByDateInArray.map(v => JSON.parse(v.productsValues))

       if (productValuesObject.length === 0) {
           return {
               countOfDays: arrOfDates.length,
               date: arrOfDates
           }
       }

       let resObj = {}

       productValuesObject.map((value, i) => {
           if (i === 0) {
               resObj = {
                   proteins: value.proteins,
                   fats: value.fats,
                   carbs: value.carbs,
                   countOfDays: arrOfDates.length, // вибрані дати в календарі
                   // countOfDays: arrDays.length, // тільки дати в яких є продукти
                   date: arrOfDates
               }
           } else {
               resObj.proteins = round(resObj.proteins + value.proteins)
               resObj.fats = round(resObj.fats + value.fats)
               resObj.carbs = round(resObj.carbs + value.carbs)
           }
       })

       return resObj
    }

    const goToStatisticsForProducts = () => {
        if (checkPeriodOfDates(token.id, userProductsState).proteins === undefined) {
            return Alert.alert("Ой :(", `Ви не додали продукти за ці дати, статистика не доступна`)
        } else {
            navigation.navigate(
                'StatisticsForProducts',
                {
                    // statisticsValues: checkPeriodOfDates(token.id, userProductsState),
                    userId: token.id,
                    objectValue: checkPeriodOfDates(token.id, userProductsState)
                }
            )
        }
    }

    // FN для того щоб передати конкретний список продуктів

    const setListOfProducts = () => {

        if (!makeObjectsArray()) {
            return []
        }

        if (makeObjectsArray().length !== 0 || Array.isArray(makeObjectsArray()) !== false) {
            let resArr = []
            makeObjectsArray().map(value => {
                if (value.date === startingDay) {
                    resArr = value.products

                }
            })
            return resArr
        }
    }

    const onDayClick = (day) => {
        setStartingDay(endingDay)
        if(day === startingDay) {
            setStartingDay(day)
            return setEndingDay(day)
        }
        if (day !== endingDay) {
             return setEndingDay(day)
        }
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                <Text style={styles.h1Text}>Календар твоїх покупок</Text>
                <View style={styles.calendarContainer}>
                    <CalendarComponent
                        markingType={'period'}
                        style={{borderRadius: 10, paddingBottom: 5}}
                        current={currentDate()}
                        onDayPress={(day) => {
                            onDayClick(day.dateString)
                        }}
                        markedDates={getMarkedDates()}
                        theme={CalendarTheme}
                    />
                </View>

                <Text style={styles.h2Text}>Що ти купив ?</Text>
                <View style={{
                    flex: 0,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: screenData.isLandscape ? '95%' : '90%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: 'center',
                        alignSelf: 'center',
                        width: screenData.isLandscape ?
                            Dimensions.get('screen').width / 2 :
                            '70%',
                        height: 42,
                        borderWidth: 2,
                        borderColor: colors.shadowBlue

                    }}>
                        <TextInput
                            placeholder='Яблуко'
                            style={styles.input}
                            onChangeText={e => onInputChangeHandler(e)}
                            value={text}
                        />
                    </View>
                    <View style={{
                        marginLeft: -2,
                        display: "flex",
                        flexDirection: "column",
                        textAlign: 'center',
                        alignSelf: 'center',
                        width: screenData.isLandscape ?
                            Dimensions.get('screen').width / 2 :
                            '25%',
                    }}>
                        <Button
                            buttonStyle={styles.btnStyle}
                            title="Додати"
                            theme={BtnTheme}
                            onPress={setToListProducts}
                        />
                    </View>
                </View>
                <View style={styles.productsListContainer}>
                    {
                        product.map( (value, i) => {
                            return (
                                <View style={styles.listContainer}>
                                    <View style={styles.txtListContainer}>
                                        <Text style={styles.txtList}>{value}</Text>
                                        {
                                            product[0] !== 'Почніть додавати' ?
                                                <Icon
                                                    name='close'
                                                    type='font-awesome'
                                                    color={'#D4CDB4'}
                                                    size={19}
                                                    style={{marginLeft: 10}}
                                                    onPress={() => deleteFromList(value)} />
                                                : null
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                {
                    product[0] !== 'Почніть додавати' && product.length !== 0 ?
                        <>
                            <Text style={styles.gramText}>Вкажи грамовку продукту</Text>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                            }}>
                                <View style={{
                                    borderRadius: 15,
                                    display: "flex",
                                    flexDirection: "column",
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    width: '50%',
                                    height: 42,
                                    borderWidth: 2,
                                    borderColor: colors.shadowBlue
                                }}>
                                    <TextInput
                                        placeholder='100'
                                        style={styles.input}
                                        onChangeText={e => onInputGramHandler(e)}
                                        value={gramText}
                                    />
                                </View>
                            </View>
                            <View style={styles.productContainer}>
                                <Text style={styles.productText}>{txtWithDate(startingDay, endingDay)}</Text>
                                <View style={styles.submitBtnContainer}>
                                    <Button
                                        buttonStyle={styles.submitBtn}
                                        title="Підтвердити" theme={BtnTheme}
                                        onPress={postProducts}
                                    />
                                </View>
                            </View>
                        </> : null
                }
                {
                    product.length === 0 || product[0] === 'Почніть додавати'?
                        <View style={product[0] !== 'Почніть додавати' && product.length !== 0 ?
                            {marginTop: -20, marginBottom: 30} :
                            {marginTop: -40, marginBottom: 30}}
                        >
                            <Text style={styles.h1Text}>Переглянути статистику за вибраними датами ?</Text>

                            <View style={styles.submitBtnContainer}>
                                <Button
                                    buttonStyle={styles.submitBtn}
                                    title="Статистика" theme={BtnTheme}
                                    onPress={goToStatisticsForProducts}
                                />
                            </View>
                        </View> : null
                }
                <View style={{
                    marginBottom: 20,
                    display: "flex",
                    textAlign: 'center',
                    alignSelf: 'center',
                    width: screenData.isLandscape ?
                        Dimensions.get('screen').width / 2 :
                        '35%',
                }}>
                    <Overlay isVisible={productsModal} onBackdropPress={toggleProductsModalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.h1ModalText}>За вибраною датою маємо: </Text>
                            <View style={styles.modalIconContainer}>
                                <Icon
                                    reverse={colors.shadowBlue}
                                    size={20}
                                    name='arrow-right'
                                    type='font-awesome'
                                    color={colors.pastelGray}
                                    onPress={toggleProductsModalOverlay}
                                />
                            </View>
                        </View>

                        <UserProductsListModal productsList={setListOfProducts()} date={startingDay}/>
                        <View style={styles.submitBtnContainer}>
                            <Button
                                buttonStyle={{marginBottom: 20, width: 100}}
                                title="Дякую" theme={BtnTheme}
                                onPress={toggleProductsModalOverlay}
                            />
                        </View>
                    </Overlay>
                </View>
                <View style={
                    product.includes('Почніть додавати') ||  product.length === 0 ?
                        {marginTop: -30, width: '100%', display: "flex", flexDirection: "row"}:
                        {marginTop: 10, width: '100%', display: "flex", flexDirection: "row"}
                }>
                    <Text style={styles.h3Text}>
                        Переглянути продукти за датою
                    </Text>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        <Button
                            buttonStyle={styles.btnStyle}
                            title="Переглянути" theme={BtnTheme}
                            onPress={toggleProductsModalOverlay}
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
        paddingBottom: 80,
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        marginTop: 7,
    },
    btnStyle: {
        height: 42,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    h1Text: {
        marginTop: 70,
        marginBottom: 15,
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center',
    },
    h2Text: {
        fontSize: 23,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    gramText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    h3Text: {
        width: '60%',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 5,
        marginRight: 10,
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    calendarContainer: {
        borderRadius: 30,
        width: '90%',
        alignSelf: 'center'
    },
    productsListContainer: {
        marginTop: 15,
        alignSelf: 'center',

    },
    listContainer: {
        alignSelf: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 12,
        display: 'flex', flexDirection: 'column',
        backgroundColor: colors.pastelGray
    },
    txtListContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    txtList: {
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        backgroundColor: colors.beige,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    h1ModalText: {
        width: '70%',
        display: 'flex',
        flexDirection: 'column',
        fontSize: 25,
        marginTop: 15,
        marginLeft: 10,
    },
    modalIconContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-end',
    },
    submitBtnContainer: {
        backgroundColor: colors.beige,
        alignItems: 'center'
    },
    submitBtn: {
        marginBottom: 20,
    },
    //
    productContainer: {
        width: '90%',
        marginTop: 15,
        display: "flex",
        alignSelf: 'center',
    },
    productText: {
        marginBottom: 30,
        fontSize: 22,
        textAlign: 'center',
    },
});

export default Calendar
