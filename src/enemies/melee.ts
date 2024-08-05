import { projectile } from "../caller/projectileConfig"
import { CollisionBlock } from "../gameModules/collision"
import { Sprite } from "../gameModules/spriteLoader"
import { Player } from "../player"
import { Projectile } from "../projectile"

class HitEffect extends Sprite {
  position: {
    x: number, y: number
  }

  width: number
  height: number

  show: boolean
  showTimeout: any
  constructor() {
    super({})
    this.image.src = "./hitEffect.png"

    this.position = {
      x: 120,
      y: 120,
    }

    this.width = 62
    this.height = 70

    this.show = false
    this.showTimeout;

    this.animations = {
      1: {
        id: 0,
        frameRate: 9,
        frameBuffer: 6,
        loop: false,
      },
      2: {
        id: 1,
        frameRate: 9,
        frameBuffer: 6,
        loop: false,
      }
    }
    this.frameRate = 10
    this.frameBuffer = 5
    this.loop = true
  }


  drawTemp(ctx: CanvasRenderingContext2D) {
    if (ctx) {
      ctx.fillStyle = "red"
      if (this.show)
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
  }


  hideHitEffect() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);

      if (this.currentFrame > 1) {
        this.currentFrame = 0
      }
    }

    this.show = true
    if (this.show) {
      this.showTimeout = setTimeout(() => this.show = false, 1000);
    }
  }
}

export class enemies_melee extends Sprite {
  position: {
    x: number
    y: number
  }

  collision: {
    radius: number
    centerX: number
    centerY: number
  }

  hitbox: {
    position: { x: number, y: number }
    width: number
    height: number
  }

  collisionWidth: number
  collisionHeight: number

  player: Player
  collisionBlocks: Array<CollisionBlock>
  velocity: {
    x: number,
    y: number
  }

  speed: number
  damage: number
  lastAttackTime: number
  attackCooldown: number
  canMove: boolean
  health: number

  width: number
  height: number;

  hiteffect: HitEffect
  constructor({ player, CollisionBlocks = [], Position = { x: 160, y: 170 } }: { player: Player, CollisionBlocks: Array<any>, Position: { x: number, y: number } }) {
    super({});

    this.image.src = "./ninja.png"
    this.loop = true
    this.animations = {
      // WALK RIGHT
      1: {
        id: 0,
        frameBuffer: 4,
        frameRate: 3,
        loop: true
      },

      // WALK LEFT
      2: {
        id: 1,
        frameBuffer: 4,
        frameRate: 3,
        loop: true
      }
    }

    this.custom_position = true
    this.custom = {
      position: {
        x: 5,
        y: 5
      }
    }
    this.width = 13 * 2; // px
    this.height = 14 * 2; // px

    // this.position = {
    //   x: 160,
    //   y: 170
    // }

    this.position = {
      x: Position.x,
      y: Position.y
    }
    this.damage = (Math.random() * 5) + 5

    this.collisionWidth = 60
    this.collisionHeight = 60

    this.health = (Math.random() * 5) + 60

    this.collision = {
      centerX: this.position.x + this.collisionWidth / 2,
      centerY: this.position.y + this.collisionHeight / 2,
      radius: 40, // Example radius, adjust as needed
    };

    this.hitbox = {
      position: {
        x: 0,
        y: 0,
      },
      width: 0,
      height: 0
    };

    this.velocity = {
      x: 0,
      y: 0
    }

    this.player = player
    this.collisionBlocks = CollisionBlocks

    this.speed = 0.2

    this.attackCooldown = 1000
    this.lastAttackTime = 0
    this.canMove = false

    this.hiteffect = new HitEffect()
  }

  drawCollision(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
    ctx.fillRect(this.position.x, this.position.y, this.collisionWidth, this.collisionHeight)

    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(this.collision.centerX, this.collision.centerY, this.collision.radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "rgba(0, 0, 255, 0.5)"
    ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
    this.ctx = ctx
  }

  update() {
    this.position.x += this.velocity.x;

    if (this.hiteffect.show) {
      this.hiteffect.draw(this.ctx)
    }

    this.updateHitbox();
    this.checkForHorizontalCollision();

    this.position.y += this.velocity.y;
    this.updateHitbox();
    this.checkForVerticalCollision();

    this.updateHitbox();
    this.checkForCollisionWithPlayer()

    this.updateHitbox()
    if (this.canMove) {
      this.movement()
    }

    this.checkForProjectileCollision()
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + this.collisionWidth / 2 - 12, // INFO: position + collision.width / 2 - hitbox.width / 2
        y: this.position.y + this.collisionHeight / 2 - 12
      },
      width: 25,
      height: 30
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

  updatePlayerPosition() {
    const directionX = this.player.position.x - this.position.x;
    const directionY = this.player.position.y - this.position.y;

    const angle = Math.atan2(directionY, directionX);

    this.collision.centerX = this.position.x + this.collisionWidth / 2 + Math.cos(angle) * this.collision.radius;
    this.collision.centerY = this.position.y + this.collisionHeight / 2 + Math.sin(angle) * this.collision.radius;
  }

  updateHitEffectPosition() {
    const angle = Math.atan2(this.player.position.y - this.hitbox.position.y, this.player.position.x - this.hitbox.position.x);
    const distanceFromPlayer = 25;
    const offsetX = Math.cos(angle) * distanceFromPlayer;
    const offsetY = Math.sin(angle) * distanceFromPlayer;

    this.hiteffect.position.x = this.hitbox.position.x + this.hitbox.width / 2 + offsetX - this.hiteffect.width / 2;
    this.hiteffect.position.y = this.hitbox.position.y + this.hitbox.height / 2 + offsetY - this.hiteffect.height / 2;
  }

  checkForOuterCollisionHorizontal(): boolean {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        this.position.x < collisionBlock.position.x + collisionBlock.width &&
        this.position.x + this.collisionWidth > collisionBlock.position.x &&
        this.position.y < collisionBlock.position.y + collisionBlock.height &&
        this.position.y + this.collisionHeight > collisionBlock.position.y
      ) {
        return true;
      }
    }
    return false;
  }

  checkForOuterCollisionVertical(): boolean {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        this.position.y < collisionBlock.position.y + collisionBlock.height &&
        this.position.y + this.collisionHeight > collisionBlock.position.y &&
        this.position.x < collisionBlock.position.x + collisionBlock.width &&
        this.position.x + this.collisionWidth > collisionBlock.position.x
      ) {
        return true;
      }
    }
    return false;
  }

  checkForProjectileCollision() {
    for (let i = 0; i < Player.projectileArray.length; i++) {
      const projectile = Player.projectileArray[i];

      const circle = {
        x: projectile.position.x,
        y: projectile.position.y,
        radius: projectile.radius
      }

      let closestX = Math.max(this.hitbox.position.x, Math.min(circle.x, this.hitbox.position.x + this.hitbox.width))
      let closestY = Math.max(this.hitbox.position.y, Math.min(circle.y, this.hitbox.position.y + this.hitbox.height))

      const distanceX = circle.x - closestX;
      const distanceY = circle.y - closestY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      if (distance < circle.radius) {
        this.takeDamage()
        this.health = Math.round(this.health)
        projectile.deleteProjectile(Player.projectileArray)
        console.log(this.health)
      }
    }
  }

  checkForHorizontalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      if (
        this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
        this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x
          this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
          this.velocity.x = 0
          break
        }

        if (this.velocity.x > 0) {
          const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
          this.position.x = collisionBlock.position.x - offset - 0.01
          this.velocity.x = 0
          break
        }
      }
    }
  }

  checkForVerticalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]
      if (
        this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
        this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          const offset = this.hitbox.position.y - this.position.y
          this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.05
          this.velocity.y = 0
          break
        }

        if (this.velocity.y > 0) {
          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
          this.position.y = collisionBlock.position.y - offset - 0.05
          this.velocity.y = 0
          break
        }
      }
    }
  }

  checkForCollisionWithPlayer() {
    const playerHitbox = this.player.hitbox
    if (
      this.hitbox.position.x < playerHitbox.position.x + playerHitbox.width &&
      this.hitbox.position.x + this.hitbox.width > playerHitbox.position.x &&
      this.hitbox.position.y < playerHitbox.position.y + playerHitbox.height &&
      this.hitbox.position.y + this.hitbox.height > playerHitbox.position.y
    ) {
      this.speed = 0.01
      this.attack()
    } else {
      this.speed = 0.1
    }

    //INFO: ENEMIES COLLISION DETECT PLAYER??
    //if (
    //  this.position.x < playerHitbox.position.x + playerHitbox.width &&
    //  this.position.x + this.collision.width > playerHitbox.position.x &&
    //  this.position.y < playerHitbox.position.y + playerHitbox.height &&
    //  this.position.y + this.collision.height > playerHitbox.position.y
    //) {
    //  console.log("collision is touching enemies hitbox try to follow")
    //}
  }

  isPlayerInCircle() {
    const distX = Math.abs(this.collision.centerX - (this.player.position.x + this.player.width / 2));
    const distY = Math.abs(this.collision.centerY - (this.player.position.y + this.player.height / 2));

    if (distX > (this.player.width / 2 + this.collision.radius)) { return false; }
    if (distY > (this.player.height / 2 + this.collision.radius)) { return false; }

    if (distX <= (this.player.width / 2)) { return true; }
    if (distY <= (this.player.height / 2)) { return true; }

    const dx = distX - this.player.width / 2;
    const dy = distY - this.player.height / 2;
    return (dx * dx + dy * dy <= (this.collision.radius * this.collision.radius));
  }

  attack() {
    this.updatePlayerPosition()
    const currentTime = Date.now()
    if (currentTime - this.lastAttackTime >= this.attackCooldown && this.isPlayerInCircle()) {
      this.updatePlayerPosition()
      this.updateHitEffectPosition()
      this.hiteffect.hideHitEffect()
      this.player.takeDamage(this.damage)
      this.lastAttackTime = currentTime
    }
  }

  movement() {
    // Adjust velocity based on player position
    if (this.player.position.x < this.position.x) {
      this.velocity.x -= this.speed;
      this.switchSprite(2)
    } else if (this.player.position.x > this.position.x + this.collisionWidth / 2) {
      this.switchSprite(1)
      this.velocity.x += this.speed;
    }

    if (this.player.position.y < this.position.y) {
      this.velocity.y -= this.speed;
    } else if (this.player.position.y > this.position.y) {
      this.velocity.y += this.speed;
    }

    // Check for collisions and adjust position
    if (this.checkForOuterCollisionHorizontal()) {
      // Try moving left or right
      if (!this.checkForOuterCollisionOnMove(-this.speed, 0)) {
        this.velocity.x -= this.speed; // Move left
      } else if (!this.checkForOuterCollisionOnMove(this.speed, 0)) {
        this.velocity.x += this.speed; // Move right
      }
    }

    if (this.checkForOuterCollisionVertical()) {
      // Try moving up or down
      if (!this.checkForOuterCollisionOnMove(0, -this.speed)) {
        this.velocity.y -= this.speed; // Move up
      } else if (!this.checkForOuterCollisionOnMove(0, this.speed)) {
        this.velocity.y += this.speed; // Move down
      }
    }
  }

  checkForOuterCollisionOnMove(deltaX: number, deltaY: number): boolean {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      const newX = this.velocity.x + deltaX;
      const newY = this.velocity.y + deltaY;
      if (
        newX < collisionBlock.position.x + collisionBlock.width &&
        newX + this.collisionWidth > collisionBlock.position.x &&
        newY < collisionBlock.position.y + collisionBlock.height &&
        newY + this.collisionHeight > collisionBlock.position.y
      ) {
        return true;
      }
    }
    return false;
  }

  takeDamage() {
    this.health -= Player.ammo.damage;
  }
}
