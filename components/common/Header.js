import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Header(props) {
    const navigation = props.navigation
    return (
        <View style={styles.container}>
            <Text style={styles.pollmeText}>PollMe</Text>
            <TouchableOpacity style={styles.chatIcon} onPress={() => navigation.push("Messages")}>
                <Ionicons name="chatbubble-outline" color='white' size={35} />
            </TouchableOpacity>



        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight * .15,
        backgroundColor: '#010101',
        flexDirection: 'row',
        alignItems: 'center'
    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        fontSize: 20,
        marginLeft: '5%',
    },
    chatIcon: {
        marginTop: '10%',
        marginLeft: '65%',
    },

})
