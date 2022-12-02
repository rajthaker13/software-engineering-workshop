import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions, TouchableOpacity, Modal, TextInput, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Button } from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import React, { useEffect, useReducer, useState } from 'react';
import { Database, get, getDatabase, onValue, ref, set, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import GestureRecognizer from 'react-native-swipe-gestures';
import { MStyles } from '../Mason Styles/MStyles';
import { COLORS } from '../Colors/ColorScheme'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { InputAccessoryView } from 'react-native-web';
import { RotateInUpLeft } from 'react-native-reanimated';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function PollStats(props) {
    const db = props.db
    const auth = props.auth
    const pollID = props.id
    const pfp = props.pfp
    const navigation = useNavigation()

    const [text, setText] = useState('')
    const [likes, setLikes] = useState(props.likes)
    const [dislikes, setDislikes] = useState(props.dislikes)
    const [comments, setComments] = useState([])
    const [shares, setShares] = useState(props.shares)
    const [hasliked, setHasLiked] = useState(false)
    const [hasDisliked, setHasDisliked] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [replyModalVisible, setReplyModalVisible] = useState(false)
    const [commentsSize, setCommentsSize] = useState(0)
    const [replyComment, setReplyComment] = useState({user: '', comment: '', uid: '', replies: [], pfp: ''})
    const isFocused = useIsFocused();
    const [username, setUsername] = useState("")
    const [pollUsername, setPollusername] = useState('')
    const [UID, setUID] = useState("")
    const pollRef = doc(db, "polls", pollID);


    useEffect(() => {
        async function getPollStats() {
            const docSnap = await getDoc(pollRef);
            if (docSnap.exists()) {
                setLikes(docSnap.data()['likes'])
                setDislikes(docSnap.data()['dislikes'])
                setComments(docSnap.data()['comments'])
                setCommentsSize(docSnap.data()['comments'].length)
                setShares(docSnap.data()['shares'])
                setPollusername(docSnap.data()['creator'])
                setUID(docSnap.data()["uid"])
            }
            let hasVotedBefore = false
            const curUserRef = doc(db, "users", auth.currentUser.uid)
            const curSnap = await getDoc(curUserRef);
            if (curSnap.exists()) {
                setUsername(curSnap.data()['username'])
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
            setModalVisible(true)
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

    const addComment = async () => {
        await updateDoc(pollRef, {
            comments: arrayUnion({user: username, comment: text, uid: auth.currentUser.uid, replies: [], pfp: pfp})
        })
        setComments([...comments, {user: username, comment: text, uid: auth.currentUser.uid, replies: [], pfp: pfp}])
        setCommentsSize(commentsSize + 1)
        setText('')
    }

    const startReply = (passComment) => {
        setReplyComment(passComment)
        setModalVisible(!modalVisible)
        setReplyModalVisible(!replyModalVisible)
    }

    const addReply = async (passComment, text) => {
        let temp = comments
        let tempIndex = temp.findIndex((comment) => 
            comment.comment == passComment.comment && comment.user == passComment.user
        )
        
        passComment.replies.push({user: username, comment: text, uid: auth.currentUser.uid, pfp: pfp})
        if (tempIndex != -1) {
            temp[tempIndex] = passComment
        }

        await updateDoc(pollRef, {
            comments: temp
        })

        setReplyComment({user: '', comment: '', uid: '', replies: [], pfp: ''})
        setComments(temp)
        setReplyModalVisible(false)
        setModalVisible(true)
        setText('')
    }

    const commentPress = (comment) => {
        setModalVisible(!modalVisible)
        navigation.push("Home", { screen: "Profile", params: { id: comment.uid } })
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
                    <Text style={styles.statsText}>{commentsSize}</Text>
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
            <View style={{ flexDirection: 'column' }}>
                <TouchableHighlight onPress={() => 
                    { if (UID == auth.currentUser.uid) {
                            alert("Cannot Report Yourself!")
                        }
                        else {
                            navigation.push("Report", { user: pollUsername, type: 'Poll', reason: 'Inappropriate Poll', uid: UID})
                        }
                        }} >
                    <MaterialCommunityIcons name="flag-outline" color="white" size={35} />
                </TouchableHighlight>
            </View>
            <GestureRecognizer
            onSwipeDown={ () => Keyboard.dismiss() }
            >
                <Modal animationType='slide'
                transparent={true} 
                visible={modalVisible}>
                    <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPressOut={() => setModalVisible(false)}>
                        <SafeAreaView style={{flex: 1, justifyContent: 'flex-end'}}>
                            <TouchableWithoutFeedback>
                                <KeyboardAvoidingView
                                        keyboardVerticalOffset={0}
                                        behavior="padding"
                                        enabled>
                                    <View style={{width: windowWidth, height: windowHeight * 0.4, backgroundColor: COLORS.Background, borderColor: COLORS.Button, borderRadius: 25, borderWidth: 2, paddingTop: 10 }}>
                                        <ScrollView>
                                            {comments.map((comment) => {
                                                return (
                                                <View onStartShouldSetResponder={() => true} style={{width: windowWidth, paddingLeft: windowWidth * 0.01, paddingBottom: windowHeight * 0.01}}>
                                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                                        <Image style={[MStyles.commentImage, {marginRight: '1.5%'}]} source={{uri: comment.pfp}}/>
                                                        <View style={{flexDirection: 'column'}}>
                                                            <View style={{flexDirection: 'row'}}>
                                                                <TouchableHighlight onPress={() => commentPress(comment)}>
                                                                    <Text style={{color: COLORS.Headline}}>{comment.user}</Text>
                                                                </TouchableHighlight>
                                                                <TouchableHighlight onPress={() => {setModalVisible(!modalVisible); 
                                                                    if (comment.uid == auth.currentUser.uid) {
                                                                        alert("Cannot Report Yourself!")
                                                                    }
                                                                    else {
                                                                        navigation.push("Report", { user: comment.user, type: 'Comment', reason: comment.comment, uid: comment.uid})
                                                                    }
                                                                    }} >
                                                                    <MaterialCommunityIcons name="flag-outline" color={COLORS.Paragraph} size={15} />
                                                                </TouchableHighlight>
                                                            </View>
                                                            <Text style={{color: COLORS.Paragraph, width: windowWidth * 0.85}}>{comment.comment}</Text>
                                                            <TouchableHighlight onPress= {() => startReply(comment)}>
                                                                <Text style={{color: COLORS.Headline}}>Reply</Text>
                                                            </TouchableHighlight>
                                                            {comment.replies.map((reply) => {
                                                                return (
                                                                    <View onStartShouldSetResponder={() => true} style={{width: windowWidth, paddingLeft: windowWidth * 0.01, paddingTop: windowHeight * 0.01}}>
                                                                        <View style={{flex: 1, flexDirection: 'row'}}>
                                                                            <Image style={[MStyles.commentImage, {marginRight: '1.5%'}]} source={{uri: reply.pfp}}/>
                                                                            <View style={{flexDirection: 'column'}}>
                                                                                <View style={{flexDirection: 'row'}}>
                                                                                    <TouchableHighlight onPress={() => commentPress(comment)}>
                                                                                        <Text style={{color: COLORS.Headline}}>{reply.user}</Text>
                                                                                    </TouchableHighlight>
                                                                                    <TouchableHighlight onPress={() => {setModalVisible(!modalVisible); 
                                                                                        if (reply.uid == auth.currentUser.uid) {
                                                                                            alert("Cannot Report Yourself!")
                                                                                        }
                                                                                        else {
                                                                                            navigation.push("Report", { user: reply.user, type: 'Comment', reason: reply.comment, uid: reply.uid})
                                                                                        }
                                                                                        }} >
                                                                                        <MaterialCommunityIcons name="flag-outline" color={COLORS.Paragraph} size={15} />
                                                                                    </TouchableHighlight>
                                                                                </View>
                                                                                <Text style={{color: COLORS.Paragraph, width: windowWidth * 0.80}}>{reply.comment}</Text>
                                                                            </View> 
                                                                        </View>   
                                                                    </View>
                                                                )
                                                            })}
                                                        </View> 
                                                    </View>   
                                                </View>
                                                )
                                            })}
                                        </ScrollView>
                                        
                                            <View style={[MStyles.option]}>
                                                <TextInput style={{ color: COLORS.Paragraph, flex: 0.9, paddingLeft: windowWidth * 0.01}} 
                                                maxLength={150} 
                                                multiline={true}
                                                placeholder="Type Here" 
                                                placeholderTextColor={COLORS.Paragraph} 
                                                value={text} 
                                                onChangeText={(t) => setText(t)} 
                                                onKeyPress={(key) => {if (key.nativeEvent.key == "Enter") {addComment()}}}
                                                autoCapitalize={false}
                                                />
                                                <TouchableOpacity style={{ flex: 0.1 }} onPress={() => addComment()}>
                                                    <MaterialCommunityIcons name="send" color={COLORS.Paragraph} size={20} />
                                                </TouchableOpacity>
                                            </View>
                                        
                                    </View> 
                                </KeyboardAvoidingView>
                            </TouchableWithoutFeedback>
                        </SafeAreaView>
                    </TouchableOpacity>
                </Modal>
                <Modal animationType='slide'
                transparent={true} 
                visible={replyModalVisible}>
                    <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPressOut={() => setReplyModalVisible(false)}>
                        <SafeAreaView style={{flex: 1, justifyContent: 'flex-end'}}>
                            <TouchableWithoutFeedback>
                                <KeyboardAvoidingView
                                        keyboardVerticalOffset={0}
                                        behavior="padding"
                                        enabled>
                                    <View style={{width: windowWidth, height: windowHeight * 0.4, backgroundColor: COLORS.Background, borderColor: COLORS.Button, borderRadius: 25, borderWidth: 2, paddingTop: windowHeight * 0.01}}>
                                        <View style={{width: windowWidth, flex: 1, paddingLeft: windowWidth * 0.01}}> 
                                            <Text style={{color: COLORS.Headline, paddingBottom: windowHeight * 0.01}}>Replying to:</Text>
                                            <View style={{flexDirection: 'row'}}>
                                                <Image style={MStyles.commentImage} source={{uri: replyComment.pfp}}/>
                                                <View style={{flexDirection: 'column'}}>                            
                                                    <Text style={{color: COLORS.Headline}}>{replyComment.user}</Text>
                                                    <Text style={{color: COLORS.Paragraph, width: windowWidth * 0.85}}>{replyComment.comment}</Text>
                                                </View> 
                                            </View>
                                        </View>   
                                        <View style={[MStyles.option]}>
                                            <TextInput style={{ color: COLORS.Paragraph, flex: 0.9, paddingLeft: windowHeight * 0.01 }} 
                                            maxLength={150} 
                                            multiline={true}
                                            placeholder="Type Here" 
                                            placeholderTextColor={COLORS.Paragraph} 
                                            value={text} 
                                            onChangeText={(t) => setText(t)} 
                                            onKeyPress={(key) => {if (key.nativeEvent.key == "Enter") {addReply(replyComment, text)}}}
                                            autoCapitalize={false}/>
                                            <TouchableOpacity style={{ flex: 0.1 }} onPress={() => addReply(replyComment, text)}>
                                                <MaterialCommunityIcons name="send" color={COLORS.Paragraph} size={20} />
                                            </TouchableOpacity>
                                        </View>
                                    </View> 
                                </KeyboardAvoidingView>
                            </TouchableWithoutFeedback>
                        </SafeAreaView>
                    </TouchableOpacity>
                </Modal>
            </GestureRecognizer>
        </View>
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
