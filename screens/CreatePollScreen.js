import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, get, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { COLORS } from '../components/Colors/ColorScheme'
import { MStyles } from '../components/Mason Styles/MStyles'
import { collection, addDoc, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

//Used ideas from
//https://javascript.plainenglish.io/build-a-todo-list-app-using-react-native-526f8fe11ff1


export default function CreatePollScreen() {
    const [inputs, setInputs] = useState([])
    const [pollName, setPollName] = useState('')
    const [pollAnswers, setPollAnswers] = useState([])
    const [username, setUsername] = useState('')
    const [indices, setIndices] = useState(0)
    const [userPolls, setUserPolls] = useState([])
    const [numPolls, setNumPolls] = useState(0)
    const [numOptions, setNumOptions] = useState(0)

    const navigator = useNavigation()

    const auth = getAuth()
    const db = getFirestore();

    const handleUniqueness = async () => {
        const pollExists = doc(collection(db, 'users'), auth.currentUser.uid)
        let exists = false
        const userPollsSnapshot = (await getDoc(pollExists)).data()
        const polls = userPollsSnapshot['polls']
        if (polls != false) {
            polls.forEach(val => {
                if (val == '' + pollName + auth.currentUser.uid) {
                    exists = true
                }
            })  
        }
        if (!exists) {
            finishPoll()
        }
        else {
            alert("You already created a poll with that name!")
        }
        
    }

    const addInput = () => {
        if (numOptions >= 5) {
            alert("Maximum of 5 Options Allowed")
        }
        else {
            setInputs([...inputs, indices])
            setIndices(indices + 1)
            setNumOptions(numOptions + 1)
        }
    }

    const updateText = (text, index) => {
        let pollAnswersCopy = pollAnswers
        pollAnswersCopy[index] = text
        setPollAnswers(pollAnswersCopy)
    }

    const deleteInput = (deleteIndex) => {
        let inputsCopy = [...inputs]
        inputsCopy = inputsCopy.filter((index) => deleteIndex != index)
        setInputs(inputsCopy)

        let pollAnswersCopy = pollAnswers
        pollAnswersCopy[deleteIndex] = null
        setPollAnswers(pollAnswersCopy)
        setNumOptions(numOptions - 1)
    }

    useEffect(() => {
        async function getData() {
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUsername(docSnap.data()["username"])
                let pollArr = []
                let data = docSnap.data()["polls"]
                if (data != false) {
                    data.forEach((a) => {
                        pollArr.push(a)
                    })
                }
                setUserPolls(pollArr)
                setNumPolls(docSnap.data()["numPolls"])
            }

        }
        getData()
    }, [useIsFocused()])

    const finishPoll = async () => {

        for (let i = 0; i < pollName.length; i++) {
            if (pollName.charAt(i) == '.') {
                alert('Poll Title cannot contain \'.\'')
                return
            }
            if (pollName.charAt(i) == '#') {
                alert('Poll Title cannot contain \'#\'')
                return
            }
            if (pollName.charAt(i) == '$') {
                alert('Poll Title cannot contain \'$\'')
                return
            }
            if (pollName.charAt(i) == '[') {
                alert('Poll Title cannot contain \'[\'')
                return
            }
            if (pollName.charAt(i) == ']') {
                alert('Poll Title cannot contain \']\'')
                return
            }
        }

        if (pollName == '') {
            alert('Poll Title is required')
        }
        else if (inputs.length < 2) {
            alert('A minimum of 2 inputs is required')
        }
        else {
            let pollAnswersCopy = pollAnswers.filter(val => val)
            if (pollAnswersCopy.length != numOptions) {
                alert("All Poll Options Must Have Text")
            }
            else {
                let optionsArray = []
                pollAnswersCopy.forEach((answer) => {
                    var obj = {
                        choice: answer,
                        numVotes: 0,
                        votes: []
                    }
                    optionsArray.push(obj)
                })
                let userPollsArr = userPolls
                userPollsArr.push(pollName + auth.currentUser.uid)
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({accuracy: LocationAccuracy.Lowest});
                const pollsRef = await setDoc(doc(db, "polls", pollName + auth.currentUser.uid), {
                    creator: username,
                    uid: auth.currentUser.uid,
                    title: pollName,
                    options: pollAnswersCopy,
                    likes: 0,
                    dislikes: 0,
                    comments: 0,
                    shares: 0,
                    location: location,
                    numVotes: 0,
                    votes: optionsArray,

                })
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, {
                    polls: userPollsArr,
                    numPolls: numPolls + 1

                })
                setInputs([])
                setPollAnswers([])
                setIndices(0)
                setPollName('')
                setNumOptions(0)
                } 
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Background }}>
            <View>
                <Text style={MStyles.pageTitle}>Create Poll</Text>
            </View>
            <View>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Title:</Text>
                </View>
                <TextInput style={MStyles.input} maxLength={45} onChangeText={(text) => setPollName(text)} value={pollName} />
            </View>
            <View>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Options:</Text>
                </View>
                <ScrollView>
                    {inputs.map((index) => {
                        return (
                            <View style={MStyles.option}>
                                <TextInput style={{ color: COLORS.Paragraph, flex: 0.9, paddingLeft: 5 }} maxLength={25} placeholder="Type Here" placeholderTextColor={COLORS.Paragraph} value={pollAnswers[index]} onChangeText={(text) => updateText(text, index)} />
                                <TouchableOpacity style={{ flex: 0.1 }} onPress={() => deleteInput(index)}>
                                    <MaterialCommunityIcons name="window-close" color={COLORS.Paragraph} size={20} />
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
            <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={() => addInput()}>
                <Text style={MStyles.buttonSolidBackgroundText}>Add Option</Text>
            </TouchableHighlight>
            <TouchableHighlight style={MStyles.buttonTranslucentBackground} onPress={() => handleUniqueness()}>
                <Text style={MStyles.buttonTranslucentBackgroundText}>Submit</Text>
            </TouchableHighlight>
        </SafeAreaView >
    )
}
