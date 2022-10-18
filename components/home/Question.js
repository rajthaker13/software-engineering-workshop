import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Question(props) {
    return (
        <View>
            <View style={{
                backgroundColor: '#D9D9D9', borderWidth: 10, borderColor: '#010101', borderRadius: 20,
                width: windowWidth * .9,
                height: windowHeight * .2,
                marginTop: windowHeight * .08,
                marginLeft: windowWidth * .05,
                marginBottom: 15,
                padding: 5,
            }}>
                <Text style={{ fontSize: 40, marginTop: '5%', fontWeight: 'bold', textAlign: 'center', flex: 1 }}>{props.title}</Text>
            </View>
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
        marginLeft: '5%'

    }

})
