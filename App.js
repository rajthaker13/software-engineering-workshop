import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CreatePollScreen from './screens/CreatePollScreen';
import ActivityScreen from './screens/ActivityScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import EditProfileScreen from './screens/EditProfileScreen'
import SettingsScreen from './screens/SettingsScreen'
import FollowScreen from './screens/FollowScreen';
import EditPFPScreen from './screens/EditPFP';
import NewUserScreen from './screens/NewUserScreen';
import ReportScreen from './screens/ReportScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { COLORS } from './components/Colors/ColorScheme';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Search from './screens/Search';
import { getStorage } from 'firebase/storage'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const firebaseConfig = {
  apiKey: "AIzaSyAN3OCr7y5e7I_ba_ASonj2HoAgrnSQbYU",
  authDomain: "pollme-24549.firebaseapp.com",
  databaseURL: "https://pollme-24549-default-rtdb.firebaseio.com",
  projectId: "pollme-24549",
  storageBucket: "pollme-24549.appspot.com",
  messagingSenderId: "517411271651",
  appId: "1:517411271651:web:2ce5925cd5faf436eba6d6",
  measurementId: "G-TMWX0CVP82"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth()
const db = getFirestore(app);
export const storage = getStorage(app)


const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function Home() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.Background,
          height: SCREEN_HEIGHT * 0.08
        },
        tabBarActiveTintColor: COLORS.Button,
        tabBarInactiveTintColor: COLORS.Paragraph,
        tabBarIndicatorStyle: { height: 0 },
        tabBarShowLabel: false
      }}
      tabBarPosition="bottom"
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{ pid: "" }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
          unmountOnBlur: true
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreatePollScreen}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ color }) => (
            <Ionicons name="add" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cards-heart" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ id: auth.currentUser.uid.toString() }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Follow" component={FollowScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Edit PFP" component={EditPFPScreen} options={{ headerShown: false }} />
        <Stack.Screen name="New User" component={NewUserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchPage" component={Search} options={{ headerShown: false }} />
        <Stack.Screen name="Report" component={ReportScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
