import {Pressable, StyleSheet, Text, View} from 'react-native';
import {capitalize, hp} from '../helpers/common';
import {theme} from '../constants/theme';

export const SectionView = ({title, content}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({data, filterName, filters, setFilters}) => {
  const onSelect = item => {
    // console.log(item);
    setFilters({...filters, [filterName]: item});
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : 'white';
          let color = isActive ? 'white' : theme.colors.neutral(0.7);
          return (
            <Pressable
              onPress={() => onSelect(item)}
              style={[styles.outlineButton, {backgroundColor}]}
              key={index}>
              <Text style={[styles.outlineButtonTxt, {color}]}>
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilter = ({data, filterName, filters, setFilters}) => {
  const onSelect = item => {
    // console.log(item);
    setFilters({...filters, [filterName]: item});
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let borderColor = isActive ? theme.colors.neutral(0.5) : 'white';
          return (
            <Pressable onPress={() => onSelect(item)} key={index}>
              <View style={[styles.colorWrapper, {borderColor}]}>
                <View style={[styles.color, {backgroundColor: item}]}></View>
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.3),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  outlineButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: 'continuous',
  },
  outlineButtonTxt: {
    color: theme.colors.neutral(0.8),
  },
  colorWrapper: {
    padding: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderCurve: 'continuous',
  },
  color: {
    height: 40,
    width: 50,
    borderRadius: theme.radius.lg - 2,
    borderCurve: 'continuous',
  },
});
