import { Dimensions, SafeAreaView, Text, TextInput, TouchableHighlight, View } from "react-native";
import { COLORS } from "../components/Colors/ColorScheme";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MStyles } from "../components/Mason Styles/MStyles";
import { useState } from "react";
import { addDoc, arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default function ReportScreen({route, navigation}) {
    const [comment, setComment] = useState('')
    const user = route.params.user
    const type = route.params.type
    const reason = route.params.reason
    const id = route.params.uid
    const db = getFirestore()

    const submitHandler = async () => {
        const reports = doc(db, "Reports", id)
        const docSnap = await getDoc(reports)
        if (!docSnap.exists()) {
            setDoc(reports, {
                docs: [{user: user, type: type, reason: reason, comment: comment}]
            })
        }
        else {
            updateDoc(reports, {
                docs: arrayUnion({user: user, type: type, reason: reason, comment: comment})
            })
        }
        alert("Report Submitted")
        navigation.pop()
    }

    return (
        <SafeAreaView style={{backgroundColor: COLORS.Background, flex: 1}}>
            <View style={{width: SCREEN_WIDTH * 0.1}}>
                    <MaterialCommunityIcons onPress={() => navigation.pop()} name="chevron-left" color={COLORS.Paragraph} size={25} />
            </View>
            <View>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>User:</Text>
                </View>
                <TextInput style={MStyles.input} editable={false} maxLength={40} defaultValue={user}/>
            </View>
            <View>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Type:</Text>
                </View>
                <TextInput style={MStyles.input} editable={false} maxLength={40} defaultValue={type}/>
            </View>
            <View>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Reason:</Text>
                </View>
                <TextInput style={MStyles.inputMedium} editable={false} maxLength={150} multiline={true} defaultValue={reason}/>
            </View>
            <View>
                <View style={MStyles.headerContainer}>
                    <Text style={MStyles.header}>Additional Comment:</Text>
                </View>
                <TextInput placeholderTextColor={COLORS.Paragraph} placeholder="Specify Whats Wrong" style={MStyles.inputLong} maxLength={450} multiline={true} onChangeText={(text) => setComment(text)} autoCapitalize={false}/>
            </View>
            <TouchableHighlight style={MStyles.buttonSolidBackground} onPress={() => submitHandler()}>
                <Text style={MStyles.buttonSolidBackgroundText}>Submit</Text>
            </TouchableHighlight>
        </SafeAreaView>
    );
  }