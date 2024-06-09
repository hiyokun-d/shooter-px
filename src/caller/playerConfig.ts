import { Player } from "../player";

export const player = new Player({
  imageSrc: "/slime.png",
  frameRate: 4,
  frameBuffer: 5,
  animations: {
    1: { // WALK UP
      id: 11,
      frameRate: 3,
      frameBuffer: 5,
      loop: true
    },
    2: { // WALK DOWN
      id: 3,
      frameRate: 4,
      frameBuffer: 7,
      loop: true
    },
    3: { // WALK LEFT
      id: 3,
      frameRate: 6,
      frameBuffer: 4,
      loop: true
    },
    4: { // WALK RIGHT
      id: 10,
      frameRate: 3,
      frameBuffer: 4,
      loop: true
    },
    5: {
      id: 2,
      frameRate: 4,
      frameBuffer: 3,
      loop: true
    },
    6: {
      id: 0,
      frameRate: 4,
      frameBuffer: 3,
      loop: true
    },
    7: {
      id: 11,
      frameRate: 3,
      frameBuffer: 3,
      loop: true
    },
    8: {
      id: 1,
      frameRate: 4,
      frameBuffer: 4,
      loop: true
    }

  }
})
