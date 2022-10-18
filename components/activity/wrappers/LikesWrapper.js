import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useState } from 'react/cjs/react.development';
import Likes from '../Likes';
import { useIsFocused } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function LikesWrapper(props) {
    const [likesActivity, setLikesActivity] = useState([])
    const isFocused = useIsFocused();
    useEffect(() => {
        setLikesActivity(props.likeActivity)

    }, [isFocused])
    return (
        <>
            <View style={{ height: windowHeight * .22 }}>
                <Text style={{ marginLeft: 20, color: 'white', fontFamily: "Federo", fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        {props.likeActivity.map((like) => {
                            return (
                                <Likes title={like.timestamp} time="1h" answerNum="432" />

                            )
                        })}

                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}