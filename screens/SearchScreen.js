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
import { COLORS } from '../components/Colors/ColorScheme';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;





function SearchScreen() {

    const [pollsArray, setPollsArray] = useState([])
    const [actArray, setActArray] = useState([])
    const isFocused = useIsFocused();
    

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
        getPolls()

    }, [isFocused])



    let arrr =[]
    pollsArray.forEach((poll) => {
        if ("activities" in poll){
            if(poll.activities["0"]!=""){

                var likeInMin = 0

                poll.activities.forEach((act) =>{
                    if((act.type == "like")&&(Date.now() - act.timestamp < 60000))
                    likeInMin ++
                })

                arrr.push([poll.title,likeInMin])

            }
            
        }
    })

    var sorted = arrr.sort(function(a, b) {
        return b[1] - a[1];
    });
    
    var finalArr = []

    sorted.forEach((poll)=>{
        finalArr.push({title:poll[0],likes:poll[1]})
    })








    return (

    <SafeAreaView>
        <SearchBar />
        
        <ScrollView>            

            <View style={{
                backgroundColor: COLORS.Background,
                width: windowWidth,
                paddingTop: 10,
                flex: 1
            }}>


                <TrendingPollWrapper polls={finalArr} title="Trending Polls" />
                <NearYouPollWrapper polls={pollsArray} title="Polls Near You" />
                
                {/* <GroupWrapper title="Groups for You" /> */}

            </View>

        </ScrollView >
    </SafeAreaView>
    )
}




export default SearchScreen
