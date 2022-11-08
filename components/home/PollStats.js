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
    const isFocused = useIsFocused();
    const pollRef = doc(db, "polls", pollID);


    useEffect(async () => {
        const docSnap = await getDoc(pollRef);
        if (docSnap.exists()) {
            setLikes(docSnap.data()['likes'])
            setDislikes(docSnap.data()['dislikes'])
            setComments(docSnap.data()['comments'])
            setShares(docSnap.data()['shares'])
        }

    }, [isFocused])

    async function onPress(type) {
        if (type == "like") {
            let numLikes = 0
            let creatorID = ""
            const docSnap = await getDoc(pollRef);
            if (docSnap.exists()) {
                numLikes = docSnap.data()["likes"] + 1
                creatorID = docSnap.data()["uid"]
                await updateDoc(docSnap, {
                    likes: numLikes
                }).then(async () => {
                    setLikes(numLikes)
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
                            activityArray.push(newActivity)
                            await updateDoc(userSnap, {
                                activity: activityArray
                            })

                        }
                        else {
                            const newActivity = {
                                timestamp: Date.now(),
                                type: "like",
                                pollID: pollID,
                                uid: auth.currentUser.uid
                            }
                            creatorActivity.push(newActivity)
                            await updateDoc(userSnap, {
                                activity: activityArray
                            })

                        }

                    }

                })
            }
        }

        if (type == "dislike") {
            let numDislikes = 0
            let creatorID = ""
            const docSnap = await getDoc(pollRef);
            if (docSnap.exists()) {
                numDislikes = docSnap.data()["dislikes"] + 1
                creatorID = docSnap.data()["uid"]
                await updateDoc(docSnap, {
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
                            activityArray.push(newActivity)
                            await updateDoc(userSnap, {
                                activity: activityArray
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
                            await updateDoc(userSnap, {
                                activity: activityArray
                            })

                        }

                    }

                })
            }
            // get(pollRef).then(snapshot => {
            //     numDislikes = snapshot.val().dislikes + 1
            //     creatorID = snapshot.val().uid
            //     update(pollRef, { dislikes: numDislikes })
            //     setDislikes(numDislikes)
            //     const userRef = ref(db, 'users/' + creatorID)
            //     get(userRef).then(snapshot => {
            //         let creatorActivity = snapshot.val().activity
            //         if (creatorActivity == '') {
            //             let activityArray = []
            //             const newActivity = {
            //                 timestamp: Date.now(),
            //                 type: "dislike",
            //                 pollID: pollID,
            //                 uid: auth.currentUser.uid
            //             }
            //             activityArray.push(newActivity)
            //             update(userRef, { activity: activityArray })
            //         }
            //         else {
            //             const newActivity = {
            //                 timestamp: Date.now(),
            //                 type: "dislike",
            //                 pollID: pollID,
            //                 uid: auth.currentUser.uid
            //             }
            //             creatorActivity.push(newActivity)
            //             update(userRef, { activity: creatorActivity })
            //         }
            //     })

            // })
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
            await updateDoc(docSnap, {
                shares: numShares
            })
        }

    }



    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => onPress("like")}>
                        <SimpleLineIcons name="like" size={26} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dislike} onPress={() => onPress("dislike")}>
                        <SimpleLineIcons name="dislike" size={26} color="white" />
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
            <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity onPress={() => onPress("share")}>
                    <Fontisto name="share-a" size={26} color="white" />
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{shares}</Text>
                </View>

            </View>
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
