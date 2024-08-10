import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  ToastAndroid,
} from 'react-native';
import {wp, hp} from '../helpers/common';
import {theme} from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {FadeInDown, FadeInRight} from 'react-native-reanimated';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

const ImageScreen = ({navigation, route}) => {
  const {
    webformatURL,
    user,
    views,
    downloads,
    likes,
    imageWidth,
    imageHeight,
    previewURL,
  } = route.params.params;
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  const [permissionStatus, setPermissionStatus] = useState(null);

  let uri = webformatURL;
  const fileName = previewURL?.split('/').pop();
  const imageUrl = uri;
  const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

  console.log('ImageUrl', imageUrl);
  console.log('FilePath', filePath);

  useEffect(() => {
    setIsLoading(true);
    setKey(prevKey => prevKey + 1);
  }, [webformatURL]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getSize = () => {
    const aspectRatio = imageWidth / imageHeight;
    const maxWidth = Platform.OS == 'web' ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;
    if (aspectRatio < 1) {
      // portrait image
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  /// grant permission in android

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      try {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        setPermissionStatus(permission === PermissionsAndroid.RESULTS.GRANTED);
      } catch (error) {
        console.error('Permission check error:', error);
      }
    }
  };

  const handleDownload = async () => {
    if (Platform.OS === 'ios') {
      // iOS-specific download logic here
      await downloadImageIOS();
      return;
    }

    if (Platform.Version >= 29) {
      // Android 10 and above
      await downloadImageMediaStore();
    } else {
      // Android 9 and below
      await downloadImageLegacy();
    }
  };

  const downloadImageIOS = async () => {
    try {
      // First, we need to fetch the image
      const resp = await fetch(imageUrl);
      const imageData = await resp.blob();

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(imageData);
      reader.onloadend = async () => {
        const base64data = reader.result;

        // Save the image to camera roll
        await CameraRoll.save(base64data, {type: 'photo'});
        Alert.alert('Success', 'Image saved to your photo library!');
      };
    } catch (error) {
      console.error('iOS Download failed:', error);
      Alert.alert('Error', 'Failed to save image to photo library');
    }
  };

  const downloadImageMediaStore = async () => {
    try {
      const {config, fs} = RNFetchBlob;
      const date = new Date();

      let PictureDir = fs.dirs.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path:
            PictureDir +
            '/image_' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            '.jpg',
          description: 'Image',
        },
      };

      config(options)
        .fetch('GET', imageUrl)
        .then(res => {
          ToastAndroid.show(
            'Image Downloaded Successfully',
            ToastAndroid.SHORT,
          );
        });
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download image');
    }
  };

  const downloadImageLegacy = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const {config, fs} = RNFetchBlob;
        const date = new Date();
        const {PictureDir} = fs.dirs;
        const imagePath = `${PictureDir}/image_${Math.floor(
          date.getTime() + date.getSeconds() / 2,
        )}.jpg`;

        const res = await config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: imagePath,
            description: 'Image',
          },
        }).fetch('GET', imageUrl);

        console.log('Download response:', JSON.stringify(res));
        ToastAndroid.show('Image Downloaded Successfully', ToastAndroid.SHORT);
      } else {
        Alert.alert(
          'Permission Denied',
          'You need to grant storage permission to download images.',
        );
      }
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download image');
    }
  };

  // Handle Share Functionality

  const downloadImageForShare = async () => {
    try {
      const {config, fs} = RNFetchBlob;
      const date = new Date();
      const imageName = `image_${Math.floor(
        date.getTime() + date.getSeconds() / 2,
      )}.jpg`;
      let downloadPath;

      if (Platform.OS === 'android') {
        if (Platform.Version >= 29) {
          // For Android 10 and above
          downloadPath = `${fs.dirs.CacheDir}/${imageName}`;
        } else {
          // For Android 9 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            throw new Error('Storage permission denied');
          }
          downloadPath = `${fs.dirs.PictureDir}/${imageName}`;
        }
      } else {
        // For iOS
        downloadPath = `${fs.dirs.CacheDir}/${imageName}`;
      }

      const res = await config({
        fileCache: true,
        path: downloadPath,
      }).fetch('GET', imageUrl);

      console.log('Image downloaded to:', res.path());
      return res.path();
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);

      const localFilePath = await downloadImageForShare();
      console.log('Local file path:', localFilePath);

      const fileExists = await RNFS.exists(localFilePath);
      console.log('File exists:', fileExists);

      if (!fileExists) {
        throw new Error('Downloaded file not found');
      }

      const base64Data = await RNFS.readFile(localFilePath, 'base64');
      const shareOptions = {
        title: `Image by ${user}`,
        message: `Check out this amazing image by ${user}!`,
        url: `data:image/jpeg;base64,${base64Data}`,
      };

      const shareResponse = await Share.open(shareOptions);
      console.log('Share response:', shareResponse);

      // Clean up the temporary file
      await RNFS.unlink(localFilePath);
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share error:', error);
        Alert.alert(
          'Error',
          'An error occurred while sharing: ' + error.message,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container} key={key}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.white} />
        </View>
      )}
      <View style={styles.backgroundContainer}>
        <Image
          source={{uri: webformatURL}}
          style={styles.backgroundImage}
          blurRadius={25}
          onLoad={handleImageLoad}
        />
        <View style={styles.overlay} />
      </View>
      <SafeAreaView style={styles.content}>
        <Pressable style={styles.backButton} onPress={() => navigation.pop()}>
          <Icon name="arrow-back" size={24} color={theme.colors.white} />
        </Pressable>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: webformatURL}}
            style={[styles.mainImage, getSize()]}
            resizeMode="contain"
            onLoad={handleImageLoad}
          />
        </View>
        <View style={styles.actionContainer}>
          <Animated.View entering={FadeInDown.springify()}>
            <Pressable onPress={handleDownload} style={styles.button}>
              <StatItem icon="download-outline" />
            </Pressable>
          </Animated.View>
          <Animated.View entering={FadeInDown.springify()}>
            <Pressable onPress={handleShare} style={styles.button}>
              <StatItem icon="share-social-outline" />
            </Pressable>
          </Animated.View>
          <Animated.Text
            entering={FadeInRight.springify()}
            style={styles.photographerName}>
            Photo by {user}
          </Animated.Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const StatItem = ({icon, value}) => (
  <View style={styles.statItem}>
    <Icon name={icon} size={30} color={theme.colors.white} />
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust opacity as needed
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: 40,
    padding: wp(4),
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: wp(90),
    height: hp(60),
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  actionContainer: {
    marginBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
    justifyContent: 'center',
  },

  //   infoContainer: {
  //     padding: wp(4),
  //   },
  //   photographerName: {
  //     color: theme.colors.white,
  //     fontSize: wp(4.5),
  //     fontWeight: 'bold',
  //     marginBottom: hp(2),
  //   },
  //   statsContainer: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-around',
  //   },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    color: theme.colors.white,
    marginLeft: wp(2),
    fontSize: wp(3.5),
  },
});

export default ImageScreen;
