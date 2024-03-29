import React from 'react';
import { StyleSheet, Text, View, FlatList,Dimensions, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import Highlight from './Highlight';
import { COLORS } from '../Colors/ColorScheme';
import PollModal from '../common/PollModalForSearch';
import { useEffect, useReducer, useState } from 'react';
import { MStyles } from '../Mason Styles/MStyles';
import { TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 10,
    flexDirection: 'column'
  },
  titleText: {
    fontWeight: 'bold',
  },
});

const windowHeight = Dimensions.get('window').height;
// const [modalVisible, setModalVisible] = useState(false);



const UserHits = ({ hits, hasMore, refineNext }) => {

  const auth = getAuth();
  const navigation = useNavigation();
  return(
  <FlatList 
    data={hits}
    keyExtractor={item => item.objectID}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    onEndReached={() => hasMore && refineNext()}
    renderItem={({ item }) => (

        // <TouchableOpacity style={styles.item}>
        //     <PollModal pollID={item.objectID}/>  
        // </TouchableOpacity>


      <View style={styles.item}>
        {/* <Text style={styles.titleText}>
          <Highlight attribute="{{attributesToDisplay.[0]}}" hit={item} />
        </Text>
        <Text>
          <Highlight attribute="{{this}}" hit={item} />
        </Text> */}
        <Pressable onPress={() => navigation.push("Home", { screen: "Profile", params: { id: item.objectID, prevId: auth.currentUser.uid } })}>
          <Text style={[MStyles.text]}>{item.username}</Text>
          {/* {console.log("xxx", item.objectID)} */}
        </Pressable>
      </View>
    )}
  />
)};

UserHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refineNext: PropTypes.func.isRequired,
};

export default connectInfiniteHits(UserHits);