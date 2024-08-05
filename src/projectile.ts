// TODO: REMOVE THE PROJECTILE WHEN IT'S COLLIDE WITH OBJECT OR OUT OF CANVAS

import { CollisionBlock } from "./gameModules/collision";
import { Sprite } from "./gameModules/spriteLoader";
import { Player } from "./player";

export class Projectile extends Sprite {
  mouse: { x: number, y: number };
  velocity: { x: number, y: number };
  position: { x: number, y: number };
  angle: number;
  initialDirection: { x: number, y: number };
  player: any; // Add this to store the player object
  gunPosition: "left" | "right"
  doSomeDamage: boolean
  updateAngleImage: boolean
  speed: number
  collisionBlocks: Array<CollisionBlock>
  radius: number

  constructor({
    imageSrc,
    frameRate,
    animations,
    loop,
    animationID,
    frameBuffer,
    CollisionBlocks = []
  }) {
    super({ imageSrc, frameRate, animations, loop, animationID, frameBuffer });
    this.velocity = { x: 2, y: 2 };
    this.position = { x: 0, y: 0 };
    this.initialDirection = { x: 0, y: 0 };
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.width = 32;
    this.height = 26;
    this.autoplay = false
    this.rotationObject = true
    this.loop = false
    this.gunPosition = "left"
    this.speed = 5

    this.doSomeDamage = false
    this.updateAngleImage = true
    this.collisionBlocks = CollisionBlocks
    this.radius = 5
  }

  initializeMouse(Mouse: any) {
    this.mouse = Mouse;
  }

  drawCircle(ctx: CanvasRenderingContext2D) {
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
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

  checkForHorizontalCollision(triggerMode: boolean) {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      const circle = {
        x: this.position.x,
        y: this.position.y,
        radius: this.radius
      }

      let closestX = Math.max(collisionBlock.position.x, Math.min(circle.x, collisionBlock.position.x + collisionBlock.width))
      let closestY = Math.max(collisionBlock.position.y, Math.min(circle.y, collisionBlock.position.y + collisionBlock.height))

      const distanceX = circle.x - closestX;
      const distanceY = circle.y - closestY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      if (distance < circle.radius) {
        if (triggerMode) {
          return true;
        }

        if (this.velocity.x < 0) {
          const offset = circle.x - this.position.x;
          this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.05
          this.velocity.x = 0
          break;
        }

        if (this.velocity.x > 0) {
          const offset = circle.x - this.position.x;
          this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.05;
          this.velocity.x = 0
          break
        }
      }
    }
  }

  checkForVerticalCollision(triggerMode: boolean) {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      const circle = {
        x: this.position.x,
        y: this.position.y,
        radius: this.radius
      }

      let closestX = Math.max(collisionBlock.position.x, Math.min(circle.x, collisionBlock.position.x + collisionBlock.width))
      let closestY = Math.max(collisionBlock.position.y, Math.min(circle.y, collisionBlock.position.y + collisionBlock.height))

      const distanceX = circle.x - closestX;
      const distanceY = circle.y - closestY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      if (distance < circle.radius) {
        if (triggerMode) {
          return true;
        }

        if (this.velocity.y < 0) {
          const offset = circle.y - this.position.y;
          this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.05
          this.velocity.y = 0
          break;
        }

        if (this.velocity.y > 0) {
          const offset = circle.y - this.position.y;
          this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.05;
          this.velocity.y = 0
          break
        }
      }
    }
  }

  getCursorPosition(player: any) {
    this.player = player;
    this.angle = Math.atan2(this.mouse.y - player.position.y, this.mouse.x - player.position.x);
    const distanceFromPlayer = 30;
    const offsetX = Math.cos(this.angle) * distanceFromPlayer + (player.width / 2);
    const offsetY = Math.sin(this.angle) * distanceFromPlayer + (player.height / 2);

    this.position.x = player.position.x + offsetX;
    this.position.y = player.position.y + offsetY;

    if (this.updateAngleImage) {
      this.angleImage = (this.angle * 180) / Math.PI;

      if (Player.ammo.currentAmmo !== 0) {
        if (this.angleImage >= 95 || this.angleImage <= -92) {
          this.switchSprite(2)
          this.gunPosition = "left"
        } else {
          this.switchSprite(1)
          this.gunPosition = "right"
        }
      } else {
        if (this.angleImage >= 95 || this.angleImage <= -92) {
          this.switchSprite(3)
          this.gunPosition = "left"
        } else {
          this.switchSprite(4)
          this.gunPosition = "right"
        }
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.checkForHorizontalCollision()
    this.position.y += this.velocity.y;
    this.checkForVerticalCollision()
  }

  shoot(tempArray: Projectile[]) {
    const newProjectile = new Projectile({
      imageSrc: "./projectile.png",
      loop: false,
    });
    const angle = Math.atan2(this.mouse.y - this.player.position.y, this.mouse.x - this.player.position.x);

    const distanceFromPlayer = 45;
    const offsetX = Math.cos(angle) * distanceFromPlayer + (this.player.width / 2);
    const offsetY = Math.sin(angle) * distanceFromPlayer + (this.player.height / 2);

    newProjectile.position.x = this.player.position.x + offsetX;
    newProjectile.position.y = this.player.position.y + offsetY;

    newProjectile.velocity.x = this.speed * Math.cos(angle);
    newProjectile.velocity.y = this.speed * Math.sin(angle);

    newProjectile.initialDirection.x = newProjectile.velocity.x;
    newProjectile.initialDirection.y = newProjectile.velocity.y;
    newProjectile.width = 11
    newProjectile.height = 10
    newProjectile.angleImage = this.angleImage
    newProjectile.rotationObject = true
    newProjectile.doSomeDamage = true
    newProjectile.updateAngleImage = true


    tempArray.push(newProjectile);


    this.play()
    this.updateAngleImage = false;
    if (this.gunPosition == "left") {
      this.angleImage += 20
    } else this.angleImage -= 20, 50

    this.onComplete = () => {
      this.autoplay = false
      this.currentFrame = 0
      this.updateAngleImage = true
    }
  }

  deleteProjectile(tempArray: Array<Projectile>) {
    if (!tempArray.length) return;

    for (let i = tempArray.length - 1; i >= 0; i--) {
      tempArray.splice(i, 1);
    }
  }
}
