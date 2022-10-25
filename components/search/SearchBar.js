import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import { Box, NativeBaseConfigProvider, Icon ,FlatList, Badge, Heading, AspectRatio, Avatar, Stack, HStack, VStack, Spacer, Center, NativeBaseProvider, SearchIcon } from "native-base";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function SearchBar(props) {
    return (
        
        <TextInput
            style={{
                height: windowHeight * .05,
                width: windowWidth,
                borderColor: 'white',
                borderWidth: 1,
                backgroundColor: '#3B3C3B'
            }}
            defaultValue="Search for polls"
        />
        
    )

}
