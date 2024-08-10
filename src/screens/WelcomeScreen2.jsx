import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import {hp, wp} from '../helpers/common';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {theme} from '../constants/theme';

const WelcomeScreen = ({navigation}) => {
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
      {/* Linear Gradinet */}
      <Animated.View entering={FadeInDown.duration(600)} style={{flex: 1}}>
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
        {/* Text 1*/}
        <View style={styles.titleContainer}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify().damping(11)}
            style={styles.title}>
            Pixels
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(500).springify().damping(11)}
            style={styles.subtitle}>
            Every Pixel Tells a Story
          </Animated.Text>
          <Animated.View
            entering={FadeInDown.delay(600).springify().damping(11)}>
            <Pressable
              style={styles.button}
              onPress={() => navigation.replace('HomeScreen')}>
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
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
