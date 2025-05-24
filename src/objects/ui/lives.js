import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import * as CONFIG from '../../config.js';
export class Lives extends Phaser.GameObjects.Container {
  #lives;
  #eventBusComponent;

  constructor(scene, eventBusComponent) {
    super(scene, 5, scene.scale.height - 25, []);
    this.#eventBusComponent = eventBusComponent;
    this.#lives = CONFIG.PLAYER_LIVES;
    this.scene.add.existing(this);
    this.setLives();
    this.createText();
    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#lives -= 1;
      this.getAt(this.#lives).destroy();
      if (this.#lives > 0) {
        scene.time.delayedCall(1500, () => {
          this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
        });
        return;
      }
      this.#eventBusComponent.emit(CUSTOM_EVENTS.GAME_OVER);
      this.gameOver.setVisible(true);
      this.enterToRestart.setVisible(true);
    });
    this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
    eventBusComponent.on(CUSTOM_EVENTS.RESTART, () => {
      this.#lives = CONFIG.PLAYER_LIVES;
      this.setLives();
      this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
      this.gameOver.setVisible(false);
      this.enterToRestart.setVisible(false);
    });
  }
  createText() {
    this.gameOver = this.scene.add
      .text(this.scene.scale.width / 2, this.scene.scale.height / 2 - 20, 'GAME OVER', {
        fontSize: '24px',
      })
      .setOrigin(0.5);
    this.enterToRestart = this.scene.add
      .text(this.scene.scale.width / 2, this.scene.scale.height / 2, '(Press Enter to restart)', {
        fontSize: '12px',
      })
      .setOrigin(0.5);
    this.gameOver.setVisible(false);
    this.enterToRestart.setVisible(false);
  }
  setLives() {
    for (let i = 0; i < this.#lives; i += 1) {
      const ship = this.scene.add
        .image(i * 20, 0, 'ship')
        .setScale(0.6)
        .setOrigin(0);
      this.add(ship);
    }
  }
}
