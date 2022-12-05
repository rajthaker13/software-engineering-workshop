import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { useState } from "react";
import { Keyboard, SafeAreaView, Text, TextInput, TouchableHighlight, View, Switch } from "react-native";
import { COLORS } from '../components/Colors/ColorScheme'
import { MStyles } from "../components/Mason Styles/MStyles";
import { collection, addDoc, setDoc, doc, updateDoc, getDocs, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore } from "firebase/firestore";
import GestureRecognizer from "react-native-swipe-gestures";


export default function RegistrationScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [privAcnt, setPrivAcnt] = useState(false);
    const toggleSwitch = () => setPrivAcnt(previousState => !previousState);
    const navigator = useNavigation()
    
    const auth = getAuth()
    const db = getFirestore();


    const handleUniqueness = async () => {
        const userExists = doc(db, 'usernames', username)
        const usernameSnapshot = await getDoc(userExists)
        if (!usernameSnapshot.exists()) {
            handleSignup()
        }
        else {
            alert("Username Already Taken")
        }
    }

    const handleSignup = async () => (
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                sendEmailVerification(user, { handleCodeInApp: true, url: 'https://pollme-24549.firebaseapp.com' })
            })
            .then(() => {
                alert('Verification email sent')
                ifNoError()
            })
            .catch(error => alert(error.message))
    );

    const ifNoError = async () => {
        const reference = doc(db, 'users', auth.currentUser.uid)
        const usernamesRef = doc(db, 'usernames', username)

        await setDoc(reference, {
            username: username,
            profile_picture_url: 'http://tny.im/tGI',
            followers: { false: false },
            following: { false: false },
            firstName: firstname,
            lastName: lastname,
            likes: 0,
            dislikes: 0,
            numPolls: 0,
            description: '',
            polls: false,
            groups: false,
            privAcnt: privAcnt,
            activity: '',
            newUser: true
        })
        await setDoc(usernamesRef, {
            isActive: true
        })

        navigator.navigate("Login")
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Background }}>
            <GestureRecognizer
            style={{flex: 1 }}
            onSwipeDown={ () => Keyboard.dismiss() }
            >
                <Text style={MStyles.pageTitle}>User Registration</Text>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Email</Text>
                </View>
                <TextInput keyboardType='email-address'
                    autoCapitalize={'none'}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={MStyles.input} />
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Username</Text>
                </View>
                <TextInput value={username}
                    autoCapitalize={'none'}
                    onChangeText={text => setUsername(text)}
                    style={MStyles.input} 
                    maxLength={40}/>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Password</Text>
                </View>
                <TextInput secureTextEntry="true"
                    autoCapitalize={'none'}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={MStyles.input} />
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>First Name</Text>
                </View>
                <TextInput value={firstname}
                    autoCapitalize={'none'}
                    onChangeText={text => setFirstname(text)}
                    style={MStyles.input} 
                    maxLength={20}/>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Last Name</Text>
                </View>
                <TextInput value={lastname}
                    autoCapitalize={'none'}
                    onChangeText={text => setLastname(text)}
                    style={MStyles.input} 
                    maxLength={20}/>
                
                <View style={{flexDirection: "row", paddingTop:"3%"}}>
                    <MaterialCommunityIcons name="account-lock-outline" color='#7f5af0' size={30} style={{marginLeft: "12.5%"}}/>
                    <Text style={[MStyles.header, {paddingLeft: "3%"}]}>Private account</Text>
                    <View style={{marginLeft: "-20%"}}>
                        <Switch
                            // style={{marginLeft: "-1900%"}}
                            trackColor={{ false: "#767577", true: "#7f5af0" }}
                            thumbColor={privAcnt ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={privAcnt}
                        />
                    </View>
                </View>
                <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={handleUniqueness}>
                    <Text style={MStyles.buttonSolidBackgroundText}>Sign Up</Text>
                </TouchableHighlight>
                <TouchableHighlight style={MStyles.buttonTranslucentBackground} onPress={() => navigator.replace("Login")}>
                    <Text style={MStyles.buttonTranslucentBackgroundText}>Go Back</Text>
                </TouchableHighlight>
            </GestureRecognizer>
        </SafeAreaView>
    );
}