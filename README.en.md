# Fusion stellaire (Stellar Fusion)

A sliding and merging tiles game: on each move, every tile slides the same way, and two identical celestial bodies that meet merge into the next one. From dust to a black hole, without filling the grid.

*Version française : [README.md](README.md)*

## Controls

- **Arrows**, **ZQSD** (WASD on QWERTY) or **drag with the mouse**: every tile slides that way.
- **U** or **Undo**: undoes the last move.
- **T** or **Wormhole**: click two tiles to swap them.

## Rules

- After each move, a new body appears in a free cell (usually dust, sometimes a pebble).
- Two identical bodies that meet while sliding merge into the next one, once per move.
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
