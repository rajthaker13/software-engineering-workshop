import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-native-paper';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




export default function Answer(props) {

    const auth = getAuth()
    const db = getFirestore();

    const [pollID, setPollID] = useState('')
    const [hasVoted, setHasVoted] = useState('')
    const [totalVotes, setTotalVotes] = useState(0)
    const [numVotes, setNumVotes] = useState(0)
    const [progress, setProgess] = useState(0.0)
    const [progressString, setProgressString] = useState('')



    useEffect(() => {
        setPollID(props.id)
        setHasVoted(props.hasVoted)
        setTotalVotes(props.totalVotes)
        setNumVotes(props.numVotes)
        const progressFloat = parseFloat(props.progress)
        setProgess(progressFloat)

        const percent = parseFloat(progressFloat * 100).toFixed(2)

        setProgressString(percent + '%')


    }, [props])



    return (
        <View>
            {!hasVoted && <View style={styles.container}>
                <Button title={props.title} onPress={() => { props.onVote(props.title) }}></Button>
            </View>
            }
            {hasVoted &&
                <View>
                    <View style={styles.containerDisabled}>
                        <Button title={props.title + ' ' + progressString} disabled={true} ></Button>
                    </View>
                    <ProgressBar style={styles.progressBar} progress={progress}>
                    </ProgressBar>

                </View>

            }
        </View>


    )
}

const styles = StyleSheet.create({
    container: {
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
        width: windowWidth * .9,
        height: windowHeight * .044,
        marginTop: windowHeight * .005,
        marginLeft: windowWidth * .05,
        marginBottom: windowHeight * .005,
        justifyContent: 'center',
    },
    progressBar: {
        backgroundColor: '#010101',
        borderColor: '#010101',
        borderRadius: windowHeight * .05,
        width: windowWidth * .9,
        height: windowHeight * .01,
        marginLeft: windowWidth * .05,
        justifyContent: 'center',
    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        // fontFamily: "Federo",
        fontSize: 20,
        marginLeft: '5%'

    }

})
