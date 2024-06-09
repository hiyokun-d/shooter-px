import { CollisionBlock } from "../gameModules/collision"

export class enemies_melee {
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

  width: number
  height: number

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

  constructor({ player, CollisionBlocks = [] }) {
    this.position = {
      x: 130,
      y: 200
    }

    this.damage = 10

    this.width = 50
    this.height = 50

    this.collision = {
      centerX: this.position.x + this.width / 2,
      centerY: this.position.y + this.height / 2,
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

    this.speed = 1

    this.attackCooldown = 1000
    this.lastAttackTime = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(0, 255, 0)"
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(this.collision.centerX, this.collision.centerY, this.collision.radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "rgba(0, 0, 255, 0.5)"
    ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
  }

  update() {
    this.position.x += this.velocity.x;

    this.updateHitbox();
    this.checkForHorizontalCollision();

    this.position.y += this.velocity.y;
    this.updateHitbox();
    this.checkForVerticalCollision();

    this.updateHitbox();
    this.checkForCollisionWithPlayer()

    this.updateHitbox()
    //    this.movement()
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + this.width / 2 - 10, // INFO: position + collision.width / 2 - hitbox.width / 2
        y: this.position.y + this.height / 2 - 10
      },
      width: 20,
      height: 20
    }
  }

  updatePlayerPosition() {
    // Calculate the direction vector from enemy to player
    const directionX = this.player.position.x - this.position.x;
    const directionY = this.player.position.y - this.position.y;

    // Calculate angle to rotate collision box
    const angle = Math.atan2(directionY, directionX);

    // Update collision box position and rotation
    this.collision.centerX = this.position.x + this.width / 2 + Math.cos(angle) * this.collision.radius;
    this.collision.centerY = this.position.y + this.height / 2 + Math.sin(angle) * this.collision.radius;
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
      this.attack()
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
      this.player.takeDamage(this.damage)
      this.lastAttackTime = currentTime
    }
  }

  movement() {
    // Example: Adjust position based on player's position
    if (this.player.position.x < this.position.x) {
      // Player is to the left of the enemy
      this.position.x -= this.speed;
    } else if (this.player.position.x > this.position.x) {
      // Player is to the right of the enemy
      this.position.x += this.speed;
    }

    if (this.player.position.y < this.position.y) {
      // Player is above the enemy
      this.position.y -= this.speed;
    } else if (this.player.position.y > this.position.y) {
      // Player is below the enemy
      this.position.y += this.speed;
    }
  }
}
