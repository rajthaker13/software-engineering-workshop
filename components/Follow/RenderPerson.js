import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions, TouchableOpacity } from 'react-native';

import React, { useEffect, useState } from 'react';
import { get, onValue, ref,} from "firebase/database";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MStyles } from '../Mason Styles/MStyles';



const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


export default function RenderPerson(props) {
    const db = props.db
    const uid = props.uid
    const navigation = props.navigation
    const prevId = props.prevId

    const firstRef = ref(db, 'users/' + uid +'/firstName')
    const lastRef = ref(db, 'users/' + uid + '/lastName')
    const usernameRef = ref(db, 'users/' + uid + '/username')
    const pfpRef = ref(db, 'users/' + uid + '/profile_picture_url')


    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [username, setUsername] = useState('')
    const [pfp, setPFP] = useState('')


    useEffect(() => {
        onValue(firstRef, snapshot => {
            setFirst(snapshot.val())
        })
        onValue(lastRef, snapshot => {
            setLast(snapshot.val())
        })
        onValue(usernameRef, snapshot => {
            setUsername(snapshot.val())
        })
        onValue(pfpRef, snapshot => {
            setPFP(snapshot.val())
        })
    }, [])

    return (
        <View>
            <TouchableOpacity style={MStyles.smallProfileRender} onPress={() => navigation.push("Home",{screen: "Profile", params: {id: uid, prevId: prevId}})}>
                <Image style={MStyles.smallProfileRenderImage} source={{uri: pfp}}/>
                <View style={{flexDirection: 'column'}}>
                    <Text style={MStyles.smallProfileRenderText}>{first} {last}</Text>
                    <Text style={MStyles.smallProfileRenderText}>{username}</Text>
                </View>
            </TouchableOpacity>
        </View>       
    )
}