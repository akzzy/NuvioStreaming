/**
 * React Native configuration for Windows platform support
 * This file tells React Native CLI about the Windows project
 */
module.exports = {
  // Project configuration
  project: {
    ios: {},
    android: {},
    windows: {
      sourceDir: 'windows',
      solutionFile: 'nuvio.sln',
      project: {
        projectFile: 'nuvio\\nuvio.vcxproj',
      },
    },
  },
  // Dependencies configuration  
  dependencies: {
    // Exclude expo packages from autolinking on Windows
    'expo': {
      platforms: {
        windows: null,
      },
    },
    'expo-modules-core': {
      platforms: {
        windows: null,
      },
    },
  },
};
