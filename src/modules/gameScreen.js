// GameScreen module for Starfighter game
import game from './game';
import input from './input';
import enemyAI from './enemyAI';
import welcomeScreen from './welcomeScreen';

// globals
let screen;
let hero;
let enemies = [];
let timeouts = [];
const leftoverBullets = []; // bullets fired from dead char

// constants
const INIT_SPAWN_RATE = 5000; // (ms)
const SPAWN_RATE_MULTIPLIER = 0.9; // (%) effective decrease in spawn time

function playerDeath() {
  clearInterval(screen);
  timeouts.forEach((t) => {
    clearTimeout(t);
  });
  enemies = [];
  timeouts = [];
  game.$box.empty();
  welcomeScreen.load();
}

function kill(enemy) {
  // remove enemy from array
  enemies.splice(enemies.indexOf(enemy), 1);
  enemy.remove();
}

function spawnNewEnemy(time) {
  enemies.push(enemyAI.spawn());
  const spawnTimer = setTimeout(() => {
    spawnNewEnemy(time * SPAWN_RATE_MULTIPLIER);
  }, time);
  timeouts.push(spawnTimer);
}

function updateElements() {
  // update all game elements
  hero.move();
  hero.animate();
  hero.updateBullets();
  enemies.forEach((enemy) => {
    enemy.move();
    enemy.animate();
    enemy.updateBullets();
  });
  leftoverBullets.forEach((bullet) => {
    bullet.move();
    bullet.animate();
  });
}

function userInput() {
  if (input.down(game.LEFT_ARROW)) {
    hero.rotate(game.ANGLE);
  }
  if (input.down(game.UP_ARROW)) {
    hero.accelerate();
  }
  if (input.down(game.RIGHT_ARROW)) {
    hero.rotate(-game.ANGLE);
  }
  if (input.tapped(game.SPACE_BAR)) {
    hero.shoot();
  }
}

function update() {
  updateElements();
  // Player hit by bullet
  enemies.forEach((enemy) => {
    if (enemy.targetsHit([hero])[0] === hero) {
      playerDeath();
    }
  });
  // Player collide with enemy
  if (hero.checkForCollision(enemies)) {
    playerDeath();
  }
  // Bullets of dead enemy kills player
  leftoverBullets.forEach((bullet) => {
    if (bullet.checkForCollision([hero])) {
      playerDeath();
    }
  });
  // Player hit enemy
  hero.targetsHit(enemies).forEach((enemy) => {
    enemy.getShotsFired().forEach((bullet) => {
      leftoverBullets.push(bullet);
    });
    kill(enemy);
  });
}

function load() {
  hero = game.hero();
  screen = setInterval(() => {
    userInput();
    enemyAI.run(enemies, hero);
    update();
  }, game.REFRESH);
  spawnNewEnemy(INIT_SPAWN_RATE);
}

const gameScreen = {
  load,
};

export default gameScreen;
