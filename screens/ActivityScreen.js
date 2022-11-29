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
import { collection, addDoc, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Answer from '../components/home/Answer';

import { getFirestore } from "firebase/firestore";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function ActivityScreen() {

  const [likes, setLikes] = useState([])
  const [dislikes, setDislikes] = useState([])


  const auth = getAuth()
  const db = getFirestore();


  const isFocused = useIsFocused();

  useEffect(() => {
    async function getActivity() {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      let likeArr = []
      let dislikeArr = []
      let pollArr = []
      if (userSnap.exists()) {
        let data = userSnap.data()['activity']
        if (data != false) {
          data.forEach((a) => {
            if (a.type == "like") {
              likeArr.push(a)
            }
            if (a.type == "dislike") {
              dislikeArr.push(a)
            }
          })

        }
      }
      setLikes(likeArr)
      setDislikes(dislikeArr)
    }
    getActivity()




  }, [isFocused])


  return (
    <ScrollView>
      <Header />
      <View style={{
        // backgroundColor: '#3B3C3B',
        backgroundColor: "#16161a",
        width: windowWidth,
        height: windowHeight,
        paddingTop: 10,
        flex: 1,
        flexDirection: 'row'
      }}>
        <LikesWrapper title="Likes" likeActivity={likes} />
        <DislikesWrapper title="Dislikes" dislikeActivity={dislikes} />


      </View>
    </ScrollView>
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