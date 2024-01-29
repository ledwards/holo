import {useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import DecklistListItem from './DecklistListItem';
import DecklistSearchFooter from './DecklistSearchFooter';
import DecklistPresenter from '../../presenters/DecklistPresenter';

import styles from '../../styles/SearchableDecklistListStyles';
import layout from '../../constants/layout';

// TODO: once it works use context for theme
// and perhaps break out most of state god object?

const SearchableDecklistList = props => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    loading: true,
    theme: props.theme,
    allDecklists: [],
  });

  useEffect(() => {
    setState({
      ...state,
      loading: false,
      allDecklists: props.allDecklists,
      flatListRef: null,
      theme: props.theme,
      nativeHeaderHeight: props.nativeHeaderHeight,
      nativeFooterHeight: props.nativeFooterHeight,
      error: null,
    });
    setData(props.allDecklists.reverse());
    setQuery('');
  }, []);

  useEffect(() => {
    if (query == '') {
      setData(props.allDecklists.reverse());
    } else {
      searchFilterFunction();
    }
  }, [query]);

  const searchHandler = (text: string) => {
    const newInput = text.toLowerCase();
    setQuery(newInput);
    // this will trigger the searchFilterFunction via useEffect
  };

  const searchFilterFunction = () => {
    const newData = state.allDecklists
      .filter(decklist => {
        const textData = query;
        const itemData = decklist.searchData();

        // Allow for unorderd word matches
        const textDataList = textData.split(' ');
        const matches = textDataList.filter(
          (w: string) => itemData.indexOf(w) > -1,
        );

        return matches.length === textDataList.length;
      })
      .reverse();

    setData(newData);
  };

  const NoResultsListComponent = () => (
    <View style={styles.listEmptyContainer}>
      <Text
        style={{
          color: state.theme.foregroundColor,
          ...styles.emptyListText,
        }}>
        No results found
      </Text>
    </View>
  );

  const SeparatorComponent = () => {
    return (
      <View
        style={{
          backgroundColor: state.theme.dividerColor,
          ...styles.separator,
        }}
      />
    );
  };

  if (state.loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <Animated.FlatList
        ref={ref => {
          state.flatListRef = ref;
        }}
        contentContainerStyle={{
          ...styles.flatListContentContainer,
          minHeight: Dimensions.get('window').height,
        }}
        data={data}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('View Decklist', {
                theme: state.theme,
                allCards: props.allCards,
                decklist: new DecklistPresenter(item),
              });
            }}
            activeOpacity={1}>
            <DecklistListItem
              theme={state.theme}
              item={new DecklistPresenter(item)}
              index={index}
              flatListRef={state.flatListRef}
              scrollToIndex={(i: number) =>
                state.flatListRef.scrollToIndex({
                  animated: true,
                  index: i,
                  viewOffset: layout.nativeHeaderHeight(),
                })
              }
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => NoResultsListComponent()}
        ListHeaderComponent={() => <></>}
        ListHeaderComponentStyle={{
          backgroundColor: state.theme.backgroundColor,
          borderColor: state.theme.dividerColor,
          borderBottomWidth: query && data.length > 0 ? 2 : 0,
          height: layout.nativeHeaderHeight(),
        }}
        ListFooterComponent={() => <></>}
        ListFooterComponentStyle={{
          flexGrow: 1, // important!
          backgroundColor: state.theme.backgroundColor,
          height: layout.footerHeight(layout.tabBarHeight(), null),
          // height: 800,
          borderTopWidth: query && data.length > 0 ? 2 : 0,
          borderColor: state.theme.dividerColor,
        }}
        keyExtractor={(item, index) => `${index}_${item.id}`}
        ItemSeparatorComponent={SeparatorComponent}
        keyboardShouldPersistTaps="handled"
        //
        // Performance settings:
        initialNumToRender={10} // Reduce initial render amount
        removeClippedSubviews={true} // Unmount components when outside of window
        maxToRenderPerBatch={10} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={10} // Reduce the window size
      />
      <DecklistSearchFooter
        query={query}
        nativeFooterHeight={layout.nativeFooterHeight()}
        searchBarHeight={layout.searchBarHeight()}
        tabBarHeight={layout.tabBarHeight()}
        allDecklists={state.allDecklists}
        data={data}
        searchCallback={searchHandler}
      />
    </>
  );
};

export default SearchableDecklistList;
