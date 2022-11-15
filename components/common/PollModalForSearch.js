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
// import Answer from '../components/home/Answer';
import Timestamp from '../activity/Timestamp';
import { MStyles } from '../Mason Styles/MStyles';




const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function PollModal(props) {
  const db = getFirestore();
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
  
  useEffect(() => {
    async function getPollsData() {

      // setModalVisible(props.setVisibility)
      const pollRef = doc(db, "polls", props.pollID);
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
    }
    getPollsData()
  }, [isFocused])

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
        animationType="fade"
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(modalVisible);
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
                    return (
                        <Answer title={option} key={option} id={props.pollID} optionBtnWidth={.7}/>
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
          <View>
          <Text style={[MStyles.text]}>{title}</Text>
          {/* <Text  style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{title}</Text> */}

          </View>
        {/* <Text style={{ fontSize: 10, color: "#94a1b2", paddingLeft:"5%", paddingTop:"1%"  }}>{props.time}</Text>
        // <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{title}</Text> */}
      </Pressable>
    </View>
  )
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