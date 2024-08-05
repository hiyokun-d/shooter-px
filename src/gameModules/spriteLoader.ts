// IF IT'S WORKING THEN DON'T DO ANYTHING ABOUT
// CAUSE I WAS WORKING WITH THIS LIKE 2 DAYS 
// AND FINALLY IT GOT WORK AND DON'T CHANGE ANYTHING
// OR EVEN ADDING A SINGLE COMMENT CAUSE IT WILL BROKE
// :(

// TODO: STILL DO SOME UPDATE WITH THIS LOADER 

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
  angleImage: number
  rotationObject: boolean
  onComplete: Function
  isCompleted: boolean
  custom_position: boolean
  custom: object

  constructor({ position, imageSrc, animations, frameRate = 1, animationID = 0, frameBuffer = 3, loop = true, autoplay = true }) {
    this.position = position
    this.image = new Image()
    this.loaded = false

    this.image.onload = () => {
      this.loaded = true
    }

    this.onComplete = () => { return }

    this.custom_position = false
    
    this.custom = {
      position: {
        x: 0,
        y: 0
      }
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
    this.angleImage = 0
    this.rotationObject = false
    this.isCompleted = false

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

    ctx.save(); // Save the current context state

    if(this.custom_position) {
      if (this.rotationObject) {
        ctx.translate(this.custom.position.x, this.custom.position.y); // Move the context origin to the center of the image
        ctx.rotate((this.angleImage * Math.PI) / 180); // Rotate the context by the angle in radians
      } else {
        ctx.translate(this.custom.position.x + this.width / 2, this.custom.position.y + this.height / 2); // Move the context origin to the center of the image
        ctx.rotate((this.angleImage * Math.PI) / 180); // Rotate the context by the angle in radians
      }
  
      ctx.drawImage(
        this.image,
        cropBox.position.x, cropBox.position.y, cropBox.width, cropBox.height,
        -this.width / 2, -this.height / 2, // Adjust the drawing position to account for the translation
        this.width, this.height
      );
    }

    if (this.rotationObject) {
      ctx.translate(this.position.x, this.position.y); // Move the context origin to the center of the image
      ctx.rotate((this.angleImage * Math.PI) / 180); // Rotate the context by the angle in radians
    } else {
      ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2); // Move the context origin to the center of the image
      ctx.rotate((this.angleImage * Math.PI) / 180); // Rotate the context by the angle in radians
    }

    ctx.drawImage(
      this.image,
      cropBox.position.x, cropBox.position.y, cropBox.width, cropBox.height,
      -this.width / 2, -this.height / 2, // Adjust the drawing position to account for the translation
      this.width, this.height
    );

    ctx.restore(); // Restore the context to its original state
    this.updateFrames()
  }

  play() {
    this.autoplay = true
  }

  updateFrames() {
    let animationTimeout;
    if (!this.autoplay) return;
    this.elapsedFrame++

    if (this.elapsedFrame % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++

        animationTimeout = setTimeout(() => {
          this.isCompleted = true
        }, 50)
      }
      else if (this.loop) this.currentFrame = 0
    }

    if (this.onComplete && this.isCompleted) {
      if (this.currentFrame === this.frameRate - 1) {
        this.onComplete()
        this.isCompleted = false
        clearTimeout(animationTimeout)
      }
    }
  }
}
