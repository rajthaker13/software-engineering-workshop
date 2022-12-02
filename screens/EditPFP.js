import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Image, View, Text, SafeAreaView, TextInput, Button, TouchableHighlight, Dimensions } from "react-native";
import { COLORS } from '../components/Colors/ColorScheme'
import { MStyles } from "../components/Mason Styles/MStyles";
import {getDownloadURL, getStorage, uploadBytes, ref, uploadBytesResumable} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function EditPFPScreen({route, navigation}) {
    const [image, setImage] = useState("")

    const db = getFirestore()
    const auth = getAuth()
    const userRef = doc(db, 'users', auth.currentUser.uid)

    useEffect(() => {
        async function getEditData() {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setImage(docSnap.data()['profile_picture_url'])
          } 
        }
        getEditData()
      }, [])


    let store = getStorage()

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

    const editPFP = async () => {

        const storageRef = ref(store, "images/" + auth.currentUser.uid)
  
        const response = await fetch(image);
        const blob = await response.blob();
        
  
        uploadBytesResumable(storageRef, blob)
          .then((snapshot) => {
            getDownloadURL(storageRef)
              .then((url) => {
                alert("Image Uploaded Successfully")
                updateDoc(userRef, {
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
      }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.Background}}>
            <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05}}>
                <MaterialCommunityIcons onPress={() => navigation.goBack()} name="chevron-left" color={COLORS.Paragraph} size={25}/>
            </View>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={pickImage}>
                <Text style={MStyles.buttonSolidBackgroundText}>Select Image</Text>
            </TouchableHighlight>
            <TouchableHighlight style={MStyles.buttonTranslucentBackground} onPress={editPFP}>
                <Text style={MStyles.buttonTranslucentBackgroundText}>Upload Image</Text>
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