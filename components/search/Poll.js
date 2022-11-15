import React from 'react'
import { Button,Pressable, StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../Colors/ColorScheme';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Poll(props) {

    const navigation = useNavigation();


    return (
        
        <View style={{
            backgroundColor: COLORS.Background, borderWidth: 10, borderColor: COLORS.Button, borderRadius: 15,
            width: 150,
            height: 140,
            marginTop: 15,
            marginLeft: 15,
            marginBottom: 15,
            marginRight: 0,
            padding: 5,
            flex: 1
        }}>
            <Text style={{ fontSize: 10, color:COLORS.Paragraph }}>{props.time}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, color:COLORS.Paragraph }}>{props.title}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 , color:COLORS.Paragraph}}>{props.answerNum} likes in the past minute</Text>
        </View>
        
      
    )
}