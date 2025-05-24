// @ts-nocheck
import { InputComponent } from '../components/input/input-component.js';
import { KeyboardInputComponent } from '../components/input/keyboard-input-component.js';
import Phaser from '../lib/phaser.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.json('animations_json', 'assets/data/animations.json');
  }

  create() {
    this.add.sprite(0, 0, 'bg1', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg1');
    this.add.sprite(0, 0, 'bg2', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg2');
    this.add.sprite(0, 0, 'bg3', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg3');

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 20, 'Space Shooter', {
        fontSize: '24px',
        fill: 'white',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, '(Press Enter to start)', {
        fontSize: '12px',
        fill: 'white',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.scene.start('GameScene');
    }
  }
}
