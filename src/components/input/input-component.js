export class InputComponent {
  _up;
  _down;
  _left;
  _right;
  _shoot;
  _enter;

  constructor() {
    this.reset();
  }

  get leftIsDown() {
    return this._left;
  }

  get rightIsDown() {
    return this._right;
  }

  get upIsDown() {
    return this._up;
  }

  get downIsDown() {
    return this._down;
  }

  get shootIsDown() {
    return this._shoot;
  }

  get enterIsDown() {
    return this._enter;
  }

  reset() {
    this._up = false;
    this._down = false;
    this._left = false;
    this._right = false;
    this._shoot = false;
    this._enter = false;
  }
}
