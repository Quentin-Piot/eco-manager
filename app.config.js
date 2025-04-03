import 'dotenv/config';

export default {
    expo: {
        build: {
            preview: {
                android: {
                    buildType: 'apk',
                },
            },
        },
        name: process.env.CUSTOM_APP_NAME || 'Eco Manager',
        slug: 'eco-manager',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        splash: {
            image: './assets/images/splash-icon.png',
            resizeMode: 'contain',
            backgroundColor: '#113826',
        },
        ios: {
            supportsTablet: true,
            userInterfaceStyle: 'light',
        },
        android: {
            userInterfaceStyle: 'light',
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#113826',
            },
            package: 'com.quenpiot.ecomanager',
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: ['expo-router', 'expo-asset'],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: process.env.PROJECT_ID
            },
        },
        owner: 'quenpiot',
    },
};
