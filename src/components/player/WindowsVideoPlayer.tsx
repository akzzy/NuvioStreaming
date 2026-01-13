import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { launchVLC, isVLCInstalled } from '../../utils/externalPlayerLauncher.windows';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Windows Video Player Component
 * Launches VLC media player with the video URL
 */
const WindowsVideoPlayer: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'PlayerAndroid'>>();
    const { currentTheme } = useTheme();
    const [vlcInstalled, setVlcInstalled] = useState<boolean | null>(null);
    const [launched, setLaunched] = useState(false);

    const {
        uri,
        title = 'Video',
        episodeTitle,
        season,
        episode,
        headers,
    } = route.params;

    // Display title
    const displayTitle = episodeTitle
        ? `${title} - S${season}E${episode}: ${episodeTitle}`
        : title;

    // Check if VLC is installed on mount
    useEffect(() => {
        if (Platform.OS === 'windows') {
            isVLCInstalled().then(setVlcInstalled);
        }
    }, []);

    // Auto-launch VLC when component mounts
    useEffect(() => {
        if (!launched && vlcInstalled && uri) {
            setLaunched(true);
            console.log('[WindowsVideoPlayer] Launching VLC with:', { uri, title: displayTitle });
            launchVLC(uri, headers, displayTitle);

            // Auto-navigate back after 2 seconds
            setTimeout(() => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            }, 2000);
        }
    }, [launched, vlcInstalled, uri, headers, displayTitle, navigation]);

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            (navigation as any).navigate('Home');
        }
    };

    const handleRetry = () => {
        setLaunched(false);
        setTimeout(() => {
            if (uri) {
                launchVLC(uri, headers, displayTitle);
                setLaunched(true);
            }
        }, 500);
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.colors.darkBackground }]}>
            <View style={styles.content}>
                {vlcInstalled === null ? (
                    <>
                        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
                            Checking for VLC...
                        </Text>
                    </>
                ) : vlcInstalled === false ? (
                    <>
                        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
                            VLC Not Found
                        </Text>
                        <Text style={[styles.message, { color: currentTheme.colors.textSecondary }]}>
                            Please install VLC Media Player from:
                        </Text>
                        <Text style={[styles.link, { color: currentTheme.colors.primary }]}>
                            https://www.videolan.org/
                        </Text>
                    </>
                ) : (
                    <>
                        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
                            Opening in VLC...
                        </Text>
                        <Text style={[styles.videoTitle, { color: currentTheme.colors.primary }]}>
                            {displayTitle}
                        </Text>
                        <Text style={[styles.message, { color: currentTheme.colors.textSecondary }]}>
                            Video playback will open in VLC Media Player
                        </Text>
                        <Text style={[styles.hint, { color: currentTheme.colors.textSecondary }]}>
                            Press ESC in VLC to exit fullscreen
                        </Text>
                    </>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: currentTheme.colors.primary }]}
                        onPress={handleBack}
                    >
                        <Text style={styles.buttonText}>Back to Catalog</Text>
                    </TouchableOpacity>

                    {vlcInstalled && (
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton, { borderColor: currentTheme.colors.primary }]}
                            onPress={handleRetry}
                        >
                            <Text style={[styles.buttonText, { color: currentTheme.colors.primary }]}>
                                Relaunch VLC
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        maxWidth: 600,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    videoTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    link: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    hint: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 32,
        gap: 12,
        width: '100%',
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default WindowsVideoPlayer;
