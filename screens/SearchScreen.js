import React, { useState, useEffect } from 'react'
import { Pressable,StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions,StatusBar } from 'react-native'
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
// import algoliasearch from 'algoliasearch/lite';
import SearchBoxNative from '../components/search/SearchBoxNative';
import { InstantSearch } from 'react-instantsearch-native';
import InfiniteHits from '../components/search/InfiniteHits';
import { SearchBox } from 'react-instantsearch-dom';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import algoliasearch from 'algoliasearch';
import * as Location from 'expo-location'
import { LocationAccuracy } from 'expo-location';
import haversine from 'haversine';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


// const searchClient = algoliasearch('PN9CAYIKKA', 'ecd74f365860ea94f1d92779981d4a64');
// const client = algoliasearch('PN9CAYIKKA', '8426ddb9e02f50bcb8ae7b4a604db602');

const client = algoliasearch('PN9CAYIKKA', '8426ddb9e02f50bcb8ae7b4a604db602');
const userIndex = client.initIndex('PollMe_users');

function SearchScreen() {

    


    const [pollsArray, setPollsArray] = useState([])
    const [usersArray, setUsersArray] = useState([])

    const [actArray, setActArray] = useState([])
    const isFocused = useIsFocused();
    const [showHits, setShowHits] = useState(false);
    const [curLocation, setLocation] = useState([])



    let db = getFirestore()
    const navigation = useNavigation();

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
        async function getUsers() {
            let arr = []
            const usersSnapshot = await getDocs(collection(db, "users"));
            usersSnapshot.forEach((user) => {
                var item = user.data()
                item.objectID = user.id
                arr.push(item)
            })
            setUsersArray(arr)

        }
        async function getLocation (){
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({accuracy: LocationAccuracy.Lowest});
            setLocation(location);
        }

        
        
        getPolls()
        getUsers()
        getLocation()

    }, [isFocused])

    
    

    
    userIndex.saveObjects(usersArray, { autoGenerateObjectIDIfNotExist: true });


    let unsortedTrending =[]
    let unsortedNearYou = []
    pollsArray.forEach((poll) => {
        if ("activities" in poll){
            if(poll.activities["0"]!=""){

                var likeInMin = 0

                poll.activities.forEach((act) =>{
                    if((act.type == "like")&&(Date.now() - act.timestamp < 600000))
                    likeInMin ++
                })

                unsortedTrending.push([poll.key, poll.title,likeInMin])

            }
            if(poll.location){
                
                //console.log(curLocation.coords.latitude)

            
                var curLoc = {
                    latitude: 38.64839,
                    longitude: 90.30772
                }
                var pollLoc ={
                    latitude: poll.location.coords.latitude.toFixed(3),
                    longitude: Math.abs(poll.location.coords.longitude.toFixed(3))
                }
                var dist = haversine(curLoc,pollLoc,{unit: 'mile'})
                unsortedNearYou.push([poll.key,poll.title,dist])
            }
            
        }
    })


    var sortedTrending = unsortedTrending.sort(function(a, b) {
        return b[2] - a[2];
    });
    var trendingArray = []
    sortedTrending.forEach((poll)=>{
        trendingArray.push({pollID: poll[0],title:poll[1],likes:poll[2]})
    })


    var sortedNearYou = unsortedNearYou.sort(function(a, b) {
        return a[2] - b[2];
    });
    var nearYouArray = []
    sortedNearYou.forEach((poll)=>{
        nearYouArray.push({pollID: poll[0],title:poll[1],dist:poll[2]})
    })

    



    





    return (

    <SafeAreaView style={{backgroundColor: COLORS.Background}}>
        {/* <Pressable onPress={()=>navigation.navigate("SearchPage")}>
            <Text>Search Polls!</Text>
        </Pressable> */}
        <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05,paddingLeft:SCREEN_WIDTH-50}}>
            <Icon onPress={() => navigation.navigate("SearchPage")} name="search" color={COLORS.Paragraph} size={25}/>
        </View>

       
        <ScrollView>            
            <View style={{
                backgroundColor: COLORS.Background,
                width: windowWidth,
                paddingTop: 10,
                flex: 1
            }}>
                <TrendingPollWrapper polls={trendingArray} title="Trending Polls" />
                <NearYouPollWrapper polls={nearYouArray} title="Polls Near You" />
        
                {/* <GroupWrapper title="Groups for You" /> */}

            </View>

        </ScrollView>
        
        
        
        
    </SafeAreaView>
    )
}




export default SearchScreen
