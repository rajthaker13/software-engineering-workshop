import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useState } from 'react/cjs/react.development';
import Dislikes from '../Dislikes';
import Timestamp from '../Timestamp';
import ResponseCount from '../ResponseCount';
import moment from "moment";



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

 

export default function DislikesWrapper(props) {
    const [dislikesActivity, setDislikesActivity] = useState([])
    useEffect(() => {
        setDislikesActivity(props.dislikeActivity)

    }, [])
    return (
        <>
            <View style={{ height: windowHeight * .22 }}>
                <Text style={{ marginLeft: 20, color: 'white', fontFamily: "Federo", fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        {dislikesActivity.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1).map((dislike) => {
                            return (
                                <Dislikes title={dislike.pollID.slice(0, -28)} time={<Timestamp time = {dislike.timestamp} />} answerNum="432" />
                            )
                        })}

                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}
