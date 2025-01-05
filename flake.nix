{
  description = "Lavander developer environment";

  inputs = {
    nixpkgs = {
      # Locked to nixpkgs/nixos-24.11
      url = "github:nixos/nixpkgs/nixos-24.11";
    };
  };
  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSupportedSystem =
        f:
        nixpkgs.lib.genAttrs supportedSystems (
          system:
          f {
            pkgs = import nixpkgs {
              inherit system;
            };
          }
        );
    in
    {
      devShells = forEachSupportedSystem (
        { pkgs }:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              # Tools
              git

              # Node
              nodejs
              nodePackages.pnpm

              # mdbook
              mdbook
              mdbook-mermaid
            ];
          };
        }
      );
    };
}
