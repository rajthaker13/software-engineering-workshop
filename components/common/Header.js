import { View, Text, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.pollmeText}>PollMe</Text>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight * .15,
        backgroundColor: '#010101',
        justifyContent: 'center',
    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        fontFamily: "Federo",
        fontSize: 20,
        marginLeft: '5%',

    }

})
