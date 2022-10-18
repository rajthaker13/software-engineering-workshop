import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native'
function SearchScreen() {
    return (
        <>
            <SearchBar />
            <Content />

        </>
    )
}

function SearchBar(props) {
    return (
        <TextInput
            style={{
                margin: 20,
                padding: 5,
                height: 40,
                width: 390,
                borderColor: 'gray',
                borderWidth: 1,
                backgroundColor: '#3B3C3B'
            }}
            defaultValue="Search for polls!"
        />
    )

}


function Content(props) {

    return (



        <View style={{
            backgroundColor: '#3B3C3B',
            width: 390,
            height: 700,
            paddingTop: 10
        }}>
            <>
                <NearYouPollWrapper title="Polls Near You" />
                <TrendingPollWrapper title="Trending Polls" />
                <GroupWrapper title="Groups for You" />
            </>
        </View>

    )

}


function NearYouPollWrapper(props) {
    return (
        <>
            <View style={{ height: 210 }}>
                <Text style={{ marginLeft: 20, color: 'white', fontFamily: "Federo", fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        <Poll title="Poll 1" time="1h" answerNum="432" />
                        <Poll title="Poll 2" time="1h" answerNum="432" />
                        <Poll title="Poll 3" time="1h" answerNum="432" />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}

function TrendingPollWrapper(props) {
    return (
        <>
            <View style={{ height: 210 }}>
                <Text style={{ marginLeft: 20, color: 'white', fontFamily: "Federo", fontSize: 20 }}> {props.title}</Text>
                <SafeAreaView>
                    <ScrollView horizontal={true}>
                        <Poll title="Poll 1" time="1h" answerNum="432" />
                        <Poll title="Poll 2" time="1h" answerNum="432" />
                        <Poll title="Poll 3" time="1h" answerNum="432" />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}

function GroupWrapper(props) {
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


function Poll(props) {
    return (

        <View style={{
            backgroundColor: '#D9D9D9', borderWidth: 10, borderColor: '#010101', borderRadius: 20,
            width: 150,
            height: 140,
            marginTop: 15,
            marginLeft: 15,
            marginBottom: 15,
            marginRight: 0,
            padding: 5,
            flex: 1
        }}>
            <Text style={{ fontSize: 10 }}>{props.time}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>{props.title}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}>{props.answerNum} answers</Text>
        </View>
    )
}

function Group(props) {
    return (

        <View style={{
            backgroundColor: '#D9D9D9', borderWidth: 10, borderColor: '#010101', borderRadius: 20,
            width: 150,
            height: 220,
            marginTop: 15,
            marginLeft: 15,
            marginBottom: 15,
            marginRight: 0,
            padding: 5,
            flex: 1
        }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>{props.name}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}> Admin: {props.admin}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}> Group Type: {props.type}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', bottom: 0 }}> Members: {props.membersNum}</Text>
        </View>
    )
}


export default SearchScreen
