// IF IT'S WORKING THEN DON'T DO ANYTHING ABOUT
// CAUSE I WAS WORKING WITH THIS LIKE 2 DAYS 
// AND FINALLY IT GOT WORK AND DON'T CHANGE ANYTHING
// OR EVEN ADDING A SINGLE COMMENT CAUSE IT WILL BROKE
// :(

export class Sprite {
  position: { x: number, y: number }
  image: HTMLImageElement
  loaded: boolean
  width: number
  height: number
  frameRate: number
  currentFrame: number
  elapsedFrame: number
  frameBuffer: number
  animations: any
  loop: boolean
  autoplay: boolean
  currentAnimation: any
  animationID: number

  constructor({ position, imageSrc, animations, frameRate = 1, animationID = 0, frameBuffer = 3, loop = true, autoplay = true }) {
    this.position = position
    this.image = new Image()
    this.loaded = false

    this.image.onload = () => {
      this.loaded = true
      this.width = 32
      this.height = 32
    }

    this.image.src = imageSrc
    this.frameRate = frameRate
    this.currentFrame = 0
    this.elapsedFrame = 0
    this.frameBuffer = frameBuffer
    this.animations = animations
    this.loop = loop
    this.autoplay = autoplay
    this.currentAnimation;
    this.animationID = animationID

    if (this.animations) {
      for (let key in this.animations) {
        const image = new Image()
        this.animations[key].image = image
        image.src = this.animations[key].imageSrc
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.loaded) return;
    const cropBox = {
      position: {
        x: this.width * this.currentFrame,
        y: this.height * this.animationID
      },
      width: this.width,
      height: this.height
    }

    ctx.drawImage(this.image, cropBox.position.x, cropBox.position.y, cropBox.width, cropBox.height, this.position.x, this.position.y, this.width, this.height)
    this.updateFrames()
  }

  play() {
    this.autoplay = true
  }

  updateFrames() {
    if (!this.autoplay) return;
    this.elapsedFrame++

    if (this.elapsedFrame % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      else if (this.loop) this.currentFrame = 0
    }

    if (this.currentAnimation?.onComplete) {
      if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive) {
        this.currentAnimation.onComplete()
        this.currentAnimation.isActive = true
      }
    }
  }
}
