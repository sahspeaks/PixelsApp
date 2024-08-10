import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React from 'react';
import {categories} from '../constants/categories';
import {hp, wp} from '../helpers/common';
import {theme} from '../constants/theme';
import Animated, {FadeInRight} from 'react-native-reanimated';

const Categories = ({activeCategory, handleChangeCategory}) => {
  return (
    <FlatList
      horizontal={true}
      data={categories}
      contentContainerStyle={styles.FlatListContainer}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item}
      renderItem={({item, index}) => (
        <CategotyItem
          title={item}
          index={index}
          isActive={activeCategory === item}
          handleChangeCategory={handleChangeCategory}
        />
      )}
    />
  );
};
const CategotyItem = ({title, index, isActive, handleChangeCategory}) => {
  let color = isActive ? theme.colors.white : theme.colors.neutral(0.7);
  let backgroundColor = isActive
    ? theme.colors.neutral(0.7)
    : theme.colors.white;
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}>
      <Pressable
        onPress={() => handleChangeCategory(isActive ? null : title)}
        style={[styles.category, {backgroundColor}]}>
        <Text key={index} style={[styles.title, {color}]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  FlatListContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    // backgroundColor: 'white',
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.7),
  },
});
