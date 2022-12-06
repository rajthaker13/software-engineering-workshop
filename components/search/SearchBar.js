import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions, StatusBar } from 'react-native'
import algoliasearch from 'algoliasearch/lite';
import SearchBoxNative from './SearchBoxNative';
import { InstantSearch, Index } from 'react-instantsearch-native';
import InfiniteHits from './InfiniteHits';
import { useState } from 'react';
import UserHits from './UserHits';
import { MStyles } from '../Mason Styles/MStyles';
import { COLORS } from '../Colors/ColorScheme';
import { getAuth } from 'firebase/auth';
import ResultTabs from './SearchTabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const searchClient = algoliasearch('PN9CAYIKKA', 'ecd74f365860ea94f1d92779981d4a64');
// const client = algoliasearch('PN9CAYIKKA', '8426ddb9e02f50bcb8ae7b4a604db602');
// const userIndex = client.initIndex('PollMe_users');

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  separatorText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.Paragraph,
    paddingLeft: 5
  }
});


export default function SearchBar() {
  const [showHits, setShowHits] = useState(false);
  const Tab = createMaterialTopTabNavigator();


  function getPollResults(){
    return(
      
      <SafeAreaView style={{width: SCREEN_WIDTH, flex: 1, backgroundColor: COLORS.Background}}>
        <Index indexName="PollMe_polls">
          <InfiniteHits modalVisible={false}/>
        </Index>
      </SafeAreaView>
    )
  }

  function getUserResults(){
    return(
      <SafeAreaView style={{width: SCREEN_WIDTH, flex: 1, backgroundColor: COLORS.Background}}>

        <Index indexName="PollMe_users">
          <UserHits modalVisible={false}/>
        </Index>
      </SafeAreaView>
            
    )
  }




  //userIndex.saveObjects(test, { autoGenerateObjectIDIfNotExist: true });

  return (

    

    <SafeAreaView>
        <View style={{height: "100%"}}>
          <InstantSearch searchClient={searchClient} indexName="PollMe_polls">
            <SearchBoxNative onFocus={()=>setShowHits(true)} onBlur={()=>setShowHits(false)}/>

            <Tab.Navigator
            initialRouteName="poll"
            screenOptions={{
                tabBarStyle: {backgroundColor: COLORS.Background, 
                    height: SCREEN_HEIGHT * 0.05},
                tabBarActiveTintColor: COLORS.Button,
                tabBarInactiveTintColor: COLORS.Paragraph,
                tabBarIndicatorStyle: {backgroundColor: COLORS.Button, width: SCREEN_WIDTH * 0.25, marginHorizontal: SCREEN_WIDTH * 0.125}
            }}
            >
                <Tab.Screen name="poll" 
                options={{
                    tabBarLabel: 'Polls',
                    unmountOnBlur: true,
                }}>
                  {()=>getPollResults()}
                </Tab.Screen>
                <Tab.Screen name="user"
                options={{
                    tabBarLabel: 'Users',
                    unmountOnBlur: true
                }}>
                  {()=>getUserResults()}
                </Tab.Screen>
            </Tab.Navigator>








            {/* <ResultTabs/> */}
            {/* <Index indexName="PollMe_polls">
              <Text style={[styles.separatorText]}>Polls</Text>
              <InfiniteHits modalVisible={false}/>
            </Index>

            <Index indexName="PollMe_users">
              <Text style={[styles.separatorText]}>Users</Text>
              <UserHits/>
            </Index> */}

          </InstantSearch>
        </View>
    </SafeAreaView>
      
  )

}
