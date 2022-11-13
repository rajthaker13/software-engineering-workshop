import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, update } from "firebase/database";
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TextInput, Button, TouchableHighlight } from "react-native";
import { COLORS } from '../components/Colors/ColorScheme'
import { MStyles } from "../components/Mason Styles/MStyles";


export default function EditProfileScreen() {
    const [username, setUsername] = useState('')
    const [permUsername, setPermUsername] = useState('')
    const [description, setDescription] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pfp, setPFP] = useState('')

    const db = getFirestore()
    const auth = getAuth()
    const userRef = doc(db, 'users', auth.currentUser.uid)
    const usernameRef = doc(db, 'users', auth.currentUser.uid + 'username')
    const descriptionRef = doc(db, 'users', auth.currentUser.uid + 'description')
    const firstnameRef = doc(db, 'users', auth.currentUser.uid + 'firstName')
    const lastnameRef = doc(db, 'users', auth.currentUser.uid + 'lastName')
    const pfpRef = doc(db, 'users', auth.currentUser.uid + 'profile_picture_url')

    const handleUniqueness = async () => {
      const userExists = doc(db, 'usernames', username)
      const usernameSnapshot = await getDoc(userExists)
      if (!usernameSnapshot.exists() || username == permUsername) {
        deleteDoc(doc(db, 'usernames', permUsername))
        setDoc(doc(db, 'usernames', username), {
          isActive: true})
        handleSubmit()
      }
      else {
          alert("Username Already Taken")
      }
  }
    
    useEffect(() => {
      async function getEditData() {
        const userRef = doc(collection(db, 'users'), auth.currentUser.uid)
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data()['username'])
          setPermUsername(docSnap.data()['username'])
          setDescription(docSnap.data()['description'])
          setFirstName(docSnap.data()['firstName'])
          setLastName(docSnap.data()['lastName'])
          setPFP(docSnap.data()['profile_picture_url'])
        } 
      }
      getEditData()
    }, [useIsFocused()])

    const navigator = useNavigation()

    const handleSubmit = (() => {
      updateDoc(userRef, {
        firstName: firstName,
        lastName: lastName,
        description: description,
        profile_picture_url: pfp,
        username: username,
      })
      .then(() => {
        navigator.navigate("Home", {screen: "Profile"})
      })
    })

    return (
      <SafeAreaView style={{flex:1, backgroundColor:COLORS.Background}}>
        <Text style={MStyles.pageTitle}>Edit Profile</Text>
        <View style={MStyles.headerContainer}>
          <Text style={MStyles.header}>Change Username:</Text>
        </View>
        <TextInput style={MStyles.input} autoCapitalize="none" value={username} onChangeText={text => setUsername(text)}/>
        <View style={MStyles.headerContainer}>
          <Text style={MStyles.header}>Change Profile Description:</Text>
        </View>
        <TextInput style={MStyles.input} maxLength={150} autoCapitalize="none" value={description} onChangeText={text => setDescription(text)}/>
        <View style={MStyles.headerContainer}>
          <Text style={MStyles.header}>Change First Name:</Text>
        </View>
        <TextInput style={MStyles.input} autoCapitalize="none" value={firstName} onChangeText={text => setFirstName(text)}/>
        <View style={MStyles.headerContainer}>
          <Text style={MStyles.header}>Change Last Name:</Text>
        </View>
        <TextInput style={MStyles.input} autoCapitalize="none" value={lastName} onChangeText={text => setLastName(text)}/>
        <View style={MStyles.headerContainer}>
          <Text style={MStyles.header}>Change Profile Pic URL:</Text>
        </View>
        <TextInput style={MStyles.input} autoCapitalize="none" value={pfp} onChangeText={text => setPFP(text)}/>
        <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={() => handleUniqueness()}>
          <Text style={MStyles.buttonSolidBackgroundText}>Submit</Text>
        </TouchableHighlight>
        <TouchableHighlight style={MStyles.buttonTranslucentBackground} onPress={() => navigator.navigate("Home", {screen: "Profile"})}>
            <Text style={MStyles.buttonTranslucentBackgroundText} >Cancel</Text>
        </TouchableHighlight>
      </SafeAreaView>

    );
  }