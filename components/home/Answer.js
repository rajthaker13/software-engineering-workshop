import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Answer(props) {
    return (
        <View style={styles.container}>
            <View>
                <Button title={props.title}></Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D9D9D9',
        borderColor: '#010101',
        borderRadius: windowHeight * .05,
        width: windowWidth * .9,
        height: windowHeight * .05,
        marginTop: windowHeight * .01,
        marginLeft: windowWidth * .05,
        marginBottom: windowHeight * .01,
        justifyContent: 'center'
    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        fontFamily: "Federo",
        fontSize: 20,
        marginLeft: '5%'

    }

})
