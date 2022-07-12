import React, {useEffect, useState} from 'react';
import {Dimensions} from "react-native";

export const colors = {
    crystal: '#A6DAD9',
    beige: '#F5EEDF',
    whiteChocolate: '#EEE7D3',
    bone: '#EAD7C3',
    almond: '#F5D9C4',
    orchidPink: '#ECC1D1',
    thistle: '#D9B4E2',
    tropicalViolet: '#BEAFE1',
    purple: '#694fad',
    pastelRed: '#ffc1ae',
    pastelBlue: '#5a9ae6',

    lilac: '#BEADC9',
    palePink: '#FAD6D6',
    cambridgeBlue: '#92C5BA',
    //
    pastelGray: '#86729b',
    wildBlue: '#5796af',
    shadowBlue: "#5796af",
    shadowBrown: '#B89276',
    //
    border: 'rgb(199, 199, 204)',
    text: 'rgb(28, 28, 30)',
    notification: 'rgb(255, 69, 58)',
}

export const SearchBarTheme = {
    dark: false,
    colors: {
        primary: colors.shadowBlue,
        background: colors.shadowBlue,
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
    },
};

export const CalendarTheme = {
    calendarBackground: colors.shadowBlue,
    selectedDayBackgroundColor: "#333",
    selectedDayTextColor: "#333",
    selectedDotColor: colors.pastelGray,
    dayTextColor: colors.beige,
    textDisabledColor: '#c0c0c0',
    dotColor: colors.beige,
    monthTextColor: colors.beige,
    textMonthFontWeight: 'bold',
    arrowColor: colors.beige,
    todayTextColor: colors.beige
};

export const BtnTheme = {
    dark: false,
    colors: {
        primary: colors.shadowBlue,
        background: colors.shadowBlue,
        card: colors.almond,
        text: colors.text,
        border: colors.border,
        notification: colors.notification,
    },
};

export const AddBtnTheme = {
    dark: false,
    colors: {
        primary: colors.pastelGray,
        background: colors.pastelGray,
        card: colors.almond,
        text: colors.text,
        border: colors.border,
        notification: colors.notification,
    },
};

export const CancelBtnTheme = {
    dark: false,
    colors: {
        primary: colors.pastelRed,
        background: colors.pastelRed,
        card: colors.almond,
        text: colors.text,
        border: colors.border,
        notification: colors.notification,
    },
};

export const truncate = (str, maxlength) => {
    return (str.length > maxlength) ? str.slice(0, maxlength - 1) + '…' : str
}

export const round = (num) => {
    if (num.toString().indexOf('.') !== -1) {
        let spl = num.toString().split('.')
        if (spl[1].length >= 2) {
            return Math.round(num * 10) / 10
        }
    }
    return num
}

export const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

export const getRecipeInfoById = (id, arr) => {

    if(arr.length === 0) {
        return []
    }

    let allInfosByDates = arr.filter(value => value.recipeId === id)

    if (allInfosByDates === []) {
        return []
    }

    return allInfosByDates.reduce((acc, obj) => {
        return {
            ...acc,
            [obj.title]: obj.description
        }
    }, {})
}

export const getRecipeByFilter = (name, arrOfInfos, arrOfRecipes) => {

    if(arrOfInfos.length === 0 || arrOfRecipes.length === 0) {
        return []
    }

    let allInfosByTitle = []

    if (name !== undefined) {
        let allItems = arrOfInfos.filter(value => value.title === name)
        allInfosByTitle = allItems.filter(value => +value.description > 10)
    }

    let recipeIdArr = shuffle(allInfosByTitle.map(v => v.recipeId))

    let resArray = []

    recipeIdArr.map( id => {
        let findRecipe = arrOfRecipes.filter(recipe => recipe.id === id)
        resArray = [...resArray, ...findRecipe]
    })

    return resArray
}

export const checkPeriodOfDates = (id, arr) => {

    if (id === null || id === undefined) {
        return []
    }
    if (arr.length === 0 || arr === []) {
        return []
    }

    let userProductsById = arr.filter(value => value.userId === id)

    let arrOfObjectByDateInArray = []
    userProductsById.map(value => {
        arrOfObjectByDateInArray = [
            ...arrOfObjectByDateInArray,
            value
        ]
    })

    let productValuesObject = arrOfObjectByDateInArray.map(v => JSON.parse(v.productsValues))

    let arrDays = []
    arrOfObjectByDateInArray.map(v => {
        if ( v.productsValues !== undefined ) {
            if (arrDays.includes(v.date)) {
                return null
            } else {
                arrDays = [...arrDays, v.date]
            }
        }
    })


    let resObj = {}

    productValuesObject.map((value, i) => {
        if (i === 0) {
            resObj = {
                proteins: value.proteins,
                fats: value.fats,
                carbs: value.carbs,
                date: arrDays
            }
        } else {
            resObj.proteins = round(resObj.proteins + value.proteins)
            resObj.fats = round(resObj.fats + value.fats)
            resObj.carbs = round(resObj.carbs + value.carbs)
        }
    })

    return resObj
}

export const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));

    useEffect(() => {
        const onChange = (result) => {
            setScreenData(result.screen);
        };

        Dimensions.addEventListener('change', onChange);

        return () => Dimensions.removeEventListener('change', onChange);
    });

    return {
        ...screenData,
        isLandscape: screenData.width > screenData.height,
    };
};

export const validateRegistration = (pass, repPass, mail, userNameValue) => {

    if (typeof pass === 'string' || pass instanceof String) {

        const passwordValue = pass.trim();

        const emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const minLengthRegExp = /.{8,}/;
        const minLengthUserName = /.{5,}/;

        const checkMinLenForUserName = minLengthUserName.test(userNameValue)
        const emailCheck = emailRegExp.test(mail);
        const uppercasePassword = uppercaseRegExp.test(passwordValue);
        const lowercasePassword = lowercaseRegExp.test(passwordValue);
        const digitsPassword = digitsRegExp.test(passwordValue);
        const minLengthPassword = minLengthRegExp.test(passwordValue);

        if (pass.trim().length === 0) {
            return 'Поле "Пароль" пусте або містить тільки пробіл'
        } else if (userNameValue.trim().length === 0) {
            return 'Поле Імені не заповнено або містить тільки пробіл'
        } else if (!checkMinLenForUserName) {
            return 'Поле Імені має містити мінімум 5 символів'
        } else if (repPass.trim().length === 0) {
            return 'Поле "Повторіть пароль" пусте або містить тільки пробіл'
        } else if (mail.trim().length === 0) {
            return 'Поле Email пусте або містить тільки пробіл'
        } else if (pass !== repPass) {
            return 'Паролі не співпадають'
        } else if (!emailCheck) {
            return 'Email не правильного формату'
        } else if (!uppercasePassword) {
            return 'Пароль повинен містити як мінімум одну велику літеру'
        } else if (!lowercasePassword) {
            return 'Пароль повинен містити як мінімум одну маленьку літеру'
        } else if (!digitsPassword) {
            return 'Пароль повинен містити як мінімум одну цифру'
        } else if (!minLengthPassword) {
            return 'Пароль повинен містити мінімум 8 символів'
        } else {
            return false
        }
    } else {
        return false
    }
}

export const findIConImage = (name) => {
    if (name === 'Напій') {
        return '🧋'
    }
    if (name === 'Пиріг') {
        return '🥧'
    }
    if (name === 'Сік') {
        return '🧃'
    }
    if (name === 'Десерт') {
        return '🍩'
    }
    if (name === 'Сніданок') {
        return '🥞'
    }
    if (name === 'Обід') {
        return '🍝'
    }
    if (name === 'Печиво') {
        return '🍪'
    }
    if (name === 'Кекс') {
        return '🧁'
    }
    if (name === 'Вечеря') {
        return '🥘'
    }
    if (name === 'Перекус') {
        return '🍿'
    }
    if (name === 'Інше') {
        return '🥗'
    }
    if (name === '50-100') {
        return '🍎'
    }
    if (name === '100-200') {
        return '🥪'
    }
    if (name === '200-300') {
        return '🥯'
    }
    if (name === '300-400') {
        return '🥞'
    }
    if (name === '400-500') {
        return '🌭'
    }
    if (name === '500-600') {
        return '🍛'
    }
    if (name === '600-700') {
        return '🍱'
    }
    if (name === '700+') {
        return '🍔🍟'
    }
    if(name === 'Високий вміст білка') {
        return '🍳'
    }
    if(name === 'Мало калорій') {
        return '🍏'
    }
    if(name === 'Низький вміст вуглеводів') {
        return '🥜'
    }
    if(name === 'Вегeтаріанство') {
        return '🧀'
    }
    if(name === 'Низький вміст жирів') {
        return '🥒'
    }
    if(name === 'Веганство') {
        return '🌱'
    }
    if(name === 'Без лактози') {
        return '🐮'
    }
    if(name === 'Без цукру') {
        return '🍭'
    }
    if(name === 'Класична') {
        return '🍗️'
    }
    if(name === 'Високий вміст клітковини') {
        return '🍠'
    }

    return '🥪'
}

export const calories =
    [
        {
            icon: findIConImage('50-100'),
            counter: "50-100",
        },
        {
            icon: findIConImage('100-100'),
            counter: "100-200",
        },
        {
            icon: findIConImage('200-300'),
            counter: "200-300",
        },
        {
            icon: findIConImage('300-400'),
            counter: "300-400",
        },
        {
            icon: findIConImage('400-500'),
            counter: "400-500",
        },
        {
            icon: findIConImage('500-600'),
            counter: "500-600",
        },
        {
            icon: findIConImage('600-700'),
            counter: "600-700",
        },
        {
            icon: findIConImage('700+'),
            counter: "700+",
        },
    ]

export const diets =
    [
        {
            icon: findIConImage('Високий вміст клітковини'),
            name: "Високий вміст клітковини",
        },
        {
            icon: findIConImage('Класична'),
            name: "Класична",
        },
        {
            icon: findIConImage('Без цукру'),
            name: "Без цукру",
        },
        {
            icon: findIConImage('Без лактози'),
            name: "Без лактози",
        },
        {
            icon: findIConImage('Веганство'),
            name: "Веганство",
        },
        {
            icon: findIConImage('Вегeтаріанство'),
            name: "Вегeтаріанство",
        },
        {
            icon: findIConImage('Низький вміст жирів'),
            name: "Низький вміст жирів",
        },
        {
            icon: findIConImage('Низький вміст вуглеводів'),
            name: "Низький вміст вуглеводів",
        },
        {
            icon: findIConImage('Мало калорій'),
            name: "Мало калорій",
        },
        {
            icon: findIConImage('Високий вміст білка'),
            name: "Високий вміст білка",
        },
    ]

export const getImage = (name) => {
    if (name === 'На ходу') {
        return require('../constants/images/onTheGo.jpeg')
    } else if (name === 'Легко') {
        return require('../constants/images/easy.jpeg')
    } else if (name === 'Помірно') {
        return require('../constants/images/medium.jpeg')
    } else if (name === 'Помірно складно') {
        return require('../constants/images/mediumHard.jpeg')
    } else if (name === 'Складно') {
        return require('../constants/images/hard.jpeg')
    } else if (name === 'Сніданок') {
        return require('../constants/images/breakfast.jpeg')
    } else if (name === 'Обід') {
        return require('../constants/images/lunch.jpeg')
    } else if (name === 'Вечеря') {
        return require('../constants/images/dinner.jpeg')
    } else if (name === 'Перекус') {
        return require('../constants/images/lunch.jpeg')
    } else if (name === 'Інше') {
        return require('../constants/images/other.jpeg')
    } else {
        return require('../constants/images/other.jpeg')
    }
}

export const methods =
    [
        {
            id:"1",
            name: "На ходу",
            image: getImage('На ходу')
        },
        {
            id:"2",
            name: "Легко",
            image: getImage('Легко')
        },
        {
            id:"3",
            name: "Помірно",
            image: getImage('Помірно')
        },
        {
            id:"4",
            name: "Помірно складно",
            image: getImage('Помірно складно')
        },
        {
            id:"5",
            name: "Складно",
            image: getImage('Складно')
        },
    ]
