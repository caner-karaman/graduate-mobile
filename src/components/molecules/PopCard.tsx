import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export interface PopCardProps {
  onPress: () => void;
  title: string;
  emoji: string;
  color?: 'yellow' | 'blue';
  placeholderImageUri?: string;
  selectedImageUri?: string;
  rotation?: number; // degree for the inner label box
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PopCard = ({
  onPress,
  title,
  emoji,
  color = 'yellow',
  placeholderImageUri,
  selectedImageUri,
  rotation = 2,
  className = '',
}: PopCardProps) => {
  const cardScale = useSharedValue(1);
  const cardRotate = useSharedValue(color === 'yellow' ? 1 : -1);
  const shadowTranslateX = useSharedValue(8);
  const shadowTranslateY = useSharedValue(8);

  const handlePressIn = () => {
    cardScale.value = withTiming(0.98, {duration: 100});
    cardRotate.value = withTiming(0, {duration: 100});
    shadowTranslateX.value = withTiming(2, {duration: 100});
    shadowTranslateY.value = withTiming(2, {duration: 100});
  };

  const handlePressOut = () => {
    cardScale.value = withTiming(1, {duration: 100});
    cardRotate.value = withTiming(color === 'yellow' ? 1 : -1, {duration: 100});
    shadowTranslateX.value = withTiming(8, {duration: 100});
    shadowTranslateY.value = withTiming(8, {duration: 100});
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: cardScale.value},
        {rotate: `${cardRotate.value}deg`},
      ],
    };
  });

  const animatedShadowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: shadowTranslateX.value},
        {translateY: shadowTranslateY.value},
      ],
    };
  });

  const bgClasses = {
    yellow: 'bg-pop-yellow',
    blue: 'bg-pop-blue',
  };

  // Determine which image to show
  const imageSource = selectedImageUri
    ? {uri: selectedImageUri}
    : placeholderImageUri
    ? {uri: placeholderImageUri}
    : null;

  return (
    <View className={`relative ${className}`}>
      {/* 3D Black Solid Shadow */}
      <Animated.View
        style={[animatedShadowStyle, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}]}
      >
        <View className="w-full h-full bg-black rounded-2xl" />
      </Animated.View>

      {/* Card Content Wrapper */}
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        <View
          className={`border-4 border-black ${bgClasses[color]} h-64 rounded-2xl overflow-hidden justify-end p-5 relative`}
        >
          {/* Background Image / Placeholder with Screen Blend effect simulation */}
          {imageSource && (
            <View className="absolute inset-0">
              <Image
                source={imageSource}
                className="w-full h-full object-cover"
                style={{opacity: selectedImageUri ? 0.95 : 0.45}}
              />
              {/* Pop Color Tint Overlay */}
              {!selectedImageUri && (
                <View
                  className={`absolute inset-0 opacity-40 ${
                    color === 'yellow' ? 'bg-pop-yellow' : 'bg-pop-blue'
                  }`}
                />
              )}
            </View>
          )}

          {/* Floating Label Container */}
          <View
            style={{
              transform: [{rotate: `${rotation}deg`}],
              shadowColor: '#000000',
              shadowOffset: {width: 2, height: 2},
              shadowOpacity: 0.15,
              shadowRadius: 4,
            }}
            className="bg-white/95 border-4 border-black p-4 rounded-xl flex-row items-center justify-between"
          >
            <Text className="font-pop-display text-2xl text-black uppercase tracking-wider flex-1">
              {title}
            </Text>
            <Text className="text-3xl ml-3">{emoji}</Text>
          </View>
        </View>
      </AnimatedPressable>
    </View>
  );
};
