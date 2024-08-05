// complete this function :v

import { player } from "../caller/playerConfig";
import { canvas, collisionBlock } from "../main";
import { enemies_melee } from "./melee";

export let enemiesArray: Array<any> = [];

// Function to find a valid position for spawning an enemy
function findValidPosition() {
  let validPosition = false;
  let randomX = 0;
  let randomY = 0;
  let Position = { x: 0, y: 0 };

  while (!validPosition) {
    randomX = Math.random() * canvas.width;
    randomY = Math.random() * canvas.height;
    Position = { x: randomX, y: randomY };

    // 25 & 30 here is the width and height of the enemy hitbox
    const isOutOfCanvas = (
      randomX < 0 ||
      randomX + 20 > canvas.width ||
      randomY < 0 ||
      randomY + 30 > canvas.height
    )

    const collidesWithBlock = collisionBlock.some(block => {
      // 25 & 30 here is the width and height of the enemy hitbox
      return (
        randomX < block.position.x + block.width &&
        randomX + 25 > block.position.x &&
        randomY < block.position.y + block.height &&
        randomY + 30 > block.position.y
      );
    });

    const distanceFromPlayer = Math.sqrt(
      Math.pow(randomX - player.position.x, 2) + Math.pow(randomY - player.position.y, 2)
    );

    // Minimum distance from the player for spawning
    if (!isOutOfCanvas && !collidesWithBlock && distanceFromPlayer >= 50) {
      validPosition = true;
    }
  }

  return Position;
}

// Function to spawn an enemy at a valid position
function spawnEnemy() {
  const position = findValidPosition();
  enemiesArray.push(new enemies_melee({ player, CollisionBlocks: collisionBlock, Position: position }));
}

export function spawner() {
  // Initial enemy spawn
  spawnEnemy();

  // Spawn enemies at intervals
  // setInterval(() => {
  //   spawnEnemy();
  // }, 1000);
}
