import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { get, getDatabase, set, update } from "firebase/database";
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Image, View, Text, SafeAreaView, TextInput, Button, TouchableHighlight, Dimensions } from "react-native";
import { COLORS } from '../components/Colors/ColorScheme'
import { MStyles } from "../components/Mason Styles/MStyles";
import {getDownloadURL, getStorage, uploadBytes, ref} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from "react-native-paper";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NewUserScreen({route, navigation}) {
    const [description, setDescription] = useState('')
    const [image, setImage] = useState("")

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.cancelled) {
          setImage(result.uri);
        }
      };
    const db = getFirestore()
    const auth = getAuth()
    const store = getStorage()
    const reference = doc(db, 'users', auth.currentUser.uid)

    const handleSubmit = async () => {
        
        
        await updateDoc(reference, {
            newUser: false,
            description: description
        })

        const storageRef = ref(store, "images/" + auth.currentUser.uid)
        const response = await fetch(image);
        const blob = await response.blob();
  
        uploadBytes(storageRef, blob)
          .then((snapshot) => {
            getDownloadURL(storageRef)
              .then((url) => {
                updateDoc(reference, {
                  profile_picture_url: url,
                })
                  .catch((error) => {
                    alert(error.message)
                  })
              })
              .catch((error) => {
                alert(error.message)
              })
          })
          .catch((error) => {
            alert(error.message)
          })

        navigation.replace("Home", {screen: "HomeScreen"})
    }

    const skip = () => {
        updateDoc(reference, {
            newUser: false,
        })
        navigation.replace("Home", {screen: "HomeScreen"})
    }

    return (
        <SafeAreaView style={{flex:1, backgroundColor:COLORS.Background}}>
            <Text style={MStyles.pageTitle}>New User Additional Details</Text>
            <View style={MStyles.headerContainer}>
                <Text style={MStyles.header}>Add Profile Pic:</Text>
            </View>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={pickImage}>
                <Text style={MStyles.buttonSolidBackgroundText}>Select Image</Text>
            </TouchableHighlight>
            <View style={MStyles.headerContainer}>
                <Text style={MStyles.header}>Add Profile Description:</Text>
            </View>
            <TextInput style={MStyles.input} maxLength={150} autoCapitalize="none" value={description} onChangeText={text => setDescription(text)}/>
            <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={() => handleSubmit()}>
                <Text style={MStyles.buttonSolidBackgroundText}>Submit</Text>
            </TouchableHighlight>
            <TouchableHighlight style={MStyles.buttonTranslucentBackground} onPress={() => skip()}>
                <Text style={MStyles.buttonTranslucentBackgroundText}>Skip</Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
        width: SCREEN_HEIGHT * 0.2,
        height: SCREEN_HEIGHT * 0.2,
        borderRadius: (SCREEN_HEIGHT * 0.2) / 2,
        alignSelf: 'center'
    },
})