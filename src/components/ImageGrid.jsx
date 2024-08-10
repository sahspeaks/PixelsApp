import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MasonryFlashList} from '@shopify/flash-list';
import ImageCard from './ImageCard';
import {wp} from '../helpers/common';
import {getColumnsCount} from '../helpers/common';
import {theme} from '../constants/theme';

const ImageGrid = ({images, navigation}) => {
  const NumberOfColumns = getColumnsCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={NumberOfColumns}
        initialNumToRender={1000}
        contentContainerStyle={styles.ListConttainer}
        renderItem={({item, index}) => (
          <ImageCard
            navigation={navigation}
            item={item}
            NumberOfColumns={NumberOfColumns}
            index={index}
          />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  ListConttainer: {
    paddingHorizontal: wp(4),
  },
});
