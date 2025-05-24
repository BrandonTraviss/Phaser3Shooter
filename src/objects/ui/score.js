import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import * as CONFIG from '../../config.js';

const ENEMY_SCORE = {
  ScoutEnemy: CONFIG.ENEMY_SCOUT_SCORE,
  FighterEnemy: CONFIG.ENEMY_FIGHTER_SCORE,
  BattlecruiserEnemy: CONFIG.ENEMY_BATTLECRUISER_SCORE,
  FrigateEnemy: CONFIG.ENEMY_FRIGATE_SCORE,
};

export class Score extends Phaser.GameObjects.Text {
  #eventBusComponent;
  #score;
  constructor(scene, eventBusComponent) {
    super(scene, scene.scale.width / 2, 20, '0', {
      fontSize: '24px',
      color: '#ff2f66',
    });

    this.scene.add.existing(this);
    this.#eventBusComponent = eventBusComponent;
    this.#score = 0;
    this.setOrigin(0.5);
    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy) => {
      this.#score += ENEMY_SCORE[enemy.constructor.name];
      this.setText(this.#score.toString(10));
    });
  }
}
