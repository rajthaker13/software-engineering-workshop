import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import Group from '../Group'


export default function GroupWrapper(props) {
    return (
        <>
            <View style={{ height: 270 }}>
                <Text style={{ marginLeft: 20, color: 'white', fontFamily: "Federo", fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        <Group name="Group 1" admin="User" type="Public" membersNum="432" />
                        <Group name="Group 2" admin="User" type="Private" membersNum="432" />
                        <Group name="Group 3" admin="User" type="Whatever" membersNum="432" />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}