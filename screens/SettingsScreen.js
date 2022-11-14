import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { View, Button, SafeAreaView, TouchableHighlight, Text } from "react-native";
import { COLORS } from '../components/Colors/ColorScheme'
import { MStyles } from "../components/Mason Styles/MStyles";


export default function SettingsScreen() {
    const auth = getAuth()
    const navigation = useNavigation()

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]})
            })
            .catch(error => alert(error.message))
    }

    return (
        <SafeAreaView style={{backgroundColor: COLORS.Background, flex: 1}}>
            <Text style={MStyles.pageTitle}>Settings</Text>
            <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={() => handleSignOut()}>
                <Text style={MStyles.buttonSolidBackgroundText}>Sign out</Text>
            </TouchableHighlight>
            <TouchableHighlight style={MStyles.buttonTranslucentBackground} onPress={() => navigation.navigate("Home", {screen: "Profile"})}>
                <Text style={MStyles.buttonTranslucentBackgroundText}>Go Back</Text>
            </TouchableHighlight>
        </SafeAreaView>
    );
  }