import React from 'react'
import { StyleSheet, View, Modal, Pressable, TouchableOpacity, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useReducer, useState } from 'react';
import { get, getDatabase, onValue, ref, remove, update } from "firebase/database";
// import { getAuth } from 'firebase/auth';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Likes(props) {
  const db = getFirestore();
  const [pollsArray, setPollsArray] = useState([])


  // const auth = getAuth()
  // const refPolls = ref(db, '/polls/' + props.pollID)
  // const [pollInfo, setPollInfo] = useState([])
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  // const auth = getAuth()


/*
comments
creator
dislikes
likes
options[]
shares
title
*/

  const [comments, setComments] = useState('');
  // const [creator, setCreator] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [likes, setLikes] = useState('');
  // const [options, setOptions] = useState([]);
  const [shares, setShares] = useState('');
  const [title, setTitle] = useState('');

  // // const refPolls = ref(db, '/polls/' + props.pollID)
  // const refComments = ref(db, "/polls/" + props.pollID + "/comments")
  // const refCreator = ref(db, "/polls/" + props.pollID + "/creator")
  // const refDislikes = ref(db, "/polls/" + props.pollID + "/dislikes")
  // const refLikes = ref(db, "/polls/" + props.pollID + "/likes")
  // // const refOptions = ref(db, "/polls/" + props.pollID + "/options")
  // const refShares = ref(db, "/polls/" + props.pollID + "/shares")
  // const refTitle = ref(db, "/polls/" + props.pollID + "/title")


  useEffect(() => {
    // get(refComments).then(snapshot => {
    //   setComments(snapshot.val())
    // })
    // get(refCreator).then(snapshot => {
    //   setCreator(snapshot.val())
    // })
    // get(refDislikes).then(snapshot => {
    //   setDislikes(snapshot.val())
    // })
    // get(refLikes).then(snapshot => {
    //   setLikes(snapshot.val())
    // })
    // // get(refOptions).then(snapshot => {
    // //   setOptions(snapshot.val())
    // // })
    // get(refShares).then(snapshot => {
    //   setShares(snapshot.val())
    // })
    // get(refTitle).then(snapshot => {
    //   setTitle(snapshot.val())
    // })

    
    async function getPollsData() {
      
      const pollRef = doc(db, "polls", props.pollID);
      const docSnap = await getDoc(pollRef);
      // if (docSnap.exists()) {
        
        
        
        
        
        
        setComments(docSnap.data()['comments'])
        setShares(docSnap.data()['shares'])
        setDislikes(docSnap.data()['dislikes'])
        setLikes(docSnap.data()['likes'])
        // setOptions(docSnap.data()['options'])
        setTitle(docSnap.data()['title'])
      // }
      
      // let arr = []
      // const pollsSnapshot = await getDocs(collection(db, "polls", props.pollID));
      // pollsSnapshot.forEach((doc) => {
      //     var item = doc.data()
      //     item.key = doc.id
      //     arr.push(item)

      // })
      // setPollsArray(arr)

    }
    getPollsData()





    // get(refDislikes).then(snapshot => {
    //   setDislikes(snapshot.val())
    // })
    // get(refDislikes).then(snapshot => {
    //   setDislikes(snapshot.val())
    // })


    // let arr = []
    // get(refPolls).then(snapshot => {
    //   snapshot.forEach((snap) => {
    //     var item = snap.val()
    //     item.key = snap.key
    //     arr.push(item)
        
    //   })
    //   setPollInfo(arr)
    // })
  }, [isFocused])
    return (
        <View style={{
            backgroundColor: '#D9D9D9', borderWidth: 10, borderColor: '#010101', borderRadius: 20,
            width: 150,
            height: "100%",
            marginTop: 15,
            marginLeft: 15,
            marginBottom: 15,
            marginRight: 0,
            padding: 5,
            flex: 1
        }}>
          
            <Modal
                animationType="slide"
                transparent={true}
                // presentationStyle="fullScreen" 
                // presentationStyle="overFullScreen" 
                // presentationStyle="pageSheet" 
                visible={modalVisible}
                // screenOptions={{ presentation: 'transparentModal' }}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    
                    {/* <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}>{props.answerNum} answers</Text> */}
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                      {/* <Text style={{ color: '#fffffe' }}>x</Text> */}
                        <MaterialCommunityIcons name="close-circle" color='#94a1b2' size={15}/>
                    </Pressable>
                        <Text style={{ fontSize: 100 }}>
                          
                          {title}
                          <View style={{
                              backgroundColor: '#16161a', borderWidth: 3, borderColor: '#7f5af0', borderRadius: 20,
                              width: windowWidth * .7,
                              height: windowHeight * .2,
                              marginTop: windowHeight * .03,
                              marginLeft: windowWidth * .05,
                              padding: windowHeight * .005,
                          }}>
                              <Text style={{ fontSize: 40, marginTop: '5%', fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{title}</Text>
                          </View>
                          <View style={styles.containerBigStats}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {/* <TouchableOpacity onPress={() => onPress("like")}> */}
                                        <SimpleLineIcons name="like" size={26} color="white" />
                                    {/* </TouchableOpacity> */}
                                    {/* <TouchableOpacity style={styles.dislike} onPress={() => onPress("dislike")}> */}
                                        <SimpleLineIcons name="dislike" size={26} color="white" />
                                    {/* </TouchableOpacity> */}
                                </View >
                                <View style={styles.statsContainer}>
                                    <Text style={styles.statsText}>{likes}</Text>
                                    <Feather name="arrow-up" size={26} color="green" />
                                </View>
                                <View style={styles.statsContainer}>
                                    <Text style={styles.statsText}>{dislikes}</Text>
                                    <Feather name="arrow-down" size={26} color="red" />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                {/* <TouchableOpacity onPress={() => onPress("comment")}> */}
                                    <Fontisto name="comment" size={26} color="white" />
                                {/* </TouchableOpacity> */}
                                <View style={styles.statsContainer}>
                                    <Text style={styles.statsText}>{comments}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                {/* <TouchableOpacity onPress={() => onPress("share")}> */}
                                    <Fontisto name="share-a" size={26} color="white" />
                                {/* </TouchableOpacity> */}
                                <View style={styles.statsContainer}>
                                    <Text style={styles.statsText}>{shares}</Text>
                                </View>

                            </View>
                        </View >
                          {/* {props.likes}
                          {props.dislikes}
                          {props.comments}
                          {props.shares} */}
                          {/* {props.options} */}
                        </Text>
                
                </View></View>
            </Modal>
            <Pressable
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ fontSize: 10 }}>{title}</Text>
                {/* <Text style={{ fontSize: 10 }}>{props.time}</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>{props.title}</Text> */}
            </Pressable>
        </View>
    )}
const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "#16161a",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      // width: "80%",
      // height: "60%",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      // backgroundColor: "#7f5af0",
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

  },
  containerBigStats: {
    width: windowWidth * .9,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: windowHeight * .01,
    marginLeft: windowWidth * .045,
    padding: windowHeight * .005,

},
dislike: {
    marginLeft: windowHeight * .005,
},
statsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
},
statsText: {
    color: 'white',
    fontSize: 15
}
  });