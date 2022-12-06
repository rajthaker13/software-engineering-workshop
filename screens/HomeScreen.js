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

export default function HomeScreen({ route, navigation }) {
    const pid = route.params.pid



    const [pollsArray, setPollsArray] = useState([])


    const auth = getAuth()
    const db = getFirestore();

    const ref = React.useRef(PagerView);

    const isFocused = useIsFocused();

    const [onForYouTab, setOnForYouTab] = useState(true)


    useEffect(() => {
        async function getPollsData() {
            let arr = []
            const userRef = doc(db, "users", auth.currentUser.uid)
            const pollsSnapshot = await getDocs(collection(db, "polls"));
            let followingList = []
            if (!onForYouTab) {
                const userSnap = await getDoc(userRef)
                if (userSnap.exists()) {
                    followingList = Object.keys(userSnap.data()['following'])
                }
            }
            pollsSnapshot.forEach(async (doc) => {
                if (onForYouTab) {
                    //AI
                    const url = 'https://us-central1-aiplatform.googleapis.com/ui/projects/pollme-24549/locations/us-central1/endpoints/7178636650958815232:predict'
                    // await fetch(url, {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': "application/json",
                    //     },
                    //     body: doc.data().title
                    // }).then((res) => {
                    //     console.log(res.data())
                    // })
                    var item = doc.data()
                    item.key = doc.id
                    if (item.key == pid) {
                        arr.unshift(item)
                    }
                    else {
                        arr.push(item)
                    }
                }
                else {
                    var item = doc.data()
                    followingList.forEach((user) => {
                        if (user == item.uid) {
                            item.key = doc.id
                            if (item.key == pid) {
                                arr.unshift(item)
                            }
                            else {
                                arr.push(item)
                            }


                        }
                    })


                }
            })
            setPollsArray(arr.sort(() => Math.random() - .5))

        }
        getPollsData()

    }, [isFocused, onForYouTab])

    if (pid != "") {
        ref.current.setPage(0)
        navigation.setParams({ pid: '' })
    }

    return (
        <ViewPager
            ref={ref}
            orientation="vertical"
            style={{ flex: 1, }}
            initialPage={0}
        >
            {pollsArray.map((poll) => {
                const pollID = poll.key

                return (
                    <Poll poll={poll} pollID={pollID} db={db} auth={auth} navigation={navigation} route={route} changeTab={setOnForYouTab} onForYouTab={onForYouTab} />

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





