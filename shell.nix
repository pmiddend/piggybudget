{ pkgs ? import <nixpkgs> {} }:
 
let fhs = pkgs.buildFHSUserEnv {
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
      androidenv.platformTools
      jdk
      schedtool
      utillinux
      m4
      gperf
      perl
      libxml2
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
