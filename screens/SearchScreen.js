import React,{useState,useEffect}from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import SearchBar from '../components/search/SearchBar'
import GroupWrapper from '../components/search/wrappers/GroupWrapper';
import NearYouPollWrapper from '../components/search/wrappers/NearYouPollWrapper';
import TrendingPollWrapper from '../components/search/wrappers/TrendingPollWrapper';
import Header from '../components/common/Header';
import { Database, get, getDatabase, onValue, ref, set, } from "firebase/database";
import { useIsFocused } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



function SearchScreen() {

    const [pollsArray, setPollsArray] = useState([])
    const [actsArray, setActsArray] = useState([])
    const isFocused = useIsFocused();

    let db = getDatabase()
    let refPolls = ref(db,'/polls/')
    
    useEffect(() => {
        let arr=[]
        get(refPolls).then(snapshot => {
            snapshot.forEach((snap) => {
                var item = snap.val()
                item.key = snap.key
                arr.push(item)

            })
            setPollsArray(arr)
        })





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
        <ScrollView>

            <Header />
            <SearchBar />
    
            <View style={{
                backgroundColor: '#3B3C3B',
                width: windowWidth,
                paddingTop: 10,
                flex: 1
            }}>
                <TrendingPollWrapper polls={finalArr} title="Trending Polls" />
                <NearYouPollWrapper polls={pollsArray} title="Polls Near You" />
                <GroupWrapper title="Groups for You" />

            </View>

        </ScrollView >
    )
}




export default SearchScreen
