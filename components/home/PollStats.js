import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import React, { useEffect, useReducer, useState } from 'react';
import { Database, get, getDatabase, onValue, ref, set, update } from "firebase/database";
import { getAuth } from 'firebase/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function PollStats(props) {
    const db = props.db
    const auth = getAuth()
    const pollID = props.id


    const [likes, setLikes] = useState(props.likes)
    const [dislikes, setDislikes] = useState(props.dislikes)
    const [comments, setComments] = useState(props.comments)
    const [shares, setShares] = useState(props.shares)
    const pollRef = ref(db, '/polls/' + pollID)

    function onPress(type) {
        if (type == "like") {
            let numLikes = 0
            let creatorID = ""
            get(pollRef).then(snapshot => {
                numLikes = snapshot.val().likes + 1
                creatorID = snapshot.val().uid
                update(pollRef, { likes: numLikes })
                setLikes(numLikes)
                const userRef = ref(db, 'users/' + creatorID)
                get(userRef).then(snapshot => {
                    let creatorActivity = snapshot.val().activity
                    if (creatorActivity == '') {
                        let activityArray = []
                        const newActivity = {
                            timestamp: Date.now(),
                            type: "like",
                            pollID: pollID,
                            uid: auth.currentUser.uid
                        }
                        activityArray.push(newActivity)
                        update(userRef, { activity: activityArray })
                    }
                    else {
                        const newActivity = {
                            timestamp: Date.now(),
                            type: "like",
                            pollID: pollID,
                            uid: auth.currentUser.uid
                        }
                        creatorActivity.push(newActivity)
                        update(userRef, { activity: creatorActivity })
                    }
                })

            })

        }

        if (type == "dislike") {
            let numDislikes = 0
            get(pollRef).then(snapshot => {
                numDislikes = snapshot.val().dislikes + 1
                update(pollRef, { dislikes: numDislikes })
                setDislikes(numDislikes)
            })
        }

        if (type == "comment") {
            //Add Logic For Comments
        }

        if (type == "share") {
            let numShares = 0
            get(pollRef).then(snapshot => {
                numShares = snapshot.val().shares + 1
                update(pollRef, { shares: numShares })
                setShares(numShares)
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
                    <Text style={styles.statsText}>{comments}</Text>
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
        marginTop: windowHeight * .01,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    statsText: {
        color: 'white',
        fontSize: 15
    }

})
