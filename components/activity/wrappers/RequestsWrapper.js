import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { useEffect, useState } from 'react/cjs/react.development';
import Requests from '../Requests';
import ResponseCount from '../ResponseCount';
import Timestamp from '../Timestamp';
import moment from "moment";
import { useIsFocused } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default function RequestsWrapper(props) {
    const [reqActivity, setRequests] = useState([])
    const isFocused = useIsFocused();
    useEffect(() => {
        setRequests(props.reqActivity)

    }, [props, isFocused])
    return (
        <>
            <View style={{ height: windowHeight * .4 }}>
                <Text style={{ marginLeft: 'auto', marginRight: 'auto', color: 'white', fontSize: 22.5, fontWeight: '700', paddingBottom:"3.5%" }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView>
                        {reqActivity.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1).map((req) => {
                            return (
                                // <Likes title={like.pollID.slice(0, -28)} time={<Timestamp time={like.timestamp}/>} pollID={like.pollID}  answerNum="12" />
                                <Requests reqID={req.userID} time={<Timestamp time = {req.timestamp}/>} hasInt={props.hasInt}/>
                                // <Requests reqID={req.userID} time={<Timestamp time = {req.timestamp} hasInt={props.hasInt}/>}/>
                                // console.log("XXX  ", req.userID, req.timestamp)
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