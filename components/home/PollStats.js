import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Pressable, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function PollStats(props) {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                        <SimpleLineIcons name="like" size={26} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dislike}>
                        <SimpleLineIcons name="dislike" size={26} color="white" />
                    </TouchableOpacity>
                </View >
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{props.likes}</Text>
                    <Feather name="arrow-up" size={26} color="green" />
                </View>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{props.dislikes}</Text>
                    <Feather name="arrow-down" size={26} color="red" />
                </View>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity>
                    <Fontisto name="comment" size={26} color="white" />
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{props.comments}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity>
                    <Fontisto name="share-a" size={26} color="white" />
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{props.shares}</Text>
                </View>

            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth * .9,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: windowHeight * .01,
        marginLeft: windowWidth * .045,
        padding: windowHeight * .005,

    },
    dislike: {
        marginLeft: windowHeight * .005,
    },
    statsContainer: {
        marginTop: windowHeight * .01,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    statsText: {
        color: 'white',
        fontSize: 15
    }

})
