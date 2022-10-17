import { useState } from 'react';
import { Button, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

//Used ideas from
//https://javascript.plainenglish.io/build-a-todo-list-app-using-react-native-526f8fe11ff1


export default function CreatePollScreen() {
    const[inputs, setInputs] = useState([])
    const[pollName, setPollName] = useState('')
    const[pollAnswers, setPollAnswers] = useState([])
    const [username, setUsername] = useState('')
    const[indices, setIndices] = useState(0)

    const navigator = useNavigation()
    const auth = getAuth()

    const addInput = () => {
        setInputs([...inputs, 
            {input: <View style={{flexDirection: 'row'}}>
                <TextInput defaultValue='Type Here' onChangeText={(text) => updateText(text, indices)}/>
                <TouchableOpacity onPress={() => deleteInput(indices)}>
                    <MaterialCommunityIcons name="close-circle" color='red' />
                </TouchableOpacity>
            </View>, index: indices} 
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
            const db = getDatabase();
            const reference = ref(db, 'polls/' + pollName + auth.currentUser.uid)
            const refUsername = ref(db, '/users/' + auth.currentUser.uid + '/username')

            get(refUsername).then(snapshot => {
                setUsername(snapshot.val())
            })
            
            set(reference, {
                creator: username,
                title: pollName,
                options: pollAnswers,
            })
            .then(() => {
                setInputs([])
                setPollAnswers([])
                setIndices(0)
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
                <TextInput onChangeText={(text) => setPollName(text)}/>
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
                <Button title="Add Option" onPress={addInput}/>
            </TouchableHighlight>
            <TouchableHighlight>
                <Button title="Submit" onPress={finishPoll}/>
            </TouchableHighlight>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    
});
