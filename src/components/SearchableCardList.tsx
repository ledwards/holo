import {Component} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Image,
  ImageBackground,
  Animated,
  Appearance,
} from 'react-native';
import {SearchBar, Icon, Chip} from 'react-native-elements';
import CardListItem from './CardListItem';

import CardPresenter from '../presenters/CardPresenter';
import FilterQuerySet from '../models/FilterQuerySet';
import FilterQuery from '../models/FilterQuery';

import colors from '../styles/colors';
import styles from '../styles/SearchableCardListStyles';
import themeDark from '../styles/themeDark';
import themeLight from '../styles/themeLight';

class SearchableCardList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      allCards: [], // all cards, doesn't change
      data: [], // currently filtered cards
      searchModeIndex: 0,
      query: '',
      filterQuerySet: new FilterQuerySet(''),
      flatListRef: null,
      theme: this.props.theme === 'light' ? themeLight : themeDark,
    };
  }

  // TODO: can this just go in init?
  componentDidMount() {
    this.setState({
      data: this.props.cards,
      allCards: this.props.cards,
      error: null,
    });
  }

  componentDidUpdate() {
    Appearance.addChangeListener(theme => {
      this.setState({
        theme: theme.colorScheme === 'light' ? themeLight : themeDark,
      });
    });
  }

  readonly searchModes = {
    0: {
      label: 'title',
      icon: 'search-outline',
      description:
        'Search all cards by title. e.g.: \n\n\n quick draw \n\n farm \n\n chimaera \n\n destroyer \n\n dvdlots \n\n hdadtj',
    },
    1: {
      label: 'natural language query',
      icon: 'color-filter-outline',
      description: `Search all cards with natural language: \n\n\n gametext contains bad feeling \n\n lore matches isb \n\n power = 9 \n\n pulls falcon \n\n pulled by sos \n\n is a leader \n\n subtype contains starting \n\n icons includes pilot \n\n\n\n Also try combining queries with AND: \n\n\n lore c isb and side=dark and type=character`,
    },
  };

  currentSearchMode() {
    return this.searchModes[this.state.searchModeIndex] || 0;
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          backgroundColor: this.state.theme.backgroundColor,
          ...styles.separator,
        }}
      />
    );
  };

  searchRouter = (text: string) => {
    text = text.toLowerCase();

    this.setState({
      query: text,
    });

    switch (this.state.searchModeIndex) {
      case 0:
        this.searchFilterFunction(text);
        break;
      case 1:
        this.queryFilterFunction(text);
        break;
    }
  };

  queryFilterFunction = (text: string) => {
    const filterQuerySet = new FilterQuerySet(text);

    this.setState({
      query: text,
      filterQuerySet: filterQuerySet,
    });

    // this.debugger(filterQuerySet); // Uncomment to help debug insane queries

    if (filterQuerySet.valid()) {
      const newData = filterQuerySet.execute(this.state.allCards);

      this.setState({
        data: newData,
      });
    } else {
      this.setState({
        data: [],
      });
    }

    return filterQuerySet.valid();
  };

  debugger = filterQuerySet => {
    console.log('====');
    console.log('text entry: ', text);
    console.log('====');
    filterQuerySet.filterQueries.forEach(filterQuery => {
      console.log('field: ', filterQuery.field?.name);
      console.log('rawField', filterQuery.rawField);
      console.log('validField: ', filterQuery.validField());
      console.log('comparator: ', filterQuery.comparator?.name);
      console.log('rawComparator: ', filterQuery.rawComparator);
      console.log('validComparator: ', filterQuery.validComparator());
      console.log('value: ', filterQuery.value);
      console.log('rawValue: ', filterQuery.rawValue);
      console.log('validValue: ', filterQuery.validValue());
      console.log('filter: ', typeof filterQuery.filter);
      console.log('valid?: ', filterQuery.valid());
      console.log('\n');
    });
    console.log('\n');
  };

  searchFilterFunction = (text: string) => {
    console.log('searching for:', text);

    const newData = this.state.allCards.filter(card => {
      const textData = text;
      const itemData = `${card.title} ${card.sortTitle} ${card.abbr || ' '}`
        .toLowerCase()
        .trim();

      // Allow for unorderd word matches
      const textDataList = textData.split(' ');
      const matches = textDataList.filter(
        (w: string) => itemData.indexOf(w) > -1,
      );

      return matches.length === textDataList.length;
    });

    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {
    return (
      <View
        style={{
          height: this.state.filterQuerySet.viewHeight(),
          ...styles.header,
          ...(this.state.query === null || this.state.query == ''
            ? styles.headerWithEmptyQuery
            : styles.headerWithQuery),
        }}>
        <SearchBar
          placeholder={`Search by ${this.currentSearchMode().label}`}
          round
          onChangeText={text => this.searchRouter(text)}
          autoCorrect={false}
          value={this.state.query}
          inputStyle={{
            ...styles.searchBarInput,
          }}
          containerStyle={{
            ...styles.searchBarContainer,
            backgroundColor: this.state.theme.secondaryBackgroundColor,
          }}
          inputContainerStyle={{
            backgroundColor: this.state.theme.backgroundColor,
            ...styles.searchBarInputContainer,
          }}
          searchIcon={
            <Icon
              name={this.currentSearchMode().icon}
              type="ionicon"
              color={this.state.theme.iconColor}
              onPress={() => {
                this.setState({query: null});
                this.searchRouter('');
                this.setState({
                  searchModeIndex: (this.state.searchModeIndex + 1) % 2,
                });
              }}
            />
          }
        />

        {this.state.filterQuerySet.filterQueries.map(
          (filterQuery: FilterQuery, i: number) => (
            <View
              key={`filterQuery_${i}`}
              style={{
                backgroundColor: this.state.query
                  ? this.state.theme.secondaryBackgroundColor
                  : this.state.theme.backgroundColor,
                borderColor: this.state.theme.backgroundColor,
                ...styles.filterQueryContainer,
              }}>
              {this.state.searchModeIndex == 1 && filterQuery.query && (
                <Chip
                  title={filterQuery.displayFieldName()}
                  key={`$filter_query_{i}_field`}
                  type="outline"
                  buttonStyle={{
                    backgroundColor: this.state.theme.backgroundColor,
                    borderColor: filterQuery.validField()
                      ? this.state.theme.yesColor
                      : this.state.theme.noColor,
                    ...styles.chipButton,
                  }}
                  titleStyle={{
                    color: filterQuery.validField()
                      ? this.state.theme.yesColor
                      : this.state.theme.noColor,
                    ...styles.chipTitle,
                  }}
                  containerStyle={styles.chipContainer}></Chip>
              )}

              {this.state.searchModeIndex == 1 &&
                (filterQuery.comparator ||
                  filterQuery.partiallyValidComparator()) &&
                !(
                  filterQuery.usingDefaultComparator() &&
                  filterQuery.comparator.name == 'includes'
                ) && (
                  <Chip
                    title={filterQuery.displayComparatorName()}
                    key={`filter_query_${i}_comparator`}
                    type="outline"
                    buttonStyle={{
                      backgroundColor: this.state.theme.backgroundColor,
                      borderColor: filterQuery.validComparator()
                        ? this.state.theme.yesColor
                        : this.state.theme.noColor,
                      ...styles.chipButton,
                    }}
                    titleStyle={{
                      color: filterQuery.validComparator()
                        ? this.state.theme.yesColor
                        : this.state.theme.noColor,
                      ...styles.chipTitle,
                    }}
                    containerStyle={styles.chipContainer}></Chip>
                )}

              {this.state.searchModeIndex == 1 && filterQuery.value && (
                <Chip
                  title={filterQuery.rawValue}
                  key={'value'}
                  type="outline"
                  buttonStyle={{
                    backgroundColor: this.state.theme.backgroundColor,
                    borderColor:
                      filterQuery.validValue() &&
                      filterQuery.length(this.state.allCards) > 0
                        ? this.state.theme.yesColor
                        : this.state.theme.noColor,
                    ...styles.chipButton,
                  }}
                  titleStyle={{
                    color:
                      filterQuery.validValue() &&
                      filterQuery.length(this.state.allCards) > 0
                        ? this.state.theme.yesColor
                        : this.state.theme.noColor,
                    ...styles.chipTitle,
                  }}
                  containerStyle={styles.chipContainer}></Chip>
              )}

              {this.state.query != '' && this.state.searchModeIndex == 0 && (
                <Chip
                  title={this.state.query}
                  key={'value'}
                  type="outline"
                  buttonStyle={{
                    backgroundColor: this.state.theme.backgroundColor,
                    borderColor: this.state.theme.yesColor,
                    ...styles.chipButton,
                  }}
                  titleStyle={{
                    color: this.state.theme.yesColor,
                    ...styles.chipTitle,
                  }}
                  containerStyle={styles.chipContainer}
                />
              )}

              <Text
                style={{
                  color: this.state.theme.foregroundColor,
                  ...styles.resultsCount,
                  ...(this.state.filterQuerySet.length() > 1
                    ? styles.resultsCountWithNoMatch
                    : styles.resultsCountWithMatch),
                }}>
                {this.state.query
                  ? `(${
                      // filterQuery.execute(this.state.allCards).length
                      this.state.data.length
                    } results)`
                  : ''}
              </Text>
            </View>
          ),
        )}
        {this.state.query && this.state.filterQuerySet.length() > 1 && (
          <Text
            style={{
              color: this.state.theme.foregroundColor,
              ...styles.combinedResultsCount,
            }}>
            {`(combined ${this.state.data.length} results)`}
          </Text>
        )}
      </View>
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View
        style={{
          ...styles.scrollableCardlistContainer,
          backgroundColor: this.state.theme.backgroundColor,
        }}>
        {this.renderHeader()}
        {(this.state.query && (
          <Animated.FlatList
            ref={ref => {
              this.state.flatListRef = ref;
            }}
            data={this.state.data}
            renderItem={({item, index}) => (
              <CardListItem
                item={new CardPresenter(item)}
                index={index}
                flatListRef={this.state.flatListRef}
                scrollToIndex={(i: number) =>
                  this.state.flatListRef.scrollToIndex({
                    animated: true,
                    index: i,
                  })
                }
              />
            )}
            keyExtractor={(item, index) => `${index}_${item.id}`}
            ItemSeparatorComponent={this.renderSeparator}
            keyboardShouldPersistTaps="never"
            // Performance settings
            initialNumToRender={10} // Reduce initial render amount
            removeClippedSubviews={true} // Unmount components when outside of window
            maxToRenderPerBatch={10} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={10} // Reduce the window size
          />
        )) || (
          <>
            <View style={styles.defaultTextContainer}>
              <Text
                style={{
                  color: this.state.theme.foregroundColor,
                }}>
                Tap the
              </Text>
              <Icon
                name={this.currentSearchMode().icon}
                type="ionicon"
                color={this.state.theme.foregroundColor}
                size={16}
                style={styles.defaultTextIcon}
              />
              <Text
                style={{
                  color: this.state.theme.foregroundColor,
                }}>
                icon to switch between search modes. {'\n\n\n'}
              </Text>
            </View>
            <Text
              style={{
                color: this.state.theme.foregroundColor,
                ...styles.defaultTextDescription,
              }}>
              {this.currentSearchMode().description}
            </Text>
          </>
        )}
      </View>
    );
  }
}

export default SearchableCardList;
