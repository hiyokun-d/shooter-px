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

const canvas: HTMLCanvasElement = document.getElementById("canvas")
const ctx: CanvasRenderingContext2D | null = canvas?.getContext("2d")

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
})

//? change the projectile variable cause javascript is sucks and my code is sucks
let projectileArrayTest: Array<any> = []

let parser = parse2D.call(data.mapBambang)
let collisionBlock = createObjectsFrom2D(canvas, parser, 924)
player.collisionBlocks = collisionBlock

let enemy = new enemies_melee({ player })
enemy.collisionBlocks = collisionBlock

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

  if (player.loaded) {
    player.draw(ctx);
    player.drawRect(ctx);
    player.update();
  }

  enemy.draw(ctx);
  enemy.update();

  ui.update();
}

game();
