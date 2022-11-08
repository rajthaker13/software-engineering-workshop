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
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = (props) => {
    const [pollsArray, setPollsArray] = useState([])


    const auth = getAuth()
    const db = getFirestore();

    const isFocused = useIsFocused();


    useEffect(() => {
        async function getPollsData() {
            let arr = []
            const pollsSnapshot = await getDocs(collection(db, "polls"));
            pollsSnapshot.forEach((doc) => {
                var item = doc.data()
                item.key = doc.id
                arr.push(item)

            })
            setPollsArray(arr)

        }
        getPollsData()

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
                                <Answer title={option} key={option} id={poll.key} />
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
        // fontFamily: "Federo",
        fontSize: 20,
        marginLeft: '5%',
        flex: 1,

    }

})

export default HomeScreen;



