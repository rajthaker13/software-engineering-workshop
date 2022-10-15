import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable } from 'react-native';

export default function ProfileScreen() {

    const navigation = useNavigation()
    const auth = getAuth()
    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignContent: "center", }}>
            <View>
                <Text style={{ fontSize: 16, color: "white"}}>Username</Text>
            </View>
            <View style={{ flex: 1}}>
                <View style={{ flex: 1, backgroundColor: "black", flexDirection: "row" }}>
                    <View style={{ flex: 0.4, flexDirection: "column" }}>
                        <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}><Image source={require('../assets/favicon.png')} /></View>
                        <Text style={{ flex: 0.5, color: "white" }}>First Name Last Name</Text>
                        <Text style={{ flex: 0.5, color: "white"}}>Description</Text>
                    </View>
                    <View style={{ flex: 0.6, flexDirection: "column" }}>
                        <View style={{ flex: 1, flexDirection: "column" }}>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
                                <Text style={{color: "white"}}>123</Text>
                                <Text style={{color: "white"}}>456</Text>
                                <Text style={{color: "white"}}>789</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", left: 10, bottom: 15 }}>
                                <Text style={{color: "white"}}>Polls</Text>
                                <Text style={{color: "white"}}>Followers</Text>
                                <Text style={{color: "white"}}>Following</Text>
                            </View>
                        </View>
                        <View style={{flex: 1}} />
                    </View>
                </View>
                <View style={{ flex: 0.25, justifyContent: "center", flexDirection: "row" }}>
                    <TouchableHighlight style={{ flex: 0.4 }}><Pressable style={styles.button} onPress={handleSignOut}><Text style={styles.text}>Edit Profile</Text></Pressable></TouchableHighlight>
                </View>
                <View style={{ flex: 0.5, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <TouchableHighlight style={{ flex: 0.3, right: 10 }}><Pressable style={styles.button}><Text style={styles.text}>###</Text><Text style={styles.text}>Up</Text></Pressable></TouchableHighlight>
                    <TouchableHighlight style={{ flex: 0.3, left: 10 }}><Pressable style={styles.button}><Text style={styles.text}>###</Text><Text style={styles.text}>Down</Text></Pressable></TouchableHighlight>
                </View>
                <View style={{ flex: 0.25}}>
                    <Text style={styles.textHeading}>Your Polls</Text>
                </View>
                <View style={{ flex: 1 }}>

                </View>
                <View style={{ flex: 0.25}}>
                    <Text style={styles.textHeading}>Your Groups</Text>
                </View>
                <View style={{ flex: 1.5 }}>

                </View>
            </View>
        </SafeAreaView>
    );
}

function editProfile() {
    return 1;
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'gray',
        flexDirection: "row"
    },
    text: {
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    textHeading: {
        fontSize: 16,
        letterSpacing: 0.25,
        color: 'white',
    }
})