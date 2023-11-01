import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withTiming,
  withDelay,
  interpolate,
  Easing,
  useAnimatedProps,
} from "react-native-reanimated";

import { View } from "../components/Themed";
import useCachedResources from "../hooks/useCachedResources";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <AnimatedSplashScreen>
      <RootLayoutNav />
    </AnimatedSplashScreen>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}

function AnimatedSplashScreen({ children }: { children: React.ReactNode }) {
  const colorSharedValue = useSharedValue(0);
  const opacitySharedValue = useSharedValue(1);
  const animatedProps = useAnimatedProps(() => {
    return {
      tintColor: interpolateColor(colorSharedValue.value, [0, 1], ["#FFFFFF", "#000000"], "RGB"),
    };
  });

  const splashStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        colorSharedValue.value,
        [0, 1],
        ["#000000", "#FFFFFF"],
        "RGB"
      ),
      opacity: opacitySharedValue.value,
    };
  });

  const appStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(opacitySharedValue.value, [0, 1], [1, 1.2]),
        },
      ],
    };
  });

  useEffect(() => {
    colorSharedValue.value = withDelay(
      1500,
      withTiming(1, { duration: 500, easing: Easing.inOut(Easing.cubic) }, () => {
        opacitySharedValue.value = withDelay(
          750,
          withTiming(0, {
            duration: 500,
            easing: Easing.out(Easing.exp),
          })
        );
      })
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          appStyle,
          {
            flex: 1,
            zIndex: 0,
          },
        ]}>
        {children}
      </Animated.View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, splashStyle]}>
        <Animated.Image
          style={{ width: "100%", height: "100%" }}
          animatedProps={animatedProps}
          source={require("../assets/images/splash.png")}
        />
      </Animated.View>
    </View>
  );
}
