import { useEffect, useState } from 'react';
import { Button, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, get, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

//Used ideas from
//https://javascript.plainenglish.io/build-a-todo-list-app-using-react-native-526f8fe11ff1


export default function CreatePollScreen() {
    const [inputs, setInputs] = useState([])
    const [pollName, setPollName] = useState('')
    const [pollAnswers, setPollAnswers] = useState([])
    const [username, setUsername] = useState('')
    const [indices, setIndices] = useState(0)
    const [userPolls, setUserPolls] = useState([''])
    const [numPolls, setNumPolls] = useState(0)

    const navigator = useNavigation()
    const auth = getAuth()

    const addInput = () => {
        setInputs([...inputs,
        {
            input: <View style={{ flexDirection: 'row' }}>
                <TextInput defaultValue='Type Here' onChangeText={(text) => updateText(text, indices)} />
                <TouchableOpacity onPress={() => deleteInput(indices)}>
                    <MaterialCommunityIcons name="close-circle" color='red' />
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
    const userRef = ref(db, 'users/' + auth.currentUser.uid)

    useEffect(() => {
        get(refUsername).then(snapshot => {
            setUsername(snapshot.val())
        })
        get(userRef).then(snapshot => {
            let pollArr = []
            let data = snapshot.val().polls
            
            data.forEach((a) => {
                pollArr.push(a)
            })

            setUserPolls(pollArr)
            setNumPolls(snapshot.val().numPolls)
            })
    })

    const finishPoll = () => {
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
        <SafeAreaView>
            <View>
                <Text>Create Poll</Text>
            </View>
            <View>
                <Text>Title:</Text>
                <TextInput onChangeText={(text) => setPollName(text)} value={pollName}/>
            </View>
            <View>
                <Text>Options:</Text>
                <ScrollView>
                    {inputs.map((input, index) => {
                        return (
                            input.input
                        )
                    })}
                </ScrollView>
            </View>
            <TouchableHighlight>
                <Button title="Add Option" onPress={addInput} />
            </TouchableHighlight>
            <TouchableHighlight>
                <Button title="Submit" onPress={finishPoll} />
            </TouchableHighlight>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({

});
