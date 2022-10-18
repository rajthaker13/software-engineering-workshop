import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import SearchBar from '../components/search/SearchBar'
import GroupWrapper from '../components/search/wrappers/GroupWrapper';
import NearYouPollWrapper from '../components/search/wrappers/NearYouPollWrapper';
import TrendingPollWrapper from '../components/search/wrappers/TrendingPollWrapper';
import Header from '../components/common/Header';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function SearchScreen() {
    return (
        <ScrollView>

            <Header />
            <SearchBar />
            <View style={{
                backgroundColor: '#3B3C3B',
                width: windowWidth,
                paddingTop: 10,
                flex: 1
            }}>
                <NearYouPollWrapper title="Polls Near You" />
                <TrendingPollWrapper title="Trending Polls" />
                <GroupWrapper title="Groups for You" />
            </View>

        </ScrollView >
    )
}




export default SearchScreen
