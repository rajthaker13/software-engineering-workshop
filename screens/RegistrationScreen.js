import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableHighlight } from "react-native";

export default function RegistrationScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const navigator = useNavigation()
    const auth = getAuth()

    const handleSignup = () => (
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                sendEmailVerification(user, {handleCodeInApp: true, url: 'https://pollme-24549.firebaseapp.com'})
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
                        followers: false,
                        following: false,
                        firstName: firstname,
                        lastName: lastname,
                        likes: 0,
                        dislikes: 0,
                        numPolls: 0,
                        description: '',
                        polls: [],
                        groups: [],
                    })
                    
                    navigator.replace("Login")
                })
            .catch(error => alert(error.message))
    );

    return (
        <SafeAreaView>
            <Text >Email</Text>
            <TextInput keyboardType='email-address' 
                autoCapitalize={'none'}
                value={email} 
                onChangeText={text => setEmail(text)}/>
            <Text>Password</Text>
            <TextInput secureTextEntry="true"
                autoCapitalize={'none'}
                value={password} 
                onChangeText={text => setPassword(text)}/>
            <Text>Username</Text>
            <TextInput value={username}
                autoCapitalize={'none'} 
                onChangeText={text => setUsername(text)}/>
            <Text>First Name</Text>
            <TextInput value={firstname}
                autoCapitalize={'none'} 
                onChangeText={text => setFirstname(text)}/>
            <Text>Last Name</Text>
            <TextInput value={lastname}
                autoCapitalize={'none'} 
                onChangeText={text => setLastname(text)}/>
            <TouchableHighlight onPress={handleSignup}>
                <Text>Sign Up</Text>
            </TouchableHighlight>
        </SafeAreaView>
    );
}