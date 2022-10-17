import { View, Text, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import Header from '../components/common/Header';
import { StyleSheet } from 'react-native';
import Question from '../components/home/Question';
import React, { useEffect, useReducer, useState } from 'react';
import { Database, get, getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from 'firebase/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = () => {
    const [pollsArray, setPollsArray] = useState([])
    const [currentPoll, setCurrentPoll] = useState()
    const [question, setQuestion] = useState('')

    const auth = getAuth()
    const db = getDatabase()

    const refPolls = ref(db, '/polls/')

    useEffect(() => {
        const arr = []
        get(refPolls).then(snapshot => {
            snapshot.forEach((snap) => {
                var item = snap.val()
                item.key = snap.key
                arr.push(item)
            })
            setPollsArray(arr)
            setCurrentPoll(arr[0])

        })
    }, [])

    return (
        <View style={styles.container}>
            <Header />
            <Question title={currentPoll.title} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3B3C3B',
        width: windowWidth,
        height: windowHeight,
        paddingTop: 10
    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        fontFamily: "Federo",
        fontSize: 20,
        marginLeft: '5%'

    }

})

export default HomeScreen;



