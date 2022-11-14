import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions, TouchableOpacity } from 'react-native';

import React, { useEffect, useState } from 'react';
import { get, onValue, ref,} from "firebase/database";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MStyles } from '../Mason Styles/MStyles';
import { doc, getDoc } from 'firebase/firestore';



const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


export default function RenderPerson(props) {
    const db = props.db
    const uid = props.uid
    const navigation = props.navigation
    const prevId = props.prevId

    const userRef = doc(db, 'users', uid)


    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [username, setUsername] = useState('')
    const [pfp, setPFP] = useState('')


    useEffect(() => {
        async function getPersonData() {
                        
            const docSnap = await getDoc(userRef)

            if (docSnap.exists()) {
                setFirst(docSnap.data()['firstName'])
                setLast(docSnap.data()['lastName'])
                setUsername(docSnap.data()['username'])
                setPFP(docSnap.data()['profile_picture_url'])
            }
          }
        getPersonData()
    }, [useIsFocused()])

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