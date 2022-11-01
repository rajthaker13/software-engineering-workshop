import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, ScrollView, Dimensions } from 'react-native';
import { Box, FlatList, Badge, Heading, AspectRatio, Avatar, Stack, HStack, VStack, Spacer, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { Database, get, getDatabase, onValue, ref, set } from "firebase/database";
import React, { useState, useEffect } from 'react';
// import AppLoading from 'expo-app-loading';
import { useFonts, IrishGrover_400Regular } from '@expo-google-fonts/irish-grover';
import Header from '../components/common/Header';
import LikesWrapper from '../components/activity/wrappers/LikesWrapper';
import { useIsFocused } from '@react-navigation/native';
import DislikesWrapper from '../components/activity/wrappers/DislikesWrapper';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function ActivityScreen() {

  const [likes, setLikes] = useState([])
  const [dislikes, setDislikes] = useState([])

  const db = getDatabase()
  const auth = getAuth()


  const isFocused = useIsFocused();

  const userRef = ref(db, 'users/' + auth.currentUser.uid)

  useEffect(() => {
    get(userRef).then(snapshot => {
      let likeArr = []
      let dislikeArr = []
      let data = snapshot.val().activity

      data.forEach((a) => {
        if (a.type == "like") {
          likeArr.push(a)
        }
        if (a.type == "dislike") {
          dislikeArr.push(a)
        }
      })

      setLikes(likeArr)
      setDislikes(dislikeArr)


    })


  }, [isFocused])


  return (
    <ScrollView>
      <Header />
      <View style={{
        backgroundColor: '#3B3C3B',
        width: windowWidth,
        height: windowHeight,
        paddingTop: 10,
        flex: 1,
        flexDirection: 'row' 
      }}>
        <Text></Text>
        <LikesWrapper title="Likes" likeActivity={likes} />
        <DislikesWrapper title="Dislikes" dislikeActivity={dislikes} />


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3B3C3B',
    width: windowWidth,
    height: windowHeight,
    paddingTop: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'gray',
    flexDirection: "row"
  },
  text: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textHeading: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: 'black',
  }
});







// _________________________________________________________

// poll format**

// const Cards = () => {
//     return <Box alignItems="center">
//         <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
//         borderColor: "coolGray.600",
//         backgroundColor: "gray.700"
//       }} _web={{
//         shadow: 2,
//         borderWidth: 0
//       }} _light={{
//         backgroundColor: "gray.50"
//       }}>
//           <Box>
//             <AspectRatio w="100%" ratio={16 / 9}>
//               <Image source={{
//               uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg"
//             }} alt="image" />
//             </AspectRatio>
//             <Avatar bg="green.500" source={{
//       uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
//     }}></Avatar>

//             <Center bg="violet.500" _dark={{
//             bg: "violet.400"
//           }} _text={{
//             color: "warmGray.50",
//             fontWeight: "700",
//             fontSize: "xs"
//           }} position="absolute" bottom="0" px="3" py="1.5">
//               PHOTOS
//             </Center>
//           </Box>
//           <Stack p="4" space={3}>
//             <Stack space={2}>
//               <Heading size="md" ml="-1">
//                 The Garden City
//               </Heading>
//               <Text fontSize="xs" _light={{
//               color: "violet.500"
//             }} _dark={{
//               color: "violet.400"
//             }} fontWeight="500" ml="-0.5" mt="-1">
//                 The Silicon Valley of India.
//               </Text>
//             </Stack>
//             <Text fontWeight="400">
//               Bengaluru (also called Bangalore) is the center of India's high-tech
//               industry. The city is also known for its parks and nightlife.
//             </Text>
//             <HStack alignItems="center" space={4} justifyContent="space-between">
//               <HStack alignItems="center">
//                 <Text color="coolGray.600" _dark={{
//                 color: "warmGray.200"
//               }} fontWeight="400">
//                   6 mins ago
//                 </Text>
//               </HStack>
//             </HStack>
//           </Stack>
//         </Box>
//       </Box>;
//   };