import React, { useEffect, useState } from 'react';
import { ActionSheetIOS, Alert, Image, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, applyActionCode, sendEmailVerification, ActionCodeOperation, reload, sendPasswordResetEmail } from "firebase/auth";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getDatabase, ref, set } from "firebase/database";
import { ReactNativeFirebase } from '@react-native-firebase/app';
import { FirebaseError } from 'firebase/app';
import { COLORS } from '../components/Colors/ColorScheme'
import { doc, getDoc, getFirestore } from 'firebase/firestore';



export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation()

    const auth = getAuth()
    const db = getFirestore()

    const handleSignup = () => (
        navigation.push("Registration")
    );

    const navigateWhere = async () => {
        const ref = doc(db, 'users', auth.currentUser.uid)
        const data = await getDoc(ref)
        if (data.data()['newUser']) {
            navigation.replace("New User")
        }
        else {
            navigation.replace("Home")
        }
    }

    const handleLogin = (() => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                user.reload()
                if (user.emailVerified) {
                    navigateWhere()
                }
            })
            .catch(error => alert(error.message))
    })

    const handlePasswordReset = (() => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password Reset Email Sent")
            })
            .catch((e) => {
                alert(e.message)
            })
    })


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Background }}>
            <View style={styles.image}>
                <Image source={require("../assets/favicon.png")} />
            </View>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Email:</Text>
                    <TextInput
                        placeholder="firstname.lastname@domain.com"
                        placeholderTextColor={"white"}
                        keyboardType='email-address'
                        value={email}
                        onChangeText={text => setEmail(text)}
                        autoCapitalize={'none'}
                        style={styles.input} />
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
                        style={styles.input} />
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
                    <TouchableHighlight
                        onPress={handlePasswordReset}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableHighlight>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontWeight: '400',
        textAlign: 'left',
        fontSize: 16,
        letterSpacing: 0.5,
        color: COLORS.Headline
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
        backgroundColor: COLORS.Background,
        color: COLORS.Headline,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 2.5,
        marginBottom: 5,
        borderColor: COLORS.Button,
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
        backgroundColor: COLORS.Button,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.Background,
        fontWeight: '700',
        fontSize: 20,
    },
    buttonOutline: {
        backgroundColor: COLORS.Background,
        marginTop: 5,
        borderColor: COLORS.Button,
        borderWidth: 2,
        marginBottom: 5
    },
    buttonOutlineText: {
        color: COLORS.Button,
        fontWeight: '700',
        fontSize: 20
    },
});