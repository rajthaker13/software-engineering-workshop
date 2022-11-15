import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import React, { useEffect, useReducer, useState } from 'react';
import { Database, get, getDatabase, onValue, ref, set, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useIsFocused } from '@react-navigation/native';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function PollStats(props) {
    const db = props.db
    const auth = props.auth
    const pollID = props.id


    const [likes, setLikes] = useState(props.likes)
    const [dislikes, setDislikes] = useState(props.dislikes)
    const [comments, setComments] = useState(props.comments)
    const [shares, setShares] = useState(props.shares)
    const [hasliked, setHasLiked] = useState(false)
    const [hasDisliked, setHasDisliked] = useState(false)
    const isFocused = useIsFocused();
    const pollRef = doc(db, "polls", pollID);


    useEffect(() => {
        async function getPollStats() {
            const docSnap = await getDoc(pollRef);
            if (docSnap.exists()) {
                setLikes(docSnap.data()['likes'])
                setDislikes(docSnap.data()['dislikes'])
                setComments(docSnap.data()['comments'])
                setShares(docSnap.data()['shares'])
            }
            let hasVotedBefore = false
            const curUserRef = doc(db, "users", auth.currentUser.uid)
            const curSnap = await getDoc(curUserRef);
            if (curSnap.exists()) {
                let likesArr = curSnap.data()['pollsLiked']
                let dislikesArr = curSnap.data()['pollsDisliked']
                if (likesArr == null) {
                    updateDoc(curUserRef, {
                        pollsLiked: []
                    })
                    likesArr = []
                }
                if (dislikesArr == null) {
                    updateDoc(curUserRef, {
                        pollsDisliked: []
                    })
                    dislikesArr = []
                }

                likesArr.forEach((like) => {
                    if (like['pid'] == pollID) {
                        hasVotedBefore = true
                        setHasLiked(true)
                    }
                })
                dislikesArr.forEach((dislike) => {
                    if (dislike['pid'] == pollID) {
                        hasVotedBefore = true
                        setHasDisliked(true)
                    }
                })

            }



        }
        getPollStats()


    }, [props, isFocused])

    async function onPress(type) {

        if (!hasliked && !hasDisliked) {
            const curUserRef = doc(db, "users", auth.currentUser.uid)
            const curSnap = await getDoc(curUserRef);
            let likesArr = curSnap.data()['pollsLiked']
            let dislikesArr = curSnap.data()['pollsDisliked']
            let pollAct = []

            if (type == 'like') {
                var newLike = {
                    timestamp: Date.now(),
                    pid: pollID
                }
                likesArr.push(newLike)
                updateDoc(curUserRef, {
                    pollsLiked: likesArr
                })
                let numLikes = 0
                let creatorID = ""
                const docSnap = await getDoc(pollRef);
                if (docSnap.exists()) {
                    pollAct = docSnap.data().activities
                    if (pollAct == "") {
                        let activityArray = []
                        const newActivity = {
                            timestamp: Date.now(),
                            type: "like",
                            from: auth.currentUser.uid
                        }
                        activityArray.push(newActivity)
                        await updateDoc(pollRef, {
                            activities: activityArray
                        })
                    }
                    else {
                        const newActivity = {
                            timestamp: Date.now(),
                            type: "like",
                            from: auth.currentUser.uid
                        }
                        pollAct.push(newActivity)
                        await updateDoc(pollRef, {
                            activities: pollAct
                        })
                    }


                    numLikes = docSnap.data()["likes"] + 1
                    creatorID = docSnap.data()["uid"]
                    await updateDoc(pollRef, {
                        likes: numLikes
                    }).then(async () => {
                        setLikes(numLikes)
                        const userRef = doc(db, "users", creatorID);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            let creatorActivity = userSnap.data()['activity']
                            let newLikesNum = userSnap.data()['likes'] + 1
                            if (creatorActivity == '') {
                                let activityArray = []
                                const newActivity = {
                                    timestamp: Date.now(),
                                    type: "like",
                                    pollID: pollID,
                                    uid: auth.currentUser.uid
                                }
                                activityArray.push(newActivity)
                                await updateDoc(userRef, {
                                    activity: activityArray,
                                    likes: newLikesNum

                                })

                            }
                            else {
                                const newActivity = {
                                    timestamp: Date.now(),
                                    type: "like",
                                    pollID: pollID,
                                    uid: auth.currentUser.uid
                                }
                                let newLikesNum = userSnap.data()['likes'] + 1
                                creatorActivity.push(newActivity)
                                await updateDoc(userRef, {
                                    activity: creatorActivity,
                                    likes: newLikesNum
                                })

                            }

                        }

                    })
                }
                setHasLiked(true)
            }
            else if (type == 'dislike') {
                var newLike = {
                    timestamp: Date.now(),
                    pid: pollID
                }
                dislikesArr.push(newLike)
                updateDoc(curUserRef, {
                    pollsLiked: dislikesArr
                })
                let numDislikes = 0
                let creatorID = ""
                const docSnap = await getDoc(pollRef);
                if (docSnap.exists()) {


                    pollAct = docSnap.data().activities
                    if (pollAct == "") {
                        let activityArray = []
                        const newActivity = {
                            timestamp: Date.now(),
                            type: "dislike",
                            from: auth.currentUser.uid
                        }
                        activityArray.push(newActivity)
                        await updateDoc(pollRef, {
                            activities: activityArray
                        })
                    }
                    else {
                        const newActivity = {
                            timestamp: Date.now(),
                            type: "dislike",
                            from: auth.currentUser.uid
                        }
                        pollAct.push(newActivity)
                        await updateDoc(pollRef, {
                            activities: pollAct
                        })
                    }





                    numDislikes = docSnap.data()["dislikes"] + 1
                    creatorID = docSnap.data()["uid"]
                    await updateDoc(pollRef, {
                        dislikes: numDislikes
                    }).then(async () => {
                        setDislikes(numDislikes)
                        const userRef = doc(db, "users", creatorID);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            let creatorActivity = userSnap.data()['activity']
                            if (creatorActivity == '') {
                                let activityArray = []
                                const newActivity = {
                                    timestamp: Date.now(),
                                    type: "like",
                                    pollID: pollID,
                                    uid: auth.currentUser.uid
                                }
                                let newDislikesNum = userSnap.data()['dislikes'] + 1
                                activityArray.push(newActivity)
                                await updateDoc(userRef, {
                                    activity: activityArray,
                                    dislikes: newDislikesNum
                                })

                            }
                            else {
                                const newActivity = {
                                    timestamp: Date.now(),
                                    type: "dislike",
                                    pollID: pollID,
                                    uid: auth.currentUser.uid
                                }
                                creatorActivity.push(newActivity)
                                let newDislikesNum = userSnap.data()['dislikes'] + 1
                                await updateDoc(userRef, {
                                    activity: creatorActivity,
                                    dislikes: newDislikesNum
                                })

                            }

                        }

                    })
                }
                setHasDisliked(true)
            }
        }


        if (type == "comment") {
            //Add Logic For Comments
        }

        if (type == "share") {
            let numShares = 0
            const docSnap = await getDoc(pollRef);
            if (docSnap.exists()) {
                numShares = docSnap.data()["shares"] + 1
            }
            await updateDoc(pollRef, {
                shares: numShares
            })
            setShares(numShares)
        }

    }



    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => onPress("like")}>
                        <SimpleLineIcons name="like" size={26} color={hasliked ? "green" : "white"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dislike} onPress={() => onPress("dislike")}>
                        <SimpleLineIcons name="dislike" size={26} color={hasDisliked ? "red" : "white"} />
                    </TouchableOpacity>
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
                <TouchableOpacity onPress={() => onPress("comment")}>
                    <Fontisto name="comment" size={26} color="white" />
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{props.comments}</Text>
                </View>
            </View>
            {/* <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity onPress={() => onPress("share")}>
                    <Fontisto name="share-a" size={26} color="white" />
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{shares}</Text>
                </View>

            </View> */}
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth * .9,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: windowHeight * .01,
        marginLeft: windowWidth * .045,
        padding: windowHeight * .005,

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

})
