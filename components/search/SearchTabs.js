import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MStyles } from '../Mason Styles/MStyles';
import { Text } from 'react-native';
import UserHits from './UserHits';
import InfiniteHits from './InfiniteHits';
import { Index } from 'react-instantsearch-native';
import TabBar from 'react-native-tab-view';




const FirstRoute = () => (
  <Index indexName="PollMe_polls">
      <InfiniteHits/>
  </Index>
  
);

const SecondRoute = () => (
  <Index indexName="PollMe_users">
      <UserHits/>
  </Index>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function ResultTabs() {

    

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Polls' },
    { key: 'second', title: 'Users' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      
    />
  );
}