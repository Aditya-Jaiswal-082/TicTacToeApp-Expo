import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
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
import GameBoard from '../components/GameBoard';
import { createGrid, checkWinner, getAvailableMoves } from '../utils/gameLogic';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ settings, onNavigate, initialScores, onScoreUpdate }) {
  // Safety check for undefined settings
  const safeSettings = settings || {
    gridSize: 3,
    gameMode: 'pvc',
    difficulty: 'medium',
    playerNames: { player1: 'Player 1', player2: 'AI' }
  };

  // If settings are completely missing, navigate back to home
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
  
  // Always start with the scores passed from parent (either fresh 0,0,0 or persistent scores)
  const [scores, setScores] = useState(initialScores || { X: 0, O: 0, draws: 0 });
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  // Game timing
  const gameStartTime = useRef(Date.now());
  const gameTimer = useRef(null);
  
  const theme = useTheme();

  // Update scores when initialScores prop changes
  useEffect(() => {
    setScores(initialScores || { X: 0, O: 0, draws: 0 });
  }, [initialScores]);

  // Game timer
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

  // Check for winner after each move
  useEffect(() => {
    const result = checkWinner(grid, safeSettings.gridSize);
    if (result.winner) {
      setGameStatus('finished');
      setWinner(result.winner);
      setWinningLine(result.line);
      
      // Calculate new scores based on current scores
      const newScores = { ...scores };
      if (result.winner === 'draw') {
        newScores.draws += 1;
      } else {
        newScores[result.winner] += 1;
      }
      
      // Update local scores
      setScores(newScores);
      
      // Update persistent scores in parent component
      if (onScoreUpdate) {
        onScoreUpdate(newScores);
      }
      
      // Navigate to result screen after delay
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

  // AI move logic
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
  }, [currentPlayer, gameStatus, safeSettings.gameMode]);

  const makeMove = (index) => {
    if (grid[index] || gameStatus !== 'playing' || isAIThinking) return;
    
    const newGrid = [...grid];
    newGrid[index] = currentPlayer;
    
    setGrid(newGrid);
    setMoveHistory(prev => [...prev, { index, player: currentPlayer, grid: [...grid] }]);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const makeAIMove = () => {
    const availableMoves = getAvailableMoves(grid);
    if (availableMoves.length === 0) return;
    
    let selectedMove;
    
    switch (safeSettings.difficulty) {
      case 'easy':
        selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        break;
      case 'medium':
        selectedMove = getStrategicMove(availableMoves) || 
                     availableMoves[Math.floor(Math.random() * availableMoves.length)];
        break;
      case 'hard':
      case 'expert':
        selectedMove = getBestMove(availableMoves) || 
                     getStrategicMove(availableMoves) || 
                     availableMoves[Math.floor(Math.random() * availableMoves.length)];
        break;
      default:
        selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    makeMove(selectedMove);
  };

  const getStrategicMove = (availableMoves) => {
    // Check if AI can win
    for (let move of availableMoves) {
      const testGrid = [...grid];
      testGrid[move] = 'O';
      if (checkWinner(testGrid, safeSettings.gridSize).winner === 'O') {
        return move;
      }
    }
    
    // Check if AI needs to block player
    for (let move of availableMoves) {
      const testGrid = [...grid];
      testGrid[move] = 'X';
      if (checkWinner(testGrid, safeSettings.gridSize).winner === 'X') {
        return move;
      }
    }
    
    return null;
  };

  const getBestMove = (availableMoves) => {
    const center = Math.floor((safeSettings.gridSize * safeSettings.gridSize) / 2);
    const corners = [
      0, 
      safeSettings.gridSize - 1, 
      (safeSettings.gridSize - 1) * safeSettings.gridSize, 
      safeSettings.gridSize * safeSettings.gridSize - 1
    ];
    
    if (availableMoves.includes(center)) return center;
    
    for (let corner of corners) {
      if (availableMoves.includes(corner)) return corner;
    }
    
    return null;
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
    // Scores remain unchanged for "Play Again" functionality
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

  // Early return if settings are invalid
  if (!settings || !settings.gameMode) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton 
            icon="arrow-left" 
            onPress={() => onNavigate('home')}
            size={28}
            iconColor={theme.colors.primary}
          />
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
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

        {/* Game Status */}
        <Card style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.statusContent}>
            <Text style={[styles.gameStatus, { color: theme.colors.primary }]}>
              {getCurrentPlayerDisplay()}
            </Text>
            {isAIThinking && (
              <ProgressBar 
                indeterminate 
                style={styles.thinkingProgress}
                color={theme.colors.secondary}
              />
            )}
          </Card.Content>
        </Card>

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Surface style={[styles.scoreCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.scoreName, { color: theme.colors.onPrimaryContainer }]}>
              ❌ {safeSettings.playerNames.player1}
            </Text>
            <Text style={[styles.scoreValue, { color: theme.colors.onPrimaryContainer }]}>
              {scores.X}
            </Text>
          </Surface>
          
          <Surface style={[styles.scoreCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.scoreName, { color: theme.colors.onSurfaceVariant }]}>
              🤝 Draws
            </Text>
            <Text style={[styles.scoreValue, { color: theme.colors.onSurfaceVariant }]}>
              {scores.draws}
            </Text>
          </Surface>
          
          <Surface style={[styles.scoreCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text style={[styles.scoreName, { color: theme.colors.onSecondaryContainer }]}>
              ⭕ {safeSettings.playerNames.player2}
            </Text>
            <Text style={[styles.scoreValue, { color: theme.colors.onSecondaryContainer }]}>
              {scores.O}
            </Text>
          </Surface>
        </View>

        {/* Game Info */}
        <View style={styles.gameInfo}>
          <Chip icon="grid" compact style={styles.infoChip}>
            Grid: {safeSettings.gridSize}×{safeSettings.gridSize}
          </Chip>
          <Chip icon="gamepad-variant" compact style={styles.infoChip}>
            Mode: {safeSettings.gameMode === 'pvc' ? 'vs AI' : 'vs Player'}
          </Chip>
          {safeSettings.gameMode === 'pvc' && (
            <Chip icon="brain" compact style={styles.infoChip}>
              AI: {safeSettings.difficulty}
            </Chip>
          )}
        </View>

        {/* Game Board */}
        <GameBoard
          grid={grid}
          gridSize={safeSettings.gridSize}
          onCellPress={makeMove}
          winningLine={winningLine}
          disabled={gameStatus !== 'playing' || (safeSettings.gameMode === 'pvc' && currentPlayer === 'O')}
        />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={undoLastMove}
            disabled={moveHistory.length === 0 || gameStatus !== 'playing' || isAIThinking}
            style={styles.actionButton}
            icon="undo"
          >
            Undo
          </Button>
          
          <Button
            mode="contained"
            onPress={resetGame}
            style={styles.actionButton}
            icon="refresh"
          >
            New Game
          </Button>
        </View>

        {/* Game Over Actions */}
        {gameStatus === 'finished' && (
          <View style={styles.gameOverActions}>
            <Button
              mode="contained"
              onPress={resetGame}
              style={styles.gameOverButton}
              contentStyle={styles.buttonContent}
              icon="play"
            >
              Play Again
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => onNavigate('home')}
              style={styles.gameOverButton}
              contentStyle={styles.buttonContent}
              icon="cog"
            >
              Settings
            </Button>
          </View>
        )}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusCard: {
    marginBottom: 15,
    elevation: 4,
  },
  statusContent: {
    alignItems: 'center',
  },
  gameStatus: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thinkingProgress: {
    width: '100%',
    marginTop: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  scoreCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  scoreName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  infoChip: {
    marginHorizontal: 4,
    marginVertical: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    marginBottom: 15,
  },
  actionButton: {
    minWidth: 120,
  },
  gameOverActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  gameOverButton: {
    minWidth: 140,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  bottomSpacer: {
    height: 50,
  },
});
