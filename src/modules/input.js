// Input module for Starfighter game
import $ from 'jquery';
import game from './game';

// Globals
const keysPressed = [];
const keysTapped = [];

game.$doc.keydown((e) => {
  if (!keysPressed[e.keyCode]) {
    keysTapped[e.keyCode] = true;
  }
  keysPressed[e.keyCode] = true;
});

game.$doc.keyup((e) => {
  keysPressed[e.keyCode] = false;
  keysTapped[e.keyCode] = false;
});

function down(key) {
  return keysPressed[key];
}

function tapped(key) {
  if (keysTapped[key]) {
    keysTapped[key] = false;
    return true;
  }
  return false;
}

const input = {
  down,
  tapped,
};

export default input;
