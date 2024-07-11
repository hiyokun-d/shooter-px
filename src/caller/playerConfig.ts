import { Player } from "../player";

export const player = new Player({
  imageSrc: "/player.png",
  frameRate: 6,
  frameBuffer: 6,
  animations: {
    1: { // WALK UP
      id: 6,
      frameRate: 3,
      frameBuffer: 6,
      loop: true
    },
    2: { // WALK DOWN
      id: 7,
      frameRate: 3,
      frameBuffer: 4,
      loop: true
    },
    3: { // WALK LEFT
      id: 5,
      frameRate: 3,
      frameBuffer: 5,
      loop: true
    },
    4: { // WALK RIGHT
      id: 4,
      frameRate: 3,
      frameBuffer: 4,
      loop: true
    },

    /* IDLE */
    5: { //  IDLE UP
      id: 2,
      frameRate: 6,
      frameBuffer: 7,
      loop: true
    },
    6: { // IDLE DOWN
      id: 3,
      frameRate: 4,
      frameBuffer: 12,
      loop: true
    },
    7: { // IDLE LEFT
      id: 1,
      frameRate: 6,
      frameBuffer: 12,
      loop: true
    },
    8: { // IDLE RIGHT
      id: 0,
      frameRate: 6,
      frameBuffer: 6,
      loop: true
    }

  }
})
