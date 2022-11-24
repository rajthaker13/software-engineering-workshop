import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, Dimensions, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, FlatList } from 'react-native';
import { get, getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../components/Colors/ColorScheme';
import { MStyles } from '../components/Mason Styles/MStyles';
import { addDoc, arrayRemove, collection, deleteDoc, deleteField, doc, FieldValue, Firestore, getDoc, getDocs, getFirestore, increment, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { NativeScreenNavigationContainer } from 'react-native-screens';
import PollModal from '../components/common/PollModal';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProfileScreen({ route, navigation }) {
    const [follow, setFollow] = useState(false)
    const [username, setUsername] = useState('');
    const [dislikes, setDislikes] = useState('');
    const [firstname, setFirstname] = useState('');
    const [followers, setFollowers] = useState('');
    const [following, setFollowing] = useState('');
    const [followersNum, setFollowersNum] = useState('');
    const [followingNum, setFollowingNum] = useState('');
    const [lastname, setLastname] = useState('');
    const [likes, setLikes] = useState('');
    const [pfp, setPfp] = useState('');
    const [numpolls, setNumpolls] = useState('');
    const [description, setDescription] = useState('');
    const [pollsArray, setPollsArray] = useState([])

    const auth = getAuth()
    const db = getFirestore()

    const currentUid = route.params.id
    const appUser = auth.currentUser.uid
    const prevId = route.params.prevId
    let authorizedUser = false

    if (auth.currentUser.uid == currentUid) {
        authorizedUser = true
    }

    const isFocused = useIsFocused();

    useEffect(() => {    
        async function getProfileData() {
            const userRef = doc(collection(db, 'users'), currentUid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setUsername(docSnap.data()['username'])
                setLikes(docSnap.data()['likes'])
                setDislikes(docSnap.data()['dislikes'])
                setFirstname(docSnap.data()['firstName'])
                setLastname(docSnap.data()['lastName'])
                setFollowers(docSnap.data()['followers'])
                let followerVal = Object.values(docSnap.data()['followers'])
                let temp = []
                followerVal.forEach(val => {
                    if (val != false) {
                        temp.push(val)
                    }
                })
                setFollowers(temp)
                setFollowersNum(temp.length)
                
                let followingVal = Object.values(docSnap.data()['following'])
                let temp2 = []
                followingVal.forEach(val => {
                    if (val != false) {
                        temp2.push(val)
                    }
                })
                setFollowing(temp2)
                setFollowingNum(temp2.length) 

                setPfp(docSnap.data()['profile_picture_url'])
                setNumpolls(docSnap.data()['numPolls'])
                setDescription(docSnap.data()['description'])
                setPollsArray(docSnap.data()['polls'])
            }
            
            const followerRef = doc(db, 'users', currentUid)
            let val = await getDoc(followerRef)
            if (!authorizedUser && val.exists()) {
                if (val.data()['followers'][auth.currentUser.uid] == undefined) {
                    setFollow(false)
                }
                else {
                    setFollow(true)
                }
            }
        }
        getProfileData()
    }, [isFocused])

    const deletePoll = async (item) => {
        const refUser = doc(collection(db, 'users'), currentUid)
        const refUserPoll = doc(collection(db, 'polls'), item.item)
        const test = doc(db, 'users', currentUid)
        const test2 = await getDoc(test)
        let numLikes = 0
        let numDislikes = 0
        test2.data()['activity'].forEach( (activity) => {
            if(activity['pollID'] == item.item) {
                if (activity['type'] == "like") {
                    numLikes = numLikes + 1
                }
                if (activity['type'] == "dislike") {
                    numDislikes = numDislikes + 1
                }
                updateDoc(refUser, {
                    activity: arrayRemove(activity)
                })
            }
            
        })

        deleteDoc(refUserPoll)

        var newNumpolls = numpolls - 1
        setNumpolls(newNumpolls)

        var newArray = pollsArray.filter((value) => value != item.item)
        setPollsArray(newArray)

        updateDoc(refUser, {
            numPolls: newNumpolls,
            polls: newArray,
            likes: increment(-numLikes),
            dislikes: increment(-numDislikes)
        })
    }

    const handleFollow = () => {
        async function updateFollow() {
            const followersListRef = doc(db, 'users', currentUid)
            const followingListRef = doc(db, 'users', auth.currentUser.uid)
            updateDoc(followingListRef, {
                [`following.${currentUid}`]: currentUid
            })
            updateDoc(followersListRef, {
                [`followers.${auth.currentUser.uid}`]: auth.currentUser.uid
            })
        }
        updateFollow()
        setFollowersNum(followersNum + 1)
        setFollow(true)
    }

    const handleUnfollow = async () => {
        const followerRef = doc(db, 'users', currentUid)
        const followingRef = doc(db, 'users', auth.currentUser.uid)

        const currentProfile = await getDoc(followerRef)
        const currentUser = await getDoc(followingRef)
        
        if (currentProfile.exists()) {
            updateDoc(followerRef, {
                [`followers.${auth.currentUser.uid}`]: deleteField()
            })
        }
        if (currentUser.exists()) {
            updateDoc(followingRef, {
                [`following.${currentUid}`]: deleteField()
            })
        }
        setFollowersNum(followersNum - 1)
        setFollow(false)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Background }}>
            <View style={[styles.layer, { width: SCREEN_WIDTH, flexDirection: 'row', alignItems: 'center' }]}>
                <View style={{width: SCREEN_WIDTH * 0.1}}>
                    {!authorizedUser &&
                        <MaterialCommunityIcons onPress={() => navigation.pop()} name="chevron-left" color={COLORS.Paragraph} size={25} />}
                </View>
                 <Text style={[MStyles.header, {width: SCREEN_WIDTH * 0.8, textAlign: 'center'}]} >{firstname} {lastname}</Text>
                <View style={{width: SCREEN_WIDTH * 0.1, alignContent:'flex-end', marginRight: 15}}>
                    {authorizedUser &&
                        <TouchableHighlight onPress={() => navigation.push("Settings")} >
                            <MaterialCommunityIcons name="cog" color={COLORS.Paragraph} size={25} />
                        </TouchableHighlight>}
                    {!authorizedUser &&
                    <TouchableHighlight onPress={() => navigation.push("Report", { user: username, type: 'Profile', reason: 'Inappropriate Profile', uid: currentUid})} >
                        <MaterialCommunityIcons name="flag-outline" color={COLORS.Paragraph} size={25} />
                    </TouchableHighlight>}
                </View>
            </View>
            <View style={[styles.layer, { alignItems: 'center' }]}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={[styles.image, {alignSelf: 'center'}]} source={{ uri: pfp }} />
                    {authorizedUser &&
                        <TouchableHighlight style ={{width: SCREEN_HEIGHT * 0.025, height: SCREEN_HEIGHT * 0.025, alignSelf: 'flex-end', position: 'absolute', left: SCREEN_WIDTH * 0.15}} onPress={() => navigation.push("Edit PFP")}>
                            <MaterialCommunityIcons name='pencil-circle' color={COLORS.Paragraph} size={25}/>
                        </TouchableHighlight>}
                </View>
                <Text style={[MStyles.header, { width: SCREEN_WIDTH, textAlign: 'center'}]}>@{username}</Text>
            </View>
            <View style={[styles.layer, { flexDirection: "row" }]}>
                <TouchableOpacity onPress={() => navigation.push("Follow", { id: currentUid, start: 'FollowersList' })} style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: SCREEN_WIDTH * 0.17 }}>
                    <Text style={MStyles.text}>{followersNum}</Text>
                    <Text style={MStyles.text}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.push("Follow", { id: currentUid, start: 'FollowingList' })} style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: SCREEN_WIDTH * 0.1 }}>
                    <Text style={MStyles.text}>{followingNum}</Text>
                    <Text style={MStyles.text}>Following</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: SCREEN_WIDTH * 0.1 }}>
                    <Text style={MStyles.text}>{likes}</Text>
                    <Text style={MStyles.text}>Likes</Text>
                </View>
            </View>
            <View style={styles.layer}>
                {authorizedUser &&
                    <TouchableHighlight style={[MStyles.buttonSolidBackground, { marginTop: 0, width: SCREEN_WIDTH * 0.5 }]} onPress={() => navigation.push("Edit Profile")}>
                        <Text style={[MStyles.buttonSolidBackgroundText]}>Edit Profile</Text>
                    </TouchableHighlight>}
                {!authorizedUser && !follow &&
                    <TouchableHighlight onPress={() => handleFollow()} style={[MStyles.buttonSolidBackground, { marginTop: 0, width: SCREEN_WIDTH * 0.5 }]}>
                        <Text style={[MStyles.buttonSolidBackgroundText]}>Follow</Text>
                    </TouchableHighlight>}
                {!authorizedUser && follow &&
                    <TouchableHighlight onPress={() => handleUnfollow()} style={[MStyles.buttonTranslucentBackground, { marginTop: 0, width: SCREEN_WIDTH * 0.5 }]}>
                        <Text style={[MStyles.buttonTranslucentBackgroundText]}>Unfollow</Text>
                    </TouchableHighlight>}
            </View>
            <View style={styles.layer}>
                <Text style={[MStyles.text, { alignSelf: 'center' }]}>{description}</Text>
            </View>
            <View style={MStyles.headerContainer}>
                <Text style={[MStyles.header, { width: SCREEN_WIDTH, marginLeft: 15 }]}>Your Polls</Text>
            </View>
            <View style={{ width: SCREEN_WIDTH, height: 0.5 * SCREEN_HEIGHT }} >
                <FlatList
                    numColumns={3}
                    data={pollsArray}
                    renderItem={(item) => (
                        <TouchableOpacity style={MStyles.pollsContainer}>
                            {authorizedUser && <TouchableHighlight onPress={() => deletePoll(item)} style={{ alignSelf: "flex-end" }}>
                                <MaterialCommunityIcons name="close-circle" color={COLORS.Paragraph} size={20} />
                            </TouchableHighlight>}
                            {/* <View style={{ justifyContent: 'center' }}> */}
                                <PollModal pollID={item.item}/>
                                {/* <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{(item.item).replace(currentUid, "")}</Text> */}
                                {/* {console.log(item.item)} */}
                            {/* </View> */}
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.index}
                />
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
        width: SCREEN_HEIGHT * 0.1,
        height: SCREEN_HEIGHT * 0.1,
        borderRadius: (SCREEN_HEIGHT * 0.1) / 2,
    },
    layer: {
        marginBottom: 15
    }
})