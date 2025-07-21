import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Button, 
  Card, 
  IconButton, 
  Surface,
  useTheme,
  Chip,
  ProgressBar
} from 'react-native-paper';
import { AppStyles } from '../styles/app';
import GameBoard from '../components/GameBoard';
import { createGrid, checkWinner, getAvailableMoves, getWinLength } from '../utils/gameLogic';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ settings, onNavigate, initialScores, onScoreUpdate }) {
  const safeSettings = settings || {
    gridSize: 3,
    gameMode: 'pvc',
    difficulty: 'medium',
    playerNames: { player1: 'Player 1', player2: 'AI' }
  };

  useEffect(() => {
    if (!settings || !settings.gameMode) {
      onNavigate('home');
      return;
    }
  }, [settings, onNavigate]);

  const [grid, setGrid] = useState(createGrid(safeSettings.gridSize));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameStatus, setGameStatus] = useState('playing');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState(initialScores || { X: 0, O: 0, draws: 0 });
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  const gameStartTime = useRef(Date.now());
  const gameTimer = useRef(null);
  
  const theme = useTheme();

  useEffect(() => {
    setScores(initialScores || { X: 0, O: 0, draws: 0 });
  }, [initialScores]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      gameTimer.current = setInterval(() => {
        setGameTime(Math.floor((Date.now() - gameStartTime.current) / 1000));
      }, 1000);
    } else {
      clearInterval(gameTimer.current);
    }

    return () => clearInterval(gameTimer.current);
  }, [gameStatus]);

  useEffect(() => {
    const result = checkWinner(grid, safeSettings.gridSize);
    if (result.winner) {
      setGameStatus('finished');
      setWinner(result.winner);
      setWinningLine(result.line);
      
      const newScores = { ...scores };
      if (result.winner === 'draw') {
        newScores.draws += 1;
      } else {
        newScores[result.winner] += 1;
      }
      
      setScores(newScores);
      
      if (onScoreUpdate) {
        onScoreUpdate(newScores);
      }
      
      setTimeout(() => {
        const gameStats = {
          totalMoves: moveHistory.length + 1,
          gameDuration: Math.floor((Date.now() - gameStartTime.current) / 1000),
          scores: newScores,
          winner: result.winner
        };
        
        onNavigate('result', { 
          winner: result.winner, 
          gameStats, 
          settings: safeSettings 
        });
      }, 2000);
    }
  }, [grid, safeSettings.gridSize]);

  useEffect(() => {
    if (safeSettings.gameMode === 'pvc' && currentPlayer === 'O' && gameStatus === 'playing') {
      setIsAIThinking(true);
      const timer = setTimeout(() => {
        makeAIMove();
        setIsAIThinking(false);
      }, 800);
      
      return () => {
        clearTimeout(timer);
        setIsAIThinking(false);
      };
    }
  }, [currentPlayer, gameStatus, safeSettings.gameMode, grid]);

  const makeMove = (index) => {
    if (grid[index] || gameStatus !== 'playing' || isAIThinking) return;
    
    const newGrid = [...grid];
    newGrid[index] = currentPlayer;
    
    setGrid(newGrid);
    setMoveHistory(prev => [...prev, { index, player: currentPlayer, grid: [...grid] }]);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  // Helper function to get all possible winning lines
  const getAllPossibleLines = (gridSize, winLength) => {
    const lines = [];
    
    // Horizontal lines
    for (let row = 0; row < gridSize; row++) {
      for (let startCol = 0; startCol <= gridSize - winLength; startCol++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push(row * gridSize + startCol + i);
        }
        lines.push(line);
      }
    }
    
    // Vertical lines
    for (let col = 0; col < gridSize; col++) {
      for (let startRow = 0; startRow <= gridSize - winLength; startRow++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push((startRow + i) * gridSize + col);
        }
        lines.push(line);
      }
    }
    
    // Diagonal lines (top-left to bottom-right)
    for (let row = 0; row <= gridSize - winLength; row++) {
      for (let col = 0; col <= gridSize - winLength; col++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push((row + i) * gridSize + col + i);
        }
        lines.push(line);
      }
    }
    
    // Diagonal lines (top-right to bottom-left)
    for (let row = 0; row <= gridSize - winLength; row++) {
      for (let col = winLength - 1; col < gridSize; col++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push((row + i) * gridSize + col - i);
        }
        lines.push(line);
      }
    }
    
    return lines;
  };

  // Helper function for corner positions
  const getCornerPositions = (gridSize) => {
    return [
      0, // Top-left
      gridSize - 1, // Top-right
      (gridSize - 1) * gridSize, // Bottom-left
      gridSize * gridSize - 1 // Bottom-right
    ];
  };

  // Get center position for odd-sized grids
  const getCenterPosition = (gridSize) => {
    if (gridSize % 2 === 1) {
      return Math.floor((gridSize * gridSize) / 2);
    }
    return null;
  };

  // Enhanced strategic move with proper logic
  const getEnhancedStrategicMove = (availableMoves) => {
    // Priority 1: Win immediately if possible
    for (let move of availableMoves) {
      const testGrid = [...grid];
      testGrid[move] = 'O';
      const result = checkWinner(testGrid, safeSettings.gridSize);
      if (result.winner === 'O') {
        return move;
      }
    }
    
    // Priority 2: Block immediate player wins
    for (let move of availableMoves) {
      const testGrid = [...grid];
      testGrid[move] = 'X';
      const result = checkWinner(testGrid, safeSettings.gridSize);
      if (result.winner === 'X') {
        return move;
      }
    }
    
    // Priority 3: Take center if available (for odd-sized grids)
    const center = getCenterPosition(safeSettings.gridSize);
    if (center !== null && availableMoves.includes(center)) {
      return center;
    }
    
    // Priority 4: Take corners
    const corners = getCornerPositions(safeSettings.gridSize);
    for (let corner of corners) {
      if (availableMoves.includes(corner)) {
        return corner;
      }
    }
    
    // Priority 5: Take edges
    return null;
  };

  // Advanced strategic move for harder difficulties
  const getAdvancedStrategicMove = (availableMoves) => {
    // First, try the basic strategic move
    const basicMove = getEnhancedStrategicMove(availableMoves);
    if (basicMove !== null) {
      return basicMove;
    }
    
    // Look for moves that create multiple opportunities
    const winLength = getWinLength(safeSettings.gridSize);
    let bestMove = null;
    let maxScore = 0;
    
    for (let move of availableMoves) {
      const testGrid = [...grid];
      testGrid[move] = 'O';
      
      // Count potential winning lines this move creates
      let score = 0;
      const lines = getAllPossibleLines(safeSettings.gridSize, winLength);
      
      for (let line of lines) {
        if (line.includes(move)) {
          const values = line.map(pos => testGrid[pos]);
          const oCount = values.filter(v => v === 'O').length;
          const emptyCount = values.filter(v => v === null).length;
          const xCount = values.filter(v => v === 'X').length;
          
          // Score this line if it has potential (no X's blocking)
          if (xCount === 0 && oCount > 0) {
            score += oCount * oCount; // Exponential scoring for better positions
          }
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMove = move;
      }
    }
    
    return bestMove;
  };

  // Main AI move function with proper fallbacks
  const makeAIMove = () => {
    const availableMoves = getAvailableMoves(grid);
    if (availableMoves.length === 0) return;
    
    let selectedMove = null;
    
    try {
      switch (safeSettings.difficulty) {
        case 'easy':
          // 30% strategic, 70% random
          if (Math.random() > 0.7) {
            selectedMove = getEnhancedStrategicMove(availableMoves);
          }
          break;
          
        case 'medium':
          // 80% strategic, 20% random
          if (Math.random() > 0.2) {
            selectedMove = getEnhancedStrategicMove(availableMoves);
          }
          break;
          
        case 'hard':
          // Always strategic with advanced moves
          selectedMove = getAdvancedStrategicMove(availableMoves);
          if (!selectedMove) {
            selectedMove = getEnhancedStrategicMove(availableMoves);
          }
          break;
          
        case 'expert':
          // Always use the best strategy available
          selectedMove = getAdvancedStrategicMove(availableMoves);
          if (!selectedMove) {
            selectedMove = getEnhancedStrategicMove(availableMoves);
          }
          break;
          
        default:
          selectedMove = getEnhancedStrategicMove(availableMoves);
      }
    } catch (error) {
      console.log('AI strategy error:', error);
      selectedMove = null;
    }
    
    // Fallback to random if no strategic move found
    if (!selectedMove) {
      selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    // Make the move
    if (selectedMove !== null && availableMoves.includes(selectedMove)) {
      makeMove(selectedMove);
    } else {
      // Emergency fallback
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      makeMove(randomMove);
    }
  };

  const resetGame = () => {
    setGrid(createGrid(safeSettings.gridSize));
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinner(null);
    setWinningLine([]);
    setMoveHistory([]);
    setGameTime(0);
    setIsAIThinking(false);
    gameStartTime.current = Date.now();
  };

  const undoLastMove = () => {
    if (moveHistory.length === 0) return;
    
    let movesToUndo = 1;
    if (safeSettings.gameMode === 'pvc' && moveHistory.length >= 2 && currentPlayer === 'X') {
      movesToUndo = 2;
    }
    
    const targetHistoryLength = Math.max(0, moveHistory.length - movesToUndo);
    const targetMove = moveHistory[targetHistoryLength - 1];
    
    if (targetMove) {
      setGrid(targetMove.grid);
      setCurrentPlayer(targetMove.player === 'X' ? 'O' : 'X');
    } else {
      setGrid(createGrid(safeSettings.gridSize));
      setCurrentPlayer('X');
    }
    
    setMoveHistory(prev => prev.slice(0, targetHistoryLength));
    setGameStatus('playing');
    setWinner(null);
    setWinningLine([]);
    setIsAIThinking(false);
  };

  const getPlayerName = (player) => {
    return player === 'X' ? safeSettings.playerNames.player1 : safeSettings.playerNames.player2;
  };

  const getCurrentPlayerDisplay = () => {
    if (gameStatus === 'finished') {
      if (winner === 'draw') {
        return "🤝 It's a Draw!";
      }
      return `🎉 ${getPlayerName(winner)} Wins!`;
    }
    
    if (safeSettings.gameMode === 'pvc' && currentPlayer === 'O') {
      return isAIThinking ? "🤖 AI is thinking..." : "🤖 AI's Turn";
    }
    
    return `${currentPlayer === 'X' ? '❌' : '⭕'} ${getPlayerName(currentPlayer)}'s Turn`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWinCriteria = () => {
    return getWinLength(safeSettings.gridSize);
  };

  if (!settings || !settings.gameMode) {
    return null;
  }

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <ScrollView 
        style={AppStyles.container}
        contentContainerStyle={AppStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={AppStyles.gameHeader}>
          <IconButton 
            icon="arrow-left" 
            onPress={() => onNavigate('home')}
            size={28}
            iconColor={theme.colors.primary}
          />
          <View style={AppStyles.gameHeaderCenter}>
            <Text style={[AppStyles.gameHeaderTitle, { color: theme.colors.onSurface }]}>
              {safeSettings.gridSize}×{safeSettings.gridSize} Tic Tac Toe
            </Text>
            <Chip icon="clock-outline" compact>
              {formatTime(gameTime)}
            </Chip>
          </View>
          <IconButton 
            icon="refresh" 
            onPress={resetGame}
            size={28}
            iconColor={theme.colors.primary}
          />
        </View>

        <Card style={[AppStyles.gameStatusCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={AppStyles.gameStatusContent}>
            <Text style={[AppStyles.gameStatus, { color: theme.colors.primary }]}>
              {getCurrentPlayerDisplay()}
            </Text>
            {isAIThinking && (
              <ProgressBar 
                indeterminate 
                style={AppStyles.gameThinkingProgress}
                color={theme.colors.secondary}
              />
            )}
          </Card.Content>
        </Card>

        <View style={AppStyles.gameScoreContainer}>
          <Surface style={[AppStyles.gameScoreCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[AppStyles.gameScoreName, { color: theme.colors.onPrimaryContainer }]}>
              ❌ {safeSettings.playerNames.player1}
            </Text>
            <Text style={[AppStyles.gameScoreValue, { color: theme.colors.onPrimaryContainer }]}>
              {scores.X}
            </Text>
          </Surface>
          
          <Surface style={[AppStyles.gameScoreCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[AppStyles.gameScoreName, { color: theme.colors.onSurfaceVariant }]}>
              🤝 Draws
            </Text>
            <Text style={[AppStyles.gameScoreValue, { color: theme.colors.onSurfaceVariant }]}>
              {scores.draws}
            </Text>
          </Surface>
          
          <Surface style={[AppStyles.gameScoreCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text style={[AppStyles.gameScoreName, { color: theme.colors.onSecondaryContainer }]}>
              ⭕ {safeSettings.playerNames.player2}
            </Text>
            <Text style={[AppStyles.gameScoreValue, { color: theme.colors.onSecondaryContainer }]}>
              {scores.O}
            </Text>
          </Surface>
        </View>

        <View style={AppStyles.gameInfo}>
          <Chip icon="grid" compact style={AppStyles.gameInfoChip}>
            Grid: {safeSettings.gridSize}×{safeSettings.gridSize}
          </Chip>
          <Chip icon="target" compact style={AppStyles.gameInfoChip}>
            Win: {getWinCriteria()} in a row
          </Chip>
          <Chip icon="gamepad-variant" compact style={AppStyles.gameInfoChip}>
            Mode: {safeSettings.gameMode === 'pvc' ? 'vs AI' : 'vs Player'}
          </Chip>
          {safeSettings.gameMode === 'pvc' && (
            <Chip icon="brain" compact style={AppStyles.gameInfoChip}>
              AI: {safeSettings.difficulty}
            </Chip>
          )}
        </View>

        <GameBoard
          grid={grid}
          gridSize={safeSettings.gridSize}
          onCellPress={makeMove}
          winningLine={winningLine}
          disabled={gameStatus !== 'playing' || (safeSettings.gameMode === 'pvc' && currentPlayer === 'O')}
        />

        <View style={AppStyles.gameActionButtons}>
          <Button
            mode="outlined"
            onPress={undoLastMove}
            disabled={moveHistory.length === 0 || gameStatus !== 'playing' || isAIThinking}
            style={AppStyles.gameActionButton}
            icon="undo"
          >
            Undo
          </Button>
          
          <Button
            mode="contained"
            onPress={resetGame}
            style={AppStyles.gameActionButton}
            icon="refresh"
          >
            New Game
          </Button>
        </View>

        {gameStatus === 'finished' && (
          <View style={AppStyles.gameOverActions}>
            <Button
              mode="contained"
              onPress={resetGame}
              style={AppStyles.gameOverButton}
              contentStyle={AppStyles.buttonContent}
              icon="play"
            >
              Play Again
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => onNavigate('home')}
              style={AppStyles.gameOverButton}
              contentStyle={AppStyles.buttonContent}
              icon="cog"
            >
              Settings
            </Button>
          </View>
        )}

        <View style={AppStyles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
