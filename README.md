# Tron

Grab a friend and start your light cycle engines--it's time to play _Tron_!

## Game

### How to play

You and your opponent are light cycle riders trapped inside a virtual computer world, and there's only one way out--and only one will leave.

Escape this virtual world by being the last rider riding.

* **Do not collide into the walls.**
* **Do not collide into your opponent's trail.**

### Keys

|            |Player 1  |Player 2  |
|------------|----------|----------|
|**Movement**|w a s d   |arrow keys|

**New game / Pause:** space

### Tips

* Your light cycle leaves behind it a permanent, impassable trail. Colliding into the train causes a player to lose the game.
* Avoid becoming trapped inside your opponent's trail.

### Future of this game

* **Choose your own color**
* **Move memory**
  * The game will remember player moves input faster than the internal tick of the game.
* **Power-ups**
* **Random events**
* **Tournament mode**


## Implementation details

### Animation

* Gameplay animation is rendered with HTML5 canvas tag.
* Menu animation is rendered with CSS3 styles.

### Fade to black

In between the the main menu, the instructions menu, and gameplay, the game has a half-second fade-out-and-back-in effect. This is all done in HTML and CSS. A div stretches across the canvas and transitions between 0, 1, and back to 0 opacity by having its class property set and reset. Setting its display property to 'none' throws a wrench in things, which is explained below.

```css
.transparent-block {
  display: block;
  opacity: 0;
}

.fade-in {
  transition: opacity .249s ease; /* Timing indicates the 'wrench' problem */
  opacity: 0;
}

.fade-out {
  display: block;
  transition: opacity .25s ease;
  opacity: 1;
}

.nowhere {
  display: none; /* This is the problem */
  opacity: 0;
}
```

Setting `display: none` is important for a game to play well with other elements on the page and for the game itself to run smoothly. Without this property set, an on-top 'screen-fader' div as Tron has would block all other elements of the game from user clicks, like the menu items.

#### Resources

Canvas
Sass
