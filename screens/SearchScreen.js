import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import SearchBar from '../components/search/SearchBar'
import GroupWrapper from '../components/search/wrappers/GroupWrapper';
import NearYouPollWrapper from '../components/search/wrappers/NearYouPollWrapper';
import TrendingPollWrapper from '../components/search/wrappers/TrendingPollWrapper';
import Header from '../components/common/Header';
import { Database, get, getDatabase, onValue, ref, set, } from "firebase/database";
import { useIsFocused } from '@react-navigation/native';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;





function SearchScreen() {

    const [pollsArray, setPollsArray] = useState([])
    const isFocused = useIsFocused();
    const [actArray, setActArray] = useState([])

    let db = getFirestore()



    useEffect(() => {
        async function getPolls() {
            let arr = []
            const pollsSnapshot = await getDocs(collection(db, "polls"));
            pollsSnapshot.forEach((poll) => {
                var item = poll.data()
                item.key = poll.id
                arr.push(item)
            })
            setPollsArray(arr)

        }
        // async function getPollsAct() {
        //     let arr = []
        //     const actsSnapshot = await getDocs(collection(db, "polls"));
        //     pollsSnapshot.forEach((poll) => {
        //         var item = poll.data()
        //         item.key = poll.id
        //         arr.push(item)
        //     })
        //     setPollsArray(arr)

        // }
        getPolls()
    }, [isFocused])



    return (
        <ScrollView>

            <Header />
            <SearchBar />

            <View style={{
                backgroundColor: '#3B3C3B',
                width: windowWidth,
                paddingTop: 10,
                flex: 1
            }}>



                <NearYouPollWrapper polls={pollsArray} title="Trending Polls" />
                <TrendingPollWrapper polls={pollsArray} title="Polls Near You" />
                <GroupWrapper title="Groups for You" />

            </View>

        </ScrollView >
    )
}




export default SearchScreen
