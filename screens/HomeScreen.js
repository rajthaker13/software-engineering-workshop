import { View, Text, Dimensions, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useEffect, useReducer, useRef, useState } from 'react';
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
import PagerView from 'react-native-pager-view';
import Poll from '../components/home/Poll';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({ route, navigation }) => {
    const pid = route.params.pid



    const [pollsArray, setPollsArray] = useState([])
    const [hasVoted, setHasVoted] = useState(false)


    const auth = getAuth()
    const db = getFirestore();

    const ref = React.useRef(PagerView);

    const isFocused = useIsFocused();


    useEffect(() => {
        async function getPollsData() {
            let arr = []
            const pollsSnapshot = await getDocs(collection(db, "polls"));
            pollsSnapshot.forEach((doc) => {
                var item = doc.data()
                item.key = doc.id
                if (item.key == pid) {
                    arr.unshift(item)
                }
                else {
                    arr.push(item)
                }
            })
            setPollsArray(arr)

        }
        getPollsData()

    }, [isFocused])

    if (pid != "") {
        ref.current.setPage(0)
        navigation.setParams({ pid: '' })
    }

    return (
        <ViewPager
            ref={ref}
            orientation="vertical"
            style={{ flex: 1 }}
            initialPage={0}
        >
            {pollsArray.map((poll) => {
                const pollID = poll.key

                return (
                    <Poll poll={poll} pollID={pollID} db={db} auth={auth} />

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



