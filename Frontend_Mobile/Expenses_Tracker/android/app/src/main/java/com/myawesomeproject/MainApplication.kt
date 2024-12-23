package fms.helpdesk

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.flipper.ReactNativeFlipper
import com.facebook.soloader.SoLoader
import com.rssignaturecapture.RSSignatureCapturePackage
import com.dooboolab.audiorecorderplayer.RNAudioRecorderPlayerPackage;


class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {

        override fun getPackages(): List<ReactPackage> {
          // Fetch autolinked packages
          val packages = PackageList(this).packages.toMutableList()

          // Add manually linked packages
      
          packages.add(RSSignatureCapturePackage())
          //  packages.add(RNAudioRecorderPlayerPackage())

          return packages
        }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override fun onCreate() {
    super.onCreate()

    SoLoader.init(this, false)

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load()
    }
    if (BuildConfig.DEBUG) {
      ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
    }
  }
}
