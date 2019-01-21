let
  pkgs = import <nixpkgs> { };
in
  pkgs.runCommand "dummy" {
    buildInputs = [ pkgs.nodejs-8_x pkgs.yarn pkgs.nodePackages.react-native-cli ];
  } ""
