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

const InfiniteHits = ({ hits, hasMore, refineNext }) => {

  const navigation = useNavigation();

  return(
    <FlatList 
      data={hits}
      keyExtractor={item => item.objectID}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => hasMore && refineNext()}
      renderItem={({ item }) => (

        // <TouchableOpacity style={styles.item}>
        //     <PollModal pollID={item.objectID} navPoll={navigation} setVisibility={true}/>  
        // </TouchableOpacity>

        <View style={styles.item}>
          <Pressable onPress={() => navigation.navigate("HomeScreen", {pid: item.objectID})}>
            <Text style={[MStyles.text]}>{item.title}</Text>
          </Pressable>
        </View>
      )}
    />
  )};

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refineNext: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);