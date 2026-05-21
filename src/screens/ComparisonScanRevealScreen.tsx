import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  Text,
  View,
  useWindowDimensions,
  PanResponder,
  GestureResponderEvent,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../navigation/AppNavigator';
import {handleError} from '../utils/errorHandler';
import {useGenerateGraduationImage} from '../api/hooks/useGenerateGraduationImage';

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

  // API service hook for image generation
  const {mutate, data: resultImageUri, isSuccess, isError, error} = useGenerateGraduationImage();



  // Start the API call on mount
  useEffect(() => {
    mutate({
      imageUrl: imageUri,
    });
  }, [mutate, imageUri]);

  // Handle API call errors
  useEffect(() => {
    if (isError && error) {
      Alert.alert(
        'Generation Failed',
        'We could not generate your graduation portrait. Please try again.',
        [{text: 'OK', onPress: () => navigation.goBack()}]
      );
    }
  }, [isError, error, navigation]);

  // Handle 60 seconds timeout
  useEffect(() => {
    if (isScanComplete) return;

    const timeoutTimer = setTimeout(() => {
      if (!isSuccess && !isError) {
        Alert.alert(
          'Request Timeout',
          'The image generation process took too long. Please try again.',
          [{text: 'OK', onPress: () => navigation.goBack()}]
        );
      }
    }, 60000);

    return () => clearTimeout(timeoutTimer);
  }, [isSuccess, isError, isScanComplete, navigation]);

  // Sync scan status text with progress percentage
  useEffect(() => {
    if (progress < 25) {
      setStatusText('Initializing neural network...');
    } else if (progress < 50) {
      setStatusText('Aligning facial features...');
    } else if (progress < 75) {
      setStatusText('Synthesizing graduation gown...');
    } else if (progress < 95) {
      setStatusText('Applying style shaders...');
    } else if (progress < 100) {
      setStatusText('Generating graduation portrait...');
    } else {
      setStatusText('Transformation complete.');
    }
  }, [progress]);

  // Navigate to PopMaximalismResultScreen when scan is complete
  useEffect(() => {
    if (isScanComplete && isSuccess && resultImageUri) {
      const timer = setTimeout(() => {
        navigation.navigate('PopMaximalismResult', {imageUri: resultImageUri});
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isScanComplete, isSuccess, resultImageUri, navigation]);

  // Reset animation values on mount
  useEffect(() => {
    sliderX.value = 0;
    setProgress(0);
    setIsScanComplete(false);
  }, [sliderX]);

  // Run progress simulation dynamically to match ~60 seconds duration
  useEffect(() => {
    if (isScanComplete) return;

    if (progress >= 100) {
      return;
    }

    // Determine delay for the next step based on progress
    // Target is to reach 95% in ~58 seconds if API is still running.
    // 0-25: 25 steps * 400ms = 10.00s
    // 25-50: 25 steps * 550ms = 13.75s
    // 50-80: 30 steps * 680ms = 20.40s
    // 80-95: 15 steps * 920ms = 13.80s
    // Total simulated time to 95%: ~57.95s
    let delay = 600;
    if (isSuccess && resultImageUri) {
      // API has finished, speed up to 100%
      delay = 25;
    } else if (progress < 25) {
      delay = 400;
    } else if (progress < 50) {
      delay = 550;
    } else if (progress < 80) {
      delay = 680;
    } else if (progress < 95) {
      delay = 920;
    } else {
      // Pause at 95% until API finishes (or timeout triggers at 60s)
      delay = 200;
    }

    const timer = setTimeout(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + 1;
        }
        if (prev === 95) {
          if (isSuccess && resultImageUri) {
            return 96;
          }
          return 95; // Keep waiting
        }
        if (prev < 100) {
          return prev + 1;
        }
        return 100;
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [progress, isSuccess, resultImageUri, isScanComplete]);

  // Update slider position based on simulated progress
  useEffect(() => {
    if (!isScanComplete) {
      let duration = 600;
      if (isSuccess && resultImageUri) {
        duration = 25;
      } else if (progress < 25) {
        duration = 400;
      } else if (progress < 50) {
        duration = 550;
      } else if (progress < 80) {
        duration = 680;
      } else {
        duration = 920;
      }

      sliderX.value = withTiming((progress / 100) * screenWidth, {
        duration: duration,
      });
    }
  }, [progress, screenWidth, sliderX, isScanComplete, isSuccess, resultImageUri]);

  // Handle final completion state when progress reaches 100
  useEffect(() => {
    if (progress === 100) {
      sliderX.value = withSpring(screenWidth / 2, {
        damping: 15,
        stiffness: 100,
      });
      setIsScanComplete(true);
    }
  }, [progress, screenWidth, sliderX]);

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
        } catch (err) {
          handleError(err, {
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
          source={imageUri ? {uri: imageUri} : SELFIE_IMAGE}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Revealed Image: AI Graduation Portrait (Clipped by overlay width) */}
      <Animated.View
        style={[animatedOverlayStyle, {height: screenHeight}]}
        className="absolute left-0 top-0 overflow-hidden z-[10]"
      >
        <Image
          source={resultImageUri ? {uri: resultImageUri} : GRADUATE_IMAGE}
          style={{width: screenWidth, height: screenHeight}}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Slider Visual Handle & Divider Line */}
      <Animated.View
        style={animatedSliderStyle}
        className="absolute top-0 bottom-0 w-1 bg-white/80 z-[20]"
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
        className="absolute bottom-10 left-5 right-5 z-[30]"
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
