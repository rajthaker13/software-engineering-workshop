import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import React, { useEffect, useReducer, useState } from 'react';
import { Database, get, getDatabase, onValue, ref, set, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function PollBanner(props) {
    const db = props.db
    const auth = props.auth
    const uid = props.uid

    const userRef = doc(db, "users", uid);

    const [name, setName] = useState('')


    useEffect(async () => {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const firstName = docSnap.data()['firstName']
            const lastName = docSnap.data()['lastName']
            const fullName = firstName + " " + lastName
            setName(fullName)

        }


    }, [])
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.profilePicContainer}>
                    <Image source={require('../../assets/favicon.png')} resizeMode='cover' style={styles.profileImg} />
                </View>
                <Text style={styles.bannerText}>{`Posted by ${name}`}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: '#010101',
        width: windowWidth * .9,
        height: windowHeight * .05,
        marginTop: windowHeight * .05,
        marginLeft: windowWidth * .05,
        flexDirection: 'row',
        alignItems: 'center'
    },
    profilePicContainer: {
        backgroundColor: '#010101',
        borderColor: '#010101',
        width: windowWidth * .15,
        height: windowWidth * .15,
        marginLeft: windowWidth * .1,
        borderRadius: windowWidth * .15
    },
    profileImg: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        borderRadius: windowWidth * .15
    },
    bannerText: {
        fontSize: 15,
        color: 'white',
        marginLeft: windowWidth * .05
    }

})
