import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, Dimensions, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, FlatList } from 'react-native';
import { get, getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../components/Colors/ColorScheme';
import { MStyles } from '../components/Mason Styles/MStyles';

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
    const db = getDatabase()

    const currentUid = route.params.id
    const prevId = route.params.prevId
    let authorizedUser = false
    
    if (auth.currentUser.uid == currentUid) {
        authorizedUser = true
    }

    const refUsername = ref(db, 'users/' + currentUid + '/username')
    const refDislikes = ref(db, 'users/' + currentUid + '/dislikes')
    const refFirstname = ref(db, 'users/' + currentUid + '/firstName')
    const refFollowers = ref(db, 'users/' + currentUid + '/followers')
    const refFollowing = ref(db, 'users/' + currentUid + '/following')
    const refLastname = ref(db, 'users/' + currentUid + '/lastName')
    const refLikes = ref(db, 'users/' + currentUid + '/likes')
    const refPFP = ref(db, 'users/' + currentUid + '/profile_picture_url')
    const refDescription = ref(db, 'users/' + currentUid + '/description')
    const refNumpolls = ref(db, 'users/' + currentUid + '/numPolls')
    const refPollsArray = ref(db, 'users/' + currentUid + '/polls')



    useEffect(() => {
        onValue(refUsername, snapshot => {
            setUsername(snapshot.val())
        })
        onValue(refDislikes, snapshot => {
            setDislikes(snapshot.val())
        })
        onValue(refFirstname, snapshot => {
            setFirstname(snapshot.val())
        })
        onValue(refFollowers, snapshot => {
            let snapVal = snapshot.val()
            
            let arr = Object.values(snapVal)
            let temp = []
            arr.forEach(val => {
                if (val != false) {
                    temp.push(val)
                }
            })
            setFollowers(temp)            
            setFollowersNum(temp.length)
             
        })
        onValue(refFollowing, snapshot => {
            let snapVal = snapshot.val()
            let arr = Object.values(snapVal)
            let temp = []
            arr.forEach(val => {
                if (val != false) {
                    temp.push(val)
                }
            })
            setFollowing(temp)
            setFollowingNum(temp.length) 
             
        })
        onValue(refLastname, snapshot => {
            setLastname(snapshot.val())
        })
        onValue(refLikes, snapshot => {
            setLikes(snapshot.val())
        })
        onValue(refPFP, snapshot => {
            setPfp(snapshot.val())
        })
        onValue(refNumpolls, snapshot => {
            setNumpolls(snapshot.val())
        })
        onValue(refDescription, snapshot => {
            setDescription(snapshot.val())
        })
        onValue(refPollsArray, snapshot => {
            setPollsArray(snapshot.val())
        })
        const followerRef = ref(db, 'users/' + currentUid + '/followers/' + auth.currentUser.uid)
        {!authorizedUser && onValue(followerRef, snapshot => {
            if (snapshot.val() == null) {
                setFollow(false)
            }
            else {
                setFollow(true)
            }
        })}
    }, [useIsFocused()])

    const deletePoll = (item) => {
        const refUser = ref(db, 'users/' + currentUid)
        const refUserPoll = ref(db, 'polls/'+ item.item)

        remove(refUserPoll)

        var newNumpolls = numpolls - 1
        setNumpolls(newNumpolls)

        var newArray = pollsArray.filter((value) => value != item.item)
        setPollsArray(newArray)
        
        update(refUser, {
            numPolls: newNumpolls,
            polls: newArray
        })
    }

    const handleFollow = () => {
        const followersListRef = ref(db, 'users/' + currentUid + '/followers')
        const followingListRef = ref(db, 'users/' + auth.currentUser.uid + '/following')
        let followersList = []
        let followingList = []
        get(followersListRef).then(snapshot => {
            followersList = snapshot.val()
        })
        get(followingListRef).then(snapshot => {
            followingList = snapshot.val()
        })
        update(followersListRef, {
            [auth.currentUser.uid]: auth.currentUser.uid
        })
        update(followingListRef, {
            [currentUid]: currentUid
        })
        setFollow(true)
    }

    const handleUnfollow = () => {
        const followerRef = ref(db, 'users/' + currentUid + '/followers/' + auth.currentUser.uid)
        const followingRef = ref(db, 'users/' + auth.currentUser.uid + '/following/' + currentUid)
        const follower = ref(db, 'users/' + currentUid)
        const following = ref(db, 'users/' + auth.currentUser.uid)
        remove(followerRef)
        remove(followingRef)
        if (followersNum == 0) {
            update(follower, {
                followers: false
            })
        }
        if (followingNum == 0) {
            update(following, {
                following: false
            })
        }
        setFollow(false)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Background}}>
            <View style={[styles.layer, {width: SCREEN_WIDTH, flexDirection: 'row', alignItems: 'center'}]}>
                {!authorizedUser && 
                <MaterialCommunityIcons onPress={() => navigation.navigate("Follow", {id: prevId})} name="chevron-left" color={COLORS.Paragraph} size={25}/>}
                <Text style={[MStyles.header, authorizedUser ? {marginLeft: SCREEN_WIDTH * 0.38} : {marginLeft: SCREEN_WIDTH * 0.355}]} >{firstname} {lastname}</Text>
                {authorizedUser && 
                <TouchableHighlight onPress={() => navigation.push("Settings")} style={{marginLeft: 'auto', marginRight: 15}}>
                    <MaterialCommunityIcons name="cog" color={COLORS.Paragraph} size={25}/>
                </TouchableHighlight>}
            </View>
            <View style={[styles.layer, {alignItems: 'center'}]}>
                <Image style={styles.image} source={{uri: pfp}}/>
                <Text style={[MStyles.header, {width: SCREEN_WIDTH, marginLeft: SCREEN_WIDTH * 0.75}]}>@{username}</Text>
            </View>
            <View style={[styles.layer, {flexDirection: "row"}]}>
                <TouchableOpacity onPress={() => navigation.push("Follow", {id: currentUid, start: 'FollowersList'})} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: SCREEN_WIDTH * 0.17}}>
                    <Text style={MStyles.text}>{followersNum}</Text>
                    <Text style={MStyles.text}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.push("Follow", {id: currentUid, start: 'FollowingList'})} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: SCREEN_WIDTH * 0.1}}>
                    <Text style={MStyles.text}>{followingNum}</Text>
                    <Text style={MStyles.text}>Following</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: SCREEN_WIDTH * 0.1}}>
                    <Text style={MStyles.text}>{likes}</Text>
                    <Text style={MStyles.text}>Likes</Text>
                </View>
            </View>
            <View style={styles.layer}>
                {authorizedUser && 
                <TouchableHighlight style={[MStyles.buttonSolidBackground, {marginTop: 0, width: SCREEN_WIDTH * 0.5}]} onPress={() => navigation.push("Edit Profile")}>
                    <Text style={[MStyles.buttonSolidBackgroundText]}>Edit Profile</Text>
                </TouchableHighlight>}
                {!authorizedUser && !follow &&
                <TouchableHighlight onPress={() => handleFollow()} style={[MStyles.buttonSolidBackground, {marginTop: 0, width: SCREEN_WIDTH * 0.5}]}>
                    <Text style={[MStyles.buttonSolidBackgroundText]}>Follow</Text>
                </TouchableHighlight>}
                {!authorizedUser && follow &&
                <TouchableHighlight onPress={() => handleUnfollow()} style={[MStyles.buttonTranslucentBackground, {marginTop: 0, width: SCREEN_WIDTH * 0.5}]}>
                    <Text style={[MStyles.buttonTranslucentBackgroundText]}>Unfollow</Text>
                </TouchableHighlight>}
            </View>
            <View style={styles.layer}>
                <Text style={[MStyles.text, {alignSelf: 'center'}]}>{description}</Text>
            </View>
            <View style={MStyles.headerContainer}>
                <Text style={[MStyles.header, {width: SCREEN_WIDTH, marginLeft: 15}]}>Your Polls</Text>
            </View>
            <View style={{ width: SCREEN_WIDTH, height: 0.5 * SCREEN_HEIGHT}} >
                <FlatList 
                numColumns={3}
                data={pollsArray} 
                renderItem={(item) => (
                    <View style={MStyles.pollsContainer}>
                        {authorizedUser && <TouchableHighlight onPress={() => deletePoll(item)} style={{alignSelf: "flex-end"}}>
                            <MaterialCommunityIcons name="close-circle" color={COLORS.Paragraph} size={15}/>
                        </TouchableHighlight>}
                        <View style={{justifyContent:'center'}}>
                            <Text style={[MStyles.text, {alignSelf:'center'}]}>{(item.item).replace(currentUid, "")}</Text>
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
               borderRadius: (SCREEN_HEIGHT * 0.1)/2,
    }, 
    layer: {
        marginBottom: 15
    }
})