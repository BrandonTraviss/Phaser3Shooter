import { InputComponent } from './input-component.js';
import * as CONFIG from '../../config.js';
export class BotFrigateInputComponent extends InputComponent {
  #gameObject;
  #startX;
  #maxXMovement;

  constructor(gameObject) {
    super();
    this.#gameObject = gameObject;
    this.#startX = this.#gameObject.x;
    this.#maxXMovement = CONFIG.ENEMY_FRIGATE_MOVEMENT_MAX_X;
    this._down = true;
    this._shoot = true;
    this._left = false;
    this._right = true;
  }
  update() {
    if (this.#gameObject.x > 450 - 30) {
      this._left = true;
      this._right = false;
    } else if (this.#gameObject.x < 0 + 30) {
      this._right = true;
      this._left = false;
    }
  }
}
