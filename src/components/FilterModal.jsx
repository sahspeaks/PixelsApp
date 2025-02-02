import {StyleSheet, Text, View, Stylesheet, Pressable} from 'react-native';
import React, {useMemo} from 'react';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {capitalize, hp} from '../helpers/common';
import {theme} from '../constants/theme';
import {ColorFilter, CommonFilterRow, SectionView} from './FilterViews';
import {filtersData} from '../constants/categories';

const FilterModal = ({
  modalRef,
  onApply,
  onClose,
  onReset,
  filters,
  setFilters,
}) => {
  const snapPoints = useMemo(() => ['75%'], []);
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
      //   onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>

          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = filtersData[sectionName];
            let title = capitalize(sectionName);
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 100 + 100)
                  .springify()
                  .damping(11)}
                key={index}>
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInDown.delay(500).springify().damping(11)}
            style={styles.buttons}>
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text
                style={[styles.buttonText, {color: theme.colors.neutral(0.9)}]}>
                Reset
              </Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, {color: theme.colors.white}]}>
                Apply
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default FilterModal;

const sections = {
  order: props => <CommonFilterRow {...props} />,
  orientation: props => <CommonFilterRow {...props} />,
  type: props => <CommonFilterRow {...props} />,
  colors: props => <ColorFilter {...props} />,
};

const CustomBackdrop = ({animatedIndex, style}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {opacity};
  });

  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];

  return <Animated.View style={containerStyle}></Animated.View>;
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    flex: 1,
    // backgroundColor: 'red',
    // width: '100%',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(3.7),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.7),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.09),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  buttonText: {
    fontSize: hp(2),
  },
});
