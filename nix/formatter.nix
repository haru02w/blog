{
  # 'nix fmt'
  perSystem = {pkgs, ...}: {
    formatter = pkgs.alejandra;
  };
}
