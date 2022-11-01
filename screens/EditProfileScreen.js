import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TextInput, Button, TouchableHighlight } from "react-native";
import { COLORS } from '../components/Colors/ColorScheme'
import { MStyles } from "../components/Mason Styles/MStyles";


export default function EditProfileScreen() {
    const [username, setUsername] = useState('')
    const [description, setDescription] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pfp, setPFP] = useState('')

    const db = getDatabase()
    const auth = getAuth()
    const userRef = ref(db, 'users/' + auth.currentUser.uid)
    const usernameRef = ref(db, 'users/' + auth.currentUser.uid + '/username')
    const descriptionRef = ref(db, 'users/' + auth.currentUser.uid + '/description')
    const firstnameRef = ref(db, 'users/' + auth.currentUser.uid + '/firstName')
    const lastnameRef = ref(db, 'users/' + auth.currentUser.uid + '/lastName')
    const pfpRef = ref(db, 'users/' + auth.currentUser.uid + '/profile_picture_url')

    
    useEffect(() => {
      get(usernameRef).then(snapshot => {
        setUsername(snapshot.val())
      })
      get(descriptionRef).then(snapshot => {
        setDescription(snapshot.val())
      })
      get(firstnameRef).then(snapshot => {
        setFirstName(snapshot.val())
      })
      get(lastnameRef).then(snapshot => {
        setLastName(snapshot.val())
      })
      get(pfpRef).then(snapshot => {
        setPFP(snapshot.val())
      })
    }, [useIsFocused()])

    const navigator = useNavigation()

    const handleSubmit = (() => {
      update(userRef, {
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
        <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={() => handleSubmit()}>
          <Text style={MStyles.buttonSolidBackgroundText}>Submit</Text>
        </TouchableHighlight>
        <TouchableHighlight style={MStyles.buttonTranslucentBackground} onPress={() => navigator.navigate("Home", {screen: "Profile"})}>
            <Text style={MStyles.buttonTranslucentBackgroundText} >Cancel</Text>
        </TouchableHighlight>
      </SafeAreaView>

    );
  }