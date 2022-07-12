import React from "react";
import {
    View, Text,
    StyleSheet, Dimensions,
} from 'react-native'
import {colors} from "../constants/helpers";


const UserProductsListModal = ({productsList}) => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.listContainer}>
                {
                    productsList.length === 0 ?
                        <View style={styles.txtContainer}>
                            <Text style={styles.h1Text}>У тебе немає продуктів за цією датою</Text>
                        </View> :
                        productsList.map( (value, i) => {
                        return (
                            <View key={i} style={styles.listItemsContainer}>
                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                    <Text style={{ color: colors.text, fontSize: 16}}>
                                        {value.name}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.beige,
        width: Dimensions.get('screen').width / 1.2,
    },
    txtContainer: {
        width: '100%',
        marginLeft: -5,
        marginTop: 20,
    },
    h1Text: {
        width: '80%',
        marginLeft: -10,
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 10,
        marginTop: 30,
        marginBottom: 30,
    },
    listItemsContainer: {
        alignSelf: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 12,
        display: 'flex', flexDirection: 'column',
        backgroundColor: colors.shadowBrown
    },
})

export default UserProductsListModal
