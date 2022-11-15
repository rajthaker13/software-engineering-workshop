import React from 'react'
import { StyleSheet, View, Modal, Pressable, TouchableHighlight, TouchableOpacity, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useReducer, useState } from 'react';
import { get, getDatabase, onValue, ref, remove, update } from "firebase/database";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import GestureRecognizer from 'react-native-swipe-gestures';
import Answer from '../home/Answer';
import Timestamp from './Timestamp';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Dislikes(props) {
  const db = getFirestore();
  const auth = getAuth()

  const userRef = doc(db, "users", auth.currentUser.uid)
  const pollRef = doc(db, "polls", props.pollID);
  
  
  const [pollsArray, setPollsArray] = useState([])
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [likes, setLikes] = useState('');
  const [shares, setShares] = useState('');
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);
  const [time, setTime] = useState('');
  const [hasVoted, setHasVoted] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)
  const [voteCounts, setVoteCounts] = useState([])

  useEffect(() => {
    async function getPollsData() {
      const docSnap = await getDoc(pollRef);
      if (docSnap.exists()) {
        setComments(docSnap.data()['comments'])
        setShares(docSnap.data()['shares'])
        setDislikes(docSnap.data()['dislikes'])
        setLikes(docSnap.data()['likes'])
        setTitle(docSnap.data()['title'])
        setOptions(docSnap.data()['options'])
        setTime(docSnap.data()['location'].timestamp)
      }
      const docSnapUser = await getDoc(userRef);
      if (docSnapUser.exists()) {
          let userVotes = docSnapUser.data()['votes']
          if (userVotes == null) {
              userVotes = []
              updateDoc(userRef, {
                  votes: userVotes,
              })
          }
          else {
              userVotes.forEach(async (vote) => {
                  if (vote['pid'] == props.pollID) {
                      const pollSnap = await getDoc(pollRef);
                      if (pollSnap.exists()) {
                          let curVotesOptionsAll = pollSnap.data()['votes']
                          const curVotes = pollSnap.data()['numVotes']
                          let voteCountsUpdate = []

                          curVotesOptionsAll.forEach((choice) => {
                              const numVotes = choice['numVotes']
                              var optionVoteCount = {
                                  choice: choice['choice'],
                                  numVotes: numVotes
                              }
                              voteCountsUpdate.push(optionVoteCount)


                          })
                          setHasVoted(true)
                          setTotalVotes(curVotes)
                          setVoteCounts(voteCountsUpdate)


                      }

                  }

              })
          }

      }


    }
    getPollsData()
  }, [props])

  async function onVote(option) {
    const docSnap = await getDoc(pollRef);
    if (docSnap.exists()) {
        let curVotesOption = docSnap.data()['votes'].filter(choice => {
            return choice['choice'] != option
        })
        let curVotesOptionsAll = docSnap.data()['votes']
        const curVotes = docSnap.data()['numVotes'] + 1
        let voteCountsUpdate = []
        curVotesOptionsAll.forEach((choice) => {
            let numVotes = 0
            if (option == choice['choice']) {
                numVotes = choice['numVotes'] + 1
                let votesArray = choice['votes']

                var newVote = {
                    timestamp: Date.now(),
                    uid: auth.currentUser.uid

                }
                votesArray.push(newVote)

                var newVote = {
                    choice: option,
                    numVotes: numVotes,
                    votes: votesArray

                }

                curVotesOption.push(newVote)


                updateDoc(pollRef, {
                    votes: curVotesOption,
                    numVotes: curVotes
                })

            }
            else {
                numVotes = choice['numVotes']

            }
            var optionVoteCount = {
                choice: choice['choice'],
                numVotes: numVotes
            }
            voteCountsUpdate.push(optionVoteCount)
        })

        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
            let userVotes = userSnap.data()['votes']
            var userVote = {
                pid: props.pollID,
                timestamp: Date.now(),
                choice: option
            }
            userVotes.push(userVote)
            updateDoc(userRef, {
                votes: userVotes,
            })
          }
          setHasVoted(true)
          setTotalVotes(curVotes)
          setVoteCounts(voteCountsUpdate)
  
      }
  
  
  
  }


  if(dislikes>0){
  return (
    <View style={{
      backgroundColor: '#16161a', borderWidth: 3, borderColor: '#7f5af0', borderRadius: 20,
      width: 150,
      height: "100%",
      marginTop: 15,
      marginLeft: 15,
      marginBottom: 15,
      marginRight: 0,
      padding: 5,
      flex: 1
    }}>
      <GestureRecognizer
        style={{flex: 1}}
        onSwipeDown={ () => setModalVisible(!modalVisible) }
        onSwipeLeft={ () => setModalVisible(!modalVisible) }
        onSwipeRight={ () => setModalVisible(!modalVisible) }
      >
      <Modal
        animationType="fade"
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <MaterialCommunityIcons name="close-circle" color='#94a1b2' size={15} />
            </Pressable>
            <Text style={{ fontSize: 10, color: "#94a1b2", padding: 10, position: 'absolute', alignSelf: 'flex-start', marginLeft:"3%" }}>Created: <Timestamp time = {time} /></Text>
            <Text style={{ fontSize: 100 }}>

              {/* {title} */}
              <View style={{
                backgroundColor: '#16161a', 
                borderWidth: 3, 
                borderColor: '#7f5af0', 
                marginTop: windowHeight * .03, 
                borderRadius: 20,
                width: windowWidth * .7,
                height: windowHeight * .125,
                marginLeft: windowWidth * .05,
                padding: windowHeight * .005,
              }}>
                <Text style={{ fontSize: 40, marginTop: '5%', fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{title}</Text>
              </View>
              <View style={styles.containerBigStats}>
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <SimpleLineIcons name="like" size={26} color="white" />
                    <SimpleLineIcons name="dislike" size={26} color="white" />
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
                  <Fontisto name="comment" size={26} color="white" />
                  <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{comments}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <Fontisto name="share-a" size={26} color="white" />
                  <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{shares}</Text>
                  </View>
                </View>
              </View >
              <View style={styles.optionSet}>
                <View style={styles.optionWindow}>
                  {options.map((option) => {
                    const choiceObject = voteCounts.find((choice) => {
                      return choice.choice == option
                  })
                  let numVotes = 0
                  let progress = 0
                  if (choiceObject != undefined) {
                      numVotes = choiceObject.numVotes
  
                      progress = (numVotes / totalVotes)
                  }
                    return (
                      <View>
                        <Answer title={option} key={option} id={props.pollID} onVote={onVote} optionBtnWidth={.7}  progress={progress} optionProgWidth={.7} hasVoted={hasVoted} totalVotes={totalVotes} numVotes={numVotes} />
                      </View>
                    )
                  })}
                </View>
              </View>
            </Text>
          </View>
        </View>
      </Modal>
      </GestureRecognizer>
      <Pressable
        onPress={() => setModalVisible(true)}
        >
        <Text style={{ fontSize: 10, color: "#94a1b2", paddingLeft:"5%", paddingTop:"1%"  }}>{props.time}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{title}</Text>
      </Pressable>
    </View>
  )
}
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
    // width: .7,
    // flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: windowWidth * .7,
    // marginTop: windowHeight * .01,
    // marginLeft: windowWidth * .045,
    // padding: windowHeight * .005,
    // // flexDirection: 'row',
    // // justifyContent: 'space-evenly',
    // // alignSelf: 'center',
    // alignSelf: 'center',
    // // flex: 1,
    // alignItems: 'center',
    // position: 'absolute',
    // marginTop: windowHeight * .01,
    // marginLeft: windowWidth * .045,
    // padding: windowHeight * .005,
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
    justifyContent: 'space-evenly'
  },
  statsText: {
    color: 'white',
    fontSize: 15
  }
});