import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




export default function Answer(props) {

    const auth = getAuth()
    const db = getFirestore();
    const pollID = props.id
    const pollRef = doc(db, "polls", pollID);


    async function vote(option) {
        const docSnap = await getDoc(pollRef);
        if (docSnap.exists()) {
            let curVotesOption = docSnap.data()['votes'].filter(choice => {
                return choice['choice'] != option
            })
            let curVotesOptionsAll = docSnap.data()['votes']
            console.log(curVotesOption)
            const curVotes = docSnap.data()['numVotes'] + 1
            curVotesOptionsAll.forEach((choice) => {
                if (option == choice['choice']) {
                    const newVotes = choice['numVotes'] + 1
                    let votesArray = choice['votes']

                    var newVote = {
                        timestamp: Date.now(),
                        uid: auth.currentUser.uid

                    }
                    votesArray.push(newVote)
                    console.log(votesArray)

                    var newVote = {
                        choice: option,
                        numVotes: newVotes,
                        votes: votesArray

                    }
                    curVotesOption.push(newVote)


                    updateDoc(pollRef, {
                        votes: curVotesOption,
                        numVotes: curVotes
                    })




                }
            })

        }



    }
    return (
        <View style={styles.container}>
            <View>
                <Button title={props.title} onPress={() => { vote(props.title) }}></Button>
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
        height: windowHeight * .045,
        marginTop: windowHeight * .005,
        marginLeft: windowWidth * .05,
        marginBottom: windowHeight * .005,
        justifyContent: 'center',
    },
    pollmeText: {
        color: 'white',
        marginTop: '10%',
        // fontFamily: "Federo",
        fontSize: 20,
        marginLeft: '5%'

    }

})
