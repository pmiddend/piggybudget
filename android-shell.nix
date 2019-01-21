{ pkgs ? import <nixpkgs> {} }:
 
let
  # androidComposition = pkgs.androidenv.androidPkgs_9_0;
  androidComposition = pkgs.androidenv.composeAndroidPackages {
    toolsVersion = "25.2.5";
    platformToolsVersion = "28.0.1";
    buildToolsVersions = [ "28.0.3" ];
    includeEmulator = true;
    emulatorVersion = "28.0.14";
    # platformVersions = [ "24" ];
    includeSources = false;
    includeDocs = false;
    includeSystemImages = false;
    systemImageTypes = [ "default" ];
    abiVersions = [ "armeabi-v7a" ];
    # lldbVersions = [ "2.0.2558144" ];
    # cmakeVersions = [ "3.6.4111459" ];
    includeNDK = false;
    ndkVersion = "18.1.5063045";
    useGoogleAPIs = false;
    useGoogleTVAddOns = false;
    # includeExtras = [
    #   "extras;google;gcm"
    # ];
  };
  fhs = pkgs.buildFHSUserEnv {
    name = "android-env";
    targetPkgs = pkgs: with pkgs;
        [ git
        gitRepo
        gnupg
        python2
        curl
        procps
        openssl
        gnumake
        nettools
        # androidComposition.platform-tools
        # androidComposition.emulator
        jdk
        schedtool
        utillinux
        m4
        gperf
        perl
        libxml2
        yarn
        zip
        unzip
        bison
        nodePackages.react-native-cli
        nodejs-8_x
        yarn
        flex
        lzop
        ];
    multiPkgs = pkgs: with pkgs;
        [ zlib
        ];
    runScript = "bash";
    profile = ''
        export USE_CCACHE=1
        export ANDROID_JAVA_HOME=${pkgs.jdk.home}
        export ANDROID_HOME=/home/philipp/Android/Sdk
        export JAVA_HOME=${pkgs.jdk}
    '';
  };
in pkgs.stdenv.mkDerivation {
  name = "android-env-shell";
  nativeBuildInputs = [ fhs ];
  shellHook = "exec android-env";
}
