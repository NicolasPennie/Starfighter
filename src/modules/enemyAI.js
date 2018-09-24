// enemy AI module
import game from './game';

const INIT_VELO = 0.5;
const SPAWN_ANGLE_ERROR = Math.PI / 4;
const TURN_SPEED = 0.075; // (rad per refresh)
const TARGET_RADIUS = 200; // (px)
const FIRE_RADIUS = 400; // (px)
const FIRE_ANGLE = Math.PI / 8; // shoot when aim is within this angle (rad)
const FIRE_RATE = 750; // (ms)
const BULLET_SPEED = 5;
const MAX_VELO = 5;
const ACCEL = 0.3;

function norm(x) {
  return Math.sqrt((x[0] ** 2) + (x[1] ** 2));
}

function distance(x, y) {
  return norm([x[0] - y[0], x[1] - y[1]]);
}

// Angle between pos1 to pos2
function angle(pos1, pos2) {
  const x = pos2[0] - pos1[0];
  const y = pos2[1] - pos1[1];
  let ang;
  if (x >= 0 && y >= 0) {
    ang = Math.atan(y / x);
  } else if (x < 0 && y >= 0) {
    ang = Math.atan(-x / y) + (Math.PI / 2);
  } else if (x < 0 && y < 0) {
    ang = Math.atan(y / x) + Math.PI;
  } else {
    ang = Math.atan(x / -y) + ((3 / 2) * Math.PI);
  }
  return ang;
}

function run(chars, target) {
  chars.forEach((char) => {
    const charPos = char.getPos();
    const charDir = char.getDir();
    const targetPos = target.getPos();
    const dist = distance(charPos, targetPos);
    const aimAngle = angle(charPos, targetPos) - charDir;
    if (aimAngle > 0 && aimAngle <= Math.PI) {
      char.rotate(TURN_SPEED);
    } else if (aimAngle > 0 && aimAngle > Math.PI) {
      char.rotate(-TURN_SPEED);
    } else if (aimAngle < 0 && aimAngle > -Math.PI) {
      char.rotate(-TURN_SPEED);
    } else {
      char.rotate(TURN_SPEED);
    }
    if (dist < FIRE_RADIUS) {
      if (Math.abs(aimAngle) < FIRE_ANGLE) {
        char.shoot(FIRE_RATE, BULLET_SPEED);
      }
    }
    if (dist > TARGET_RADIUS) {
      char.accelerate(ACCEL);
      if (norm(char.getVelo()) > MAX_VELO) {
        char.accelerate(-ACCEL);
      }
    }
  });
}

function spawn() {
  // min is inclusive, max is exclusive
  function getRandomInt(min, max) {
    const minCiel = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCiel)) + minCiel;
  }
  const width = game.$win.width();
  const height = game.$win.height();
  const horzMidpoint = width / 2;
  const vertMidpoint = height / 2;
  let pos;
  let dir;
  // spawn enemy either to the left, top, right, or bottom of the scren (resp.)
  switch (getRandomInt(0, 4)) {
    case 0:
      // left
      pos = [-game.BUFFER, getRandomInt(0, height)];
      if (pos[1] > vertMidpoint) {
        dir = -Math.atan((pos[1] - vertMidpoint) / horzMidpoint);
      } else {
        dir = Math.atan((vertMidpoint - pos[1]) / horzMidpoint);
      }
      break;
    case 1:
      // top
      pos = [getRandomInt(0, width), height + game.BUFFER];
      if (pos[0] > horzMidpoint) {
        dir = Math.PI + Math.atan(vertMidpoint / (pos[0] - horzMidpoint));
      } else {
        dir = -Math.atan((horzMidpoint - pos[0]) / vertMidpoint);
      }
      break;
    case 2:
      // right
      pos = [width + game.BUFFER, getRandomInt(0, height)];
      if (pos[1] > vertMidpoint) {
        dir = Math.PI + Math.atan((pos[1] - vertMidpoint) / horzMidpoint);
      } else {
        dir = Math.PI - Math.atan((vertMidpoint - pos[1]) / horzMidpoint);
      }
      break;
    default:
      // bottom
      pos = [getRandomInt(0, width), -game.BUFFER];
      if (pos[0] > horzMidpoint) {
        dir = Math.PI - Math.atan(vertMidpoint / (pos[0] - horzMidpoint));
      } else {
        dir = Math.atan(vertMidpoint / (horzMidpoint - pos[0]));
      }
      break;
  }
  dir += (Math.random() * SPAWN_ANGLE_ERROR) - (SPAWN_ANGLE_ERROR / 2);
  const velo = [INIT_VELO * Math.cos(dir), INIT_VELO * Math.sin(dir)];
  return game.enemy(pos, velo, dir);
}

const enemyAI = {
  spawn,
  run,
};

export default enemyAI;
