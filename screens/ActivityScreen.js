import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, ScrollView, Dimensions } from 'react-native';
import { Box, FlatList, Badge, Heading, AspectRatio, Avatar, Stack, HStack, VStack, Spacer, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { Database, get, getDatabase, onValue, ref, set } from "firebase/database";
import React, { useState, useEffect } from 'react';
// import AppLoading from 'expo-app-loading';
import { useFonts, IrishGrover_400Regular } from '@expo-google-fonts/irish-grover';
import Header from '../components/common/Header';
import LikesWrapper from '../components/activity/wrappers/LikesWrapper';
import { useIsFocused } from '@react-navigation/native';
import DislikesWrapper from '../components/activity/wrappers/DislikesWrapper';
import RequestsWrapper from '../components/activity/wrappers/RequestsWrapper';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Answer from '../components/home/Answer';

import { getFirestore } from "firebase/firestore";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function ActivityScreen() {

  const [likes, setLikes] = useState([])
  const [dislikes, setDislikes] = useState([])
  const [requests, setRequests] = useState([])
  const [hasInt, setHasInt] = useState(false)


  const auth = getAuth()
  const db = getFirestore();


  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("XXXXXX", hasInt)
    async function getActivity() {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      let likeArr = []
      let dislikeArr = []
      let reqMap = []
      // let reqMap = {}
      if (userSnap.exists()) {
        let activityData = userSnap.data()['activity']
        if (activityData != false) {
          activityData.forEach((a) => {
            if (a.type == "like") {
              likeArr.push(a)
            }
            if (a.type == "dislike") {
              dislikeArr.push(a)
            }
          })

        }
        let reqs = Object.entries(userSnap.data()['followerReq'])
        reqs.forEach((value, key) => {
          const obj ={
            userID : value[0], 
            timestamp : value[1]
          }
          reqMap.push(obj)
        });
        }
      setRequests(reqMap)
      setLikes(likeArr)
      setDislikes(dislikeArr)
    }
    getActivity()
    
  
    
    
  }, [isFocused])
  const updateActivity = async () => {    
    const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      let likeArr = []
      let dislikeArr = []
      let reqMap = []
      // let reqMap = {}
      if (userSnap.exists()) {
        let activityData = userSnap.data()['activity']
        if (activityData != false) {
          activityData.forEach((a) => {
            if (a.type == "like") {
              likeArr.push(a)
            }
            if (a.type == "dislike") {
              dislikeArr.push(a)
            }
          })

        }
        let reqs = Object.entries(userSnap.data()['followerReq'])
        reqs.forEach((value, key) => {
          const obj ={
            userID : value[0], 
            timestamp : value[1]
          }
          reqMap.push(obj)
        });
        }
      setRequests(reqMap)
      setLikes(likeArr)
      setDislikes(dislikeArr)     
   };  
  // async function updateActivity() {
  //     getActivity()

  // }

  return (
    <>
    <ScrollView>
      {/* <Header /> */}
      <View style={{
        // backgroundColor: '#3B3C3B',
        backgroundColor: "#16161a",
        width: windowWidth,
        paddingTop: "25%",
        flex: 1,
        flexDirection: 'row'
      }}>
        <LikesWrapper title="Likes" likeActivity={likes} />
        <DislikesWrapper title="Dislikes" dislikeActivity={dislikes} />
      </View>
    </ScrollView>
    <ScrollView>
      {/* <Header /> */}
      <View style={{
        // backgroundColor: '#3B3C3B',
        backgroundColor: "#16161a",
        width: windowWidth,
        height: windowHeight,
        paddingTop: 10,
        flex: 1,
        flexDirection: 'row'
      }}>
        <RequestsWrapper title="Requests" reqActivity={requests} hasInt={updateActivity} />
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3B3C3B',
    width: windowWidth,
    height: windowHeight,
    paddingTop: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'gray',
    flexDirection: "row"
  },
  text: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textHeading: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: 'black',
  }
});