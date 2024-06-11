import { player } from "../caller/playerConfig";
import { projectile } from "../caller/projectileConfig";

let keys = {
	up: false,
	down: false,
	right: false,
	left: false,
	dash: false,
	reload: false,
};

addEventListener("keydown", (e) => {
	switch (e.keyCode) {
		case 65:
			keys.left = true;
			break;
		case 68:
			keys.right = true;
			break;
		case 87:
			keys.up = true;
			break;
		case 83:
			keys.down = true;
			break;
		default:
			break;
	}

	if (e.keyCode == 81 && !keys.dash) {
		keys.dash = true;
	}

	if (e.keyCode == 82 && !keys.reload) {
		keys.reload = true;
	}
});

addEventListener("keyup", (e) => {
	switch (e.keyCode) {
		case 65:
			keys.left = false;
			break;
		case 68:
			keys.right = false;
			break;
		case 87:
			keys.up = false;
			break;
		case 83:
			keys.down = false;
			break;
		default:
			break;
	}
});

type Mouse = {
	x: number;
	y: number;
};
let mouse: Mouse = {
	x: 0,
	y: 0,
};

addEventListener("mousemove", (e) => {
	if (mouse) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;

		projectile.initializeMouse(mouse);
	}
});

addEventListener("click", () => {
  if(!player.checkAmmo(true)) {
    player.shooting = true
  }
	player.shoot();
});

export { keys, mouse };
