import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions, StatusBar } from 'react-native'
import algoliasearch from 'algoliasearch/lite';
import SearchBoxNative from './SearchBoxNative';
import { InstantSearch } from 'react-instantsearch-native';
import InfiniteHits from './InfiniteHits';
import { useState } from 'react';

const searchClient = algoliasearch('PN9CAYIKKA', 'ecd74f365860ea94f1d92779981d4a64');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function SearchBar() {
  const [showHits, setShowHits] = useState(false);

  return (

    <SafeAreaView>
        <StatusBar />
        <View>
          <InstantSearch searchClient={searchClient} indexName="PollMe_polls">
            <SearchBoxNative onFocus={()=>setShowHits(true)} onBlur={()=>setShowHits(false)}/>
            <InfiniteHits modalVisible={false}/>
          </InstantSearch>
        </View>
    </SafeAreaView>
      
  )

}
