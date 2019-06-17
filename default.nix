{ pkgs ? import <nixpkgs> {} }:
 
let 
  jdk = pkgs.jdk8;
  androidsdk = pkgs.androidenv.androidPkgs_9_0.androidsdk;
  fhs = pkgs.buildFHSUserEnv {
    name = "android-env";
    targetPkgs = pkgs: with pkgs; [ 
      androidsdk
      bash
      ncurses
      nodejs
      yarn
      nodePackages.react-native-cli
      nodePackages.eslint
      git
      which
      jdk
      xterm
      watchman
    ];
    multiPkgs = pkgs: with pkgs; [
      gst_all_1.gst-plugins-ugly
      gst_all_1.gstreamer
      xlibs.libX11
      xlibs.libXcomposite
      xlibs.libXext
      xlibs.libXfixes
      xlibs.libXrandr
      xlibs.libXtst
      zlib 
    ];
    runScript = "bash";
    profile = ''
      export ANDROID_HOME="${androidsdk}/libexec/android-sdk"
      export ANDROID_EMULATOR_FORCE_32BIT=true
      export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ANDROID_HOME/tools/lib64
    '';
  };
in 
pkgs.stdenv.mkDerivation {
  name = "android-sdk-fhs-shell";
  nativeBuildInputs = [ fhs ];
  shellHook = "exec android-env";
}
