import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Question(props) {
    return (
        <View>
            <View style={{
                backgroundColor: '#16161a', borderWidth: 3, borderColor: '#7f5af0', borderRadius: 20,
                width: windowWidth * .9,
                height: windowHeight * .2,
                marginTop: windowHeight * .03,
                marginLeft: windowWidth * .05,
                padding: windowHeight * .005,
            }}>
                <Text style={{ fontSize: 40, marginTop: '5%', fontWeight: 'bold', textAlign: 'center', flex: 1, color: "#94a1b2" }}>{props.title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3B3C3B',
        width: windowWidth,
        height: windowHeight,
        paddingTop: 10,
    },
    tabsContainer: {
        height: '10%',
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 10,
        alignItems: 'center',
        marginTop: '20%',
        flex: 1,
        justifyContent: 'space-between'

    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        fontSize: 20,
        marginLeft: '5%',
        flex: 1,

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: 22

    },
    modalView: {
        margin: 20,
        backgroundColor: "#16161a",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        alignSelf: 'flex-end',
        position: 'absolute',
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    container: {
        backgroundColor: '#3B3C3B',
        width: windowWidth,
        height: windowHeight,
        paddingTop: 10,
    },
    tabsContainer: {
        height: '10%',
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 10,
        alignItems: 'center',
        marginTop: '20%',
        flex: 1,
        justifyContent: 'space-between'

    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        fontSize: 20,
        marginLeft: '5%',
        flex: 1,
    },
    containerBigStats: {
        width: windowWidth * .7,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: windowHeight * .01,
        marginLeft: windowWidth * .045,
        padding: windowHeight * .005,
        paddingTop: "6%"
    },
    optionSet: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: windowWidth * .7,
    },
    optionWindow: {
        width: windowWidth * .7,
        alignSelf: 'center',
        alignItems: 'center',
    },
    dislike: {
        marginLeft: windowHeight * .005,
    },
    statsContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',

    },
    statsText: {
        color: 'white',
        fontSize: 15
    }

})
