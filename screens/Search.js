import React, { useState, useEffect } from 'react'
import { Pressable,StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions,StatusBar } from 'react-native'
import SearchBar from '../components/search/SearchBar'
import GroupWrapper from '../components/search/wrappers/GroupWrapper';
import NearYouPollWrapper from '../components/search/wrappers/NearYouPollWrapper';
import TrendingPollWrapper from '../components/search/wrappers/TrendingPollWrapper';
import Header from '../components/common/Header';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { COLORS } from '../components/Colors/ColorScheme';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


function Search() {
    const navigation = useNavigation();

    return (

    <SafeAreaView style={{backgroundColor: COLORS.Background,height:windowHeight}}>
        <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05,paddingLeft:20}}>
            <MaterialCommunityIcons onPress={() => navigation.navigate("Search")} name="chevron-left" color={COLORS.Paragraph} size={25}/>
        </View>
        <SearchBar />
    </SafeAreaView>
    )
}




export default Search
