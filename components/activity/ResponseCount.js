import React from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ResponseCount(props) {

  const db = getDatabase()
  const auth = getAuth()

  const [likesCount, setLikesCount] = useState(props.likes)
  const [dislikesCount, setDislikesCount] = useState(props.dislikes)
  const pollRef = ref(db, '/polls/' + auth.props.answerNum)

  useEffect(() => {
      get(pollRef).then(snapshot => {
        setLikesCount(snapshot.val().likes)
        setDislikesCount(snapshot.val().dislikes)
      })

  }, [])
  let total = likesCount+dislikesCount
  return total
}