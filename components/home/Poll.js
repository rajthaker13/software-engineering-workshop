import { View, Text, Dimensions, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Database, get, getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from 'firebase/auth';
import Header from '../common/Header';
import Question from './Question';
import Answer from './Answer';
import PollStats from './PollStats';
import ViewPager from 'react-native-pager-view';
import { useIsFocused } from '@react-navigation/native';
import PollBanner from './PollBanner';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";




const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default function Poll(props) {

    const pollID = props.pollID
    const poll = props.poll
    const db = props.db
    const auth = props.auth
    const navigation = props.navigation
    const route = props.route


    const userRef = doc(db, "users", auth.currentUser.uid)
    const pollRef = doc(db, "polls", pollID);
    const [hasVoted, setHasVoted] = useState(false)
    const [totalVotes, setTotalVotes] = useState(0)
    const [voteCounts, setVoteCounts] = useState([])


    useEffect(() => {
        async function getVotingData() {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                let userVotes = docSnap.data()['votes']
                if (userVotes == null) {
                    userVotes = []
                    updateDoc(userRef, {
                        votes: userVotes,
                    })
                }
                else {
                    userVotes.forEach(async (vote) => {
                        if (vote['pid'] == pollID) {
                            const pollSnap = await getDoc(pollRef);
                            if (pollSnap.exists()) {
                                let curVotesOptionsAll = pollSnap.data()['votes']
                                const curVotes = pollSnap.data()['numVotes']
                                let voteCountsUpdate = []

                                curVotesOptionsAll.forEach((choice) => {
                                    console.log(choice['numVotes'] + "HEY")
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
        getVotingData()

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
                    pid: pollID,
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
            console.log("cur" + curVotes)

        }



    }



    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.tabsContainer}>
                <TouchableOpacity>
                    <Text>Following</Text>
                </TouchableOpacity>
                <Text style={{
                    color: '#fff',
                    fontSize: 15,
                    opacity: 0.2,
                }}>|</Text>
                <TouchableOpacity>
                    <Text>For You</Text>
                </TouchableOpacity>
            </View>
            <PollBanner uid={poll.uid} db={db} auth={auth} navigation={navigation} route={route} />
            <Question title={poll.title} />
            <PollStats id={poll.key} likes={poll.likes} dislikes={poll.dislikes} comments={poll.comments} shares={poll.shares} db={db} auth={auth} />
            {poll.options.map((option) => {
                const choiceObject = voteCounts.find((choice) => {
                    return choice.choice == option
                })
                let numVotes = 0
                let progress = 0
                if (choiceObject != undefined) {
                    numVotes = choiceObject.numVotes
                    console.log("Total: " + totalVotes)
                    console.log(option + ":" + numVotes)
                    progress = (numVotes / totalVotes)
                }
                return (
                    <View>
                        <Answer title={option} key={option} id={poll.key} onVote={onVote} hasVoted={hasVoted} totalVotes={totalVotes} numVotes={numVotes} progress={progress} />
                    </View>
                )
            })}
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#16161a',
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
        paddingTop: "6%"
    },
    optionSet: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: windowWidth * .7,
    },
    optionWindow: {
        width: windowWidth * .7,
        alignSelf: 'center',
        alignItems: 'center',
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

})
