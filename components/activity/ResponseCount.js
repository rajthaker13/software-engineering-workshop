import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react/cjs/react.development';
import { Database, get, getDatabase, onValue, ref, set, update } from "firebase/database";
import { getAuth } from 'firebase/auth';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ResponseCount(props) {

  const db = getDatabase()
  const auth = getAuth()



  // const db = props.db
  // const auth = props.auth

  // const pollID = props.answerNum
  // const pollID = auth.props.answerNum
  // const pollID = props.id

  const [likesCount, setLikesCount] = useState([])
  const [dislikesCount, setDislikesCount] = useState([])
  const pollRef = ref(db, '/polls/' + props)
  // const pollRef = ref(db, '/polls/' + auth.props.answerNum)
  const isFocused = useIsFocused();

  useEffect(() => {
      get(pollRef).then(snapshot => {
        setLikesCount(snapshot.val().likes)
        setDislikesCount(snapshot.val().dislikes)
      })

    }, [isFocused])
  let total = likesCount+dislikesCount
  return total
}