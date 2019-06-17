with import <nixpkgs> {};

androidenv.emulateApp {
  name = "emulate-MyAndroidApp";
  platformVersion = "28";
  #abiVersion = "armeabi-v7a"; # mips, x86 or x86_64
  abiVersion = "x86_64"; # mips, x86 or x86_64
  systemImageType = "default";
  useGoogleAPIs = false;
}
