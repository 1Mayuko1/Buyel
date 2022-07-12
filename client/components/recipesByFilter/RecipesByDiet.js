import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {colors, SearchBarTheme} from "../../constants/helpers";
import { Appbar } from 'react-native-paper';
import SearchBar from "react-native-dynamic-search-bar";
import Icon from "react-native-vector-icons/FontAwesome";

const RecipesByDiet = ({route, navigation}) => {


    const [term, setTerm] = React.useState('')

    const {recipeDiet} = route.params

    const onChangeSearch = (value) => {
        setTerm(value)
    }

    const goBeck = () => {
        navigation.navigate('Recipes');
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={{height: Dimensions.get('screen').height}}>
                <View>
                    <Appbar.Header theme={SearchBarTheme}>
                        <Appbar.Action icon="home" onPress={goBeck}/>
                        <SearchBar
                            placeholder="Search here"
                            onChangeText={(text) =>
                                onChangeSearch(text)
                            }
                            style={{flex: 1}}
                            onClearPress={() => setTerm('')}
                        />
                        <Appbar.Action
                            icon={
                                () => (
                                    <View>
                                        <Icon
                                            onPress={() => {
                                                console.log('hello')
                                            }}
                                            style={[{color: '#000'}]}
                                            size={20}
                                            name={'search'}
                                        />
                                    </View>
                                )
                            }
                        />
                    </Appbar.Header>
                </View>
                <View>
                    <Text style={styles.h1Text}>
                        {recipeDiet}
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default RecipesByDiet

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.beige,
        height: Dimensions.get('screen').height,
    },
    h1Text: {
        marginTop: 70,
        marginLeft: 30,
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 30,
        textAlign: 'left',
    },
})

