import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useState } from 'react/cjs/react.development';
import Dislikes from '../Dislikes';
import Likes from '../Likes';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function DislikesWrapper(props) {
    const [dislikesActivity, setLDislikesActivity] = useState([])
    useEffect(() => {
        setLDislikesActivity(props.dislikesActivity)

    }, [])
    return (
        <>
            <View style={{ height: windowHeight * .22 }}>
                <Text style={{ marginLeft: 20, color: 'white', fontFamily: "Federo", fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        {dislikesActivity.map((dislike) => {
                            return (
                                <Dislikes title={dislike.timestamp} time="1h" answerNum="432" />

                            )
                        })}

                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}