import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export interface PopBadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'red' | 'yellow' | 'white';
  size?: 'sm' | 'md' | 'lg';
  rotation?: number; // in degrees
  pulse?: boolean;
  className?: string;
}

export const PopBadge = ({
  children,
  color = 'blue',
  size = 'md',
  rotation = 0,
  pulse = false,
  className = '',
}: PopBadgeProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, {duration: 600}),
          withTiming(1.0, {duration: 600})
        ),
        -1, // infinite loop
        true // reverse
      );
    } else {
      scale.value = 1;
    }
  }, [pulse, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scale.value},
        {rotate: `${rotation}deg`},
      ],
    };
  });

  // Size mapping
  const sizeClasses = {
    sm: 'px-2 py-1 rounded-full',
    md: 'w-12 h-12 rounded-full items-center justify-center',
    lg: 'w-16 h-16 rounded-full items-center justify-center',
  };

  // Color mapping
  const colorClasses = {
    blue: 'bg-pop-blue',
    red: 'bg-pop-red',
    yellow: 'bg-pop-yellow',
    white: 'bg-white',
  };

  // Shadow / Outline (Pop Maximalism: thick border, solid offset shadow)
  // For the badge, we can wrap it in a container that renders a shadow layer
  return (
    <View className={className}>
      <Animated.View style={animatedStyle} className="relative">
        {/* Black offset shadow */}
        <View
          className={`absolute inset-0 bg-black rounded-full translate-x-1 translate-y-1 ${sizeClasses[size]}`}
        />
        {/* Content layer */}
        <View
          className={`border-4 border-black ${colorClasses[color]} ${sizeClasses[size]} flex items-center justify-center`}
        >
          {typeof children === 'string' ? (
            <Text className="font-pop-display text-white text-center font-bold">
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </Animated.View>
    </View>
  );
};
