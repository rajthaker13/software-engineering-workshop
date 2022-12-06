import React from 'react'
import { StyleSheet, View, Modal, ActivityIndicator, Pressable, TouchableHighlight, TouchableOpacity, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useReducer, useState } from 'react';
import { get, getDatabase, onValue, ref, remove, update } from "firebase/database";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import GestureRecognizer from 'react-native-swipe-gestures';
import Answer from '../home/Answer';
import { NativeScreenNavigationContainer } from 'react-native-screens';
// import Answer from '../components/home/Answer';
import Timestamp from '../activity/Timestamp';
import { MStyles } from '../Mason Styles/MStyles';
import { ProgressBar } from 'react-native-paper';





const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function PollModal(props) {
  const db = getFirestore();
  const auth = getAuth()
  
  const userRef = doc(db, "users", auth.currentUser.uid)
  const pollRef = doc(db, "polls", props.pollID);
  // const pollID = pollID
  
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
  const [progress, setProgess] = useState(0.0)
  const [progressString, setProgressString] = useState('')
  
  useEffect(() => {
    async function getPollsData() {
      // setModalVisible(props.setVisibility)

      const docSnap = await getDoc(pollRef);
      if (docSnap.exists()) {
        setComments(docSnap.data()['comments'])
        setShares(docSnap.data()['shares'])
        setDislikes(docSnap.data()['dislikes'])
        setLikes(docSnap.data()['likes'])
        setTitle(docSnap.data()['title'])
        setOptions(docSnap.data()['options'])
        setTime(docSnap.data()['location'].timestamp)
        // }
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
  }, [props, isFocused])

  const progressFn = async (item) => {
    const progressFloat = parseFloat(props.progress)
    setProgess(progressFloat)

    const percent = parseFloat(progressFloat * 100).toFixed(2)

    setProgressString(percent + '%')
  }
  
  return (
    <View style={{
      // backgroundColor: '#16161a', borderWidth: 3, borderColor: '#7f5af0', borderRadius: 20,
      // width: 150,
      // height: "100%",
      // marginTop: 15,
      // marginLeft: 15,
      // marginBottom: 15,
      // marginRight: 0,
      // padding: 5,
      // flex: 1
    }}>
      <GestureRecognizer
        style={{flex: 1}}
        onSwipeDown={ () => setModalVisible(!modalVisible) }
        onSwipeLeft={ () => setModalVisible(!modalVisible) }
        onSwipeRight={ () => setModalVisible(!modalVisible) }
      >
      <Modal
        // presentationStyle="formSheet"
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
                backgroundColor: '#16161a', borderWidth: 3, borderColor: '#7f5af0', borderRadius: 20,
                width: windowWidth * .7,
                height: windowHeight * .125,
                marginTop: windowHeight * .03,
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
                    <Text style={styles.statsText}>{comments.length}</Text>
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
                <View style={[styles.optionWindow, {color: '#7f5af0'}]}>
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
                      
                            <View style={[{width: windowWidth * .7, justifyContent:"center", backgroundColor: '#7f5af0'}, styles.progContainer]}>
                              <Text style={{width: windowWidth * .7, textAlign:"center", color: '#7f5af0'}}>{option}</Text>
                              {/* <Button title={props.title} onPress={() => { props.onVote(props.title) }}></Button> */}
                            </View>
                          
                      </View>
                      // <View>
                      //               <ActivityIndicator  color="black" /> 

                      //   {/* {console.log(onVote)} */}
                      //     {/* <Answer title={option} key={option} id={props.pollID} optionBtnWidth={.7}  progress={progress} optionProgWidth={.7} hasVoted={hasVoted} totalVotes={totalVotes} numVotes={numVotes} /> */}
                      //     {!hasVoted && 
                      //       <View style={[{width: windowWidth * .7}, styles.progContainer]}>
                      //         <Text>{option}</Text>
                      //         {/* <Button title={props.title} onPress={() => { props.onVote(props.title) }}></Button> */}
                      //       </View>
                      //     }
                      //     {/*  */}
                      //     {hasVoted &&
                      //         <View style={{width: windowWidth * .7}}>
                      //             <View style={[{width: windowWidth * .7}, styles.containerDisabled]}>
                      //                 {/* <Button title={props.title + ' ' + progressString} disabled={true} ></Button> */}
                      //                 <Text>{option} {progressString}</Text>
                      //             </View>
                      //             <View style={{width: windowWidth * .7}}>
                      //               <ProgressBar style={[{width: windowWidth * .7},styles.progressBar]} progress={progress}></ProgressBar>
                      //             </View>
                      //         </View>

                      //     }
                          
                      // </View>
                  )
                    // return (
                    //     <Answer title={option} key={option} id={props.pollID} optionBtnWidth={.7}/>
                    //     // <Answer title={option} key={option} id={poll.key} onVote={onVote} hasVoted={hasVoted} totalVotes={totalVotes} numVotes={numVotes} progress={progress} />
                    //     // <Answer title={option} key={option} id={poll.key} onVote={onVote} hasVoted={hasVoted} totalVotes={totalVotes} numVotes={numVotes} progress={progress} />
                    // )
                  })}
                </View>
              </View>
            </Text>
          </View>
        </View>
      </Modal>
      </GestureRecognizer>
      <Pressable
        // onPress={() => props.navPoll.navigate("HomeScreen", {pid: props.pollID})}
        // onLongPress={() => setModalVisible(true)}
        >
          <View>
          <Text style={{ fontSize: 10, color: "#94a1b2", paddingLeft:"7.5%", marginTop:props.MT  }}><Timestamp time = {time} /></Text>
          <Text style={[MStyles.text, { alignSelf: 'center', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop:"10%"}]} onPress={() => props.navPoll.navigate("HomeScreen", {pid: props.pollID})}
        onLongPress={() => setModalVisible(true)}>{title}</Text>
          {/* <Text  style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{title}</Text> */}

          </View>
        {/* <Text style={{ fontSize: 10, color: "#94a1b2", paddingLeft:"5%", paddingTop:"1%"  }}>{props.time}</Text>
        // <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{title}</Text> */}
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  },
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
  progContainer: {
    backgroundColor: '#D9D9D9',
    borderColor: '#010101',
    borderRadius: windowHeight * .05,
    // width: windowWidth * props.width,
    height: windowHeight * .045,
    marginTop: windowHeight * .005,
    marginLeft: windowWidth * .05,
    marginBottom: windowHeight * .005,
    justifyContent: 'center',
},
containerDisabled: {
  backgroundColor: '#3B3C3B',
  borderColor: '#010101',
  borderRadius: windowHeight * .05,
  // width: windowWidth * .9,
  height: windowHeight * .04,
  marginTop: windowHeight * .005,
  marginLeft: windowWidth * .05,
  marginBottom: windowHeight * .005,
  justifyContent: 'center',
},
progressBar: {
  backgroundColor: 'white',
  borderColor: '#010101',
  borderRadius: windowHeight * .05,
  // width: windowWidth * .9,
  height: windowHeight * .01,
  marginLeft: windowWidth * .05,
  justifyContent: 'center',
  marginTop: windowHeight * .005
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