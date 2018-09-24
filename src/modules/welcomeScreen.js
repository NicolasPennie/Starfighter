// WelcomeScreen module for Starfighter game
import $ from 'jquery';
import game from './game';
import input from './input';
import gameScreen from './gameScreen';

// jQuery objects
const title = $('<p id="title">Starfighter</p>');
const instruction = $('<p>Press SPACE to begin</p>');

// Globals
let screen;

function load() {
  game.$box.append(title, instruction);
  screen = setInterval(() => {
    if (input.down(game.SPACE_BAR)) {
      clearInterval(screen);
      game.$box.empty();
      gameScreen.load();
    }
  }, game.REFRESH);
}

const welcomeScreen = {
  load,
};

export default welcomeScreen;
