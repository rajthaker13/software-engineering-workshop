import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList } from 'react-native';
import { Database, get, getDatabase, onValue, ref, set } from "firebase/database";
import React, { useEffect, useReducer, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ProfileScreen() {
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
    const [groupsArray, setGroupsArray] = useState([])



    const navigator = useNavigation()
    const auth = getAuth()
    const db = getDatabase()

    const refUsername = ref(db, 'users/' + auth.currentUser.uid + '/username')
    const refDislikes = ref(db, 'users/' + auth.currentUser.uid + '/dislikes')
    const refFirstname = ref(db, 'users/' + auth.currentUser.uid + '/firstName')
    const refFollowers = ref(db, 'users/' + auth.currentUser.uid + '/followers')
    const refFollowing = ref(db, 'users/' + auth.currentUser.uid + '/following')
    const refLastname = ref(db, 'users/' + auth.currentUser.uid + '/lastName')
    const refLikes = ref(db, 'users/' + auth.currentUser.uid + '/likes')
    const refPFP = ref(db, 'users/' + auth.currentUser.uid + '/profile_picture_url')
    const refDescription = ref(db, 'users/' + auth.currentUser.uid + '/description')
    const refNumpolls = ref(db, 'users/' + auth.currentUser.uid + '/numPolls')



    useEffect(() => {
        get(refUsername).then(snapshot => {
            setUsername(snapshot.val())
        })
        get(refDislikes).then(snapshot => {
            setDislikes(snapshot.val())
        })
        get(refFirstname).then(snapshot => {
            setFirstname(snapshot.val())
        })
        get(refFollowers).then(snapshot => {
            setFollowers(snapshot.val())
            if (snapshot.val() == false) {
                setFollowersNum(0)
            }
            else {
                setFollowersNum(followers.length())
            }
        })
        get(refFollowing).then(snapshot => {
            setFollowing(snapshot.val())
            if (snapshot.val() == false) {
                setFollowingNum(0)
            }
            else {
                setFollowingNum(following.length())
            }
        })
        get(refLastname).then(snapshot => {
            setLastname(snapshot.val())
        })
        get(refLikes).then(snapshot => {
            setLikes(snapshot.val())
        })
        get(refPFP).then(snapshot => {
            setPfp(snapshot.val())
        })
        get(refNumpolls).then(snapshot => {
            setNumpolls(snapshot.val())
        })
        get(refDescription).then(snapshot => {
            setDescription(snapshot.val())
        })
    }, [useIsFocused()])

    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignContent: "center", }}>
            <View style={{flexDirection: 'row', flex: 0.05}}>
                <Text style={{ flex: 0.5, fontSize: 16, color: "white", alignSelf: 'center' }}>{username}</Text>
                <TouchableHighlight onPress={() => navigator.replace("Settings")}style={{flex: 0.5, alignSelf: 'center', alignItems: 'flex-end'}}>
                    <MaterialCommunityIcons name="cog" color="white" size={25}/>
                </TouchableHighlight>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "black", flexDirection: "row" }}>
                    <View style={{ flex: 0.4, flexDirection: "column" }}>
                        <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}><Image style={styles.image} source={{uri: pfp}} /></View>
                        <Text style={{ flex: 0.5, color: "white" }}>{firstname} {lastname}</Text>
                        <Text style={{ flex: 0.5, color: "white" }}>{description}</Text>
                    </View>
                    <View style={{ flex: 0.6, flexDirection: "column" }}>
                        <View style={{ flex: 1, flexDirection: "column" }}>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
                                <Text style={{ color: "white" }}>{numpolls}</Text>
                                <Text style={{ color: "white" }}>{followersNum}</Text>
                                <Text style={{ color: "white" }}>{followingNum}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", left: 10, bottom: 15 }}>
                                <Text style={{ color: "white" }}>Polls</Text>
                                <Text style={{ color: "white" }}>Followers</Text>
                                <Text style={{ color: "white" }}>Following</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                </View>
                <View style={{ flex: 0.25, justifyContent: "center", flexDirection: "row" }}>
                    <TouchableHighlight style={{ flex: 0.4 }}><Pressable style={styles.button} onPress={() => navigator.replace("Edit Profile")}><Text style={styles.text}>Edit Profile</Text></Pressable></TouchableHighlight>
                </View>
                <View style={{ flex: 0.5, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <TouchableHighlight style={{ flex: 0.3, right: 10 }}><Pressable style={styles.button}><Text style={styles.text}>{likes}</Text><Text style={styles.text}> Up</Text></Pressable></TouchableHighlight>
                    <TouchableHighlight style={{ flex: 0.3, left: 10 }}><Pressable style={styles.button}><Text style={styles.text}>{dislikes}</Text><Text style={styles.text}> Down</Text></Pressable></TouchableHighlight>
                </View>
                <View style={{ flex: 0.25 }}>
                    <Text style={styles.textHeading}>Your Polls</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {/* <FlatList data={} renderItem={} keyExtractor={item => item.id} horizontal='true'/>  */}
                </View>
                <View style={{ flex: 0.25 }}>
                    <Text style={styles.textHeading}>Your Groups</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                    {/* <FlatList data={} renderItem={} keyExtractor={item => item.id} horizontal='true'/> */}
                </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    image: {
               resizeMode: 'cover',
               width: SCREEN_HEIGHT * 0.08,
               height: SCREEN_HEIGHT * 0.08,
               borderRadius: (SCREEN_HEIGHT * 0.08)/2,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'gray',
        flexDirection: "row"
    },
    text: {
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    textHeading: {
        fontSize: 16,
        letterSpacing: 0.25,
        color: 'white',
    }
})