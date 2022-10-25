import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import Poll from '../Poll';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;





export default function NearYouPollWrapper(props) {
    
    let pollArray = props.polls
    
  

    return (
        <>
            <View style={{ height: windowHeight * .22 }}>
                <Text style={{ marginLeft: 20, color: 'white', fontFamily: "Federo", fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        {pollArray.map((poll) => {
                            return(
                                <Poll title={poll.title} time="1h" answerNum={poll.comments}/>

                            )
                            
                        })}
                        {/* <Poll title="Poll 1" time="1h" answerNum="432" />
                        <Poll title="Poll 2" time="1h" answerNum="432" />
                        <Poll title="Poll 3" time="1h" answerNum="432" /> */}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}