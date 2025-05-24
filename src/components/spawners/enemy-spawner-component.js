import { CUSTOM_EVENTS } from '../events/event-bus-component.js';

export class EnemySpawnerComponent {
  #scene;
  #spawnInterval;
  #spawnStart;
  #group;
  #disableSpawning;

  constructor(scene, enemyClass, spawnConfig, eventBusComponent) {
    this.#scene = scene;
    this.#disableSpawning = false;
    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
      //   Used to create new instances of our enemyClass that we pass in
      classType: enemyClass,
      //   Phaser automatically calls update method on the gameObjects
      runChildUpdate: true,
      //   Function run when enemy is created
      createCallback: (enemy) => {
        console.log(enemy);
        //Notify game scene that new enemy is made using events component
        enemy.init(eventBusComponent);
      },
    });
    this.#spawnInterval = spawnConfig.interval;
    this.#spawnStart = spawnConfig.spawnStart;

    this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.#scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
    this.#scene.events.once(
      Phaser.Scenes.Events.DESTROY,
      () => {
        this.#scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.#scene.scene.physics.world.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
      },
      this
    );
    eventBusComponent.on(CUSTOM_EVENTS.GAME_OVER, () => {
      this.#disableSpawning = true;
      this.#group.getChildren().forEach((enemy) => {
        enemy.setActive(false);
        enemy.setVisible(false);
      });
    });
    eventBusComponent.on(CUSTOM_EVENTS.RESTART, () => {
      this.#disableSpawning = false;
      this.#spawnStart = spawnConfig.spawnStart;
    });
  }

  get phaserGroup() {
    return this.#group;
  }

  update(ts, dt) {
    if (this.#disableSpawning == true) {
      return;
    }
    this.#spawnStart -= dt;
    if (this.#spawnStart > 0) {
      return;
    }

    const x = Phaser.Math.RND.between(30, this.#scene.scale.width - 40);
    const enemy = this.#group.get(x, -20);
    enemy.reset();
    this.#spawnStart = this.#spawnInterval;
  }
  worldStep(delta) {
    // Loops over every enemy in  #group
    this.#group.getChildren().forEach((enemy) => {
      if (!enemy.active) {
        return;
      }
      if (enemy.y > this.#scene.scale.height + 50) {
        enemy.setActive(false);
        enemy.setVisible(false);
      }
    });
  }
}
