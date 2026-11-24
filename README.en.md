# Fusion stellaire (Stellar Fusion)

A sliding and merging tiles game: on each move, every tile slides the same way, and two identical celestial bodies that meet merge into the next one. From dust to a black hole, without filling the grid.

*Version française : [README.md](README.md)*

## Grid shapes (new in 1.3.0)

Four new grids in the menu: **Ring** (5 × 5 without the middle cell), **Cross** (5 × 5 without the corners), **Wide space** (6 × 6) and **Hourglass** (6 × 6 diamond). Empty cells never move, never break and cut lines like debris. Each shape has its own record.

## Controls

- **Arrows**, **ZQSD** (WASD on QWERTY) or **drag with the mouse**: every tile slides that way.
- **U** or **Undo**: undoes the last move.
- **T** or **Wormhole**: click two tiles to swap them.
- **P** or **Escape**: pause.
- **Gamepad**: the d-pad or stick to slide, **X** to undo, **Y** for the wormhole (the d-pad moves a cursor, **A** takes the tile, **B** cancels), **A** or **Start** to play again, **Start** to pause.
- **Full screen**: the button of the same name; Escape to leave it. Outside full screen, the game takes the height of the window.

## Rules

- After each move, a new body appears in a free cell (usually dust, sometimes a pebble).
- Two identical bodies that meet while sliding merge into the next one, once per move: they spin towards each other, pull together, then burst into sparks the colour of the new body. The merge sound rises by a note at each step, and a rumble goes with stars and beyond; the slide itself sounds higher when big bodies are in play.
- Every body has its own drawing, big and bright, to recognise it at a glance: a cloud of sparks, a stone, an asteroid pitted with craters, a comet with a long tail, a moon, a blue planet with green continents, a ringed planet, a striped giant with a red spot, a shining star, a supernova, a black hole and its disc of light.
- The ladder: dust → pebble → asteroid → comet → moon → planet → ringed planet → gas giant → star → supernova → black hole.
- **Debris** does not move or merge: it cuts the line into pieces that slide on their own, and it **breaks** when a merge happens right next to it.
- The game ends when no move is possible.

## Powers

Undo and the wormhole have limited charges. You earn one charge of each **every 150 moves** and each time you form a **black hole**.

## Points

Each merge is worth more the bigger the resulting body: 4 points for a pebble, 8 for an asteroid, doubling at each step.

## Game modes

- **Galaxy** (5 × 5) and **Nebula** (4 × 4, tighter): free games for the best score. A piece of debris appears every 30 moves.
- **15 challenges**: reach a body (sometimes within a limited number of moves), break a number of debris, or score points. Some start with debris in place or on a 4 × 4 grid. A completed challenge earns 1 to 3 stars (one for completing it, one for keeping your powers, one for finishing in few moves) and unlocks the next.

Pick the mode from the list at the top. The current game is saved: you find it again when you come back, even on another PC.

## Data and sync

Your records, stars, biggest body reached and the current game are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Fusion stellaire → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
