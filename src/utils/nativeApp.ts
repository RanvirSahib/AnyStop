import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Returns true if running inside a native iOS or Android Capacitor wrapper
 */
export const isNativeApp = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Triggers subtle native haptic vibration
 */
export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
  if (isNativeApp()) {
    try {
      await Haptics.impact({ style });
    } catch {
      // ignore
    }
  }
};

/**
 * Synchronizes Android status bar styling with the app's Day / Night theme
 */
export const syncNativeStatusBar = async (isDarkMode: boolean) => {
  if (isNativeApp()) {
    try {
      await StatusBar.setStyle({
        style: isDarkMode ? Style.Dark : Style.Light,
      });
      await StatusBar.setBackgroundColor({
        color: isDarkMode ? '#15122B' : '#FFF5EC',
      });
    } catch {
      // ignore
    }
  }
};

/**
 * Hides the native splash screen smoothly after initial mount
 */
export const hideNativeSplashScreen = async () => {
  if (isNativeApp()) {
    try {
      await SplashScreen.hide({ fadeOutDuration: 400 });
    } catch {
      // ignore
    }
  }
};

/**
 * Configures the Android hardware back button handler:
 * - If a custom modal dismissal callback returns true, modal was dismissed
 * - Otherwise navigates back in React Router or exits app if at root
 */
export const registerNativeBackButton = (
  onBack: () => boolean | void
) => {
  if (!isNativeApp()) return () => {};

  const listenerPromise = CapApp.addListener('backButton', ({ canGoBack }) => {
    const handled = onBack();
    if (handled) return;

    if (canGoBack) {
      window.history.back();
    } else {
      CapApp.exitApp();
    }
  });

  return () => {
    listenerPromise.then(l => l.remove()).catch(() => {});
  };
};

