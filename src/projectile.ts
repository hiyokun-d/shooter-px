// TODO: MAKE THE PROJECTILE MORE FASTER
// TODO: detect when the pistol or image is at the back of the player and change the sprite as fast as it can

import { Sprite } from "./gameModules/spriteLoader";

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

  constructor({
    imageSrc,
    frameRate,
    animations,
    loop,
    animationID,
    frameBuffer
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

    this.doSomeDamage = false
    this.updateAngleImage = true
  }

  initializeMouse(Mouse: any) {
    this.mouse = Mouse;
  }

  drawCircle(ctx: CanvasRenderingContext2D) {
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
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

  getCursorPosition(player: any) {
    this.player = player; // Store the player object
    this.angle = Math.atan2(this.mouse.y - player.position.y, this.mouse.x - player.position.x);
    const distanceFromPlayer = 30;
    const offsetX = Math.cos(this.angle) * distanceFromPlayer + (player.width / 2);
    const offsetY = Math.sin(this.angle) * distanceFromPlayer + (player.height / 2);

    this.position.x = player.position.x + offsetX;
    this.position.y = player.position.y + offsetY;

    if (this.updateAngleImage) {
      this.angleImage = (this.angle * 180) / Math.PI;

      if (this.angleImage >= 95 || this.angleImage <= -92) {
        this.switchSprite(2)
        this.gunPosition = "left"
      } else {
        this.switchSprite(1)
        this.gunPosition = "right"
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  shoot(tempArray: Projectile[]) {
    const newProjectile = new Projectile({
      imageSrc: "./slime.png", // WE'LL CHANGE IT LATER
      frameRate: 4, // WE'LL CHANGE IT LATER
      loop: false,
      frameBuffer: 5
    });
    const angle = Math.atan2(this.mouse.y - this.player.position.y, this.mouse.x - this.player.position.x);

    const distanceFromPlayer = 30;
    const offsetX = Math.cos(angle) * distanceFromPlayer + (this.player.width / 2);
    const offsetY = Math.sin(angle) * distanceFromPlayer + (this.player.height / 2);

    newProjectile.position.x = this.player.position.x + offsetX;
    newProjectile.position.y = this.player.position.y + offsetY;

    newProjectile.velocity.x = 2 * Math.cos(angle);
    newProjectile.velocity.y = 2 * Math.sin(angle);

    newProjectile.initialDirection.x = newProjectile.velocity.x;
    newProjectile.initialDirection.y = newProjectile.velocity.y;
    newProjectile.width = 32
    newProjectile.height = 32
    newProjectile.angle = this.angleImage;
    newProjectile.rotationObject = true
    newProjectile.doSomeDamage = true


    tempArray.push(newProjectile);

    this.play()
    this.onComplete = () => {
      this.autoplay = false
      this.currentFrame = 0
    }
  }
}
