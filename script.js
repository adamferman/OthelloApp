class OthelloGame {
    constructor() {
        this.boardSize = 8;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.showHints = false;
        this.validMoves = [];
        this.isAIEnabled = true; // Black will be AI
        this.aiPlayer = 'black';
        this.humanPlayer = 'white';
        this.isAIThinking = false;
        
        this.initializeBoard();
        this.setupEventListeners();
        this.renderBoard();
        this.updateGameInfo();
        
        // Start AI move if black goes first
        if (this.currentPlayer === this.aiPlayer) {
            this.makeAIMove();
        }
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
        if (this.gameOver || !this.isValidMove(row, col) || this.isAIThinking) {
            return;
        }

        // Only allow human player to click
        if (this.currentPlayer === this.aiPlayer) {
            return;
        }

        this.makeMove(row, col);
        this.switchPlayer();
        this.calculateValidMoves();
        this.renderBoard();
        this.updateGameInfo();
        this.checkGameEnd();

        // Make AI move after human move
        if (!this.gameOver && this.currentPlayer === this.aiPlayer) {
            setTimeout(() => this.makeAIMove(), 500);
        }
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
        if (this.gameOver || this.currentPlayer !== this.aiPlayer) {
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
            }
            
            this.isAIThinking = false;
        }, 800); // AI "thinks" for 800ms
    }

    findBestMove() {
        const moves = this.getValidMovesForPlayer(this.aiPlayer);
        if (moves.length === 0) return null;

        let bestMove = null;
        let bestScore = -Infinity;

        for (const move of moves) {
            const score = this.evaluateMove(move.row, move.col);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    evaluateMove(row, col) {
        // Create a copy of the board to simulate the move
        const boardCopy = this.copyBoard();
        const originalPlayer = this.currentPlayer;
        
        // Simulate the move
        this.simulateMove(boardCopy, row, col, this.aiPlayer);
        
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
        const mobilityScore = this.calculateMobility(boardCopy, this.aiPlayer) - 
                             this.calculateMobility(boardCopy, this.humanPlayer);
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
        let aiPieces = 0;
        let humanPieces = 0;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (board[row][col] === this.aiPlayer) {
                    aiPieces++;
                } else if (board[row][col] === this.humanPlayer) {
                    humanPieces++;
                }
            }
        }
        
        return aiPieces - humanPieces;
    }

    calculateStability(board) {
        let aiStable = 0;
        let humanStable = 0;
        
        // Check corners (always stable)
        const corners = [[0,0], [0,7], [7,0], [7,7]];
        for (const [row, col] of corners) {
            if (board[row][col] === this.aiPlayer) aiStable++;
            else if (board[row][col] === this.humanPlayer) humanStable++;
        }
        
        return aiStable - humanStable;
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
            currentPlayerElement.textContent = 'AI is thinking...';
        } else {
            const playerName = this.currentPlayer === 'black' ? 'AI (Black)' : 'Human (White)';
            currentPlayerElement.textContent = `${playerName}'s Turn`;
        }
        
        const messageElement = document.getElementById('game-message');
        
        if (this.isAIThinking) {
            messageElement.textContent = 'AI is calculating the best move...';
        } else if (this.validMoves.length === 0 && !this.gameOver) {
            const playerName = this.currentPlayer === 'black' ? 'AI' : 'Human';
            messageElement.textContent = `No valid moves for ${playerName}. Switching turns...`;
            setTimeout(() => {
                this.switchPlayer();
                this.calculateValidMoves();
                this.updateGameInfo();
                this.renderBoard();
                if (this.validMoves.length === 0) {
                    this.endGame();
                } else if (this.currentPlayer === this.aiPlayer) {
                    this.makeAIMove();
                }
            }, 1500);
        } else if (!this.gameOver) {
            if (this.currentPlayer === this.aiPlayer) {
                messageElement.textContent = 'AI is planning its move...';
            } else {
                messageElement.textContent = this.showHints ? 
                    'Valid moves are highlighted in yellow' : 
                    'Click on a valid square to place your piece';
            }
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
            winnerText = 'AI Wins!';
        } else if (scores.white > scores.black) {
            winner = 'white';
            winnerText = 'Human Wins!';
        } else {
            winnerText = "It's a Tie!";
        }

        document.getElementById('winner-text').textContent = winnerText;
        document.getElementById('final-score').textContent = `Final Score - AI (Black): ${scores.black}, Human (White): ${scores.white}`;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('game-message').textContent = 'Game Over!';
    }

    newGame() {
        document.getElementById('game-over').classList.add('hidden');
        this.isAIThinking = false;
        this.initializeBoard();
        this.renderBoard();
        this.updateGameInfo();
        
        // Start AI move if black goes first
        if (this.currentPlayer === this.aiPlayer) {
            setTimeout(() => this.makeAIMove(), 500);
        }
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
