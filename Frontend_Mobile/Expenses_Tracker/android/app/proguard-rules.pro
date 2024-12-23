# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Keep your React Native code intact
-keep class com.facebook.react.** { *; }

# Keep your JS bundle
-keepclassmembers class * {
   @com.facebook.react.bridge.ReactMethod <methods>;
}

# Keep native modules if using any
-keep class com.reactnative.** { *; }

# Don't obfuscate React Native classes
-dontwarn com.facebook.react.**
-dontwarn javax.annotation.**


