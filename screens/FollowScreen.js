import { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, get, update, onValue } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { TabActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { COLORS } from '../components/Colors/ColorScheme'
import {MStyles} from '../components/Mason Styles/MStyles'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RenderPerson from '../components/Follow/RenderPerson';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function FollowScreen({route, navigation}) {
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);


    const currentUid = route.params.id
    const db = getDatabase()

    const refFollowers = ref(db, '/users/' + currentUid + '/followers')
    const refFollowing = ref(db, '/users/' + currentUid + '/following')

    const Tab = createMaterialTopTabNavigator();

    function renderScreen(list) {
        return (
            <SafeAreaView style={{width: SCREEN_WIDTH, flex: 1, backgroundColor: COLORS.Background}}>
                <ScrollView snapToInterval={SCREEN_WIDTH} decelerationRate="fast" horizontal={true}>
                    <FlatList 
                    width={SCREEN_WIDTH} 
                    data={list}
                    keyExtractor={(item) => item.key}
                    renderItem={(item) => (   
                        <RenderPerson uid={item.item} db={db} navigation={navigation} prevId={currentUid}/>  
                    )}/>
                </ScrollView>
            </SafeAreaView>
        )
    }

    useEffect(() => {
        onValue(refFollowers, snapshot => {
            if (snapshot.val() == null) {
                setFollowersList(0)
            }
            else {
                let arr = Object.values(snapshot.val())
                setFollowersList(arr)
            }
        })
        onValue(refFollowing, snapshot => {
            if (snapshot.val() == null) {
                setFollowingList(0)
            }
            else {
                let arr = Object.values(snapshot.val())
                setFollowingList(arr)
            }
        })
    }, [useIsFocused()])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Background}}>
            <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05}}>
                <MaterialCommunityIcons onPress={() => navigation.goBack()} name="chevron-left" color={COLORS.Paragraph} size={25}/>
            </View>
            <Tab.Navigator
            initialRouteName={route.params.start}
            screenOptions={{
                tabBarStyle: {backgroundColor: COLORS.Background, 
                    height: SCREEN_HEIGHT * 0.05},
                tabBarActiveTintColor: COLORS.Button,
                tabBarInactiveTintColor: COLORS.Paragraph,
                tabBarIndicatorStyle: {backgroundColor: COLORS.Button, width: SCREEN_WIDTH * 0.25, marginHorizontal: SCREEN_WIDTH * 0.125}
            }}
            >
                <Tab.Screen name="FollowersList" 
                options={{
                    tabBarLabel: 'Followers',
                    unmountOnBlur: true,
                }}>
                    {() => renderScreen(followersList)}
                </Tab.Screen>
                <Tab.Screen name="FollowingList"
                options={{
                    tabBarLabel: 'Following',
                    unmountOnBlur: true
                }}>
                    {() => renderScreen(followingList)}
                </Tab.Screen>
            </Tab.Navigator>
        </SafeAreaView>
    ) 
}

