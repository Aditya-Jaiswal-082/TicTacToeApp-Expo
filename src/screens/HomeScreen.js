import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Title, 
  Button, 
  Card, 
  SegmentedButtons, 
  RadioButton,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';
import { AppStyles } from '../styles/app';
import { getWinLength } from '../utils/gameLogic';

export default function HomeScreen({ onNavigate }) {
  const [gridSize, setGridSize] = useState('3');
  const [gameMode, setGameMode] = useState('pvc');
  const [difficulty, setDifficulty] = useState('medium');
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [playerIcon, setPlayerIcon] = useState('X'); // New state for icon selection

  const theme = useTheme();

  const gridSizeOptions = [
    { value: '3', label: '3×3' },
    { value: '4', label: '4×4' },
    { value: '5', label: '5×5' },
  ];

  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
    { label: 'Expert', value: 'expert' },
  ];

  // New icon selection options
  const iconOptions = [
    { value: 'X', label: '❌ X' },
    { value: 'O', label: '⭕ O' },
  ];

  const startGame = () => {
    const settings = {
      gridSize: parseInt(gridSize),
      gameMode,
      difficulty,
      playerIcon, // Include player icon choice
      playerNames: {
        player1: player1Name,
        player2: gameMode === 'pvc' ? 'AI' : player2Name
      }
    };
    onNavigate('game', settings);
  };

  const getDifficultyDescription = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Perfect for beginners';
      case 'medium': return 'Balanced challenge';
      case 'hard': return 'Strategic thinking required';
      case 'expert': return 'Maximum challenge';
      default: return '';
    }
  };

  const getGridDescription = (size) => {
    const winLength = getWinLength(parseInt(size));
    switch (size) {
      case '3': return `Classic 3×3 grid - Get ${winLength} in a row to win`;
      case '4': return `Extended 4×4 grid - Get ${winLength} in a row to win (Faster gameplay!)`;
      case '5': return `Large 5×5 grid - Get ${winLength} in a row to win (More strategic!)`;
      default: return '';
    }
  };

  const getOpponentIcon = () => {
    return playerIcon === 'X' ? 'O' : 'X';
  };

  const getOpponentName = () => {
    return gameMode === 'pvc' ? 'AI' : player2Name;
  };

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <ScrollView 
        style={AppStyles.container}
        contentContainerStyle={AppStyles.homeScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={AppStyles.homeHeader}>
          <Title style={[AppStyles.homeTitle, { color: theme.colors.primary }]}>
            🎮 Tic Tac Toe
          </Title>
          <Text style={[AppStyles.homeSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Choose your game settings and start playing!
          </Text>
        </View>
        
        <Card style={[AppStyles.homeCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[AppStyles.homeSectionTitle, { color: theme.colors.onSurface }]}>
              🎯 Grid Size & Win Criteria
            </Text>
            <Text style={[AppStyles.homeSectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              {getGridDescription(gridSize)}
            </Text>
            <SegmentedButtons
              value={gridSize}
              onValueChange={setGridSize}
              buttons={gridSizeOptions}
              style={AppStyles.homeSegmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* New Icon Selection Card */}
        <Card style={[AppStyles.homeCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[AppStyles.homeSectionTitle, { color: theme.colors.onSurface }]}>
              🎨 Choose Your Icon
            </Text>
            <Text style={[AppStyles.homeSectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Select whether you want to play as X or O
            </Text>
            <SegmentedButtons
              value={playerIcon}
              onValueChange={setPlayerIcon}
              buttons={iconOptions}
              style={AppStyles.homeSegmentedButtons}
            />
            <View style={[AppStyles.homeSummaryRow, { marginTop: 10 }]}>
              <Text style={[AppStyles.homeSummaryLabel, { color: theme.colors.onSurfaceVariant }]}>
                You: {playerIcon === 'X' ? '❌' : '⭕'} {playerIcon}
              </Text>
              <Text style={[AppStyles.homeSummaryLabel, { color: theme.colors.onSurfaceVariant }]}>
                {getOpponentName()}: {getOpponentIcon() === 'X' ? '❌' : '⭕'} {getOpponentIcon()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[AppStyles.homeCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[AppStyles.homeSectionTitle, { color: theme.colors.onSurface }]}>
              👥 Game Mode
            </Text>
            <Text style={[AppStyles.homeSectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Play against AI or a friend
            </Text>
            <RadioButton.Group onValueChange={setGameMode} value={gameMode}>
              <View style={AppStyles.homeRadioOption}>
                <RadioButton value="pvc" />
                <View style={AppStyles.homeRadioText}>
                  <Text style={[AppStyles.homeRadioLabel, { color: theme.colors.onSurface }]}>
                    🤖 Player vs Computer
                  </Text>
                  <Text style={[AppStyles.homeRadioSubtext, { color: theme.colors.onSurfaceVariant }]}>
                    Challenge our enhanced AI with new win criteria
                  </Text>
                </View>
              </View>
              <View style={AppStyles.homeRadioOption}>
                <RadioButton value="pvp" />
                <View style={AppStyles.homeRadioText}>
                  <Text style={[AppStyles.homeRadioLabel, { color: theme.colors.onSurface }]}>
                    👤 Player vs Player
                  </Text>
                  <Text style={[AppStyles.homeRadioSubtext, { color: theme.colors.onSurfaceVariant }]}>
                    Play with a friend locally - faster games!
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {gameMode === 'pvc' && (
          <Card style={[AppStyles.homeCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[AppStyles.homeSectionTitle, { color: theme.colors.onSurface }]}>
                🧠 AI Difficulty
              </Text>
              <Text style={[AppStyles.homeSectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                Choose how challenging you want the AI to be
              </Text>
              <RadioButton.Group onValueChange={setDifficulty} value={difficulty}>
                {difficultyOptions.map((option) => (
                  <View key={option.value} style={AppStyles.homeRadioOption}>
                    <RadioButton value={option.value} />
                    <View style={AppStyles.homeRadioText}>
                      <Text style={[AppStyles.homeRadioLabel, { color: theme.colors.onSurface }]}>
                        {option.label}
                      </Text>
                      <Text style={[AppStyles.homeRadioSubtext, { color: theme.colors.onSurfaceVariant }]}>
                        {getDifficultyDescription(option.value)}
                      </Text>
                    </View>
                  </View>
                ))}
              </RadioButton.Group>
            </Card.Content>
          </Card>
        )}

        <Card style={[AppStyles.homeCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[AppStyles.homeSectionTitle, { color: theme.colors.onSurface }]}>
              🏷️ Player Names
            </Text>
            <Text style={[AppStyles.homeSectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Customize player names
            </Text>
            <TextInput
              label={`Player 1 Name (${playerIcon})`}
              value={player1Name}
              onChangeText={setPlayer1Name}
              style={AppStyles.homeTextInput}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
            />
            {gameMode === 'pvp' && (
              <TextInput
                label={`Player 2 Name (${getOpponentIcon()})`}
                value={player2Name}
                onChangeText={setPlayer2Name}
                style={AppStyles.homeTextInput}
                mode="outlined"
                left={<TextInput.Icon icon="account-multiple" />}
              />
            )}
          </Card.Content>
        </Card>

        <Card style={[AppStyles.homeSummaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text style={[AppStyles.homeSummaryTitle, { color: theme.colors.onPrimaryContainer }]}>
              🎮 Game Summary
            </Text>
            <View style={AppStyles.homeSummaryRow}>
              <Text style={[AppStyles.homeSummaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Grid Size:
              </Text>
              <Text style={[AppStyles.homeSummaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {gridSize}×{gridSize}
              </Text>
            </View>
            <View style={AppStyles.homeSummaryRow}>
              <Text style={[AppStyles.homeSummaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Win Condition:
              </Text>
              <Text style={[AppStyles.homeSummaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {getWinLength(parseInt(gridSize))} in a row
              </Text>
            </View>
            <View style={AppStyles.homeSummaryRow}>
              <Text style={[AppStyles.homeSummaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Your Icon:
              </Text>
              <Text style={[AppStyles.homeSummaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {playerIcon === 'X' ? '❌' : '⭕'} {playerIcon}
              </Text>
            </View>
            <View style={AppStyles.homeSummaryRow}>
              <Text style={[AppStyles.homeSummaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Mode:
              </Text>
              <Text style={[AppStyles.homeSummaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {gameMode === 'pvc' ? `vs AI (${difficulty})` : 'vs Player'}
              </Text>
            </View>
            <View style={AppStyles.homeSummaryRow}>
              <Text style={[AppStyles.homeSummaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Players:
              </Text>
              <Text style={[AppStyles.homeSummaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {player1Name} ({playerIcon}) vs {getOpponentName()} ({getOpponentIcon()})
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={startGame}
          style={AppStyles.homeStartButton}
          contentStyle={AppStyles.homeStartButtonContent}
          icon="play"
        >
          Start Game
        </Button>

        <View style={AppStyles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
