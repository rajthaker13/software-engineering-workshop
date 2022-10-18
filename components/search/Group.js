import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import SearchBar from '../components/search/SearchjBar'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Group(props) {
    return (

        <View style={{
            backgroundColor: '#D9D9D9', borderWidth: 10, borderColor: '#010101', borderRadius: 20,
            width: 150,
            height: 220,
            marginTop: 15,
            marginLeft: 15,
            marginBottom: 15,
            marginRight: 0,
            padding: 5,
            flex: 1
        }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>{props.name}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}> Admin: {props.admin}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}> Group Type: {props.type}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}> Members: {props.membersNum}</Text>
        </View>
    )
}
