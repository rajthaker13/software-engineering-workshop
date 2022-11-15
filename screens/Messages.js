/* eslint-disable react/display-name */
import 'react-native-gesture-handler';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { LogBox, SafeAreaView, useColorScheme, View } from 'react-native';
import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator, useHeaderHeight } from '@react-navigation/native-stack';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StreamChat } from 'stream-chat';
import {
    Channel,
    ChannelList,
    Chat,
    MessageInput,
    MessageList,
    OverlayProvider,
    Streami18n,
    Thread,
    useAttachmentPickerContext,
} from 'stream-chat-expo';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreAllLogs(true);
const chatClient = StreamChat.getInstance('vh5jtbp92bcz');

const auth = getAuth()
const db = getFirestore();


const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicm9uIn0.eRVjxLvd4aqCEHY_JRa97g6k7WpHEhxL7Z4K4yTot1c';
const user = {
    id: auth.currentUser.uid,
};

const filters = {
    example: 'example-apps',
    members: { $in: ['ron'] },
    type: 'messaging',
};
const sort = { last_message_at: -1 };
const options = {
    state: true,
    watch: true,
};


/**
 * Start playing with streami18n instance here:
 * Please refer to description of this PR for details: https://github.com/GetStream/stream-chat-react-native/pull/150
 */
const streami18n = new Streami18n({
    language: 'en',
});

const ChannelListScreen = ({ navigation }) => {
    const { setChannel } = useContext(AppContext);

    const memoizedFilters = useMemo(() => filters, []);


    return (
        <Chat client={chatClient} i18nInstance={streami18n}>
            <View style={{ height: '100%' }}>
                <ChannelList
                    filters={memoizedFilters}
                    onSelect={(channel) => {
                        setChannel(channel);
                        navigation.navigate('Channel');
                    }}
                    options={options}
                    sort={sort}
                />
            </View>
        </Chat >
    );
};

const ChannelScreen = ({ navigation }) => {
    const { channel, setThread, thread } = useContext(AppContext);
    const headerHeight = useHeaderHeight();
    const { setTopInset } = useAttachmentPickerContext();


    useEffect(() => {
        setTopInset(headerHeight);
    }, [headerHeight]);

    return (
        <SafeAreaView>
            <Chat client={chatClient} i18nInstance={streami18n}>
                <Channel
                    channel={channel}
                    keyboardVerticalOffset={headerHeight}
                    thread={thread}
                >
                    <View style={{ flex: 1 }}>
                        <MessageList
                            onThreadSelect={(thread) => {
                                setThread(thread);
                                navigation.navigate('Thread');
                            }}
                        />
                        <MessageInput />
                    </View>
                </Channel>
            </Chat>
        </SafeAreaView>
    );
};

const ThreadScreen = () => {
    const { channel, setThread, thread } = useContext(AppContext);
    const headerHeight = useHeaderHeight();

    return (
        <SafeAreaView>
            <Chat client={chatClient} i18nInstance={streami18n}>
                <Channel
                    channel={channel}
                    keyboardVerticalOffset={headerHeight}
                    thread={thread}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Thread onThreadDismount={() => setThread(null)} />
                    </View>
                </Channel>
            </Chat>
        </SafeAreaView>
    );
};

const Stack = createNativeStackNavigator();

const AppContext = React.createContext();

const Messages = () => {
    const colorScheme = useColorScheme();


    const [channel, setChannel] = useState();
    const [clientReady, setClientReady] = useState(false);
    const [thread, setThread] = useState();


    useEffect(() => {
        const setupClient = async () => {
            await chatClient.connectUser(user, userToken);

            const channel = chatClient.channel('messaging', 'the_park', {
                name: 'The Park',
            });

            await channel.create();



            setClientReady(true);
        };

        setupClient();
    }, []);

    return (

        <AppContext.Provider value={{ channel, setChannel, setThread, thread }}>
            <GestureHandlerRootView>
                <OverlayProvider
                    i18nInstance={streami18n}
                >
                    {clientReady && (
                        <Stack.Navigator
                            initialRouteName='ChannelList'
                            screenOptions={{
                                headerTitleStyle: { alignSelf: 'center', fontWeight: 'bold' },
                            }}
                        >
                            <Stack.Screen
                                component={ChannelScreen}
                                name='Channel'
                                options={() => ({
                                    headerBackTitle: 'Back',
                                    headerRight: () => <></>,
                                    headerTitle: channel?.data?.name,
                                })}
                            />
                            <Stack.Screen
                                component={ChannelListScreen}
                                name='ChannelList'
                                options={{ headerTitle: 'Channel List' }}
                            />
                            <Stack.Screen
                                component={ThreadScreen}
                                name='Thread'
                                options={() => ({ headerLeft: () => <></> })}
                            />
                        </Stack.Navigator>
                    )}
                </OverlayProvider>
            </GestureHandlerRootView>
        </AppContext.Provider>
    );
};

export default Messages