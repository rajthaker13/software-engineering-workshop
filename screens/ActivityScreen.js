import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, ScrollView } from 'react-native';
import {  Box, FlatList, Badge, Heading, AspectRatio, Avatar, Stack, HStack, VStack, Spacer, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { Database, get, getDatabase, onValue, ref, set} from "firebase/database";
import React, { useState, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts, IrishGrover_400Regular } from '@expo-google-fonts/irish-grover';


// const data = [{
//     id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//     fullName: "Aafreen Khan",
//     timeStamp: "12:47 PM",
//     recentText: "Good Day!",
//     avatarUrl: ""
//   }, {
//     id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//     fullName: "Sujitha Mathur",
//     timeStamp: "11:11 PM",
//     recentText: "Cheer up, there!",
//     avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
//   }, {
//     id: "58694a0f-3da1-471f-bd96-145571e29d72",
//     fullName: "Anci Barroco",
//     timeStamp: "6:22 PM",
//     recentText: "Good Day!",
//     avatarUrl: "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg"
//   }, {
//     id: "68694a0f-3da1-431f-bd56-142371e29d72",
//     fullName: "Aniket Kumar",
//     timeStamp: "8:56 PM",
//     recentText: "All the best",
//     avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU"
//   }, {
//     id: "28694a0f-3da1-471f-bd96-142456e29d72",
//     fullName: "Kiara",
//     timeStamp: "12:47 PM",
//     recentText: "I will call today.",
//     avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
//   }];

const Header = () => {
  return <Heading shadow="4" style={{fontSize: "32.5%", paddingTop: "12.5%", paddingHorizontal: "7%", fontFamily: 'IrishGrover_400Regular'}}>Poll Me</Heading>;
}
const Inbox = () => {
    // let [fontsLoaded] = useFonts({
    // IrishGrover_400Regular,
    //   });
    
    //   let fontSize;
    //   let paddingVertical = 6;
    
    //   if (!fontsLoaded) {
        // return <AppLoading />;
    //   } else {
    return <Box>
    <Heading fontSize="xl" p="3%" pb="1">
      Inbox
    </Heading>
    <FlatList data={data} renderItem={({
    item
  }) => <Box borderBottomWidth="1" _dark={{
    borderColor: "muted.50"
  }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
          <HStack space={[2, 3]} justifyContent="space-between">
            <Avatar size="48px" source={{
        uri: item.avatarUrl
      }} />
            <VStack>
              <Text _dark={{
          color: "warmGray.50"
        }} color="coolGray.800" bold>
                {item.fullName}
              </Text>
              <Text color="coolGray.600" _dark={{
          color: "warmGray.200"
        }}>
                {item.recentText}
              </Text>
            </VStack>
            <Spacer />
            <Text fontSize="xs" _dark={{
        color: "warmGray.50"
      }} color="coolGray.800" alignSelf="flex-start">
              {item.timeStamp}
            </Text>
          </HStack>
        </Box>} keyExtractor={item => item.id} />
  </Box>;
    // };
};

const Requests = () => {
    const navigation = useNavigation()
    const auth = getAuth()
    const db = getDatabase()

    const [followers, setFollowers] = useState('');
    const refFollowers = ref(db, 'users/WiVmPRV2wXc9Z2fUOvr5ZYRDx0m2/followers')
    // const refFollowers = ref(db, 'users/' + auth.currentUser.uid + '/followers')
    useEffect(() => {
        get(refFollowers).then(snapshot => {
            setFollowers(snapshot.val())
        })
    })
    if (!followers){
        return <Box>
                <Heading fontSize="xl" p="3%" pb="1" ml="5%" >
                    Requests
                </Heading>
                <Center>
                    <Text color="coolGray.600" style={{ fontSize: "10%", color: "gray", left: "4%" }} _dark={{color: "warmGray.200"}}>
                        No Follow Requests For You :(
                    </Text>
            </Center>
            </Box>
    } else{
        for (followObj in followers){
            if (followObj.isReq){

                const [userAvatar, setAvatar] = useState('');
                const [username, setUsername] = useState('');
                const refUserAvatar = ref(db, 'users/' + followObj.uid + '/avatar')
                const refUsername = ref(db, '/users/' + followObj.uid + '/username')
                useEffect(() => {
                    get(refUserAvatar).then(snapshot => {
                        setAvatar(snapshot.val())
                    })
                    get(refUsername).then(snapshot => {
                        setUsername(snapshot.val())
                    })
                })
                return <Box>
                    <Heading fontSize="xl" p="3%" pb="1" ml="5%" >
                    Requests
                    </Heading>
                    <Box alignItems="center">
                        <HStack space={3} justifyContent="center">
                                
                        <Badge // bg="red.400"
                    colorScheme="danger" rounded="full" mb="-3%" mr="-5%" zIndex={1} variant="solid" alignSelf="flex-end" _text={{
                        fontSize: 12
                    }}>
                        count
                        </Badge>
                        <Box maxW="40%" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                    }} _web={{
                        shadow: 2,
                        borderWidth: 0
                    }} _light={{
                        backgroundColor: "gray.50"
                    }}>
                        <Box>
                            <AspectRatio w="100%" ratio={9 / 4} marginBottom="3%">
                            <Center h="80%" paddingVertical="17.5%">
                            <Avatar bg="green.500" source={{
                                uri: {userAvatar}
                                // uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                            }}></Avatar>
                            </Center>
                            </AspectRatio>
                            <Center bg="violet.500" _dark={{
                            bg: "violet.400"
                        }} _text={{
                            color: "warmGray.50",
                            fontWeight: "700",
                            fontSize: "xs"
                        }} position="absolute" bottom="0%" px="2.5%" py="1%">
                            Request
                            </Center>
                        </Box>
                        <Stack p="2%" space="3%">
                            {/* <Stack space={2}> */}
                            <Center>
                            <Heading fontSize="17.5%" ml="-1" fontWeight= "700">
                                {username}
                            </Heading>
                            </Center>
                                <Text color="coolGray.600" style={{ fontSize: "10%", color: "gray", left: "4%" }} _dark={{
                                color: "warmGray.200"
                            }}>
                                {followObj.timeStamp}
                                </Text>
                        </Stack>
                        </Box>
                        </HStack>
                    </Box>
                    </Box>;
                };
            }

        }
    }

    

    

    

  const Likes = () => {
    // const [userAvatar, setAvatar] = useState(data.avatarUrl);
    // const [username, setUsername] = useState(data.fullName);
    // const [timeStamp, setTimeStamp] = useState(data.timeStamp);

    
    // const navigation = useNavigation()
    // const auth = getAuth()
    // const db = getDatabase()

    // const refUserAvatar = ref(db, 'users/' + auth.currentUser.uid + '/avatar')
    // const refUsername = ref(db, '/users/' + auth.currentUser.uid + '/username')
    // const refTimeStamp = ref(db, 'users/' + auth.currentUser.uid + '/requestTime')

    // useEffect(() => {
    //     get(refUserAvatar).then(snapshot => {
    //         setAvatar(snapshot.val())
    //     })
    //     get(refUsername).then(snapshot => {
    //         setUsername(snapshot.val())
    //     })
    //     get(refTimeStamp).then(snapshot => {
    //         setTimeStamp(snapshot.val())
    //     })
    // })

    return <Box>
        <Heading fontSize="xl" p="3%" pb="1" ml="5%" >
      Inbox
    </Heading>
    <Box alignItems="center">
        <HStack space={3} justifyContent="center">
                
         <Badge // bg="red.400"
      colorScheme="danger" rounded="full" mb="-3%" mr="-5%" zIndex={1} variant="solid" alignSelf="flex-end" _text={{
        fontSize: 12
      }}>
          count
        </Badge>
        <Box maxW="40%" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700"
      }} _web={{
        shadow: 2,
        borderWidth: 0
      }} _light={{
        backgroundColor: "gray.50"
      }}>
          <Box>
            <AspectRatio w="100%" ratio={9 / 4} marginBottom="3%">
            <Center h="80%" paddingVertical="17.5%">
              
            <Avatar bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            }}></Avatar>
            </Center>
            </AspectRatio>
            <Center bg="violet.500" _dark={{
            bg: "violet.400"
          }} _text={{
            color: "warmGray.50",
            fontWeight: "700",
            fontSize: "xs"
          }} position="absolute" bottom="0%" px="2.5%" py="1%">
              Request
            </Center>
          </Box>
          <Stack p="2%" space="3%">
            {/* <Stack space={2}> */}
            <Center>
              <Heading fontSize="17.5%" ml="-1" fontWeight= "700">
                Raj Thaker
              </Heading>
            </Center>
                <Text color="coolGray.600" style={{ fontSize: "10%", color: "gray", left: "4%" }} _dark={{
                color: "warmGray.200"
              }}>
                  6 mins ago
                </Text>
          </Stack>
        </Box>
        </HStack>
      </Box>
      </Box>;
  };


  const Dislikes = () => {
    // const [userAvatar, setAvatar] = useState(data.avatarUrl);
    // const [username, setUsername] = useState(data.fullName);
    // const [timeStamp, setTimeStamp] = useState(data.timeStamp);

    
    // const navigation = useNavigation()
    // const auth = getAuth()
    // const db = getDatabase()

    // const refUserAvatar = ref(db, 'users/' + auth.currentUser.uid + '/avatar')
    // const refUsername = ref(db, '/users/' + auth.currentUser.uid + '/username')
    // const refTimeStamp = ref(db, 'users/' + auth.currentUser.uid + '/requestTime')

    // useEffect(() => {
    //     get(refUserAvatar).then(snapshot => {
    //         setAvatar(snapshot.val())
    //     })
    //     get(refUsername).then(snapshot => {
    //         setUsername(snapshot.val())
    //     })
    //     get(refTimeStamp).then(snapshot => {
    //         setTimeStamp(snapshot.val())
    //     })
    // })

    return <Box>
        <Heading fontSize="xl" p="3%" pb="1" ml="5%" >
      Inbox
    </Heading>
    <Box alignItems="center">
        <HStack space={3} justifyContent="center">
                
         <Badge // bg="red.400"
      colorScheme="danger" rounded="full" mb="-3%" mr="-5%" zIndex={1} variant="solid" alignSelf="flex-end" _text={{
        fontSize: 12
      }}>
          count
        </Badge>
        <Box maxW="40%" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700"
      }} _web={{
        shadow: 2,
        borderWidth: 0
      }} _light={{
        backgroundColor: "gray.50"
      }}>
          <Box>
            <AspectRatio w="100%" ratio={9 / 4} marginBottom="3%">
            <Center h="80%" paddingVertical="17.5%">
              
            <Avatar bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            }}></Avatar>
            </Center>
            </AspectRatio>
            <Center bg="violet.500" _dark={{
            bg: "violet.400"
          }} _text={{
            color: "warmGray.50",
            fontWeight: "700",
            fontSize: "xs"
          }} position="absolute" bottom="0%" px="2.5%" py="1%">
              Request
            </Center>
          </Box>
          <Stack p="2%" space="3%">
            {/* <Stack space={2}> */}
            <Center>
              <Heading fontSize="17.5%" ml="-1" fontWeight= "700">
                Raj Thaker
              </Heading>
            </Center>
                <Text color="coolGray.600" style={{ fontSize: "10%", color: "gray", left: "4%" }} _dark={{
                color: "warmGray.200"
              }}>
                  6 mins ago
                </Text>
          </Stack>
        </Box>
        </HStack>
      </Box>
      </Box>;
  };

// function Cards() {
//     return<Box>
//     <Heading fontSize="xl" p="3%" pb="1">
//       Requests
//     </Heading>
//             <HStack space={3} justifyContent="center">
//                 <Center h="40" w="20" bg="primary.300" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.300" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.500" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.500" rounded="md" shadow={3} />
                
//                 <Center h="40" w="20" bg="primary.700" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.700" rounded="md" shadow={3} />
//             </HStack>;
//             <HStack space={3} justifyContent="center">
//                 <Center h="40" w="20" bg="primary.300" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.300" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.500" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.500" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.700" rounded="md" shadow={3} />
//                 <Center h="40" w="20" bg="primary.700" rounded="md" shadow={3} />
//             </HStack>;
//             </Box>;

//   }



export default function ActivityScreen() {
    

    return (
        <NativeBaseProvider>
            <Header />
        {/* <Center flex={1} px="3"> */}
            {/* <Inbox /> */}
            {/* <RequestBoxes /> */}
        {/* </Center> */}
            {/* <Cards /> */}
            <Requests />
            <Likes />
            {/* <Likes /> */}
            {/* <Requests /> */}
        </NativeBaseProvider>
    );
    }




    // export default function ActivityScreen() {
    //     let [fontsLoaded] = useFonts({
    //         IrishGrover_400Regular,
    //       });
        
    //       let fontSize;
    //       let paddingVertical = 6;
        
    //       if (!fontsLoaded) {
    //         return <AppLoading />;
    //       } else {
    
    //         return (
    //           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <Text
    //               style={{
    //                 fontSize: 24,
    //                 paddingVertical,
    //                 fontFamily: 'IrishGrover_400Regular',
    //               }}>
    //               Irish Grover Regular
    //             </Text>
    //           </View>
    //         );
    //       }
    //     };




//     return (
       
//     );
// }

// function editProfile() {
//     return 1;
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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


 // <SafeAreaView style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignContent: "center", }}>
        //     <View>
        //         <Text style={{ fontSize: 16, color: "white", left: 10 }}>Username</Text>
        //     </View>
        //     <View style={{ flex: 1, backgroundColor: "white", marginLeft: 10, marginRight: 10 }}>
        //         <View style={{ flex: 1, backgroundColor: "black", flexDirection: "row" }}>
        //             <View style={{ flex: 0.4, flexDirection: "column" }}>
        //                 <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignContent: "center", alignItems: "center" }}><Image source={require('../assets/favicon.png')} /></View>
        //                 <Text style={{ flex: 0.5, backgroundColor: "white" }}>First Name Last Name</Text>
        //                 <Text style={{ flex: 0.5, backgroundColor: "white" }}>Description</Text>
        //             </View>
        //             <View style={{ flex: 0.6, backgroundColor: "white", flexDirection: "column" }}>
        //                 <View style={{ flex: 1, backgroundColor: "white", flexDirection: "column" }}>
        //                     <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
        //                         <Text >123</Text>
        //                         <Text >456</Text>
        //                         <Text >789</Text>
        //                     </View>
        //                     <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", left: 10, bottom: 15 }}>
        //                         <Text>Polls</Text>
        //                         <Text>Followers</Text>
        //                         <Text>Following</Text>
        //                     </View>
        //                 </View>
        //                 <View style={{ flex: 1, backgroundColor: "white" }} />
        //             </View>
        //         </View>
        //         <View style={{ flex: 0.25, backgroundColor: "white", justifyContent: "center", flexDirection: "row" }}>
        //             <TouchableHighlight style={{ flex: 0.4 }}><Pressable style={styles.button} onPress={editProfile()}><Text style={styles.text}>Edit Profile</Text></Pressable></TouchableHighlight>
        //         </View>
        //         <View style={{ flex: 0.5, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        //             <TouchableHighlight style={{ flex: 0.3, right: 10 }}><Pressable style={styles.button}><Text style={styles.text}>###</Text><Text style={styles.text}>Up</Text></Pressable></TouchableHighlight>
        //             <TouchableHighlight style={{ flex: 0.3, left: 10 }}><Pressable style={styles.button}><Text style={styles.text}>###</Text><Text style={styles.text}>Down</Text></Pressable></TouchableHighlight>
        //         </View>
        //         <View style={{ flex: 0.25, backgroundColor: "white" }}>
        //             <Text style={styles.textHeading}>Your Polls</Text>
        //         </View>
        //         <View style={{ flex: 1 }}>

        //         </View>
        //         <View style={{ flex: 0.25, backgroundColor: "white" }}>
        //             <Text style={styles.textHeading}>Your Groups</Text>
        //         </View>
        //         <View style={{ flex: 1.5 }}>

        //         </View>
        //     </View>
        //     <View style={{ flex: 0.05 }}>
        //         <Text style={{ fontSize: 16, color: "white", left: 10 }}>Bottom Bar</Text>
        //     </View>
        // </SafeAreaView>








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