import { View, Text, Dimensions, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { COLORS } from '../Colors/ColorScheme'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Header() {
    return (
        <View style={styles.container}>
            <Image source={require("../../assets/PollMe_Logo.png")} style={{marginLeft:"5%",marginTop:"9%", height:"45%", width:"45%", resizeMode: 'contain'}}/>


        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight * .15,
        backgroundColor: COLORS.backgroundColor,
        justifyContent: 'center',
    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        // fontFamily: "Federo",
        fontSize: 20,
        marginLeft: '5%',

    }

})
