// TODO: MAKE THE PROJECTILE MORE FASTER
// TODO: put some sprite sheet for Projectile (optional)

export class Projectile {
  mouse: { x: number, y: number };
  velocity: { x: number, y: number };
  fixedPosition: { x: number, y: number };
  angle: number;
  initialDirection: { x: number, y: number }

  constructor() {

    this.velocity = { x: 2, y: 2 }
    this.fixedPosition = { x: 0, y: 0 }
    this.initialDirection = { x: 0, y: 0 }
    this.mouse = {
      x: 0,
      y: 0,
    }
  }

  initializeMouse(Mouse: any) {
    this.mouse = Mouse
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.strokeStyle = "blue"
    ctx.arc(this.fixedPosition.x, this.fixedPosition.y, 10, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
  }

  getCursorPosition(player: any) {
    this.player = player
    this.angle = Math.atan2(this.mouse.y - player.position.y, this.mouse.x - player.position.x)
    const distanceFromPlayer = 30;
    const offsetX = Math.cos(this.angle) * distanceFromPlayer + (player.width / 2);
    const offsetY = Math.sin(this.angle) * distanceFromPlayer + (player.height / 2)

    this.fixedPosition.x = player.position.x + offsetX;
    this.fixedPosition.y = player.position.y + offsetY;
  }

  update() {
    this.fixedPosition.x += this.velocity.x;
    this.fixedPosition.y += this.velocity.y
  }

shoot(tempArray: Projectile[]) {
    const newProjectile = new Projectile();
    const angle = Math.atan2(this.mouse.y - this.player.position.y, this.mouse.x - this.player.position.x)

    const distanceFromPlayer = 30;
    const offsetX = Math.cos(angle) * distanceFromPlayer + (this.player.width / 2)
    const offsetY = Math.sin(angle) * distanceFromPlayer + (this.player.height / 2)

    newProjectile.fixedPosition.x = this.player.position.x + offsetX;
    newProjectile.fixedPosition.y = this.player.position.y + offsetY;

    newProjectile.velocity.x = 2 * Math.cos(angle)
    newProjectile.velocity.y = 2 * Math.sin(angle)

    newProjectile.initialDirection.x = newProjectile.velocity.x;
    newProjectile.initialDirection.y = newProjectile.velocity.y

    tempArray.push(newProjectile)
  }
}
