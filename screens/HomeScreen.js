import { View, Text, Dimensions, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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
import PollBanner from '../components/home/PollBanner';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = () => {
    const [pollsArray, setPollsArray] = useState([])


    const db = getDatabase()
    const auth = getAuth()

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
                        <View style={styles.tabsContainer}>
                            <TouchableOpacity>
                                <Text>Following</Text>
                            </TouchableOpacity>
                            <Text style={{
                                color: '#fff',
                                fontSize: 15,
                                opacity: 0.2,
                            }}>|</Text>
                            <TouchableOpacity>
                                <Text>For You</Text>
                            </TouchableOpacity>
                        </View>
                        <PollBanner uid={poll.uid} db={db} auth={auth} />
                        <Question title={poll.title} />
                        <PollStats id={poll.key} likes={poll.likes} dislikes={poll.dislikes} comments={poll.comments} shares={poll.shares} db={db} auth={auth} />
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
    },
    tabsContainer: {
        height: '10%',
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 10,
        alignItems: 'center',
        marginTop: '20%',
        flex: 1,
        justifyContent: 'space-between'

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



