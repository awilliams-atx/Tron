# Tron

<!-- [live-demo]: http://example.com -->
[Wireframes]

## Project Breakdown

Tron is a classic arcade game for two players or one player and the computer. The goal is to survive as long as it takes for your opponent to lose a life. As players move, they leave behind them an impassable trail. Lives are lost when colliding with one of three things: the game boundary, either player's trail, or the other player himself.

The game is over when either player loses all their lives or both players lose their last life at the same time. In the event that both players lose their final life at the same time, the game is a draw.

### Minimum Viable Product

* Two player game
  * A computer AI would be great to build later, though!
* Game area
  * Boundary
* Player object
  * Color
    * Each player object and trail have a distinct color.
  * Movement
    * One square per turn
    * In the direction of the current velocity
      * Turning registers anytime via arrow-keys (in 2 player, also WASD) and happens on the next animation frame.
* Player trail
  * Appears each frame on the player's previous position.
    * Acts as a block of collide-able terrain
    * Has the player's color.
  * Collision
    * Colliding with the other player ends the turn.
      * Both players lose a life.
    * Colliding with either the wall or the other player ends the turn.
      * Colliding player loses a life.

### Wireframes

### Implementation Timeline

#### Phase I: Single moving LightCycle.

##### Set up

0. Add canvas tag to `index.html`
  * Set width and height attributes. (800x500).
  * Set the id to 'tron-canvas'
0. Create entry file

##### Empty `GameView`

0. Create, export a GameView class.
0. Accept ctx (the canvas) and a game.
  * Later, accept both Light Cycles.
0. Write `#start`
  * Call requestAnimationFrame passing in `#animate`.
  * Hint: bind `#animate`
0. Write `#animate`
  * Call `game` ivar `#step`, `#draw`
0. Color canvas (black)
0. Position canvas on the page
0. Add border (gray)

##### `Game#draw`

0. Create, export a `Game` class
0. Require it in `GameView`
0. Declare `Game.DIM_X`, `DIM_Y`, and `BG_COLOR`
0. Write constructor.
0. Write `#draw`.
  * Accept a context (ctx).
  * Clear the ctx rectangle.
  * Set the ctx fillStyle to black.
  * Fill the ctx rectangle.
0. Check: does the canvas draw on the page yet?

##### `LightCycle` constructor

0. Create, export a `LightCycle` class
  * Accept an gameOverOptions object of position, direction, and color.
0. Require it in `Game`
0. Call `#addLightCycles` in `Game` constructor
  * For now, just add a single `LightCycle`
0.

##### Add single `LightCycle` to `Game`
0. Set up an empty lightCycles ivar
0. Write `#addLightCycles`
  * For now, instantiate single LightCycle, passing in position [25, 10].
  * Set up direction [0, 1]
    * Later, the other LightCycle will start at [25, 60].
  * Call `#addLightCycles` from constructor.
    * Instantiate a single `LightCycle` and add it to a `lightCycles` ivar.
    * Return the `LightCycle`
0. Call `LightCycle#draw` on each cycle ivar inside `Game#draw`.


##### `LightCycle#draw`

0. Set the ctx fillStyle to the cycle's color ivar.
0. Fill a rectangle on the ctx.
  * Start at 10x each coordinate and fill in 10px east and south.





#### Phase II: Collisions

##### `LightCycle#move` (no keyboard control yet)

0. Move one space in the direction indicated by the ivar `direction`
  * Later, map keys to change direction

##### `Game#moveLightCycles`

* Call `#move` for each `LightCycle`

##### `Game#step` (no collisions yet)

* Call `#moveLightCycles`

##### `Game#isGameOver`

* Return an ivar `isGameOver`
  * Set this ivar in other functions that check for collisions etc.

##### `GameView#animate`

* If `Game#isGameOver`, call `GameView#endGame` (defined later)
* Otherwise, call `Game#step` followed by `Game#draw`, passing in ctx.

##### `LightCycle#isOutOfBounds`

* Check the coordinates of the light cycles against the dimensions of the game area. Return a boolean.
* For testing purposes, position the cycle near the edge.

##### `Game#checkCollisions` (cycle out of bounds)

0. Call `LightCycle#isOutOfBounds`
  * For testing, if a `LightCycle` is out of bounds, alert to that effect.
0. If any `LightCycle` has collided, set ivar `isGameOver` to `true`
  * Set an ivar gameOverOptions object with things like winner, message.

##### `GameView#endGame`

0. Cancel the animation frame.
  * See what happens. Is this the right way to go?
0. Draw a new black rectangle over the canvas with .5 opacity.
0. Draw another smaller rectangle in the middle.
  * In it, announce the winner and provide a restart button.
  * Construct a new `Game` object and call `GameView#animate`

##### `LightCycle#isCollidedWith` (cycle)

0. In `Game#addLightCycles`, add the other cycle.
  * Position it near the first cycle so they can quickly collide.
0. In `LightCycle#isCollidedWith`, accept a collidables object.
0. First, check for colliding directly with the other cycle.
0. If their positions are the same, set ivar `isGameOver` and `gameOverOptions`





#### Phase III: Trails

##### `Game#moveLightCycles`

* Store the cycle's position in an ivar object `trails` before moving it.
  * `trails` has coordinate keys and color values.

##### `Game#draw`

* Draw each `LightCycle` and each trail square.

##### `Game#checkCollisions` (trail)

* Add a key `trails` to the `collidables` object and pass all the trail blocks into `LightCycle#isCollidedWith`

##### `LightCycle#isCollidedWith` (trail)

* The only difference between colliding with a trail and the game area boundary is the message.

## Resources

* [Canvas tutorial](https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial?redirectlocale=en-US&redirectslug=Canvas_tutorial)
* [Canvas docs](https://developer.mozilla.org/en-US/docs/HTML/Canvas)
* [Legend](http://asteroids.aaronik.com/)
* [Legend](http://asteroidsdamacy.com/)
