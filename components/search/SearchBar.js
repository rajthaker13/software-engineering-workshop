import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions, StatusBar } from 'react-native'
import algoliasearch from 'algoliasearch/lite';
import SearchBoxNative from './SearchBoxNative';
import { InstantSearch } from 'react-instantsearch-native';
import InfiniteHits from './InfiniteHits';

const searchClient = algoliasearch('PN9CAYIKKA', 'ecd74f365860ea94f1d92779981d4a64');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function SearchBar() {
    return (

      <SafeAreaView>
          <StatusBar />
          
          <View>
            <InstantSearch searchClient={searchClient} indexName="PollMe_polls">
              <SearchBoxNative />
              <InfiniteHits />
            </InstantSearch>
          </View>
      </SafeAreaView>
        
        // <TextInput
        //     style={{
        //         height: windowHeight * .05,
        //         width: windowWidth,
        //         borderColor: 'white',
        //         borderWidth: 1,
        //         backgroundColor: '#3B3C3B'
        //     }}
        //     defaultValue="Search for polls"
        // />
        
    )

}
