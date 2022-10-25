import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TextInput, Button } from "react-native";

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
        navigator.replace("Home")
      })
    })

    return (
      <SafeAreaView>
        <View>
          <Text>Change Username:</Text>
          <TextInput autoCapitalize="none" value={username} onChangeText={text => setUsername(text)}/>
        </View>
        <View>
          <Text>Change Profile Description:</Text>
          <TextInput maxLength={150} autoCapitalize="none" value={description} onChangeText={text => setDescription(text)}/>
        </View>
        <View>
          <Text>Change First Name:</Text>
          <TextInput autoCapitalize="none" value={firstName} onChangeText={text => setFirstName(text)}/>
        </View>
        <View>
          <Text>Change Last Name:</Text>
          <TextInput autoCapitalize="none" value={lastName} onChangeText={text => setLastName(text)}/>
        </View>
        <View>
          <Text>Change Profile Pic URL:</Text>
          <TextInput  autoCapitalize="none" value={pfp} onChangeText={text => setPFP(text)}/>
        </View>
        <View>
          <Button title="submit" onPress={() => handleSubmit()}/>
        </View>
      </SafeAreaView>

    );
  }