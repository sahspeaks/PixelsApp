import React, {useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {hp, wp} from '../helpers/common';
import {theme} from '../constants/theme';

const WelcomeScreen = ({navigation}) => {
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withTiming(1, {duration: 1000, easing: Easing.ease});
    subtitleOpacity.value = withTiming(1, {
      duration: 1000,
      delay: 300,
      easing: Easing.ease,
    });
    buttonOpacity.value = withTiming(1, {
      duration: 1000,
      delay: 600,
      easing: Easing.ease,
    });
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      {translateY: withTiming(0, {duration: 1000, easing: Easing.ease})},
    ],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [
      {translateY: withTiming(0, {duration: 1000, easing: Easing.ease})},
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [
      {translateY: withTiming(0, {duration: 1000, easing: Easing.ease})},
    ],
  }));

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <Image
        style={styles.bgImage}
        source={require('../../assets/images/welcome.png')}
        resizeMode={'cover'}
      />
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 0.5)',
          'white',
          'white',
        ]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 0.8}}
        style={styles.gradient}
      />
      <View style={styles.titleContainer}>
        <Animated.Text style={[styles.title, titleStyle]}>Pixels</Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Every Pixel Tells a Story
        </Animated.Text>
        <Animated.View style={buttonStyle}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.replace('HomeScreen')}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp('100'),
    height: hp('100'),
    position: 'absolute',
  },
  gradient: {
    width: wp('100'),
    height: hp('65'),
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
  title: {
    fontSize: hp(7),
    color: theme.colors.neutral(0.8),
    fontWeight: theme.fontWeights.bold,
  },
  subtitle: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.5),
    fontWeight: theme.fontWeights.medium,
    marginBottom: 10,
    letterSpacing: 1,
  },
  button: {
    marginBottom: 50,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 1,
  },
});
