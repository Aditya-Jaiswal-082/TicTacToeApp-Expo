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
import { createGrid, checkWinner, getAvailableMoves } from '../utils/gameLogic';

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
    for (let move of availableMoves) {
      const testGrid = [...grid];
      testGrid[move] = 'O';
      if (checkWinner(testGrid, safeSettings.gridSize).winner === 'O') {
        return move;
      }
    }
    
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
