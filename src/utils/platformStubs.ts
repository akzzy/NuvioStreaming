import { Platform } from 'react-native';

/**
 * Platform-aware stubs for Android-only modules
 * Provides no-op implementations for Windows platform
 */

// ===== Immersive Mode Stub =====
let RNImmersiveMode: any = null;

if (Platform.OS === 'android') {
    try {
        RNImmersiveMode = require('react-native-immersive-mode').default;
    } catch (e) {
        console.warn('[Platform Stubs] react-native-immersive-mode not available');
    }
}

export const ImmersiveMode = {
    fullLayout: (enable?: boolean) => {
        if (Platform.OS === 'android' && RNImmersiveMode) {
            return RNImmersiveMode.fullLayout(enable);
        }
        return Promise.resolve();
    },
    setBarMode: (mode: string) => {
        if (Platform.OS === 'android' && RNImmersiveMode) {
            return RNImmersiveMode.setBarMode(mode);
        }
        return Promise.resolve();
    },
    addEventListener: (callback: () => void) => {
        if (Platform.OS === 'android' && RNImmersiveMode) {
            return RNImmersiveMode.addEventListener(callback);
        }
        return { remove: () => { } };
    },
};

// ===== Navigation Bar Stub =====
let ExpoNavigationBar: any = null;

if (Platform.OS === 'android') {
    try {
        ExpoNavigationBar = require('expo-navigation-bar');
    } catch (e) {
        console.warn('[Platform Stubs] expo-navigation-bar not available');
    }
}

export const NavigationBar = {
    setBackgroundColorAsync: (color: string) => {
        if (Platform.OS === 'android' && ExpoNavigationBar) {
            return ExpoNavigationBar.setBackgroundColorAsync(color);
        }
        return Promise.resolve();
    },
    setVisibilityAsync: (visibility: string) => {
        if (Platform.OS === 'android' && ExpoNavigationBar) {
            return ExpoNavigationBar.setVisibilityAsync(visibility);
        }
        return Promise.resolve();
    },
    setBehaviorAsync: (behavior: string) => {
        if (Platform.OS === 'android' && ExpoNavigationBar) {
            return ExpoNavigationBar.setBehaviorAsync(behavior);
        }
        return Promise.resolve();
    },
    setPositionAsync: (position: string) => {
        if (Platform.OS === 'android' && ExpoNavigationBar) {
            return ExpoNavigationBar.setPositionAsync(position);
        }
        return Promise.resolve();
    },
};

// ===== Intent Launcher Stub =====
let ExpoIntentLauncher: any = null;

if (Platform.OS === 'android') {
    try {
        ExpoIntentLauncher = require('expo-intent-launcher');
    } catch (e) {
        console.warn('[Platform Stubs] expo-intent-launcher not available');
    }
}

export const IntentLauncher = {
    startActivityAsync: (activityAction: string, params?: any) => {
        if (Platform.OS === 'android' && ExpoIntentLauncher) {
            return ExpoIntentLauncher.startActivityAsync(activityAction, params);
        }
        console.log('[Platform Stubs] IntentLauncher called on non-Android platform');
        return Promise.resolve();
    },
};

// ===== Device Brightness Stub =====
let DeviceBrightness: any = null;

if (Platform.OS === 'android' || Platform.OS === 'ios') {
    try {
        DeviceBrightness = require('@adrianso/react-native-device-brightness');
    } catch (e) {
        console.warn('[Platform Stubs] react-native-device-brightness not available');
    }
}

export const Brightness = {
    setBrightness: (value: number) => {
        if (DeviceBrightness) {
            return DeviceBrightness.setBrightness(value);
        }
        console.log('[Platform Stubs] Brightness control not available on this platform');
        return Promise.resolve();
    },
    getBrightness: () => {
        if (DeviceBrightness) {
            return DeviceBrightness.getBrightness();
        }
        return Promise.resolve(1.0);
    },
};

// ===== Google Cast Stub =====
export const GoogleCast = {
    showIntroductoryOverlay: () => Promise.resolve(),
    getCastState: () => Promise.resolve('NoDevicesAvailable'),
    castMedia: () => Promise.resolve(),
    endSession: () => Promise.resolve(),
};

console.log(`[Platform Stubs] Initialized for platform: ${Platform.OS}`);
