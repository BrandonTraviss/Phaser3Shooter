import { ColliderComponent } from '../../components/collider/collider-component.js';
import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import { HealthComponent } from '../../components/health/health-component.js';
import { BotFrigateInputComponent } from '../../components/input/bot-frigate-input-component.js';
import { HorizontalMovementComponent } from '../../components/movement/horizontal-movement-component.js';
import { VerticalMovementComponent } from '../../components/movement/vertical-movement-component.js';
import { WeaponComponent } from '../../components/weapon/weapon-component.js';
import * as CONFIG from '../../config.js';

export class FrigateEnemy extends Phaser.GameObjects.Container {
  #shipSprite;
  #shipEngineSprite;
  #inputComponent;
  #weaponComponent;
  #verticalMovementComponent;
  #horizontalMovementComponent;

  #eventBusComponent;
  #isInitialized;

  #healthComponent;
  #colliderComponent;

  constructor(scene, x, y) {
    super(scene, x, y, []);

    this.#isInitialized = false;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setSize(32, 32);
    this.body.setOffset(-16, -16);

    this.#shipSprite = scene.add.sprite(0, 0, 'frigate', 0).setFlipY(true);
    this.#shipEngineSprite = scene.add.sprite(0, 0, 'frigate_engine').setFlipY(true);
    this.#shipEngineSprite.play('frigate_engine');
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
  // GETTER FUNCTIONS
  get weaponGameObjectGroup() {
    return this.#weaponComponent.bulletGroup;
  }
  get weaponComponent() {
    return this.#weaponComponent;
  }
  get colliderComponent() {
    return this.#colliderComponent;
  }
  get healthComponent() {
    return this.#healthComponent;
  }
  get shipAssetKey() {
    return 'frigate';
  }
  get shipDestroyedAnimationKey() {
    return 'frigate_destroy';
  }

  // FUNCTIONS
  init(eventBusComponent) {
    this.#eventBusComponent = eventBusComponent;
    this.#isInitialized = true;
    // Add Input
    this.#inputComponent = new BotFrigateInputComponent(this);
    // Add Vertical Movement
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_FRIGATE_MOVEMENT_VERTICAL_VELOCITY
    );
    //Add Horizonal Movement
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_FRIGATE_MOVEMENT_HORIZONTAL_VELOCITY
    );
    // Add Weapon
    this.#weaponComponent = new WeaponComponent(
      this,
      this.#inputComponent,
      {
        speed: CONFIG.ENEMY_FRIGATE_BULLET_SPEED,
        lifespan: CONFIG.ENEMY_FRIGATE_BULLET_LIFESPAN,
        maxCount: CONFIG.ENEMY_FRIGATE_BULLET_MAX_COUNT,
        yOffset: CONFIG.ENEMY_FRIGATE_BULLET_Y_OFFSET,
        interval: CONFIG.ENEMY_FRIGATE_BULLET_INTERVAL,
        flipY: true,
      },
      this.#eventBusComponent
    );
    // Create Health Component
    this.#healthComponent = new HealthComponent(CONFIG.ENEMY_FRIGATE_HEALTH);
    // Create Collision Component
    this.#colliderComponent = new ColliderComponent(this.#healthComponent, this.#eventBusComponent);
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this);
  }

  reset() {
    this.setActive(true);
    this.setVisible(true);
    this.#healthComponent.reset();
    this.#verticalMovementComponent.reset();
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
    this.#inputComponent.update();
    this.#verticalMovementComponent.update();
    this.#weaponComponent.update(dt);
    this.#horizontalMovementComponent.update();
  }
}
