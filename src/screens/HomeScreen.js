import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
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

const { width } = Dimensions.get('window');

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Title style={[styles.title, { color: theme.colors.primary }]}>
            🎮 Tic Tac Toe
          </Title>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Choose your game settings and start playing!
          </Text>
        </View>
        
        {/* Grid Size Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              🎯 Grid Size
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Choose the game board size
            </Text>
            <SegmentedButtons
              value={gridSize}
              onValueChange={setGridSize}
              buttons={gridSizeOptions}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Game Mode Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              👥 Game Mode
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Play against AI or a friend
            </Text>
            <RadioButton.Group onValueChange={setGameMode} value={gameMode}>
              <View style={styles.radioOption}>
                <RadioButton value="pvc" />
                <View style={styles.radioText}>
                  <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>
                    🤖 Player vs Computer
                  </Text>
                  <Text style={[styles.radioSubtext, { color: theme.colors.onSurfaceVariant }]}>
                    Challenge our smart AI
                  </Text>
                </View>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="pvp" />
                <View style={styles.radioText}>
                  <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>
                    👤 Player vs Player
                  </Text>
                  <Text style={[styles.radioSubtext, { color: theme.colors.onSurfaceVariant }]}>
                    Play with a friend locally
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* AI Difficulty Selection */}
        {gameMode === 'pvc' && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                🧠 AI Difficulty
              </Text>
              <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                Choose how challenging you want the AI to be
              </Text>
              <RadioButton.Group onValueChange={setDifficulty} value={difficulty}>
                {difficultyOptions.map((option) => (
                  <View key={option.value} style={styles.radioOption}>
                    <RadioButton value={option.value} />
                    <View style={styles.radioText}>
                      <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>
                        {option.label}
                      </Text>
                      <Text style={[styles.radioSubtext, { color: theme.colors.onSurfaceVariant }]}>
                        {getDifficultyDescription(option.value)}
                      </Text>
                    </View>
                  </View>
                ))}
              </RadioButton.Group>
            </Card.Content>
          </Card>
        )}

        {/* Player Names */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              🏷️ Player Names
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Customize player names
            </Text>
            <TextInput
              label="Player 1 Name"
              value={player1Name}
              onChangeText={setPlayer1Name}
              style={styles.textInput}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
            />
            {gameMode === 'pvp' && (
              <TextInput
                label="Player 2 Name"
                value={player2Name}
                onChangeText={setPlayer2Name}
                style={styles.textInput}
                mode="outlined"
                left={<TextInput.Icon icon="account-multiple" />}
              />
            )}
          </Card.Content>
        </Card>

        {/* Game Summary */}
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text style={[styles.summaryTitle, { color: theme.colors.onPrimaryContainer }]}>
              🎮 Game Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Grid Size:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {gridSize}×{gridSize}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Mode:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {gameMode === 'pvc' ? `vs AI (${difficulty})` : 'vs Player'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Players:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {player1Name} vs {gameMode === 'pvc' ? 'AI' : player2Name}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Start Game Button */}
        <Button 
          mode="contained" 
          onPress={startGame}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          icon="play"
        >
          Start Game
        </Button>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function for difficulty descriptions
const getDifficultyDescription = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'Perfect for beginners';
    case 'medium': return 'Balanced challenge';
    case 'hard': return 'Strategic thinking required';
    case 'expert': return 'Maximum challenge';
    default: return '';
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 15,
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioText: {
    flex: 1,
    marginLeft: 8,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  textInput: {
    marginBottom: 15,
  },
  summaryCard: {
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  startButton: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonContent: {
    paddingVertical: 12,
  },
  bottomSpacer: {
    height: 50,
  },
});
