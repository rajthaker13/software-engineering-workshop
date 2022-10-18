import React, {useEffect, useState} from 'react';
import { ActionSheetIOS, Alert, Image, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, applyActionCode, sendEmailVerification, ActionCodeOperation, reload } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, set } from "firebase/database";
import { ReactNativeFirebase } from '@react-native-firebase/app';
import { FirebaseError } from 'firebase/app';


export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation()
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user.emailVerified) {
                navigation.replace("Home")
            }
        })

        return unsubscribe
    }, [])

    const auth = getAuth()
    
    const handleSignup = () => (
        navigation.replace("Registration")
    );

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                user.reload()
            })
            .catch(error => alert(error.message))
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <View style={styles.image}>
                 <Image source={require("../assets/favicon.png")} />
            </View>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Username:</Text>
                    <TextInput 
                    placeholder="firstname.lastname@domain.com" 
                    placeholderTextColor={"white"}
                    keyboardType='email-address' 
                    value={email} 
                    onChangeText={text => setEmail(text)} 
                    autoCapitalize={'none'}
                    style={styles.input}/>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Password:</Text>
                    <TextInput 
                    placeholder="Password" 
                    placeholderTextColor={"white"}
                    secureTextEntry="true"
                    value={password} 
                    onChangeText={text => setPassword(text)}
                    autoCapitalize={'none'}  
                    style={styles.input}/>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                    onPress={handleLogin}
                    style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    onPress={handleSignup}
                    style={[styles.button, styles.buttonOutline]}>
                        <Text style={styles.buttonOutlineText}>Sign Up</Text>
                    </TouchableHighlight>
                </View> 
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontWeight:'400',
        textAlign: 'left',
        fontSize: 16,
        letterSpacing: 0.5,
        color: "white"
    },
    image: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        backgroundColor: "black",
        color: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 2.5,
        marginBottom: 5,
        borderColor: "#e91e63",
        borderRadius: 10,
        borderWidth: 2,
    },
    inputContainer: {
        width: '80%',
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: '#e91e63',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',     
    },
    buttonText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 20,
    },
    buttonOutline: {
        backgroundColor: 'black',
        marginTop: 5,
        borderColor: '#e91e63',
        borderWidth: 2
    },
    buttonOutlineText: {
        color: '#e91e63',
        fontWeight: '700',
        fontSize: 20
    },
});