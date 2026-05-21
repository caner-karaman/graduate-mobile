import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {PopBadge} from './PopBadge';

export interface PopButtonProps {
  onPress: () => void;
  title: string;
  color?: 'red' | 'yellow' | 'blue' | 'white';
  badgeText?: string;
  disabled?: boolean;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PopButton = ({
  onPress,
  title,
  color = 'red',
  badgeText,
  disabled = false,
  className = '',
}: PopButtonProps) => {
  const pressScale = useSharedValue(1);
  const shadowTranslateX = useSharedValue(6);
  const shadowTranslateY = useSharedValue(6);

  const handlePressIn = () => {
    pressScale.value = withTiming(0.97, {duration: 100});
    shadowTranslateX.value = withTiming(2, {duration: 100});
    shadowTranslateY.value = withTiming(2, {duration: 100});
  };

  const handlePressOut = () => {
    pressScale.value = withTiming(1, {duration: 100});
    shadowTranslateX.value = withTiming(6, {duration: 100});
    shadowTranslateY.value = withTiming(6, {duration: 100});
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: pressScale.value}],
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

  const colorClasses = {
    red: 'bg-pop-red',
    yellow: 'bg-pop-yellow',
    blue: 'bg-pop-blue',
    white: 'bg-white',
  };

  const textColors = {
    red: 'text-white',
    yellow: 'text-black',
    blue: 'text-white',
    white: 'text-black',
  };

  return (
    <View className={`relative ${className}`}>
      {/* 3D Black Offset Shadow */}
      <Animated.View
        style={[animatedShadowStyle, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}]}
      >
        <View className="w-full h-full bg-black rounded-full" />
      </Animated.View>

      {/* Button Body */}
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={animatedStyle}
      >
        <View
          className={`border-4 border-black ${colorClasses[color]} py-4 px-10 rounded-full flex items-center justify-center`}
        >
          <Text
            style={{
              textShadowColor: '#000000',
              textShadowOffset: color === 'yellow' || color === 'white' ? {width: 1, height: 1} : {width: 2, height: 2},
              textShadowRadius: 0.1,
            }}
            className={`font-pop-display text-2xl uppercase tracking-wider ${textColors[color]} text-center`}
          >
            {title}
          </Text>
        </View>
      </AnimatedPressable>

      {/* Badge (e.g. POW!) */}
      {badgeText && (
        <PopBadge
          color="blue"
          size="sm"
          rotation={12}
          className="absolute -top-3 -right-3"
        >
          <Text className="font-pop-display text-white text-xs font-bold px-2 py-0.5">
            {badgeText}
          </Text>
        </PopBadge>
      )}
    </View>
  );
};
