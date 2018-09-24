// Game module for Starfighter game
import $ from 'jquery';

// Game parameters
const REFRESH = 20; // refresh time (ms)
const BUFFER = 5; // maximum offscreen distance before teleporting (px)
const ACCEL = 0.1; // acceleration (px per (refresh time)^2)
const ANGLE = 0.1; // rotate angle (rad)
const BULLET_SPEED = 7; // (px per refrsh time)
const BULLET_LIFE = 1500; // (ms)
const FIRE_RATE = 100; // (ms)

//  Key codes
const SPACE_BAR = 32;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;

// JQuery objects
const $doc = $(document);
const $win = $(window);
const $box = $('#gamebox');
const $hero = $('<img class="char" src="sprites/hero.png">');

// HTML
const HERO_BULLET = '<img class="bullet" src="sprites/Blue/bullet.png">';
const ENEMY_BULLET = '<img class="bullet" src="sprites/Red/bullet_red.png">';
const ENEMY_HTML = '<img class="char" src="sprites/enemy2.png">';

const element = ($id) => {
  const pos = [0, 0];
  const velo = [0, 0];
  let dir;
  return ({
    $id,
    setPos(newPos) {
      pos[0] = newPos[0];
      pos[1] = newPos[1];
    },
    getPos() {
      return pos.slice();
    },
    setVelo(newVelo) {
      velo[0] = newVelo[0];
      velo[1] = newVelo[1];
    },
    getVelo() {
      return velo.slice();
    },
    accelerate(acl = ACCEL) {
      velo[0] += acl * Math.cos(dir);
      velo[1] += acl * Math.sin(dir);
    },
    setDir(angle) {
      dir = angle % (Math.PI * 2);
      if (dir < 0) {
        dir += Math.PI * 2;
      }
    },
    getDir() {
      return dir;
    },
    move() {
      pos[0] += velo[0];
      pos[1] += velo[1];
      if (pos[0] > $win.width() + BUFFER) {
        pos[0] = -BUFFER;
      } else if (pos[0] < -BUFFER) {
        pos[0] = $win.width() + BUFFER;
      }
      if (pos[1] > $win.height() + BUFFER) {
        pos[1] = -BUFFER;
      } else if (pos[1] < -BUFFER) {
        pos[1] = $win.height() + BUFFER;
      }
    },
    rotate(angle) {
      dir += angle;
      if (dir > 2 * Math.PI) {
        dir %= 2 * Math.PI;
      } else if (dir < 0) {
        dir %= 2 * Math.PI;
        dir += 2 * Math.PI;
      }
    },
    animate() {
      const left = Math.round(pos[0]) - ($id.width() / 2);
      const top = $win.height() - (Math.round(pos[1]) + ($id.height() / 2));
      $id.css({ left, top });
      const shiftString = `rotate(${-dir + (Math.PI / 2)}rad)`;
      $id.css({ '-webkit-transform': shiftString });
    },
    remove() {
      $id.remove();
    },
  });
};

function checkForHit(item, target) {
  const itemPos = item.getPos();
  const targetPos = target.getPos();
  if (Math.abs(itemPos[0] - targetPos[0]) < target.$id.width() / 2) {
    if (Math.abs(itemPos[1] - targetPos[1]) < target.$id.height() / 2) {
      return true;
    }
  }
  return false;
}

function checkForCollision(chars) {
  let hit = false;
  chars.forEach((x) => {
    if (checkForHit(x, this)) {
      hit = true;
    }
  });
  return hit;
}

const gun = (bulletHTML) => {
  const shotsFired = [];
  let loaded = true;
  return {
    shoot(fireRate = FIRE_RATE, bulletSpeed = BULLET_SPEED, bulletLife = BULLET_LIFE) {
      if (loaded) {
        const $bullet = $(bulletHTML);
        $box.append($bullet);
        const bullet = Object.assign(Object.create(element($bullet)), {
          checkForCollision,
        });
        const bulletPos = this.getPos();
        const bulletVelo = this.getVelo();
        const bulletDir = this.getDir();
        bulletPos[0] += (this.$id.width() / 2) * Math.cos(bulletDir);
        bulletPos[1] += (this.$id.height() / 2) * Math.sin(bulletDir);
        bulletVelo[0] += bulletSpeed * Math.cos(bulletDir);
        bulletVelo[1] += bulletSpeed * Math.sin(bulletDir);
        bullet.setPos(bulletPos);
        bullet.setVelo(bulletVelo);
        bullet.setDir(bulletDir);
        shotsFired.push(bullet);
        loaded = false;
        setTimeout(() => {
          // remove bullet from array
          shotsFired.splice(shotsFired.indexOf(bullet), 1);
          bullet.remove();
        }, bulletLife);
        setTimeout(() => {
          loaded = true;
        }, fireRate);
      }
    },
    updateBullets() {
      shotsFired.forEach((bullet) => {
        bullet.move();
        bullet.animate();
      });
    },
    targetsHit(chars) {
      const charsHit = [];
      shotsFired.forEach((bullet) => {
        chars.forEach((char) => {
          if (checkForHit(bullet, char)) {
            charsHit.push(char);
          }
        });
      });
      return charsHit;
    },
    getShotsFired() {
      return shotsFired;
    },
  };
};

const char = ($id, pos, velo, dir) => {
  const newChar = Object.assign(Object.create(element($id)), {
    checkForCollision,
  });
  newChar.setPos(pos);
  newChar.setVelo(velo);
  newChar.setDir(dir);
  newChar.animate();
  return newChar;
};

const hero = (pos = [$win.width() / 2, $win.height() / 2], velo = [0, 0], dir = Math.PI / 2) => {
  const newHero = Object.assign(char($hero, pos, velo, dir), gun(HERO_BULLET));
  $box.append($hero);
  return newHero;
};

const enemy = (pos = [$win.width() / 2, $win.height() / 2], velo = [0, 0], dir = Math.PI / 2) => {
  const $enemy = $(ENEMY_HTML);
  const newEnemy = Object.assign(char($enemy, pos, velo, dir), gun(ENEMY_BULLET));
  $box.append($enemy);
  return newEnemy;
};

// final module
const game = {
  $doc,
  $win,
  $box,
  REFRESH,
  SPACE_BAR,
  LEFT_ARROW,
  UP_ARROW,
  RIGHT_ARROW,
  BUFFER,
  ANGLE,
  hero,
  enemy,
};

export default game;
