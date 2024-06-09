class WallsGenerator {
  position: { x: number, y: number }
  width: number
  height: number

  constructor({ position }, width, height) {
    this.position = position
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx) {
      ctx.fillStyle = "blue"
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
  }
}

export function generate_walls(canvas: HTMLCanvasElement) {
  const wallThickness = 32; // Thickness of the walls
  let walls = [];

  // Top wall
  walls.push(new WallsGenerator({ position: { x: 0, y: 0 } }, canvas.width, wallThickness));

  // Left wall
  walls.push(new WallsGenerator({ position: { x: 0, y: 0 } }, wallThickness, canvas.height));

  // Bottom wall
  walls.push(new WallsGenerator({ position: { x: 0, y: canvas.height - wallThickness } }, canvas.width, wallThickness));

  // Right wall
  walls.push(new WallsGenerator({ position: { x: canvas.width - wallThickness, y: 0 } }, wallThickness, canvas.height));

  return walls;
}
