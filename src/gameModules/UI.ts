import gsap from "gsap";
import { player } from "../caller/playerConfig";
import { Player } from "../player";
//TODO: MAKE A AMMO INDICATOR

export class UI {
	player: Player;
	constructor() {
		this.player = player;
		this.previousDashAvailable = false;
	}

	draw() {
		document.addEventListener("DOMContentLoaded", () => {
			const mainUI = document.getElementById("UI");
			if (!mainUI) return;

			mainUI.innerHTML = `
<div class="health-bar">
<div class="health-bar-inner" id="health-bar-inner"></div>
</div>

<div class="stamina-bar">
<div class="stamina-bar-inner" id="stamina-bar-inner"></div>
</div>

       <div class="ammo-display" id="ammo-display">
	   <span id="ammo-count">Ammo can't be detected!</span>
	   <div class="reload-bar-inner" id="reload-bar-inner"></div>
        </div>
`;

			this.updateHealth();
			this.updateStamina();
			this.updateAmmo();
		});
	}

	update() {
		this.updateHealth();
		this.updateStamina();
		this.updateAmmo();
	}

	updateHealth() {
		const healthBarInner = document.getElementById("health-bar-inner");
		if (!healthBarInner) return;

		const healthPercentage =
			(this.player.health.health / this.player.health.maxHealth) * 100;
		healthBarInner.style.width = `${healthPercentage}%`;
	}

	updateStamina() {
		const staminaBarInner = document.getElementById("stamina-bar-inner");
		if (!staminaBarInner) return;

		const staminaPercentage =
			Math.round(this.player.dash.cooldown / this.player.dash.delay) * 100;
		staminaBarInner.style.width = `${staminaPercentage}%`;

		if (this.player.dash.available && !this.previousDashAvailable) {
			this.previousDashAvailable = true;
			gsap.to(staminaBarInner, {
				backgroundColor: "green",
				duration: 0.1,
				delay: 0.5,
				onComplete: () => {
					gsap.to(staminaBarInner, {
						backgroundColor: "white",
						duration: 0.1,
						delay: 0.2,
					});
				},
			});
		} else if (!this.player.dash.available) {
			this.previousDashAvailable = false;
		}
	}
	updateAmmo() {
		const ammoCount = document.getElementById("ammo-count");
		const ammoDisplay = document.getElementById("ammo-display");
		const ammoBar = document.getElementById("reload-bar-inner");

		if (!ammoCount) return;

		if (
			Player.ammo &&
			Player.ammo.currentAmmo !== undefined &&
			Player.ammo.maxAmmo !== undefined
		) {
			const formatAmmoCount = (count: number) => {
				return count < 10 ? `0${count}` : count;
			};

			ammoCount.textContent = this.player.checkAmmo(true)
				? `reload / ${Player.ammo.maxAmmo}`
				: `${formatAmmoCount(Player.ammo.currentAmmo)} / ${formatAmmoCount(
						Player.ammo.maxAmmo
				  )}`;

			if (
				this.player.isReloading ||
				ammoDisplay?.classList.contains("reload")
			) {
				gsap.to(ammoDisplay, {
					height: 45,
					duration: 0.05,
					ease: "back",
				});
				
				gsap.to(ammoBar, {
					width: this.player.currentReloadTime,
					duration: 0.5,
					background: "#fff",
				})
			} else {
				gsap.to(ammoDisplay, {
					height: 25,
					duration: 0.1,
					// delay: 0.5
				});
			}

			if (!ammoCount.textContent.includes("reload")) {
				ammoCount.parentElement?.classList.remove("reload");
				if (this.player.shooting && !this.player.isReloading) {
					this.player.shooting = false;
					gsap.to(ammoCount, {
						transform: "rotate(-20deg) translate(-25px)",
						yoyoEase: true,
						duration: 0.4,
						ease: "bounce.inOut",
						// delay: 0.3,
						onComplete() {
							gsap.to(ammoCount, {
								transform: "rotate(0deg)",
								onComplete() {
									gsap.to(ammoCount, {
										transform: "rotate(0deg) translate(0px)",
										duration: 0.3,
										ease: "bounce",
										delay: 0.2,
									});
								},
							});
						},
					});
				}
			} else {
				ammoCount.parentElement?.classList.add("reload");
			}
		} else {
			ammoCount.textContent = "Ammo Can't be detected";
		}
	}
}
