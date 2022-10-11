import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Button, TextInput} from 'react-native';
function ProfileScreen() {
    return (
<SafeAreaView style={{flex: 1, justifyContent: "center", alignContent: "center"}}>
    <View style={{flex: 0.35, backgroundColor: "white"}}>
      <Text>Username</Text>
    </View>
    <View style={{flex: 1, backgroundColor: "black", flexDirection: "row"}}>
      <View style={{flex: 0.4, flexDirection: "column"}}>
        <View style={{flex: 1, backgroundColor: "white", justifyContent: "center", alignContent: "center", alignItems: "center"}}><Image source={require('../assets/favicon.png')}/></View>
        <Text style={{flex: 0.5, backgroundColor: "white"}}>First Name Last Name</Text>
        <Text style={{flex: 0.5, backgroundColor: "white"}}>Description</Text>
      </View>
      <View style={{flex: 0.6, backgroundColor: "white", flexDirection: "column"}}>
        <View style={{flex: 1, backgroundColor: "white", flexDirection: "column"}}>
          <View style={{flex: 1, flexDirection: "row", justifyContent: "space-around"}}>
            <Text>123</Text>
            <Text>456</Text>
            <Text>789</Text>
          </View>
          <View style={{flex: 1, flexDirection: "row", justifyContent: "space-around"}}>
            <Text>Polls</Text>
            <Text>Followers</Text>
            <Text>Following</Text>
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: "white"}}/>
      </View>
    </View>
    <View style={{flex: 0.25, backgroundColor: "white", borderWidth: 2, justifyContent: "center"}}>
      <TouchableHighlight><Button title="Edit Profile" alignContents="center"/></TouchableHighlight>
    </View>
    <View style={{flex: 0.5, backgroundColor: "black", flexDirection: "row", justifyContent: "center"}}>
      <Button title="up"/>
      <Button title="down"/>
    </View>
    <View style={{flex: 0.25, backgroundColor: "white"}}>
      <Text>Your Polls</Text>
    </View>
    <View style={{flex: 1, backgroundColor: "black"}}>

    </View>
    <View style={{flex: 0.25, backgroundColor: "white"}}>
      <Text>Your Groups</Text>
    </View>
    <View style={{flex: 1.5, backgroundColor: "black"}}>

    </View>
    <View style={{flex: 0.35, backgroundColor: "white"}}>
      <Text>Bottom Bar</Text>
    </View>
</SafeAreaView>
    )
}
export default ProfileScreen