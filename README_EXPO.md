# Health Tracker - Expo Mobile App

This is the Expo mobile version of the Health Tracker application, converted from a React web app.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or newer)
- npm or yarn
- Expo Go app on your phone (download from App Store or Google Play)

## Setup Instructions

### 1. Install Dependencies

First, remove the old node_modules and install new dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

Or if you use yarn:

```bash
rm -rf node_modules yarn.lock
yarn install
```

### 2. Configure Firebase

Make sure your `.env` file exists in the root directory with your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Create Assets Folder (Optional)

The app requires some assets. You can create placeholder images or use your own:

```bash
mkdir -p assets
```

Required assets:
- `assets/icon.png` (1024x1024px)
- `assets/splash.png` (1284x2778px for iOS)
- `assets/adaptive-icon.png` (1024x1024px for Android)
- `assets/favicon.png` (48x48px)

You can generate these using online tools or use placeholder images for now.

## Running the App

### Start the Development Server

```bash
npm start
```

Or with Expo CLI:

```bash
npx expo start
```

### Testing on Your Phone

1. Open the Expo Go app on your phone
2. Scan the QR code displayed in your terminal
3. The app will load on your device

### Platform-Specific Commands

Run on Android emulator:
```bash
npm run android
```

Run on iOS simulator (Mac only):
```bash
npm run ios
```

Run on web:
```bash
npm run web
```

## Project Structure

```
health-tracking-app/
├── App.js                          # Main app entry with navigation
├── app.json                        # Expo configuration
├── app.config.js                   # Expo config with env variables
├── package.json                    # Dependencies
├── .env                           # Environment variables (not in git)
├── assets/                        # App icons and splash screens
└── src/
    ├── components/                # React Native components
    │   ├── SignIn.js
    │   ├── SignUp.js
    │   ├── Dashboard.js
    │   ├── HeartRatePage.js
    │   ├── StepsPage.js
    │   ├── MedicinePage.js
    │   ├── MilestonesPage.js
    │   ├── RewardPage.js
    │   └── SettingsPage.js
    ├── firebase/
    │   └── config.js              # Firebase configuration
    └── services/
        └── api.js                 # API service
```

## Key Changes from Web Version

1. **Navigation**: Uses React Navigation instead of React Router
2. **Styling**: Uses React Native StyleSheet instead of Tailwind CSS
3. **Components**: All web components converted to React Native equivalents
4. **Icons**: Uses Expo's @expo/vector-icons instead of lucide-react
5. **Firebase**: Uses Expo Constants for environment variables

## Features

- ✅ User Authentication (Sign In/Sign Up)
- ✅ Dashboard with health metrics
- ✅ Heart rate monitoring
- ✅ Step tracking
- ✅ Medicine tracking with reminders
- ✅ Milestones and progress tracking
- ✅ Rewards system
- ✅ Settings page
- ✅ Bottom tab navigation

## Troubleshooting

### Common Issues

**1. Metro bundler errors**
```bash
npx expo start -c
```

**2. Firebase not connecting**
- Check your `.env` file exists and has correct values
- Ensure `app.config.js` is reading environment variables correctly

**3. Dependencies conflicts**
```bash
rm -rf node_modules package-lock.json
npm install
```

**4. Asset errors**
- Make sure the `assets` folder exists with required images
- Or comment out asset references in `app.json` temporarily

## Building for Production

### Android APK

```bash
npx expo build:android
```

### iOS IPA

```bash
npx expo build:ios
```

## Additional Notes

- The app uses Firebase for authentication and data storage
- All health data is stored in Firestore
- The app works offline and syncs when connection is restored
- Push notifications require additional setup in Firebase Console

## Support

If you encounter any issues:
1. Check the Expo documentation: https://docs.expo.dev/
2. Check Firebase documentation: https://firebase.google.com/docs
3. Review the console logs for specific error messages

## License

Same as original project license.
