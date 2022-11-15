import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useState } from 'react/cjs/react.development';
import Dislikes from '../Dislikes';
import ResponseCount from '../ResponseCount';
import Timestamp from '../Timestamp';
import moment from "moment";
import { useIsFocused } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default function DislikesWrapper(props) {
    const [dislikesActivity, setDislikesActivity] = useState([])
    const isFocused = useIsFocused();
    useEffect(() => {
        setDislikesActivity(props.dislikeActivity)

    }, [props, isFocused])
    return (
        <>
            <View style={{ height: windowHeight, marginLeft:"12%" }}>
                <Text style={{ marginLeft: 'auto', marginRight: 'auto', color: 'white', fontSize: 22.5, fontWeight: '700' }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView>
                        {dislikesActivity.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1).map((dislike) => {
                            return (
                                <Dislikes pollID={dislike.pollID} time={<Timestamp time = {dislike.timestamp} />}/>
                            )
                        }, [isFocused])}

                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}