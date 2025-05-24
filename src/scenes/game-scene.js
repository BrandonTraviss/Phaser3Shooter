// @ts-nocheck
import { EnemySpawnerComponent } from '../components/spawners/enemy-spawner-component.js';
import Phaser from '../lib/phaser.js';
import { BattlecruiserEnemy } from '../objects/enemies/battlecruiser-enemy.js';
import { FighterEnemy } from '../objects/enemies/fighter-enemy.js';
import { FrigateEnemy } from '../objects/enemies/frigate-enemy.js';
import { ScoutEnemy } from '../objects/enemies/scout-enemy.js';
import { Player } from '../objects/player.js';
import * as CONFIG from '../config.js';
import { CUSTOM_EVENTS, EventBusComponent } from '../components/events/event-bus-component.js';
import { EnemyDestroyedComponent } from '../components/spawners/enemy-destroy-component.js';
import { Score } from '../objects/ui/score.js';
import { Lives } from '../objects/ui/lives.js';
import { AudioManager } from '../objects/audio-manager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    this.add.sprite(0, 0, 'bg1', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg1');
    this.add.sprite(0, 0, 'bg2', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg2');
    this.add.sprite(0, 0, 'bg3', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg3');

    const eventBusComponent = new EventBusComponent();
    const player = new Player(this, eventBusComponent);
    // SPAWNER COMPONENTS
    // Scout
    const scoutSpawner = new EnemySpawnerComponent(
      this,
      ScoutEnemy,
      {
        interval: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_INTERVAL,
        spawnStart: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_START,
      },
      eventBusComponent
    );
    // Fighter
    const fighterSpawner = new EnemySpawnerComponent(
      this,
      FighterEnemy,
      {
        interval: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL,
        spawnStart: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_START,
      },
      eventBusComponent
    );
    // Frigate
    const frigateSpawner = new EnemySpawnerComponent(
      this,
      FrigateEnemy,
      {
        interval: CONFIG.ENEMY_FRIGATE_GROUP_SPAWN_INTERVAL,
        spawnStart: CONFIG.ENEMY_FRIGATE_GROUP_SPAWN_START,
      },
      eventBusComponent
    );
    // Frigate
    const battlecruiserSpawner = new EnemySpawnerComponent(
      this,
      BattlecruiserEnemy,
      {
        interval: CONFIG.ENEMY_BATTLECRUISER_GROUP_SPAWN_INTERVAL,
        spawnStart: CONFIG.ENEMY_BATTLECRUISER_GROUP_SPAWN_START,
      },
      eventBusComponent
    );
    // DESTROYED EVENT EMITTER
    new EnemyDestroyedComponent(this, eventBusComponent);
    // OVERLAPS
    // SCOUT
    this.physics.add.overlap(player, scoutSpawner.phaserGroup, (playerGameObject, enemyGameObject) => {
      if (!playerGameObject.active || !enemyGameObject.active) {
        return;
      }
      playerGameObject.colliderComponent.collideWithEnemyShip();
      enemyGameObject.colliderComponent.collideWithEnemyShip();
    });
    // FIGHTER
    this.physics.add.overlap(player, fighterSpawner.phaserGroup, (playerGameObject, enemyGameObject) => {
      if (!playerGameObject.active || !enemyGameObject.active) {
        return;
      }
      playerGameObject.colliderComponent.collideWithEnemyShip();
      enemyGameObject.colliderComponent.collideWithEnemyShip();
    });
    // FRIGATE
    this.physics.add.overlap(player, frigateSpawner.phaserGroup, (playerGameObject, enemyGameObject) => {
      if (!playerGameObject.active || !enemyGameObject.active) {
        return;
      }
      playerGameObject.colliderComponent.collideWithEnemyShip();
      enemyGameObject.colliderComponent.collideWithEnemyShip();
    });
    // BATTLECRUISER
    this.physics.add.overlap(player, battlecruiserSpawner.phaserGroup, (playerGameObject, enemyGameObject) => {
      if (!playerGameObject.active || !enemyGameObject.active) {
        return;
      }
      playerGameObject.colliderComponent.collideWithEnemyShip();
      enemyGameObject.colliderComponent.collideWithEnemyShip();
    });
    // BULLETS
    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_INIT, (gameObject) => {
      if (gameObject.constructor.name == 'ScoutEnemy') {
        return;
      }
      this.physics.add.overlap(player, gameObject.weaponGameObjectGroup, (playerGameObject, projectileGameObject) => {
        if (!playerGameObject.active || !projectileGameObject.active) {
          return;
        }
        console.log('Hit With Bullet');
        gameObject.weaponComponent.destroyBullet(projectileGameObject);
        playerGameObject.colliderComponent.collideWithEnemyProjectile();
      });
    });
    // Enemy OVERLAP with player BULLETS
    // SCOUT
    this.physics.add.overlap(
      scoutSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        if (!enemyGameObject.active || !projectileGameObject.active) {
          return;
        }
        player.weaponComponent.destroyBullet(projectileGameObject);
        enemyGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );
    // FIGHTER
    this.physics.add.overlap(
      fighterSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        if (!enemyGameObject.active || !projectileGameObject.active) {
          return;
        }
        player.weaponComponent.destroyBullet(projectileGameObject);
        enemyGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );
    // FRIGATE
    this.physics.add.overlap(
      frigateSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        if (!enemyGameObject.active || !projectileGameObject.active) {
          return;
        }
        player.weaponComponent.destroyBullet(projectileGameObject);
        enemyGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );
    // BATTLECRUISER
    this.physics.add.overlap(
      battlecruiserSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        if (!enemyGameObject.active || !projectileGameObject.active) {
          return;
        }
        player.weaponComponent.destroyBullet(projectileGameObject);
        enemyGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );
    new Score(this, eventBusComponent);
    new Lives(this, eventBusComponent);
    new AudioManager(this, eventBusComponent);
  }

  update() {}
}
