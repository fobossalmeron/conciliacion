{ pkgs }:
let 
  nodejs = pkgs.nodejs-20_x;  # Asegúrate de que esta línea apunte a Node.js 20.x
in {
  deps = [
    nodejs
  ];
}