# Othello Game with AI

A modern, responsive web-based implementation of the classic Othello (Reversi) board game built with HTML, CSS, and vanilla JavaScript. Features an intelligent AI opponent playing as Black.

## Features

- **AI vs Human Gameplay**: Intelligent AI opponent (Black) vs Human player (White)
- **Smart AI Strategy**: AI uses advanced evaluation including corner control, mobility, and stability
- **Complete Othello Gameplay**: Full implementation of Othello rules with piece flipping mechanics
- **Beautiful UI**: Modern design with gradient backgrounds and smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Score Tracking**: Real-time score updates for both AI and human players
- **Hint System**: Optional highlighting of valid moves for the human player
- **Game State Management**: Automatic turn switching and game over detection
- **Smooth Animations**: Piece flipping animations and hover effects

## How to Play

1. **Objective**: Have the most pieces of your color when the board fills up
2. **Players**: You play as White, AI plays as Black
3. **Rules**: 
   - Players take turns placing pieces on the board
   - When you place a piece, all opponent pieces between your new piece and any of your existing pieces (in any direction) get flipped to your color
   - You must make a move that flips at least one opponent piece
   - If no valid moves are available, your turn is skipped
   - Game ends when the board is full or neither player can move

4. **Controls**:
   - Wait for the AI to make its move (Black goes first)
   - Click on any valid square to place your white piece
   - Use "Show Hints" to see available moves
   - Click "New Game" to restart

## AI Strategy

The AI opponent uses sophisticated evaluation criteria:

- **Corner Control**: Prioritizes capturing corners (highest value)
- **Edge Strategy**: Values edge positions while avoiding dangerous squares
- **Mobility**: Considers move options for both players
- **Stability**: Evaluates pieces that cannot be flipped
- **Positional Awareness**: Avoids squares adjacent to empty corners

The AI provides a challenging but fair opponent suitable for players of all skill levels.

## Getting Started

1. Open `index.html` in any modern web browser
2. The game will start automatically with the traditional Othello setup
3. Black goes first - click on a valid square to make your move

## Project Structure

```
Othello/
├── index.html          # Main game interface
├── styles.css          # Game styling and animations
├── script.js           # Game logic and interactions
└── README.md          # This file
```

## Technical Details

- **No Dependencies**: Built with vanilla JavaScript, HTML, and CSS
- **Modern CSS**: Uses CSS Grid, Flexbox, and CSS animations
- **ES6+ JavaScript**: Uses modern JavaScript features like classes and arrow functions
- **Mobile-First**: Responsive design that works on all screen sizes
- **Accessible**: Semantic HTML structure with proper ARIA labels

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

The game is structured using object-oriented JavaScript with a main `OthelloGame` class that handles:

- Board state management
- Move validation and piece flipping logic
- AI decision making with strategic evaluation
- Score calculation and game flow control
- UI updates and animations

### AI Implementation

The AI uses a sophisticated evaluation function that considers:
- **Strategic positioning** (corners, edges, danger squares)
- **Mobility analysis** (available moves for both players)
- **Piece stability** (pieces that cannot be flipped)
- **Board control** metrics

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to contribute by:
- Improving AI difficulty levels
- Adding different AI personalities/strategies
- Implementing sound effects
- Adding multiplayer functionality
- Improving accessibility features
- Adding animations and visual effects

Enjoy playing Othello! 🎮
