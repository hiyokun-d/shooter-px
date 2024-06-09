export class CollisionBlock {
  position: { x: number, y: number }
  width: number
  height: number

  constructor({ position, width, height }: any) {
    this.position = position
    this.width = width;
    this.height = height
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx) {
      ctx.fillStyle = "rgba(255, 13, 0, 0.5)"
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
  }
}
