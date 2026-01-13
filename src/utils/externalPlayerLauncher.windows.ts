import { exec } from 'child_process';
import { Platform, Alert } from 'react-native';

/**
 * Launch VLC media player with a video URL on Windows
 * Tries multiple common installation paths for VLC
 */
export const launchVLC = (
  videoUrl: string,
  headers?: Record<string, string>,
  title?: string
): void => {
  if (Platform.OS !== 'windows') {
    console.warn('[VLC Launcher] VLC launch only supported on Windows');
    return;
  }

  console.log('[VLC Launcher] Launching VLC with URL:', videoUrl);

  // Common VLC installation paths
  const vlcPaths = [
    'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
    'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe',
    `${process.env.LOCALAPPDATA}\\Programs\\VideoLAN\\VLC\\vlc.exe`,
    `${process.env.ProgramFiles}\\VideoLAN\\VLC\\vlc.exe`,
  ];

  // Build VLC command arguments
  const args: string[] = [];
  
  // Add HTTP headers if provided
  if (headers) {
    // VLC supports custom HTTP headers via --http-user-agent and other flags
    if (headers['User-Agent']) {
      args.push(`--http-user-agent="${headers['User-Agent']}"`);
    }
    if (headers['Referer']) {
      args.push(`--http-referrer="${headers['Referer']}"`);
    }
    // For other headers, we can use --http-forward-cookies or custom headers
    Object.entries(headers).forEach(([key, value]) => {
      if (key !== 'User-Agent' && key !== 'Referer') {
        console.log(`[VLC Launcher] Custom header: ${key} = ${value}`);
      }
    });
  }

  // VLC playback options
  args.push('--fullscreen'); // Start in fullscreen
  args.push('--play-and-exit'); // Close VLC when video ends
  args.push('--no-video-title-show'); // Don't show filename overlay

  const commandArgs = args.join(' ');

  // Try each VLC path until one works
  const tryLaunch = (pathIndex: number) => {
    if (pathIndex >= vlcPaths.length) {
      Alert.alert(
        'VLC Not Found',
        'Please install VLC Media Player from https://www.videolan.org/',
        [{ text: 'OK' }]
      );
      return;
    }

    const vlcPath = vlcPaths[pathIndex];
    const command = `"${vlcPath}" "${videoUrl}" ${commandArgs}`;

    console.log(`[VLC Launcher] Trying path ${pathIndex + 1}/${vlcPaths.length}: ${vlcPath}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.warn(`[VLC Launcher] Failed with path ${vlcPath}:`, error.message);
        // Try next path
        tryLaunch(pathIndex + 1);
      } else {
        console.log(`[VLC Launcher] Successfully launched VLC at: ${vlcPath}`);
        if (title) {
          console.log(`[VLC Launcher] Playing: ${title}`);
        }
      }
    });
  };

  // Start trying paths
  tryLaunch(0);
};

/**
 * Check if VLC is installed on the system
 */
export const isVLCInstalled = async (): Promise<boolean> => {
  if (Platform.OS !== 'windows') return false;

  const vlcPaths = [
    'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
    'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe',
  ];

  return new Promise((resolve) => {
    let checked = 0;
    let found = false;

    vlcPaths.forEach((path) => {
      exec(`if exist "${path}" echo found`, (error, stdout) => {
        checked++;
        if (stdout.includes('found')) {
          found = true;
        }
        if (checked === vlcPaths.length) {
          resolve(found);
        }
      });
    });
  });
};
