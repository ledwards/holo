import React, {useState, useEffect} from 'react';
import {View, useColorScheme, Appearance, StatusBar} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import TabNavigation from './src/components/navigation/TabNavigation';

import downloadCardDefinitions from './src/lib/DownloadCardDefinitions';
import downloadExpansionSets from './src/lib/DownloadExpansionSets';
import downloadDecklists from './src/lib/DownloadDecklists';
import loadCardDefinitions from './src/lib/LoadCardDefinitions';
import loadExpansionSets from './src/lib/LoadExpansionSets';
import loadDecklists from './src/lib/LoadDecklists';

import themeDark from './src/styles/themeDark';
import themeLight from './src/styles/themeLight';
import layout from './src/constants/layout';

import ThemeContext from './src/contexts/ThemeContext';
import AllCardsContext from './src/contexts/AllCardsContext';
import AllDecklistsContext from './src/contexts/AllDecklistsContext';
import AllExpansionsContext from './src/contexts/AllExpansionsContext';

const App = () => {
  const initialTheme = useColorScheme();

  const [isCardsDownloadReady, setIsCardsDownloadReady] = useState(false);
  const [isExpansionSetsDownloadReady, setisExpansionSetsDownloadReady] =
    useState(false);
  const [isDecklistsDownloadReady, setIsDecklistsDownloadReady] =
    useState(false);
  const [allCards, setAllCards] = useState([]);
  const [expansionSets, setExpansionSets] = useState([]);
  const [allDecklists, setAllDecklists] = useState([]);
  const [internetConnection, setInternetConnection] = useState(false);
  const [theme, setTheme] = useState(
    initialTheme.colorScheme === 'light' ? themeLight : themeDark,
  );

  useEffect(() => {
    setTheme(initialTheme.colorScheme === 'light' ? themeLight : themeDark);

    Appearance.addChangeListener(t => {
      setTheme(t.colorScheme === 'light' ? themeLight : themeDark);
    });

    NetInfo.fetch().then(state => {
      setInternetConnection(state.isConnected);
    });

    NetInfo.addEventListener(state => {
      setInternetConnection(state.isConnected);
    });
  }, []);

  useEffect(() => {
    if (!isCardsDownloadReady && internetConnection) {
      downloadCardDefinitions().then(() => {
        setIsCardsDownloadReady(true);
      });
    }

    if (!isExpansionSetsDownloadReady && internetConnection) {
      downloadExpansionSets().then(() => {
        setisExpansionSetsDownloadReady(true);
      });
    }

    if (!isDecklistsDownloadReady && internetConnection) {
      downloadDecklists().then(() => {
        setIsDecklistsDownloadReady(true);
      });
    }
  }, [internetConnection]);

  useEffect(() => {
    if (
      !internetConnection ||
      (isCardsDownloadReady && isExpansionSetsDownloadReady)
    ) {
      loadExpansionSets()
        .then(sets => {
          setExpansionSets(sets);
          return sets;
        })
        .then(expansionSets => {
          loadCardDefinitions(expansionSets).then(cards => {
            setAllCards(cards);
          });
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (!internetConnection || isDecklistsDownloadReady) {
      loadDecklists().then(decklists => {
        setAllDecklists(decklists);
      });
    }
  }, [
    isCardsDownloadReady,
    isExpansionSetsDownloadReady,
    isDecklistsDownloadReady,
  ]);

  const NavigationContainerTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.backgroundColor,
    },
  };

  return (
    <AllDecklistsContext.Provider value={allDecklists}>
      <AllCardsContext.Provider value={allCards}>
        <AllExpansionsContext.Provider value={expansionSets}>
          <ThemeContext.Provider value={theme}>
            <View style={{width: '100%', height: '100%'}}>
              <View
                style={{
                  flex: 1,
                }}>
                <StatusBar barStyle={theme.statusBarStyle} />
                <NavigationContainer theme={NavigationContainerTheme}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <TabNavigation
                      allCards={allCards}
                      expansionSets={expansionSets}
                      allDecklists={allDecklists}
                    />
                  </View>
                </NavigationContainer>
                <BlurView
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: layout.nativeHeaderHeight(),
                  }}
                  blurType={theme.name}
                  blurAmount={10}
                  reducedTransparencyFallbackColor={
                    theme.translucentBackgroundColor
                  }
                />
              </View>
            </View>
          </ThemeContext.Provider>
        </AllExpansionsContext.Provider>
      </AllCardsContext.Provider>
    </AllDecklistsContext.Provider>
  );
};

export default App;
