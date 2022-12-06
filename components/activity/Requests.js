import React from 'react'
import { StyleSheet, Image, View, Modal, Pressable, SafeAreaView, TouchableHighlight, TouchableOpacity, Text, TextInput, ScrollView, Dimensions } from 'react-native'
import { useEffect, useReducer, useState } from 'react';
import { get, getDatabase, onValue, ref, remove, update } from "firebase/database";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth } from 'firebase/auth';
import { NativeScreenNavigationContainer } from 'react-native-screens';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, deleteDoc, deleteField, getFirestore } from "firebase/firestore";
import GestureRecognizer from 'react-native-swipe-gestures';
import Answer from '../home/Answer';
import Timestamp from './Timestamp';
import { COLORS } from '../Colors/ColorScheme';
import { MStyles } from '../Mason Styles/MStyles';






const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Requests(props) {
  const db = getFirestore();
  const auth = getAuth()

  const userRef = doc(db, "users", auth.currentUser.uid)
  const requesterRef = doc(db, "users", props.reqID);

  const [followReqs, setFollowReqs] = useState([])
  const [requesterFollows, setRequesterFollows] = useState([])
  
  const [followerReqs, setFollowerReqs] = useState([])
  const [userFollowers, setUserFollowers] = useState([])
  const [accepted, setAccepted] = useState(false)

    
  const [pfp, setPfp] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    async function getRequesterData() {
        // Get Requester Data
        const reqDocSnap = await getDoc(requesterRef);
        if (reqDocSnap.exists()) {
            setUsername(reqDocSnap.data()['username'])
            setFirstname(reqDocSnap.data()['firstName'])
            setLastname(reqDocSnap.data()['lastName'])
            setPfp(reqDocSnap.data()['profile_picture_url'])
            
            let followReqVal = Object.values(reqDocSnap.data()['followReq'])
                    let tempReq = []
                    followReqVal.forEach(val => {
                        if (val != undefined) {
                            tempReq.push(val)
                        }
                    })
            setFollowReqs(tempReq)
            let reqFollowVals = Object.values(reqDocSnap.data()['following'])
                    let tempReqFol = []
                    reqFollowVals.forEach(val => {
                        if (val != undefined) {
                            tempReqFol.push(val)
                        }
                    })
            setRequesterFollows(tempReqFol)
        }

        // Get User Data
        const userDocSnap = await getDoc(userRef);
        if (userDocSnap.exists()) {
            let followerReqVal = Object.values(userDocSnap.data()['followerReq'])
                    let tempFollowerReq = []
                    followerReqVal.forEach(val => {
                        if (val != undefined) {
                            tempFollowerReq.push(val)
                        }
                    })
            setFollowerReqs(tempFollowerReq)
            let userFollowerVals = Object.values(userDocSnap.data()['followers'])
                    let tempUsrFol = []
                    userFollowerVals.forEach(val => {
                        if (val != undefined) {
                            tempUsrFol.push(val)
                        }
                    })
            setUserFollowers(tempUsrFol)
        }
  }
  getRequesterData()
  }, [props, isFocused])

  const handleAccept = () => {
    async function updateFollower() {
        const userRef = doc(db, "users", auth.currentUser.uid)
        const requesterRef = doc(db, "users", props.reqID);

        const curUser = await getDoc(userRef)
        const curRequester = await getDoc(requesterRef)

        if (curUser.exists()) {
            updateDoc(userRef, {
                [`followers.${props.reqID}`]: props.reqID
            })
            updateDoc(userRef, {
                [`followerReq.${props.reqID}`]: deleteField()
            })
        }
        if (curRequester.exists()) {
            updateDoc(requesterRef, {
                [`following.${auth.currentUser.uid}`]: auth.currentUser.uid
            })
            updateDoc(requesterRef, {
                [`followReq.${auth.currentUser.uid}`]: deleteField()
            })
        }
    }
    updateFollower()
    props.hasInt()
    }
    const handleUnrequest = async () => {
        const userRef = doc(db, "users", auth.currentUser.uid)
        const requesterRef = doc(db, "users", props.reqID);

        const curUser = await getDoc(userRef)
        const curRequester = await getDoc(requesterRef)
        
        if (curUser.exists()) {
            updateDoc(userRef, {
                [`followerReq.${props.reqID}`]: deleteField()
            })
        }
        if (curRequester.exists()) {
            updateDoc(requesterRef, {
                [`followReq.${auth.currentUser.uid}`]: deleteField()
            })
        }
    props.hasInt()
    }

//   if(likes>0){
  return (
    <View style={{
    //   backgroundColor: '#16161a', borderWidth: 3, borderColor: '#7f5af0', borderRadius: 20,
    //   width: 150,
    //   height: "100%",
    //   marginTop: 15,
    //   marginLeft: 15,
    //   marginBottom: 15,
    //   marginRight: 0,
    //   padding: 5,
    //   flex: 1
    }}>
      <View style={{paddingTop:"3.5%"}}>
        {/* <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Background }}> */}
            {/* FLATLIST -- 4 cols */}
            <View style={[styles.layer, { width: windowWidth*.95, flexDirection: 'row', alignItems: 'center', marginLeft:"4%", flex:1}]}>

                <Image style={[styles.image, {alignSelf: 'center'}]} source={{ uri: pfp }} />
                {/* <Text style={{ fontSize: 10, color: "#94a1b2", padding: 10, position: 'absolute', alignSelf: 'flex-start', marginLeft:"3%" }}>Created: <Timestamp time = {time} /></Text> */}
                {/* {title} */}
                <View style={{flex:1, alignItems: 'center', paddingRight:"15%"}}>
                    <Text style={[MStyles.text,{}]}>{username}</Text>
                    <View>
                        <Text style={[MStyles.text, {fontWeight:"200"}]}>{firstname} {lastname}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row',flex:1 , justifyContent:'flex-end'}}>
                    <TouchableHighlight onPress={() => handleAccept()} style={[MStyles.buttonSolidBackground, { marginTop: 0, width: windowWidth * 0.25 }]}>
                            <Text style={[MStyles.buttonSolidBackgroundText]}>Accept</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => handleUnrequest()} style={[MStyles.buttonTranslucentBackground, { marginTop: 0, width: windowWidth * 0.25 }]}>
                            <Text style={[MStyles.buttonTranslucentBackgroundText]}>Decline</Text>
                    </TouchableHighlight>
                </View>
            </View>
        {/* </SafeAreaView> */}
      </View>
              
    </View>
  )
// }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: 22
    
  },
  modalView: {
    margin: 20,
    backgroundColor: "#16161a",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  container: {
    backgroundColor: '#3B3C3B',
    width: windowWidth,
    height: windowHeight,
    paddingTop: 10,
  },
  image: {
    resizeMode: 'cover',
    width: windowHeight * 0.05,
    height: windowHeight * 0.05,
    borderRadius: (windowHeight * 0.05) / 2,
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
    fontSize: 20,
    marginLeft: '5%',
    flex: 1,
  },
  containerBigStats: {
    width: windowWidth * .7,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: windowHeight * .01,
    marginLeft: windowWidth * .045,
    padding: windowHeight * .005,
    paddingTop:"6%"
  },
  optionSet: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: windowWidth * .7,
  },
  optionWindow: {
    width: windowWidth * .7,
    // marginTop: windowHeight * .01,
    // marginLeft: windowWidth * .045,
    // padding: windowHeight * .005,
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignSelf: 'center',
    alignSelf: 'center',
    // flex: 1,
    alignItems: 'center',
    // position: 'absolute',
    
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignSelf: 'center',
    // alignItems: 'center',
    // position: 'absolute',
    // marginTop: windowHeight * .01,
    // marginLeft: windowWidth * .045,
    // padding: windowHeight * .005,
  },
  dislike: {
    marginLeft: windowHeight * .005,
  },
  statsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    
  },
  statsText: {
    color: 'white',
    fontSize: 15
  }
});