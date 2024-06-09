import { CollisionBlock } from "../gameModules/collision"

// INFO!
// MAP CONFIG: 
// map size: 50px (width and height)
// tile size each: 16px

const parse2D = function() {
  const rows: Array<any> = []
  // 50  IS THE MAP TILE PIXEL EACH
  for (let i = 0; i < this.length; i += 50) {
    rows.push(this.slice(i, i + 50))
  }

  return rows
}

const createObjectsFrom2D = function(canvas: HTMLCanvasElement, collisionData: number[][], ID: number) {
  const objects: Array<CollisionBlock> = [];
  const tileSize = 16;

  const createObjects = () => {
    objects.length = 0; // Clear the objects array
    const rows = collisionData.length;
    const cols = collisionData[0].length;
    const scaledTileWidth = canvas.width / cols;
    const scaledTileHeight = canvas.height / rows;

    collisionData.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === ID) {
          const positionX = x * scaledTileWidth;
          const positionY = y * scaledTileHeight;
          objects.push(new CollisionBlock({
            position: {
              x: positionX,
              y: positionY
            },
            width: scaledTileWidth,
            height: tileSize // Adjust height as needed
          }));
        }
      });
    });
  };

  // Initialize objects
  createObjects();

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createObjects();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      objects.forEach(object => object.draw(ctx));
    }
  };
  handleResize()
  // Attach resize event listener
  window.addEventListener('resize', handleResize);

  return objects;
};

export { createObjectsFrom2D, parse2D }
