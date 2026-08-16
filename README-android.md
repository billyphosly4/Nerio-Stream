Android setup (Capacitor)

This project includes a Capacitor Android project under the ./android folder. Below are instructions and notes for opening and running the native project.

1) Opening Android Studio

If Android Studio is installed via Snap or manually, Capacitor's `npx cap open android` tries to locate it automatically. If it fails to open Android Studio, set the environment variable CAPACITOR_ANDROID_STUDIO_PATH to the full path of the studio.sh launcher and run the open command again, e.g.:

  export CAPACITOR_ANDROID_STUDIO_PATH="/snap/android-studio/236/bin/studio.sh"
  npx cap open android

On this machine Android Studio was detected at: /snap/android-studio/236/bin/studio.sh

2) Typical workflow

- Build the web app and sync assets to the native project:
    npm run cap:build

- Open Android Studio:
    npm run cap:open:android
  (If the script fails to open Android Studio, set CAPACITOR_ANDROID_STUDIO_PATH to your studio.sh path and run the command manually.)

- In Android Studio, let Gradle sync, then choose a device or emulator and Run the app.

3) When making changes to web assets

- Run:
    npm run cap:build
  This executes the Vite build and runs `npx cap sync` to copy the web assets into android/app/src/main/assets/public (or the appropriate assets folder).

4) StatusBar plugin

- This project installs @capacitor/status-bar and the app initializes it from src/main.jsx when running on a native Capacitor runtime.
- The plugin call is guarded so it has no effect on the web build.

5) Signing and release

6) App icons

- A set of launcher icons was generated from dist/icon.png and placed into the Android project's mipmap folders:
  - android/app/src/main/res/mipmap-mdpi/
  - android/app/src/main/res/mipmap-hdpi/
  - android/app/src/main/res/mipmap-xhdpi/
  - android/app/src/main/res/mipmap-xxhdpi/
  - android/app/src/main/res/mipmap-xxxhdpi/

- The adaptive icon XML (mipmap-anydpi-v26/ic_launcher.xml and ic_launcher_round.xml) was updated to use the application's theme color (#0f172a) as the background and the generated foreground image as the icon foreground.

- If you prefer different artwork for the foreground (for example a flat PNG without rounded square background), replace the files named ic_launcher_foreground.png in the mipmap-* folders and re-sync the project.


If you need help generating alternate icon shapes (transparent foreground only, or separate adaptive foreground/background images), tell me which style you want and I can regenerate them.


- For release builds, create a signing key (keystore) and configure signing in android/app/build.gradle (or via Android Studio's SigningConfig dialog). Do NOT commit keystores or local.properties to version control.

6) Git

- The repository ignores native build outputs in .gitignore but keeps the android/ project folder. This allows committing native project files while keeping generated artifacts out of the repository.

If you need help with signing, generating app icons, or creating a release APK/AAB, ask and I can add step-by-step instructions.