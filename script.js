class OthelloGame {
    constructor() {
        this.boardSize = 8;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.showHints = false;
        this.validMoves = [];
        this.isAIEnabled = true; // Both players are AI
        this.aiPlayer1 = 'black';
        this.aiPlayer2 = 'white';
        this.isAIThinking = false;
        this.moveDelay = 500; // 0.5 second delay between moves
        
        this.initializeBoard();
        this.setupEventListeners();
        this.renderBoard();
        this.updateGameInfo();
        
        // Start the AI vs AI game
        setTimeout(() => this.makeAIMove(), 1000); // Initial delay before first move
    }

    initializeBoard() {
        // Initialize empty board
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        
        // Set up initial pieces
        const mid = this.boardSize / 2;
        this.board[mid - 1][mid - 1] = 'white';
        this.board[mid - 1][mid] = 'black';
        this.board[mid][mid - 1] = 'black';
        this.board[mid][mid] = 'white';
        
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.calculateValidMoves();
    }

    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.toggleHints());
        document.getElementById('play-again-btn').addEventListener('click', () => this.newGame());
    }

    renderBoard() {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                // Add piece if exists
                if (this.board[row][col]) {
                    const piece = document.createElement('div');
                    piece.className = `cell-piece ${this.board[row][col]}`;
                    cell.appendChild(piece);
                }

                // Highlight valid moves if hints are enabled
                if (this.showHints && this.isValidMove(row, col)) {
                    cell.classList.add('valid-move');
                }

                // Add click event listener
                cell.addEventListener('click', () => this.handleCellClick(row, col));

                boardElement.appendChild(cell);
            }
        }
    }

    handleCellClick(row, col) {
        // Disable human interaction - both players are AI
        return;
    }

    isValidMove(row, col) {
        if (this.board[row][col] !== null) {
            return false;
        }

        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            if (this.canFlipInDirection(row, col, dr, dc)) {
                return true;
            }
        }

        return false;
    }

    canFlipInDirection(row, col, dr, dc) {
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        let r = row + dr;
        let c = col + dc;
        let foundOpponent = false;

        while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
            if (this.board[r][c] === null) {
                return false;
            }
            if (this.board[r][c] === opponent) {
                foundOpponent = true;
            } else if (this.board[r][c] === this.currentPlayer) {
                return foundOpponent;
            }
            r += dr;
            c += dc;
        }

        return false;
    }

    makeMove(row, col) {
        this.board[row][col] = this.currentPlayer;

        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        const piecesToFlip = [];

        for (const [dr, dc] of directions) {
            const flipped = this.getFlippedPieces(row, col, dr, dc);
            piecesToFlip.push(...flipped);
        }

        // Flip pieces with animation
        piecesToFlip.forEach(([r, c]) => {
            this.board[r][c] = this.currentPlayer;
        });

        // Add animation to flipped pieces
        setTimeout(() => {
            piecesToFlip.forEach(([r, c]) => {
                const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"] .cell-piece`);
                if (cell) {
                    cell.classList.add('flipping');
                    setTimeout(() => cell.classList.remove('flipping'), 600);
                }
            });
        }, 100);
    }

    getFlippedPieces(row, col, dr, dc) {
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        const flipped = [];
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
            if (this.board[r][c] === null) {
                return [];
            }
            if (this.board[r][c] === opponent) {
                flipped.push([r, c]);
            } else if (this.board[r][c] === this.currentPlayer) {
                return flipped;
            }
            r += dr;
            c += dc;
        }

        return [];
    }

    calculateValidMoves() {
        this.validMoves = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.isValidMove(row, col)) {
                    this.validMoves.push([row, col]);
                }
            }
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }

    // AI Methods
    makeAIMove() {
        if (this.gameOver) {
            return;
        }

        this.isAIThinking = true;
        this.updateGameInfo(); // Show AI thinking message

        // Use a timeout to show AI is "thinking"
        setTimeout(() => {
            const bestMove = this.findBestMove();
            
            if (bestMove) {
                this.makeMove(bestMove.row, bestMove.col);
                this.switchPlayer();
                this.calculateValidMoves();
                this.renderBoard();
                this.updateGameInfo();
                this.checkGameEnd();
                
                // Schedule next AI move if game continues
                if (!this.gameOver) {
                    setTimeout(() => this.makeAIMove(), this.moveDelay);
                }
            } else {
                // No valid moves for current player, skip turn
                this.switchPlayer();
                this.calculateValidMoves();
                this.updateGameInfo();
                this.renderBoard();
                
                if (this.validMoves.length === 0) {
                    // No moves for either player - game over
                    this.endGame();
                } else {
                    // Continue with next player
                    setTimeout(() => this.makeAIMove(), this.moveDelay);
                }
            }
            
            this.isAIThinking = false;
        }, 300); // AI "thinks" for 300ms
    }

    findBestMove() {
        const moves = this.getValidMovesForPlayer(this.currentPlayer);
        if (moves.length === 0) return null;

        let bestMove = null;
        let bestScore = -Infinity;

        // Add some variation for different AI strategies
        const isBlackAI = this.currentPlayer === 'black';
        
        for (const move of moves) {
            let score = this.evaluateMove(move.row, move.col);
            
            // Add slight strategy differences between the two AIs
            if (isBlackAI) {
                // Black AI favors aggressive play (more piece capture)
                score += this.calculateImmediatePieceGain(move.row, move.col) * 3;
            } else {
                // White AI favors positional play (corners and stability)
                score += this.calculatePositionalValue(move.row, move.col) * 2;
            }
            
            // Add small random factor to make games less predictable
            score += Math.random() * 5;
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    calculateImmediatePieceGain(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        let totalFlipped = 0;
        for (const [dr, dc] of directions) {
            const flipped = this.getFlippedPieces(row, col, dr, dc);
            totalFlipped += flipped.length;
        }
        
        return totalFlipped;
    }

    calculatePositionalValue(row, col) {
        let value = 0;
        
        // Corner positions are very valuable
        if (this.isCorner(row, col)) {
            value += 50;
        }
        
        // Edge positions are valuable
        if (this.isEdge(row, col) && !this.isCorner(row, col)) {
            value += 15;
        }
        
        // Center positions have moderate value
        if (row >= 2 && row <= 5 && col >= 2 && col <= 5) {
            value += 5;
        }
        
        return value;
    }

    evaluateMove(row, col) {
        // Create a copy of the board to simulate the move
        const boardCopy = this.copyBoard();
        const originalPlayer = this.currentPlayer;
        
        // Simulate the move
        this.simulateMove(boardCopy, row, col, this.currentPlayer);
        
        // Calculate score based on multiple factors
        let score = 0;
        
        // 1. Corner control (very high value)
        if (this.isCorner(row, col)) {
            score += 100;
        }
        
        // 2. Edge control (medium value)
        if (this.isEdge(row, col) && !this.isCorner(row, col)) {
            score += 20;
        }
        
        // 3. Avoid squares next to corners if corner is empty (negative value)
        if (this.isAdjacentToCorner(row, col) && !this.isCornerOccupied(row, col)) {
            score -= 50;
        }
        
        // 4. Mobility (number of moves available after this move)
        const currentPlayerMobility = this.calculateMobility(boardCopy, this.currentPlayer);
        const opponentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        const opponentMobility = this.calculateMobility(boardCopy, opponentPlayer);
        const mobilityScore = currentPlayerMobility - opponentMobility;
        score += mobilityScore * 2;
        
        // 5. Piece count difference
        const pieceScore = this.calculatePieceScore(boardCopy);
        score += pieceScore;
        
        // 6. Stability (pieces that can't be flipped)
        const stabilityScore = this.calculateStability(boardCopy);
        score += stabilityScore * 5;
        
        return score;
    }

    copyBoard() {
        return this.board.map(row => [...row]);
    }

    simulateMove(board, row, col, player) {
        board[row][col] = player;
        
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            const flipped = this.getFlippedPiecesForBoard(board, row, col, dr, dc, player);
            flipped.forEach(([r, c]) => {
                board[r][c] = player;
            });
        }
    }

    getFlippedPiecesForBoard(board, row, col, dr, dc, player) {
        const opponent = player === 'black' ? 'white' : 'black';
        const flipped = [];
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
            if (board[r][c] === null) {
                return [];
            }
            if (board[r][c] === opponent) {
                flipped.push([r, c]);
            } else if (board[r][c] === player) {
                return flipped;
            }
            r += dr;
            c += dc;
        }

        return [];
    }

    isCorner(row, col) {
        return (row === 0 || row === 7) && (col === 0 || col === 7);
    }

    isEdge(row, col) {
        return row === 0 || row === 7 || col === 0 || col === 7;
    }

    isAdjacentToCorner(row, col) {
        const corners = [[0,0], [0,7], [7,0], [7,7]];
        for (const [cr, cc] of corners) {
            if (Math.abs(row - cr) <= 1 && Math.abs(col - cc) <= 1 && !(row === cr && col === cc)) {
                return true;
            }
        }
        return false;
    }

    isCornerOccupied(row, col) {
        const corners = [[0,0], [0,7], [7,0], [7,7]];
        for (const [cr, cc] of corners) {
            if (Math.abs(row - cr) <= 1 && Math.abs(col - cc) <= 1) {
                if (this.board[cr][cc] !== null) {
                    return true;
                }
            }
        }
        return false;
    }

    calculateMobility(board, player) {
        let count = 0;
        const originalBoard = this.board;
        const originalPlayer = this.currentPlayer;
        
        this.board = board;
        this.currentPlayer = player;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.isValidMove(row, col)) {
                    count++;
                }
            }
        }
        
        this.board = originalBoard;
        this.currentPlayer = originalPlayer;
        
        return count;
    }

    calculatePieceScore(board) {
        let currentPlayerPieces = 0;
        let opponentPieces = 0;
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (board[row][col] === this.currentPlayer) {
                    currentPlayerPieces++;
                } else if (board[row][col] === opponent) {
                    opponentPieces++;
                }
            }
        }
        
        return currentPlayerPieces - opponentPieces;
    }

    calculateStability(board) {
        let currentPlayerStable = 0;
        let opponentStable = 0;
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        
        // Check corners (always stable)
        const corners = [[0,0], [0,7], [7,0], [7,7]];
        for (const [row, col] of corners) {
            if (board[row][col] === this.currentPlayer) currentPlayerStable++;
            else if (board[row][col] === opponent) opponentStable++;
        }
        
        return currentPlayerStable - opponentStable;
    }

    getValidMovesForPlayer(player) {
        const moves = [];
        const originalPlayer = this.currentPlayer;
        this.currentPlayer = player;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.isValidMove(row, col)) {
                    moves.push({ row, col });
                }
            }
        }
        
        this.currentPlayer = originalPlayer;
        return moves;
    }

    updateGameInfo() {
        const scores = this.calculateScores();
        document.getElementById('black-score').textContent = scores.black;
        document.getElementById('white-score').textContent = scores.white;
        
        const currentPlayerElement = document.getElementById('current-player');
        
        if (this.isAIThinking) {
            const playerName = this.currentPlayer === 'black' ? 'Black AI' : 'White AI';
            currentPlayerElement.textContent = `${playerName} is thinking...`;
        } else {
            const playerName = this.currentPlayer === 'black' ? 'Black AI' : 'White AI';
            currentPlayerElement.textContent = `${playerName}'s Turn`;
        }
        
        const messageElement = document.getElementById('game-message');
        
        if (this.isAIThinking) {
            const playerName = this.currentPlayer === 'black' ? 'Black AI' : 'White AI';
            messageElement.textContent = `${playerName} is calculating the best move...`;
        } else if (this.validMoves.length === 0 && !this.gameOver) {
            const playerName = this.currentPlayer === 'black' ? 'Black AI' : 'White AI';
            messageElement.textContent = `No valid moves for ${playerName}. Switching turns...`;
            setTimeout(() => {
                this.switchPlayer();
                this.calculateValidMoves();
                this.updateGameInfo();
                this.renderBoard();
                if (this.validMoves.length === 0) {
                    this.endGame();
                } else {
                    setTimeout(() => this.makeAIMove(), this.moveDelay);
                }
            }, 1500);
        } else if (!this.gameOver) {
            messageElement.textContent = 'Watch the AI players compete! Click "New Game" to restart.';
        }
    }

    calculateScores() {
        let black = 0;
        let white = 0;

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 'black') {
                    black++;
                } else if (this.board[row][col] === 'white') {
                    white++;
                }
            }
        }

        return { black, white };
    }

    checkGameEnd() {
        const scores = this.calculateScores();
        const totalPieces = scores.black + scores.white;
        
        // Game ends if board is full or no valid moves for both players
        if (totalPieces === this.boardSize * this.boardSize) {
            this.endGame();
            return;
        }

        // Check if current player has valid moves
        if (this.validMoves.length === 0) {
            // Switch to other player and check their moves
            this.switchPlayer();
            this.calculateValidMoves();
            if (this.validMoves.length === 0) {
                // No moves for either player
                this.endGame();
            }
            // If the other player has moves, the game continues (handled in updateGameInfo)
        }
    }

    endGame() {
        this.gameOver = true;
        this.isAIThinking = false;
        const scores = this.calculateScores();
        
        let winner;
        let winnerText;
        
        if (scores.black > scores.white) {
            winner = 'black';
            winnerText = 'Black AI Wins!';
        } else if (scores.white > scores.black) {
            winner = 'white';
            winnerText = 'White AI Wins!';
        } else {
            winnerText = "It's a Tie!";
        }

        document.getElementById('winner-text').textContent = winnerText;
        document.getElementById('final-score').textContent = `Final Score - Black AI: ${scores.black}, White AI: ${scores.white}`;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('game-message').textContent = 'Game Over! Click "New Game" to watch another AI vs AI match.';
    }

    newGame() {
        document.getElementById('game-over').classList.add('hidden');
        this.isAIThinking = false;
        this.initializeBoard();
        this.renderBoard();
        this.updateGameInfo();
        
        // Start new AI vs AI game
        setTimeout(() => this.makeAIMove(), 1000);
    }

    toggleHints() {
        this.showHints = !this.showHints;
        const hintBtn = document.getElementById('hint-btn');
        hintBtn.textContent = this.showHints ? 'Hide Hints' : 'Show Hints';
        this.renderBoard();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new OthelloGame();
});

// Add some utility functions for enhanced gameplay
function addSoundEffects() {
    // Placeholder for sound effects
    // You can add audio elements and play sounds for moves, wins, etc.
}

function addKeyboardSupport() {
    // Placeholder for keyboard navigation
    // You can add arrow key navigation for accessibility
}

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OthelloGame;
}
