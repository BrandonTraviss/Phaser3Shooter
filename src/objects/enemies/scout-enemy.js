import { ColliderComponent } from '../../components/collider/collider-component.js';
import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import { HealthComponent } from '../../components/health/health-component.js';
import { BotScoutInputComponent } from '../../components/input/bot-scout-input-component.js';
import { HorizontalMovementComponent } from '../../components/movement/horizontal-movement-component.js';
import { VerticalMovementComponent } from '../../components/movement/vertical-movement-component.js';
import * as CONFIG from '../../config.js';

export class ScoutEnemy extends Phaser.GameObjects.Container {
  #shipSprite;
  #shipEngineSprite;
  #InputComponent;
  #verticalMovementComponent;
  #horizontalMovementComponent;

  #eventBusComponent;
  #isInitialized;

  #healthComponent;
  #colliderComponent;

  constructor(scene, x, y) {
    super(scene, x, y, []);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setSize(24, 24);
    this.body.setOffset(-12, -12);

    this.#shipSprite = scene.add.sprite(0, 0, 'scout', 0).setFlipY(true);
    this.#shipEngineSprite = scene.add.sprite(0, 0, 'scout_engine').setFlipY(true);
    this.#shipEngineSprite.play('scout_engine');
    this.add([this.#shipEngineSprite, this.#shipSprite]);
    // Check Phaser.scenes.Events for when Update is run and runs this.update with this for context
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  // get colliderComponent
  get colliderComponent() {
    return this.#colliderComponent;
  }
  // get healthComponent for collision
  get healthComponent() {
    return this.#healthComponent;
  }
  get shipAssetKey() {
    return 'scout';
  }
  get shipDestroyedAnimationKey() {
    return 'scout_destroy';
  }

  init(eventBusComponent) {
    this.#isInitialized = true;
    this.#eventBusComponent = eventBusComponent;
    // Add Input
    this.#InputComponent = new BotScoutInputComponent(this);
    // Vertical Movement Component
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#InputComponent,
      CONFIG.ENEMY_SCOUT_MOVEMENT_VERTICAL_VELOCITY
    );
    // Horizontal Movement Component
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#InputComponent,
      CONFIG.ENEMY_SCOUT_MOVEMENT_HORIZONTAL_VELOCITY
    );
    // Create Health Component
    this.#healthComponent = new HealthComponent(CONFIG.ENEMY_SCOUT_HEALTH);
    // Create Collision Component
    this.#colliderComponent = new ColliderComponent(this.#healthComponent, this.#eventBusComponent);
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this);
  }

  reset() {
    this.setActive(true);
    this.setVisible(true);
    this.#healthComponent.reset();
    this.#InputComponent.startX = this.x;
    this.#verticalMovementComponent.reset();
    this.#horizontalMovementComponent.reset();
  }

  update(ts, dt) {
    if (!this.#isInitialized) {
      return;
    }
    if (!this.active) {
      return;
    }
    if (this.#healthComponent.isDead) {
      this.setActive(false);
      this.setVisible(false);
      this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_DESTROYED, this);
    }
    this.#InputComponent.update();
    this.#verticalMovementComponent.update();
    this.#horizontalMovementComponent.update();
  }
}
