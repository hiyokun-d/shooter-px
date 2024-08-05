// TODO: CLEAN THIS CODE!

import './style.css'
import { keys } from "./gameModules/evenListener"
import { player } from './caller/playerConfig.ts'
import { projectile } from './caller/projectileConfig.ts'
import { resources } from './gameModules/resources'
import * as data from "./collisionManagement/collisionData.json"
import { parse2D, createObjectsFrom2D } from './collisionManagement/parserArray'
import { enemies_melee } from './enemies/melee'
import { UI } from './gameModules/UI'
import { enemiesArray, spawner } from './enemies/spawner.ts'

export const canvas: HTMLCanvasElement = document.getElementById("canvas")
const ctx: CanvasRenderingContext2D | null = canvas?.getContext("2d")

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
})


let parser = parse2D.call(data.newMapData)
//TUTORIAL MAP ID: 924
//MAIN MAP ID = 73
export let collisionBlock = createObjectsFrom2D(canvas, parser, 73)
player.collisionBlocks = collisionBlock
// let enemy = new enemies_melee({ player })
// enemy.collisionBlocks = collisionBlock

let ui = new UI()

ui.draw()
function game() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const map = resources.images.map;
  if (map.isLoaded) {
    ctx?.drawImage(map.image, 0, 0, canvas.width, canvas.height);
  }

  collisionBlock.forEach((key) => key.draw(ctx));

  requestAnimationFrame(game);
  player.handleEventKeys(keys);

  enemiesArray.forEach(enemy => {
    enemy.drawCollision(ctx);
    enemy.draw(ctx)
    enemy.update();
    enemy.play()
    enemy.canMove = true
  })

  if (player.loaded) {
    player.draw(ctx);
    player.drawRect(ctx);
    player.update();
  }

  ui.update();
}
// console.log(enemy)

console.log(projectile)

game();
spawner()
