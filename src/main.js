import Phaser from './lib/phaser.js';
import { BootScene } from './scenes/boot-scene.js';
import { GameScene } from './scenes/game-scene.js';
import { MenuScene } from './scenes/menu-scene.js';
import { PreloadScene } from './scenes/preload-scene.js';

const game = new Phaser.Game({
  type: Phaser.CANVAS,
  roundPixels: true,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 450,
    height: 640,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
});

game.scene.add('GameScene', GameScene);
game.scene.add('BootScene', BootScene);
game.scene.add('MenuScene', MenuScene);
game.scene.add('PreloadScene', PreloadScene);
game.scene.start('BootScene');
