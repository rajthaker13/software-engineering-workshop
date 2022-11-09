import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, Dimensions, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, FlatList } from 'react-native';
import { get, getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../components/Colors/ColorScheme';
import { MStyles } from '../components/Mason Styles/MStyles';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

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
    const prevId = route.params.prevId
    let authorizedUser = false

    if (auth.currentUser.uid == currentUid) {
        authorizedUser = true
    }




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
            console.log(val.data()['followers'][auth.currentUser.uid])
            if (!authorizedUser && val.exists()) {
                if (val.data() == undefined) {
                    setFollow(true)
                }
                else {
                    setFollow(false)
                }
            }
        }
        getProfileData()
    }, [useIsFocused()])

    const deletePoll = (item) => {
        const refUser = doc(collection(db, 'users'), currentUid)
        const refUserPoll = doc(collection(db, 'polls'), item.item)

        deleteDoc(refUserPoll)

        var newNumpolls = numpolls - 1
        setNumpolls(newNumpolls)

        var newArray = pollsArray.filter((value) => value != item.item)
        setPollsArray(newArray)

        updateDoc(refUser, {
            numPolls: newNumpolls,
            polls: newArray
        })
    }

    const handleFollow = () => {
        

        async function updateFollow() {
            const followersListRef = doc(collection(db, 'users/' + currentUid + '/followers'), auth.currentUser.uid)
            const followingListRef = doc(collection(db, 'users/' +  auth.currentUser.uid + '/following'), currentUid)

            await setDoc(followingListRef, {
                [currentUid]: currentUid
            })
            await setDoc(followersListRef, {
                [auth.currentUser.uid]: auth.currentUser.uid
            })
        }
        updateFollow()
        //setFollow(true)
    }

    const handleUnfollow = async () => {
        const followerRef = doc(collection(db, 'users/' + currentUid + '/followers'), auth.currentUser.uid)
        const followingRef = doc(collection(db, 'users/' + auth.currentUser.uid + '/following'), currentUid)
        let docSnapFollower = await getDoc(followerRef)
        let docSnapFollowing = await getDoc(followingRef)
        if (docSnapFollower.exists()) {
            console.log(docSnapFollower.data())
        }
        if (docSnapFollowing.exists()) {
            console.log(docSnapFollowing.data())
        }
        deleteDoc(followerRef)
        deleteDoc(followingRef)
        
        //setFollow(false)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Background }}>
            <View style={[styles.layer, { width: SCREEN_WIDTH, flexDirection: 'row', alignItems: 'center' }]}>
                {!authorizedUser &&
                    <MaterialCommunityIcons onPress={() => navigation.navigate("Follow", { id: prevId })} name="chevron-left" color={COLORS.Paragraph} size={25} />}
                <Text style={[MStyles.header, authorizedUser ? { marginLeft: SCREEN_WIDTH * 0.38 } : { marginLeft: SCREEN_WIDTH * 0.355 }]} >{firstname} {lastname}</Text>
                {authorizedUser &&
                    <TouchableHighlight onPress={() => navigation.push("Settings")} style={{ marginLeft: 'auto', marginRight: 15 }}>
                        <MaterialCommunityIcons name="cog" color={COLORS.Paragraph} size={25} />
                    </TouchableHighlight>}
            </View>
            <View style={[styles.layer, { alignItems: 'center' }]}>
                <Image style={styles.image} source={{ uri: pfp }} />
                <Text style={[MStyles.header, { width: SCREEN_WIDTH, marginLeft: SCREEN_WIDTH * 0.75 }]}>@{username}</Text>
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
                        <View style={MStyles.pollsContainer}>
                            {authorizedUser && <TouchableHighlight onPress={() => deletePoll(item)} style={{ alignSelf: "flex-end" }}>
                                <MaterialCommunityIcons name="close-circle" color={COLORS.Paragraph} size={15} />
                            </TouchableHighlight>}
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={[MStyles.text, { alignSelf: 'center' }]}>{(item.item).replace(currentUid, "")}</Text>
                            </View>
                        </View>
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