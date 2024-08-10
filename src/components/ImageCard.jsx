import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {getImageSize, wp} from '../helpers/common';
import {theme} from '../constants/theme';

const ImageCard = ({item, NumberOfColumns, index, navigation}) => {
  const isLastInRow = () => {
    return (index + 1) % NumberOfColumns === 0;
  };

  const getImageHeight = () => {
    let {imageHeight: height, imageWidth: width} = item;
    return {height: getImageSize(height, width)};
  };

  return (
    <Pressable
      onPress={() => navigation.push('ImageScreen', {params: {...item}})}
      style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
      <FastImage
        style={[styles.image, getImageHeight()]}
        source={{uri: item?.webformatURL}}
      />
    </Pressable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%',
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2),
  },
});
