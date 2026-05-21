import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  Text,
  View,
  useWindowDimensions,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../navigation/AppNavigator';
import {handleError} from '../utils/errorHandler';

// Local dummy assets
const SELFIE_IMAGE = require('../assets/images/selfie.jpg');
const GRADUATE_IMAGE = require('../assets/images/graduate.png');

interface ComparisonScanRevealScreenProps
  extends NativeStackScreenProps<AppStackParamList, 'ComparisonScanReveal'> {}

export const ComparisonScanRevealScreen = ({
  route,
  navigation,
}: ComparisonScanRevealScreenProps) => {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const {imageUri} = route.params;

  // Animation values
  const sliderX = useSharedValue(0);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing neural network...');
  const [isScanComplete, setIsScanComplete] = useState(false);

  // Sync scan status text with progress percentage
  useEffect(() => {
    if (progress < 25) {
      setStatusText('Initializing neural network...');
    } else if (progress < 50) {
      setStatusText('Aligning facial features...');
    } else if (progress < 75) {
      setStatusText('Synthesizing graduation gown...');
    } else if (progress < 100) {
      setStatusText('Applying style shaders...');
    } else {
      setStatusText('Transformation complete.');
    }
  }, [progress]);

  // Navigate to PopMaximalismResultScreen when scan is complete
  useEffect(() => {
    if (isScanComplete) {
      const timer = setTimeout(() => {
        navigation.navigate('PopMaximalismResult', {imageUri});
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isScanComplete, navigation, imageUri]);

  // Run the initial scan animation on mount
  useEffect(() => {
    // 1. Reset values
    sliderX.value = 0;
    setProgress(0);
    setIsScanComplete(false);

    // 2. Animate slider line sweeping from left to right (0 to screenWidth)
    sliderX.value = withTiming(screenWidth, {duration: 3500}, () => {
      // 3. Sweep completed: animate back to 50% split view using spring animation
      sliderX.value = withSpring(screenWidth / 2, {
        damping: 15,
        stiffness: 100,
      });
      // 4. Mark scanning process as complete
      runOnJS(setIsScanComplete)(true);
    });

    // 5. Increment progress percentage simulation
    const intervalTime = 35; // 35ms * 100 = 3500ms total duration
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => {
      clearInterval(progressInterval);
    };
  }, [screenWidth, sliderX]);

  // Create PanResponder to handle horizontal dragging after scanning finishes
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isScanComplete,
      onMoveShouldSetPanResponder: () => isScanComplete,
      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (!isScanComplete) {
          return;
        }
        try {
          const touchX = evt.nativeEvent.pageX;
          sliderX.value = Math.max(0, Math.min(screenWidth, touchX));
        } catch (error) {
          handleError(error, {
            componentName: 'ComparisonScanRevealScreen',
            actionName: 'onPanResponderMove',
          });
        }
      },
    })
  ).current;

  // Reanimated style to clip revealed (graduation) image container width
  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      width: sliderX.value,
    };
  });

  // Reanimated style to position slider line handle
  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: sliderX.value}],
    };
  });

  return (
    <View className="flex-1 bg-surface-container-lowest" {...panResponder.panHandlers}>
      {/* Base Image: User Selfie (Original Portrait) */}
      <View className="absolute inset-0 w-full h-full">
        <Image
          source={SELFIE_IMAGE}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Revealed Image: AI Graduation Portrait (Clipped by overlay width) */}
      <Animated.View
        style={[animatedOverlayStyle, {height: screenHeight, zIndex: 10}]}
        className="absolute left-0 top-0 overflow-hidden"
      >
        <Image
          source={GRADUATE_IMAGE}
          style={{width: screenWidth, height: screenHeight}}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Slider Visual Handle & Divider Line */}
      <Animated.View
        style={[animatedSliderStyle, {zIndex: 20}]}
        className="absolute top-0 bottom-0 w-1 bg-white/80"
      >
        {/* Glowing visual effect for the line */}
        <View className="absolute inset-y-0 -left-1.5 w-4 bg-white/20 blur-sm" />

        {/* Circular Handle */}
        <View className="absolute top-1/2 -left-5 -translate-y-6 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center shadow-xl">
          <Text className="text-white text-xs font-bold tracking-tighter">◀  ▶</Text>
        </View>
      </Animated.View>

      {/* Bottom Floating Control Card */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 20,
          right: 20,
          zIndex: 30,
        }}
      >
        <View className="bg-surface/85 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
          <View className="items-center">
            <Text className="font-headline text-white text-2xl font-bold tracking-tight mb-0.5">
              Transformation Scan
            </Text>
            <Text className="font-body text-on-surface-variant text-xs font-medium">
              Enhancing portrait via neural synthesis
            </Text>
          </View>

          {/* Progress Section */}
          <View className="flex flex-col gap-2">
            <View className="flex-row justify-between items-center px-1">
              <Text className="font-body text-white text-xs font-semibold">
                {statusText}
              </Text>
              <Text className="font-label text-secondary text-xs font-bold">
                {progress}%
              </Text>
            </View>

            {/* Progress Bar Container */}
            <View className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <View
                style={{width: `${progress}%`}}
                className="h-full bg-primary"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
