import { InputComponent } from './input-component.js';

export class KeyboardInputComponent extends InputComponent {
  #cursorKeys;
  #inputLocked;
  #enterKey;

  constructor(scene) {
    super();
    this.#cursorKeys = scene.input.keyboard.createCursorKeys();
    this.#inputLocked = false;
    this.#enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  set lockInput(val) {
    this.#inputLocked = val;
  }

  update() {
    if (this.#inputLocked) {
      this.reset();
      return;
    }

    this._up = this.#cursorKeys.up.isDown;
    this._down = this.#cursorKeys.down.isDown;
    this._left = this.#cursorKeys.left.isDown;
    this._right = this.#cursorKeys.right.isDown;
    this._shoot = this.#cursorKeys.space.isDown;
    this._enter = this.#enterKey.isDown;
  }
}
