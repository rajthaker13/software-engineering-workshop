import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { View, Button, SafeAreaView } from "react-native";

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
            <Button title="Sign Out" onPress={() => handleSignOut()}/>
        </SafeAreaView>
    );
  }