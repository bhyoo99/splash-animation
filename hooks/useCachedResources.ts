import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect, useState } from "react";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await Font.loadAsync({
          SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
          ...FontAwesome.font,
        });
        await Asset.loadAsync(require("../assets/images/splash.png"));
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
