import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/FontAwesome';
import {debounce} from 'lodash';

import {theme} from '../constants/theme';
import {hp, wp} from '../helpers/common';
import Categories from '../components/Categories';
import {apiCall} from '../api';
import ImageGrid from '../components/ImageGrid';
import FilterModal from '../components/FilterModal';
var page = 1;
const HomeScreen = ({navigation, route}) => {
  const paddingTop = top > 0 ? top + 10 : 40;
  const {top} = useSafeAreaInsets();
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);

  const handleChangeCategory = cat => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = {page: 1}, append = true) => {
    console.log('params', params, append);
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) setImages([...images, ...res.data.hits]);
      else setImages([...res.data.hits]);
    }
  };

  const handleSearch = text => {
    setSearch(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({page, q: text}, false);
    }
    if (text === '') {
      page = 1;
      searchInputRef?.current.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({page, ...filters}, false);
    }
  };
  const clearSearch = () => {
    setSearch('');
    searchInputRef?.current.clear();
  };
  const handleSearchDebounce = useCallback(debounce(handleSearch, 500), []);

  const openFilterModal = () => {
    modalRef?.current.present();
  };
  const closeFilterModal = () => {
    modalRef?.current.close();
  };

  const applyFilter = () => {
    // console.log('applying filter');
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };
  const resetFilter = () => {
    // console.log('resetting filter');
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };

  const clearThisFilter = filterName => {
    let filterz = {...filters};
    delete filterz[filterName];
    setFilters({...filterz});
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleScroll = event => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrolloffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;
    if (scrolloffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        console.log('reached the bottom of scrollview');
        // fetch more images
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      } else if (isEndReached) {
        setIsEndReached(false);
      }
    }
  };

  const handleScrollTop = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={[styles.container, {paddingTop: paddingTop}]}>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollTop}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable>
          <Icon name="align-right" size={22} color="rgba(10, 10, 10,0.7)" />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{gap: 15}}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchBarIcon}>
            <Icon name="search" size={24} color="rgba(10, 10, 10,0.7)" />
          </View>
          <TextInput
            placeholder="Search"
            style={styles.searchBarInput}
            // value={search}
            ref={searchInputRef}
            onChangeText={handleSearchDebounce}
            placeholderTextColor={'rgba(10, 10, 10,0.5)'}
          />
          {search.length > 0 ? (
            <Pressable
              style={styles.closeButton}
              onPress={() => handleSearch('')}>
              <Icon name="times" size={24} color="rgba(10, 10, 10,0.7)" />
            </Pressable>
          ) : null}
          <Pressable onPress={openFilterModal} style={styles.filterButton}>
            <Icon name="filter" size={24} color="rgba(10, 10, 10,0.7)" />
          </Pressable>
        </View>
        {/* Categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* Applied Filters */}

        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filter}>
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key == 'colors' ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}></View>
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}

                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}>
                      <Icon
                        name="close"
                        size={14}
                        color="rgba(10, 10, 10,0.6)"
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Images Grid */}
        <View>
          {images.length > 0 && (
            <ImageGrid navigation={navigation} images={images} />
          )}
        </View>

        {/* Loading Icon */}
        <View
          style={{marginBottom: 70, marginTop: images.length > 0 ? 10 : 70}}>
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>
      {/* Filter Modal */}
      <FilterModal
        filters={filters}
        setFilters={setFilters}
        onApply={applyFilter}
        onClose={closeFilterModal}
        onReset={resetFilter}
        modalRef={modalRef}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(4),
  },
  title: {
    fontSize: hp(4),
    color: theme.colors.neutral(0.8),
    fontWeight: theme.fontWeights.semibold,
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: theme.radius.lg,
  },
  searchBarIcon: {
    padding: 8,
  },
  searchBarInput: {
    flex: 1,
    fontSize: hp(1.8),
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    color: theme.colors.neutral(0.7),
  },
  closeButton: {
    padding: 8,
  },
  filter: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    // padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});
