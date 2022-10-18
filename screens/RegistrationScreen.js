import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableHighlight } from "react-native";

export default function RegistrationScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigator = useNavigation()
    const auth = getAuth()

    const handleSignup = () => (
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                sendEmailVerification(user, { handleCodeInApp: true, url: 'https://pollme-24549.firebaseapp.com' })
            })
            .then(() => {
                alert('Verification email sent')
            })
            .catch(error => alert(error.message))
            .then(() => {
                const db = getDatabase();
                const reference = ref(db, 'users/' + auth.currentUser.uid)

                set(reference, {
                    username: username,
                    profile_picture_url: '',
                    followers: 0,
                    following: 0,
                    firstName: 'John',
                    lastName: 'Doe',
                    likes: 0,
                    dislikes: 0,
                    numPolls: 0,
                    description: '',
                    polls: [],
                    groups: [],
                    activity: ''
                })

                navigator.replace("Login")
            })
            .catch(error => alert(error.message))
    );

    return (
        <SafeAreaView>
            <Text >Email</Text>
            <TextInput keyboardType='email-address'
                value={email}
                onChangeText={text => setEmail(text)} />
            <Text>Password</Text>
            <TextInput secureTextEntry="true"
                value={password}
                onChangeText={text => setPassword(text)} />
            <Text>Username</Text>
            <TextInput value={username}
                onChangeText={text => setUsername(text)} />
            <TouchableHighlight onPress={handleSignup}>
                <Text>Sign Up</Text>
            </TouchableHighlight>
        </SafeAreaView>
    );
}