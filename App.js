import React, { useState } from 'react';
import { View } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { AppStyles } from './src/styles/app';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [gameSettings, setGameSettings] = useState({
    gridSize: 3,
    gameMode: 'pvc',
    difficulty: 'medium',
    playerNames: { player1: 'Player 1', player2: 'AI' },
    winner: null,
    gameStats: null
  });

  const [persistentScores, setPersistentScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isPlayAgainSession, setIsPlayAgainSession] = useState(false);
  
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  const navigateToScreen = (screen, additionalData = null) => {
    if (additionalData) {
      setGameSettings(prev => ({ ...prev, ...additionalData }));
    }
    
    if (screen === 'game' && currentScreen === 'home') {
      setPersistentScores({ X: 0, O: 0, draws: 0 });
      setIsPlayAgainSession(false);
    }
    
    setCurrentScreen(screen);
  };

  const handleScoreUpdate = (newScores) => {
    setPersistentScores(newScores);
  };

  const handlePlayAgain = () => {
    setIsPlayAgainSession(true);
    setCurrentScreen('game');
  };

  const handleNewGame = () => {
    setPersistentScores({ X: 0, O: 0, draws: 0 });
    setIsPlayAgainSession(false);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateToScreen} onNewGame={handleNewGame} />;
      case 'game':
        return (
          <GameScreen 
            settings={gameSettings} 
            onNavigate={navigateToScreen}
            initialScores={isPlayAgainSession ? persistentScores : { X: 0, O: 0, draws: 0 }}
            onScoreUpdate={handleScoreUpdate}
          />
        );
      case 'result':
        return (
          <ResultScreen 
            winner={gameSettings.winner}
            gameStats={gameSettings.gameStats}
            settings={gameSettings}
            onNavigate={navigateToScreen}
            onPlayAgain={handlePlayAgain}
          />
        );
      default:
        return <HomeScreen onNavigate={navigateToScreen} onNewGame={handleNewGame} />;
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={AppStyles.appContainer}>
        {renderScreen()}
      </View>
    </PaperProvider>
  );
}
