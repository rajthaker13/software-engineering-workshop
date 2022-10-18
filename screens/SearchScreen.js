import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import SearchBar from '../components/search/SearchBar'
import GroupWrapper from '../components/search/wrappers/GroupWrapper';
import NearYouPollWrapper from '../components/search/wrappers/NearYouPollWrapper';
import TrendingPollWrapper from '../components/search/wrappers/TrendingPollWrapper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function SearchScreen() {
    return (
        <>
            <SearchBar />
            <View style={{
                backgroundColor: '#3B3C3B',
                width: windowWidth,
                height: windowHeight,
                paddingTop: 10,
                flex: 1
            }}>
                <NearYouPollWrapper title="Polls Near You" />
                <TrendingPollWrapper title="Trending Polls" />
                <GroupWrapper title="Groups for You" />
            </View>

        </>
    )
}




export default SearchScreen
