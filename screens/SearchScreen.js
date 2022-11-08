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
    const [actArray, setActArray] = useState([])
    const isFocused = useIsFocused();

    let db = getDatabase()
    let refPolls = ref(db,'/polls/')
    let refUsers = ref(db,'/users/WoruXPBJ0PXcTebnm2u5555dVpq2/')
    
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
