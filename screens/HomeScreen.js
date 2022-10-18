import { View, Text, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { Database, get, getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from 'firebase/auth';
import Header from '../components/common/Header';
import Question from '../components/home/Question';
import Answer from '../components/home/Answer';
import PollStats from '../components/home/PollStats';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = () => {
    const [pollsArray, setPollsArray] = useState([])
    const [currentPoll, setCurrentPoll] = useState([])
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(["Loading"])
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)


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
            setOptions(arr[0].options)
            setLikes(arr[0].likes)
            setDislikes(arr[0].dislikes)

        })
    }, [])

    return (
        <View style={styles.container}>
            <Header />
            <Question title={currentPoll == [] ? "" : currentPoll.title} />
            <PollStats id={currentPoll.key} likes={currentPoll.likes} dislikes={currentPoll.dislikes} comments={currentPoll.comments} shares={currentPoll.shares} db={db} />
            {options == [] ? <View></View> : options.map((option) => {
                return (
                    <Answer title={option} key={option} />
                )
            })}
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
        marginLeft: '5%',
        flex: 1,

    }

})

export default HomeScreen;



