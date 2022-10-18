import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function SearchBar(props) {
    return (
        <TextInput
            style={{
                height: windowHeight,
                width: windowWidth,
                borderColor: 'gray',
                borderWidth: 1,
                backgroundColor: '#3B3C3B'
            }}
            defaultValue="Search for polls!"
        />
    )

}
