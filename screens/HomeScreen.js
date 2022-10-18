import { View, Text, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { Database, get, getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from 'firebase/auth';
import Header from '../components/common/Header';
import Question from '../components/home/Question';
import Answer from '../components/home/Answer';
import PollStats from '../components/home/PollStats';
import ViewPager from 'react-native-pager-view';
import { useIsFocused } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = () => {
    const [pollsArray, setPollsArray] = useState([])


    const db = getDatabase()

    const refPolls = ref(db, '/polls/')

    const isFocused = useIsFocused();


    useEffect(() => {
        const arr = []
        get(refPolls).then(snapshot => {
            snapshot.forEach((snap) => {
                var item = snap.val()
                item.key = snap.key
                arr.push(item)
            })
            setPollsArray(arr)
        })
    }, [isFocused])

    return (
        <ViewPager
            orientation="vertical"
            style={{ flex: 1 }}
            initialPage={0}
        >
            {pollsArray.map((poll) => {
                return (
                    <View style={styles.container}>
                        <Header />
                        <Question title={poll.title} />
                        <PollStats id={poll.key} likes={poll.likes} dislikes={poll.dislikes} comments={poll.comments} shares={poll.shares} db={db} />
                        {poll.options.map((option) => {
                            return (
                                <Answer title={option} key={option} />
                            )
                        })}
                    </View>

                )
            })}
        </ViewPager>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3B3C3B',
        width: windowWidth,
        height: windowHeight,
        paddingTop: 10,
        zIndex: -1,
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



