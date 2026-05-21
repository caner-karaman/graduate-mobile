import React, {useEffect} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
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

interface UploadSuccessScreenProps
  extends NativeStackScreenProps<AppStackParamList, 'UploadSuccess'> {}

export const UploadSuccessScreen = ({
  route,
  navigation,
}: UploadSuccessScreenProps) => {
  const {imageUri} = route.params;

  // Reanimated values for premium entrance animations
  const frameScale = useSharedValue(0.8);
  const frameRotate = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  const textOpacity = useSharedValue(0);
  const starScale = useSharedValue(0.5);

  useEffect(() => {
    // Animate the main photo frame entrance
    frameScale.value = withSpring(1, {damping: 12});
    frameRotate.value = withSpring(3, {damping: 10});

    // Animate the text title
    textTranslateY.value = withTiming(0, {duration: 600});
    textOpacity.value = withTiming(1, {duration: 600});

    // Animate star badge
    starScale.value = withRepeat(
      withSequence(
        withTiming(1.15, {duration: 650}),
        withTiming(0.95, {duration: 650})
      ),
      -1,
      true
    );
  }, [frameScale, frameRotate, textTranslateY, textOpacity, starScale]);

  const animatedFrameStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: frameScale.value},
        {rotate: `${frameRotate.value}deg`},
      ],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: textTranslateY.value}],
      opacity: textOpacity.value,
    };
  });

  const animatedStarStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: starScale.value}, {rotate: '-12deg'}],
    };
  });

  const handleGoGraduate = (): void => {
    navigation.navigate('ComparisonScanReveal', {imageUri});
  };

  const handleChangePhoto = (): void => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/images/halftone.png')}
      resizeMode="repeat"
      style={{flex: 1}}
    >
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingBottom: 64}}
          style={{flex: 1}}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Texts */}
          <Animated.View
            style={animatedTextStyle}
            className="items-center mt-12 mb-12 relative w-full"
          >
            {/* Star Sticker (Behind Header Top-Left) */}
            <Animated.View
              style={animatedStarStyle}
              className="absolute -top-10 -left-6 z-20"
            >
              <PopBadge color="yellow" size="lg" rotation={-12}>
                <Text className="text-3xl">⭐</Text>
              </PopBadge>
            </Animated.View>

            {/* Title Lookin Good */}
            <View
              style={{transform: [{rotate: '-2deg'}]}}
              className="px-6 py-4 bg-pop-yellow border-4 border-black rounded-2xl relative z-10"
            >
              <Text
                style={{
                  textShadowColor: '#000000',
                  textShadowOffset: {width: 3, height: 3},
                  textShadowRadius: 0.1,
                }}
                className="font-pop-display text-black text-4xl md:text-5xl text-center font-black tracking-wider uppercase"
              >
                LOOKIN' GOOD!
              </Text>
            </View>

            {/* Ready Tag */}
            <View
              style={{transform: [{rotate: '4deg'}]}}
              className="px-8 py-2 bg-pop-red border-4 border-black rounded-xl mt-4 relative z-10"
            >
              <Text
                style={{
                  textShadowColor: '#000000',
                  textShadowOffset: {width: 2, height: 2},
                  textShadowRadius: 0.1,
                }}
                className="font-pop-display text-white text-2xl text-center font-black tracking-widest uppercase"
              >
                READY!
              </Text>
            </View>
          </Animated.View>

          {/* Photo Frame Container */}
          <View className="items-center justify-center py-6 w-full z-10">
            <Animated.View
              style={[animatedFrameStyle, {width: 280, height: 280}]}
              className="relative"
            >
              {/* 3D Accent Layer 1 (Yellow Shadow) */}
              <View
                className="absolute inset-0 bg-pop-yellow rounded-2xl border-4 border-black"
                style={{transform: [{translateX: 12}, {translateY: 12}]}}
              />

              {/* 3D Accent Layer 2 (Red Shadow) */}
              <View
                className="absolute inset-0 bg-pop-red rounded-2xl border-4 border-black"
                style={{transform: [{translateX: 6}, {translateY: 6}]}}
              />

              {/* Main Photo Frame */}
              <View className="absolute inset-0 bg-white border-4 border-black rounded-2xl overflow-hidden justify-center items-center">
                <Image
                  source={{uri: imageUri}}
                  className="w-full h-full object-cover"
                  resizeMode="cover"
                />
              </View>

              {/* Cyan ZAP! Badge (Bottom Right) */}
              <PopBadge
                color="blue"
                size="md"
                rotation={12}
                className="absolute -bottom-6 -right-6 z-20"
              >
                <Text
                  style={{
                    textShadowColor: '#000000',
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: 0.1,
                  }}
                  className="font-pop-display text-white text-sm font-black px-1"
                >
                  ZAP!
                </Text>
              </PopBadge>
            </Animated.View>
          </View>

          {/* Actions */}
          <View className="mt-16 w-full items-center gap-6">
            {/* GO GRADUATE Button */}
            <PopButton
              onPress={handleGoGraduate}
              title="GO GRADUATE!"
              color="yellow"
              badgeText="POW!"
              className="w-full max-w-sm"
            />

            {/* Change Photo Link */}
            <Pressable
              onPress={handleChangePhoto}
              className="flex-row items-center justify-center p-3 mt-2 active:opacity-70"
            >
              <Text className="text-3xl mr-2">🔄</Text>
              <Text
                style={{
                  textShadowColor: '#000000',
                  textShadowOffset: {width: 1, height: 1},
                  textShadowRadius: 0.1,
                }}
                className="font-pop-display text-white text-lg tracking-wider uppercase"
              >
                CHANGE PHOTO
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};
