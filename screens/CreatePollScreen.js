import { useEffect, useState } from 'react';
import { Button, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, get, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

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
        setInputs([...inputs,
        {
            input: <View style={styles.option}>
                <TextInput style={{color: 'white', flex: 0.9, paddingLeft: 5}} defaultValue='Type Here' onChangeText={(text) => updateText(text, indices)} />
                <TouchableOpacity style={{flex: 0.1}} onPress={() => deleteInput(indices)}>
                    <MaterialCommunityIcons name="close-circle" color='red' size={15}/>
                </TouchableOpacity>
            </View>, index: indices
        }
        ])
        setIndices(indices + 1)
    }

    const updateText = (text, indices) => {
        pollAnswers[indices] = text
    }

    const deleteInput = (deleteIndex) => {
        setInputs(inputs.filter((value, index) => value.index !== deleteIndex))
        setIndices(indices - 1)
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
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <View>
                <Text style={styles.pageTitle}>Create Poll</Text>
            </View>
            <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Title:</Text>
                </View>
                <TextInput style={styles.input} onChangeText={(text) => setPollName(text)} value={pollName}/>
            </View>
            <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Options:</Text>
                </View>
                <ScrollView>
                    {inputs.map((input, index) => {
                        return (
                            input.input
                        )
                    })}
                </ScrollView>
            </View>
            <TouchableHighlight style={[styles.button, {borderColor: '#e91e63'}]} onPress={addInput}>
                <Text style={{color: '#e91e63', fontWeight: '700', fontSize: 16}}>Add Option</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.button, {backgroundColor: '#e91e63'}]} onPress={finishPoll}>
                <Text style={{color: 'black', fontWeight: '700', fontSize: 16}}>Submit</Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    option: {
        height: SCREEN_HEIGHT * 0.05,
        width: SCREEN_WIDTH * 0.75,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: 'white',
        borderWidth: 2,
        color:'white',
        marginBottom: 5,
        borderRadius: 10
    },
    header: {
        width: SCREEN_WIDTH * 0.75,
        alignSelf: 'center',
        fontSize: 16,
        color:'white',
    },
    headerContainer: {
        height: SCREEN_HEIGHT * 0.05,
        justifyContent: 'center'
    },
    button: {
        height: SCREEN_HEIGHT * 0.05,
        width: SCREEN_WIDTH * 0.75,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 3
    },
    pageTitle: {
        height: SCREEN_HEIGHT * 0.05,
        alignSelf: 'center',
        fontSize: 24,
        color:'white'
    },
    input: {
        width: SCREEN_WIDTH * 0.75,
        height: SCREEN_HEIGHT * 0.03,
        borderColor: 'white',
        borderWidth: 2,
        alignSelf: 'center',
        color:'white',
        borderRadius: 10,
        paddingLeft: 5
    }
});
