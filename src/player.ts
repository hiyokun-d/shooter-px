import { player } from "./caller/playerConfig";
import { projectile } from "./caller/projectileConfig";
import { CollisionBlock } from "./gameModules/collision";
import { Sprite } from "./gameModules/spriteLoader";
import { Projectile } from "./projectile";

type keys = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  dash: boolean;
  reload: boolean;
};

export class Player extends Sprite {
  position: { x: number; y: number };
  speed: number;
  width: number;
  height: number;
  velocity: { x: number; y: number };
  lastDirection: "up" | "down" | "left" | "right";
  hitbox: {
    position: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
  };
  collisionBlocks?: Array<CollisionBlock>;
  direction: "up" | "down" | "left" | "right";
  health: {
    maxHealth: number;
    health: number;
  };

  dash: {
    speed: number;
    cooldown: number;
    delay: number;
    available: boolean;
  };

  shooting: boolean;
  isReloading: boolean;
  currentReloadTime: number;
  isTakeDamage: boolean
  healTimeout: any

  constructor({
    collisionBlock = [],
    imageSrc,
    frameRate,
    frameBuffer,
    animations,
    loop,
    animationID,
  }) {
    super({ imageSrc, frameRate, animations, loop, animationID, frameBuffer });
    this.position = {
      x: 150,
      y: 150,
    };

    this.speed = -2;

    this.width = 32; // px
    this.height = 32; // px

    this.collisionBlocks = collisionBlock;

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.hitbox = {
      position: {
        x: 0,
        y: 0,
      },
      width: 0,
      height: 0,
    };

    this.dash = {
      speed: 25,
      cooldown: 100,
      delay: 0,
      available: false,
    };

    this.health = {
      maxHealth: 100,
      health: 100,
    };

    this.shooting = false;
    this.isReloading = false;

    this.isTakeDamage = false
    this.healTimeout = null
  }

  drawRect(ctx: CanvasRenderingContext2D) {
    if (ctx) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fillRect(
        this.hitbox.position.x,
        this.hitbox.position.y,
        this.hitbox.width,
        this.hitbox.height
      );

      ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

      projectile.draw(ctx);
      // projectile.drawCircle(ctx)

      for (let i = 0; i < Player.projectileArray.length; i++) {
        const proj = Player.projectileArray[i]

        proj.drawCircle(ctx);
        proj.draw(ctx)
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;

    if (this.dash.delay == this.dash.cooldown) {
      this.dash.available = true;
    }

    this.updateHitbox();
    this.checkForHorizontalCollision();

    this.position.y += this.velocity.y;
    this.updateHitbox();
    this.checkForVerticalCollision();

    this.updateHitbox();
    this.incremenetDashing();

    this.updatePlayerPosition();

    Player.projectileArray.forEach((proj, i) => {
      proj.collisionBlocks = this.collisionBlocks
      proj.update();

      if (proj.checkForHorizontalCollision(true) || proj.checkForVerticalCollision(true)) {
        Player.projectileArray.splice(i, 1)
      }
    });

    if (this.isReloading) {
      this.reload();
    }

    if (this.health.health !== this.health.maxHealth && !this.isTakeDamage) {
      this.startHealTimer()
    }
  }

  incremenetDashing() {
    if (this.dash.delay !== this.dash.cooldown) {
      this.dash.delay++;
    }
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 6,
        y: this.position.y + 7.5,
      },
      width: 20,
      height: 20,
    };
  }

  checkForHorizontalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        this.hitbox.position.x <=
        collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
        collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
        collisionBlock.position.y &&
        this.hitbox.position.y <=
        collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          this.velocity.x = 0;
          break;
        }

        if (this.velocity.x > 0) {
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          this.velocity.x = 0;
          break;
        }
      }
    }
  }
  checkForVerticalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        this.hitbox.position.x <=
        collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
        collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
        collisionBlock.position.y &&
        this.hitbox.position.y <=
        collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.05;
          this.velocity.y = 0;
          break;
        }

        if (this.velocity.y > 0) {
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.05;
          this.velocity.y = 0;
          break;
        }
      }
    }
  }

  switchSprite(id: number) {
    if (!this.animations[id]) {
      console.error(`Animation with ID ${id} not found or it doesn't exist`);
      return;
    }
    this.frameRate = this.animations[id].frameRate;
    this.frameBuffer = this.animations[id].frameBuffer;
    this.animationID = this.animations[id].id;
  }

  handleEventKeys(keys: keys) {
    if (this.preventInput) return;

    // Initialize velocity to zero before checking keys
    this.velocity.x = 0;
    this.velocity.y = 0;

    if (keys.up) {
      this.switchSprite(1);
      this.velocity.y = this.speed;
      this.lastDirection = "up";
      this.direction = "up";
    }
    if (keys.down) {
      this.switchSprite(2);
      this.velocity.y = -this.speed;
      this.lastDirection = "down";
      this.direction = "down";
    }
    if (keys.left) {
      this.switchSprite(3);
      this.velocity.x = this.speed; // Corrected the direction
      this.lastDirection = "left";
      this.direction = "left";
    }
    if (keys.right) {
      this.switchSprite(4); // Assuming switchSprite(4) is for right direction
      this.velocity.x = -this.speed; // Corrected the direction
      this.lastDirection = "right";
      this.direction = "right";
    }

    // If no vertical movement, set idle sprite based on last direction
    if (!keys.up && !keys.down) {
      switch (this.lastDirection) {
        case "up":
          this.switchSprite(5);
          break;
        case "down":
          this.switchSprite(6);
          break;
      }
    }

    // If no horizontal movement, set idle sprite based on last direction
    if (!keys.left && !keys.right) {
      switch (this.lastDirection) {
        case "left":
          this.switchSprite(7);
          break;
        case "right":
          this.switchSprite(8);
          break;
      }
    }

    if (keys.dash && this.dash.available) {
      if (this.dash.delay === this.dash.cooldown) {
        keys.dash = false;
        this.dash.delay = 0;

        switch (this.direction) {
          case "right":
            this.velocity.x -= this.speed * this.dash.speed;
            break;
          case "left":
            this.velocity.x += this.speed * this.dash.speed;
            break;
          case "up":
            this.velocity.y += this.speed * this.dash.speed;
            break;
          case "down":
            this.velocity.y -= this.speed * this.dash.speed;
            break;
          default:
            break;
        }

        this.dash.available = false;
      } else keys.dash = false;
    }

    if (keys.reload && !this.isReloading) {
      keys.reload = false;
      this.isReloading = true;
    }
  }

  takeDamage(damage: number) {
    this.health.health -= damage || 10;
    this.isTakeDamage = true

    if (this.health.health <= 0) return this.health.health = 0

    if (this.healTimeout) {
      clearTimeout(this.healTimeout)
    }

    this.startHealTimer()
  }

  startHealTimer() {
    this.healTimeout = setTimeout(() => {
      this.heal(10);
      this.isTakeDamage = false;
    }, 5500)
  }

  checkHealth(isItZero?: boolean) {
    if (!isItZero && this.health.health < this.health.maxHealth) return true;
    if (isItZero && this.health.health <= 0) return true;

    return false;
  }

  heal(heal: number) {
    if (this.health.health <= 0) return;
    if (this.isTakeDamage) {
      clearTimeout(this.healTimeout)
      this.startHealTimer();
    }

    if (this.health.health < this.health.maxHealth) {
      console.log("it's lower than maxHealth")
      this.health.health += heal || 10

      if (this.health.health > this.health.maxHealth) {
        this.health.health = this.health.maxHealth
        clearTimeout(this.healTimeout)
      }

      console.log("healed: ", heal)
    } else {
      clearTimeout(this.healTimeout)
    }

    console.log("currentHealth: ", this.health.health)
  }

  updatePlayerPosition() {
    projectile.getCursorPosition(this);
  }

  static ammo = {
    maxAmmo: 30,
    currentAmmo: 2,
    reloadTime: 100,
    maxReloadTime: 100,
    damage: 10
  };

  checkAmmo(isItZero: boolean = false) {
    if (!isItZero) return Player.ammo.currentAmmo;
    if (isItZero && Player.ammo.currentAmmo <= 0) return true;
    return false;
  }

  static decreaseAmmo() {
    if (!player.checkAmmo(true)) {
      Player.ammo.currentAmmo -= 1;
    }
  }

  static projectileArray = [];

  shoot() {
    if (Player.ammo.currentAmmo <= 0 || this.isReloading) return;
    Player.decreaseAmmo();
    projectile.shoot(Player.projectileArray);
  }

  reload() {
    if (Player.ammo.currentAmmo === Player.ammo.maxAmmo || !this.isReloading) {
      this.isReloading = false;
      return;
    }

    this.currentReloadTime = Player.ammo.reloadTime

    if (0 === Player.ammo.reloadTime) {
      Player.ammo.currentAmmo = Player.ammo.maxAmmo;
      Player.ammo.reloadTime = Player.ammo.maxReloadTime;
      this.isReloading = false;
      this.currentReloadTime = Player.ammo.reloadTime
      projectile.updateAngleImage = true

    }

    if (0 < Player.ammo.reloadTime && this.isReloading) {
      Player.ammo.reloadTime -= 1;
      this.isReloading = true;
      projectile.updateAngleImage = false
      if (projectile.gunPosition === "right") {
        projectile.angleImage += 15
      } else projectile.angleImage -= 15
    }
  }
}
