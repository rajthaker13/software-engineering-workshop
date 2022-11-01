import { useEffect, useState } from 'react';
import { Button, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, get, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { COLORS } from '../components/Colors/ColorScheme'
import {MStyles} from '../components/Mason Styles/MStyles'

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

    const navigator = useNavigation()
    const auth = getAuth()

    const addInput = () => {
        setInputs([...inputs, indices])
        setIndices(indices + 1)
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
    }

    const db = getDatabase();
    const refUsername = ref(db, '/users/' + auth.currentUser.uid + '/username')
    const userPollsRef = ref(db, 'users/' + auth.currentUser.uid + '/polls')
    const numPollsRef = ref(db, 'users/' + auth.currentUser.uid + '/numPolls')
    const userRef = ref(db, '/users/' + auth.currentUser.uid)

    useEffect(() => {
        get(refUsername).then(snapshot => {
            setUsername(snapshot.val())
        })
        get(userPollsRef).then(snapshot => {
            let pollArr = []
            let data = snapshot.val()
            
            data.forEach((a) => {
                pollArr.push(a)
            })

            setUserPolls(pollArr)
            })
        get(numPollsRef).then(snapshot => {
            setNumPolls(snapshot.val())
        })
    }, [useIsFocused()])

    const finishPoll = () => {

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
        else if (inputs.length > 5) {
            alert('A maximum of 5 inputs is allowed')
        }
        else if (inputs.length < 2) {
            alert('A minimum of 2 inputs is required')
        }
        else {
            const pollsRef = ref(db, 'polls/' + pollName + auth.currentUser.uid)
            let userPollsArr = userPolls
            userPollsArr.push(pollName + auth.currentUser.uid)
            set(pollsRef, {
                creator: username,
                uid: auth.currentUser.uid,
                title: pollName,
                options: pollAnswers,
                likes: 0,
                dislikes: 0,
                comments: 0,
                shares: 0
            })
            update(userRef, {
                polls: userPollsArr,
                numPolls: numPolls + 1
            })
                .then(() => {
                    setInputs([])
                    setPollAnswers([])
                    setIndices(0)
                    setPollName('')
                })
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.Background}}>
            <View>
                <Text style={MStyles.pageTitle}>Create Poll</Text>
            </View>
            <View>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Title:</Text>
                </View>
                <TextInput style={MStyles.input} onChangeText={(text) => setPollName(text)} value={pollName}/>
            </View>
            <View>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Options:</Text>
                </View>
                <ScrollView>
                    {inputs.map((index) => {                            
                        return (
                            <View style={MStyles.option}>
                                <TextInput style={{color: COLORS.Headline, flex: 0.9, paddingLeft: 5}} defaultValue='Type Here' value={pollAnswers[index]} onChangeText={(text) => updateText(text, index)} />
                                <TouchableOpacity style={{flex: 0.1}} onPress={() => deleteInput(index)}>
                                    <MaterialCommunityIcons name="close-circle" color={COLORS.Paragraph} size={15}/>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
            <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={() => addInput()}>
                <Text style={MStyles.buttonSolidBackgroundText}>Add Option</Text>
            </TouchableHighlight>
            <TouchableHighlight style={MStyles.buttonTranslucentBackground} onPress={() => finishPoll()}>
                <Text style={MStyles.buttonTranslucentBackgroundText}>Submit</Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}
