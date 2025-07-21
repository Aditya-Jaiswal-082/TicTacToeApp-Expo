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

export default function HomeScreen({ onNavigate }) {
  const [gridSize, setGridSize] = useState('3');
  const [gameMode, setGameMode] = useState('pvc');
  const [difficulty, setDifficulty] = useState('medium');
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');

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

  const startGame = () => {
    const settings = {
      gridSize: parseInt(gridSize),
      gameMode,
      difficulty,
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
              🎯 Grid Size
            </Text>
            <Text style={[AppStyles.homeSectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Choose the game board size
            </Text>
            <SegmentedButtons
              value={gridSize}
              onValueChange={setGridSize}
              buttons={gridSizeOptions}
              style={AppStyles.homeSegmentedButtons}
            />
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
                    Challenge our smart AI
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
                    Play with a friend locally
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
              label="Player 1 Name"
              value={player1Name}
              onChangeText={setPlayer1Name}
              style={AppStyles.homeTextInput}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
            />
            {gameMode === 'pvp' && (
              <TextInput
                label="Player 2 Name"
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
                {player1Name} vs {gameMode === 'pvc' ? 'AI' : player2Name}
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
