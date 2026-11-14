{
  # 'nix develop'
  perSystem = {pkgs, ...}: {
    devShells.default = pkgs.mkShellNoCC {
      packages = [pkgs.hugo];
    };
  };
}
