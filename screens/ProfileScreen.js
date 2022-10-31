import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList } from 'react-native';
import { get, getDatabase, ref, remove, update } from "firebase/database";
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { propsFlattener } from 'native-base/lib/typescript/hooks/useThemeProps/propsFlattener';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProfileScreen({ route }) {
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

    const navigator = useNavigation()
    const auth = getAuth()
    const db = getDatabase()

    const currentUid = route.params.id
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
        get(refPollsArray).then(snapshot => {
            setPollsArray(snapshot.val())
        })
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignContent: "center", }}>
            <View style={{flexDirection: 'row', flex: 0.05}}>
                <Text style={{ flex: 0.5, fontSize: 16, color: "white", alignSelf: 'center' }}>{username}</Text>
                {authorizedUser && <TouchableHighlight onPress={() => navigator.replace("Settings")}style={{flex: 0.5, alignSelf: 'center', alignItems: 'flex-end'}}>
                    <MaterialCommunityIcons name="cog" color="white" size={25}/>
                </TouchableHighlight>}
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
                    {authorizedUser && <TouchableHighlight style={{ flex: 0.4 }}><Pressable style={styles.button} onPress={() => navigator.replace("Edit Profile")}><Text style={styles.text}>Edit Profile</Text></Pressable></TouchableHighlight>}
                </View>
                <View style={{ flex: 0.5, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <TouchableHighlight style={{ flex: 0.3, right: 10 }}><Pressable style={styles.button}><Text style={styles.text}>{likes}</Text><Text style={styles.text}> Up</Text></Pressable></TouchableHighlight>
                    <TouchableHighlight style={{ flex: 0.3, left: 10 }}><Pressable style={styles.button}><Text style={styles.text}>{dislikes}</Text><Text style={styles.text}> Down</Text></Pressable></TouchableHighlight>
                </View>
                <View style={{ flex: 0.25 }}>
                    <Text style={styles.textHeading}>Your Polls</Text>
                </View>
                <View style={{ width: SCREEN_WIDTH, height: 0.5 * SCREEN_HEIGHT}} >
                    <FlatList 
                    numColumns={3}
                    data={pollsArray} 
                    renderItem={(item) => (
                        <View style={styles.pollsContainer}>
                            {authorizedUser && <TouchableHighlight onPress={() => deletePoll(item)} style={{alignSelf: "flex-end"}}>
                                <MaterialCommunityIcons name="close-circle" color='red' size={15}/>
                            </TouchableHighlight>}
                            <View style={{flexGrow: 0.3, justifyContent:'center'}}>
                                <Text style={{color: 'white', alignSelf:'center'}}>{(item.item).replace(currentUid, "")}</Text>
                            </View>
                        </View>
                    )} 
                    keyExtractor={(item) => item.index} 
                    /> 
                </View>
            </View>
            {authorizedUser && <Button title="test" onPress={() => navigator.navigate("Profile", {id: 'dwnr6k0lubh5zonII35fFL0KFHZ2'})}/>}
            {!authorizedUser && <Button title="GoBack" onPress={() => navigator.navigate("Profile", {id: auth.currentUser.uid})}/>}
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
    },
    pollsContainer: {
        width: SCREEN_WIDTH * 0.30,
        height: SCREEN_HEIGHT * 0.1,
        borderColor: "#e91e63",
        borderRadius: 10,
        borderWidth: 2,
        marginHorizontal: 5,
        marginBottom: 5,
    },
})