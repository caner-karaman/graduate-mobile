import React, {useEffect} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import {PopBadge} from '../components/atoms/PopBadge';
import {PopButton} from '../components/atoms/PopButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../navigation/AppNavigator';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {handleError} from '../utils/errorHandler';
import ReactNativeBlobUtil from 'react-native-blob-util';

// Local dummy assets
const GRADUATE_IMAGE = require('../assets/images/graduate.png');

export interface PopMaximalismResultScreenProps
  extends NativeStackScreenProps<AppStackParamList, 'PopMaximalismResult'> {}

export const PopMaximalismResultScreen = ({
  route,
  navigation,
}: PopMaximalismResultScreenProps) => {
  const imageUri = route.params?.imageUri;

  // Reanimated values for premium entrance animations
  const frameScale = useSharedValue(0.8);
  const frameRotate = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const titleOpacity = useSharedValue(0);

  // Floating background element animation values
  const burstScale = useSharedValue(1);
  const starScale = useSharedValue(1);

  useEffect(() => {
    // Animate portrait frame entrance
    frameScale.value = withSpring(1, {damping: 12, stiffness: 90});
    frameRotate.value = withSpring(-3, {damping: 10, stiffness: 80});

    // Animate the main text title
    titleTranslateY.value = withTiming(0, {duration: 650});
    titleOpacity.value = withTiming(1, {duration: 650});

    // Subtle scale pulses on the background decorative shapes to make the screen feel alive
    burstScale.value = withRepeat(
      withSequence(
        withTiming(1.08, {duration: 1000}),
        withTiming(1.0, {duration: 1000})
      ),
      -1,
      true
    );

    starScale.value = withRepeat(
      withSequence(
        withTiming(1.1, {duration: 900}),
        withTiming(1.0, {duration: 900})
      ),
      -1,
      true
    );
  }, [frameScale, frameRotate, titleTranslateY, titleOpacity, burstScale, starScale]);

  const animatedFrameStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: frameScale.value},
        {rotate: `${frameRotate.value}deg`},
      ],
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: titleTranslateY.value}],
      opacity: titleOpacity.value,
    };
  });

  const animatedBurstStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: burstScale.value}, {rotate: '12deg'}],
    };
  });

  const animatedStarStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: starScale.value}, {rotate: '-12deg'}],
    };
  });

  const hasAndroidPermission = async (): Promise<boolean> => {
    const version = typeof Platform.Version === 'string'
      ? parseInt(Platform.Version, 10)
      : Platform.Version;

    if (version >= 33) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Galeri İzni',
        message: 'Fotoğrafı galerinize kaydetmek için depolama iznine ihtiyacımız var.',
        buttonPositive: 'Tamam',
        buttonNegative: 'İptal',
      },
    );

    return status === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handleGrabIt = async (): Promise<void> => {
    if (!imageUri) {
      Alert.alert('Hata', 'Kaydedilecek fotoğraf bulunamadı.');
      return;
    }

    let localPath: string | null = null;

    try {
      // 1. Android Specific: Check permissions
      if (Platform.OS === 'android') {
        const hasPermission = await hasAndroidPermission();
        if (!hasPermission) {
          Alert.alert(
            'İzin Reddedildi',
            'Fotoğrafı galeriye kaydetmek için depolama izni vermeniz gerekiyor.',
          );
          return;
        }
      }

      // 2. Download remote/HTTP URL to local temporary file to bypass iOS validation/ATS restrictions
      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'png',
      }).fetch('GET', imageUri);

      localPath = res.path();

      // 3. Save to photo library (prepend file:// protocol so CameraRoll loads the file correctly)
      await CameraRoll.save(`file://${localPath}`, {type: 'photo', album: 'Graduate'});

      // 4. Show success alert
      Alert.alert(
        'Başarılı 🎉',
        'Fotoğraf galerinize başarıyla kaydedildi!',
        [
          {
            text: 'Harika!',
            onPress: () => {
              navigation.navigate('PopMaximalism');
            },
          },
        ],
      );
    } catch (err) {
      handleError(err, {
        componentName: 'PopMaximalismResultScreen',
        actionName: 'handleGrabIt',
      });
      Alert.alert(
        'Hata',
        `Fotoğraf galeriye kaydedilirken bir hata oluştu: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      // 5. Clean up the downloaded temporary cache file
      if (localPath) {
        try {
          await ReactNativeBlobUtil.fs.unlink(localPath);
        } catch (cleanupErr) {
          handleError(cleanupErr, {
            componentName: 'PopMaximalismResultScreen',
            actionName: 'handleGrabItCleanup',
          });
        }
      }
    }
  };

  const handleDoItAgain = (): void => {
    // Go back to the initial camera screen
    navigation.navigate('PopMaximalism');
  };

  return (
    <ImageBackground
      source={require('../assets/images/halftone.png')}
      resizeMode="repeat"
      style={{flex: 1}}
      className="bg-[#131313]"
    >
      <SafeAreaView style={{flex: 1}}>
        {/* Outer container */}
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingBottom: 64, justifyContent: 'center'}}
          style={{flex: 1}}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative Background Shapes */}
          <View className="absolute inset-0 pointer-events-none" style={{zIndex: -1}}>
            {/* Big Yellow Comic Burst (Stacked rotated views) */}
            <Animated.View
              style={animatedBurstStyle}
              className="absolute top-10 -left-12 w-48 h-48 opacity-80"
            >
              <View className="absolute inset-0 bg-[#FFE800] rounded-xl border-2 border-black" style={{transform: [{rotate: '0deg'}]}} />
              <View className="absolute inset-0 bg-[#FFE800] rounded-xl border-2 border-black" style={{transform: [{rotate: '30deg'}]}} />
              <View className="absolute inset-0 bg-[#FFE800] rounded-xl border-2 border-black" style={{transform: [{rotate: '60deg'}]}} />
            </Animated.View>

            {/* Pink Comic Star (Stacked rotated views) */}
            <Animated.View
              style={animatedStarStyle}
              className="absolute bottom-40 -right-8 w-28 h-28"
            >
              <View className="absolute inset-0 bg-[#FF007F] rounded-lg border-2 border-black" style={{transform: [{rotate: '0deg'}]}} />
              <View className="absolute inset-0 bg-[#FF007F] rounded-lg border-2 border-black" style={{transform: [{rotate: '30deg'}]}} />
              <View className="absolute inset-0 bg-[#FF007F] rounded-lg border-2 border-black" style={{transform: [{rotate: '60deg'}]}} />
            </Animated.View>

            {/* Cyan Dot Sticker */}
            <View
              className="absolute top-[45%] -right-4 w-12 h-12 relative"
              style={{transform: [{rotate: '15deg'}]}}
            >
              {/* Flat black drop shadow */}
              <View className="absolute inset-0 bg-black rounded-full translate-x-1 translate-y-1" />
              <View className="absolute inset-0 bg-[#00F0FF] border-4 border-white rounded-full" />
            </View>

            {/* Green Zigzag Line (Simulated with dashed top border rotated) */}
            <View
              className="absolute top-[22%] left-[12%] w-24 h-6 border-t-[6px] border-dashed border-[#00FF00]"
              style={{transform: [{rotate: '-45deg'}]}}
            />
          </View>

          {/* Central Portrait & Content */}
          <View className="items-center w-full z-10">
            
            {/* Image Section - Sticker Frame Style */}
            <View className="items-center justify-center py-6 w-full mb-8">
              <Animated.View
                style={[animatedFrameStyle, {width: 270, height: 270}]}
                className="relative"
              >
                {/* 3D Flat Drop Shadow Layer */}
                <View
                  className="absolute inset-0 bg-[#FF007F] rounded-3xl border-4 border-black"
                  style={{transform: [{translateX: 8}, {translateY: 8}, {rotate: '6deg'}]}}
                />

                {/* Main Photo Frame */}
                <View className="absolute inset-0 bg-white border-8 border-black rounded-3xl overflow-hidden">
                  <Image
                    source={imageUri ? {uri: imageUri} : GRADUATE_IMAGE}
                    className="w-full h-full object-cover"
                    resizeMode="cover"
                  />
                </View>

                {/* Floating Lightning Bolt Badge (Top Right of Frame) */}
                <PopBadge
                  color="yellow"
                  size="md"
                  rotation={15}
                  className="absolute -top-6 -right-6 z-20"
                >
                  <Text className="text-2xl">⚡</Text>
                </PopBadge>
              </Animated.View>
            </View>

            {/* Title Section (BOOM! GRADUATED!) */}
            <Animated.View
              style={animatedTitleStyle}
              className="items-center mb-6 w-full"
            >
              <Text
                style={{
                  textShadowColor: '#000000',
                  textShadowOffset: {width: 4, height: 4},
                  textShadowRadius: 0.1,
                  transform: [{rotate: '-2deg'}],
                }}
                className="font-pop-display text-[#FFE800] text-5xl md:text-6xl text-center font-black tracking-wider leading-none uppercase"
              >
                BOOM!{'\n'}GRADUATED!
              </Text>
            </Animated.View>

            {/* Subtext Section (Sticker Box Style) */}
            <View className="relative mb-12" style={{transform: [{rotate: '1deg'}]}}>
              {/* Black drop shadow behind subtext */}
              <View className="absolute inset-0 bg-black rounded-xl translate-x-1 translate-y-1" />
              {/* Subtext container */}
              <View className="bg-surface-container border-2 border-white rounded-xl px-6 py-2.5">
                <Text className="font-pop-body text-white text-lg font-bold text-center">
                  You look absolutely amazing.
                </Text>
              </View>
            </View>

            {/* Action Buttons (CTAs) */}
            <View className="w-full items-center gap-6 px-4">
              {/* Primary CTA (GRAB IT!) */}
              <PopButton
                onPress={handleGrabIt}
                title="GRAB IT! ➔"
                color="red"
                badgeText="POW!"
                className="w-full max-w-sm"
              />

              {/* Secondary CTA (DO IT AGAIN!) */}
              <PopButton
                onPress={handleDoItAgain}
                title="DO IT AGAIN!"
                color="white"
                className="w-full max-w-sm"
              />
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};
