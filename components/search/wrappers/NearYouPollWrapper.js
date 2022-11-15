import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import Poll from '../Poll';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;





export default function NearYouPollWrapper(props) {
    
    let pollArray = props.polls
    
  

    return (
        <>
            <View style={{ height: windowHeight * .55 }}>
                <Text style={{ marginLeft: 20, color: 'white', fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        {pollArray.map((poll) => {
                            // {console.log(poll.key);}
                            return(
                                <Poll title={poll.title} time="1h" answerNum={poll.likes} pollID={poll.key}/>
                            )
                            
                        })}
                    
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}