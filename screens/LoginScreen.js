import React, {useEffect, useState} from 'react';
import { Image, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home")
            }
        })

        return unsubscribe
    }, [])

    const auth = getAuth()
    const handleSignup = () => (
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
            })
            .catch(error => alert(error.message))
    );

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
            })
            .catch(error => alert(error.message))
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.image}>
                 <Image source={require("../assets/favicon.png")} />
            </View>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.inputContainer}>
                    <Text>Username:</Text>
                    <TextInput 
                    placeholder="firstname.lastname@domain.com" 
                    keyboardType='email-address' 
                    value={email} 
                    onChangeText={text => setEmail(text)} 
                    style={styles.input}/>
                </View>
                <View style={styles.inputContainer}>
                    <Text>Password:</Text>
                    <TextInput 
                    placeholder="Password" 
                    secureTextEntry="true"
                    value={password} 
                    onChangeText={text => setPassword(text)}  
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
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    inputContainer: {
        width: '80%'
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: 'blue',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItmes: 'center',     
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: 'blue',
        borderWidth: 2
    },
    buttonOutlineText: {
        color: 'blue',
        fontWeight: '700',
        fontSize: 16
    },
});