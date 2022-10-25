import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useState } from 'react/cjs/react.development';
import Likes from '../Likes';
import ResponseCount from '../ResponseCount';
import Timestamp from '../Timestamp';
import moment from "moment";
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
                <Text style={{ marginLeft: 20, color: 'white', fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        {likesActivity.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1).map((like) => {
                            return (
                                <Likes title={like.pollID.slice(0, -28)} time={<Timestamp time = {like.timestamp} />} answerNum="12" />
                                // <Likes title={like.pollID.slice(0, -28)} time={<Timestamp time = {like.timestamp} />} answerNum={<ResponseCount answerNum = {like} />} />
                                // <Likes title={like.pollID.slice(0, -28)} time={<Timestamp time = {like.timestamp} />} answerNum={<ResponseCount answerNum = {like.pollID} />} />
                                
                            )
                        }, [isFocused])}

                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}