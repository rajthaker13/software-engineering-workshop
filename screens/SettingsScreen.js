import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { View, Button, SafeAreaView, TouchableHighlight, Text } from "react-native";

export default function SettingsScreen() {
    const auth = getAuth()
    const navigation = useNavigation()

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    return (
        <SafeAreaView>
            <TouchableHighlight onPress={() => handleSignOut()}>
                <Text>Sign out</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => navigation.navigate("Home", {screen: "Profile"})}>
                <Text>Go Back</Text>
            </TouchableHighlight>
        </SafeAreaView>
    );
  }