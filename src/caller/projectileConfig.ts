import { Projectile } from "../projectile";

export const projectile = new Projectile({
  imageSrc: "./pistol.png",
  frameRate: 2,
  frameBuffer: 2,
  animations: {
    1: { // RIGHT POSITION PISTOL 
      id: 0,
      frameRate: 2,
      frameBuffer: 5,
      loop: false
    },
    2: { // LEFT POSITION PISTOL
      id: 1,
      frameRate: 2,
      frameBuffer: 5,
      loop: false
    },

    3: { // LEFT OUT OF AMMO
      id: 2,
      frameRate: 2,
      frameBuffer: 5,
      loop: false
    },

    4: { // RIGHT OUT OF AMMO
      id: 3,
      frameRate: 2,
      frameBuffer: 5,
      loop: false
    }
  }
});
