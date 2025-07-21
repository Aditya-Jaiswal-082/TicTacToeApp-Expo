import React from 'react';
import { View, StyleSheet, Dimensions, Platform, Alert, Share } from 'react-native';
import { 
  Title, 
  Text, 
  Button, 
  Card, 
  Surface,
  useTheme,
  IconButton 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

export default function ResultScreen({ 
  winner, 
  gameStats, 
  settings, 
  onNavigate,
  onPlayAgain
}) {
  const theme = useTheme();

  const getResultIcon = () => {
    if (winner === 'draw') {
      return { name: 'handshake', color: theme.colors.outline };
    } else if (winner === 'X') {
      return { name: 'trophy', color: '#FFD700' };
    } else {
      return { name: 'trophy', color: '#C0C0C0' };
    }
  };

  const getResultMessage = () => {
    if (winner === 'draw') {
      return "It's a Draw!";
    } else if (winner === 'X') {
      return `${settings.playerNames.player1} Wins!`;
    } else {
      return `${settings.playerNames.player2} Wins!`;
    }
  };

  const getResultSubMessage = () => {
    if (winner === 'draw') {
      return "Great game! Nobody wins this time.";
    } else if (settings.gameMode === 'pvc') {
      if (winner === 'X') {
        return `You beat the ${settings.difficulty} AI!`;
      } else {
        return `The ${settings.difficulty} AI wins this round!`;
      }
    } else {
      return "Congratulations on your victory!";
    }
  };

  const getExperiencePoints = () => {
    if (settings.gameMode !== 'pvc' || winner !== 'X') return 0;
    
    const difficultyPoints = {
      easy: 1,
      medium: 3,
      hard: 5,
      expert: 7
    };
    
    return difficultyPoints[settings.difficulty] || 1;
  };

  const generateShareText = (format = 'simple') => {
    const totalGames = gameStats.scores.X + gameStats.scores.O + gameStats.scores.draws;
    const winRate = totalGames > 0 ? ((gameStats.scores.X / totalGames) * 100).toFixed(1) : 0;

    switch (format) {
      case 'detailed':
        return `🎮 Tic-Tac-Toe Game Result 🎮

🏆 ${getResultMessage()}
📊 ${settings.gridSize}×${settings.gridSize} Grid
${settings.gameMode === 'pvc' ? `🤖 AI Difficulty: ${settings.difficulty}` : '👥 Player vs Player'}

📈 Session Stats:
• ${settings.playerNames.player1}: ${gameStats.scores.X} wins
• ${settings.playerNames.player2}: ${gameStats.scores.O} wins
• Draws: ${gameStats.scores.draws}
• Win Rate: ${winRate}%
• Game Duration: ${gameStats.gameDuration}s

${winner === 'X' ? '🎉' : winner === 'O' ? '😅' : '🤝'} ${getResultSubMessage()}

#TicTacToe #Gaming #Challenge`;

      case 'social':
        const emoji = winner === 'X' ? '🎉' : winner === 'O' ? '😅' : '🤝';
        const resultText = winner === 'draw' ? 'tied' : winner === 'X' ? 'won' : 'lost';
        return `${emoji} Just played Tic-Tac-Toe and ${resultText}! ${settings.gridSize}×${settings.gridSize} grid${settings.gameMode === 'pvc' ? ` vs ${settings.difficulty} AI` : ' vs friend'} 🎮 #TicTacToe`;

      case 'stats':
        return `📊 My Tic-Tac-Toe Stats:
Wins: ${gameStats.scores.X} | Losses: ${gameStats.scores.O} | Draws: ${gameStats.scores.draws}
Win Rate: ${winRate}% | Games Played: ${totalGames}`;

      default:
        return `🎮 ${getResultMessage()} in Tic-Tac-Toe (${settings.gridSize}×${settings.gridSize})! ${winner === 'X' ? '🎉' : winner === 'O' ? '😅' : '🤝'}`;
    }
  };

  const shareResult = async () => {
    const shareOptions = [
      { title: '📱 Quick Share', value: 'native' },
      { title: '📋 Copy to Clipboard', value: 'clipboard' },
      { title: '📊 Share Stats', value: 'stats' },
      { title: '📝 Detailed Report', value: 'detailed' },
    ];

    if (Platform.OS === 'web') {
      showWebShareOptions();
    } else {
      showMobileShareOptions();
    }
  };

  const showMobileShareOptions = () => {
    const options = ['Quick Share', 'Copy Simple', 'Copy Detailed', 'Copy Stats', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    // For now, we'll use Alert.alert since ActionSheet is not available
    // In a real app, you might want to install @expo/react-native-action-sheet
    Alert.alert(
      'Share Result',
      'How would you like to share your result?',
      [
        {
          text: 'Quick Share',
          onPress: () => shareNative('simple'),
        },
        {
          text: 'Copy Simple',
          onPress: () => copyToClipboard('simple'),
        },
        {
          text: 'Copy Detailed',
          onPress: () => copyToClipboard('detailed'),
        },
        {
          text: 'Copy Stats',
          onPress: () => copyToClipboard('stats'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const showWebShareOptions = () => {
    Alert.alert(
      'Share Result',
      'Choose sharing option:',
      [
        {
          text: 'Native Share',
          onPress: () => shareWebNative(),
        },
        {
          text: 'Copy Simple',
          onPress: () => copyToClipboard('simple'),
        },
        {
          text: 'Copy Detailed',
          onPress: () => copyToClipboard('detailed'),
        },
        {
          text: 'Copy Stats Only',
          onPress: () => copyToClipboard('stats'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const shareNative = async (format = 'simple') => {
    try {
      const shareText = generateShareText(format);
      const result = await Share.share({
        message: shareText,
        title: 'Tic-Tac-Toe Result',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Alert.alert('Success', 'Result shared successfully!');
        } else {
          Alert.alert('Success', 'Result shared!');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share result. Try copying to clipboard instead.');
      copyToClipboard(format);
    }
  };

  const shareWebNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tic-Tac-Toe Result',
          text: generateShareText('social'),
          url: window.location.href,
        });
        Alert.alert('Success', 'Result shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Web share error:', error);
          copyToClipboard('simple');
        }
      }
    } else {
      copyToClipboard('simple');
    }
  };

  const copyToClipboard = async (format = 'simple') => {
    try {
      const textToCopy = generateShareText(format);
      
      if (Platform.OS === 'web') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
      } else {
        await Clipboard.setStringAsync(textToCopy);
      }
      
      Alert.alert(
        'Copied!', 
        `${format === 'detailed' ? 'Detailed result' : format === 'stats' ? 'Stats' : 'Result'} copied to clipboard!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Clipboard error:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const shareToSocial = (platform) => {
    const text = encodeURIComponent(generateShareText('social'));
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      default:
        return;
    }
    
    if (Platform.OS === 'web') {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const playAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      onNavigate('game');
    }
  };

  const goToSettings = () => {
    onNavigate('home');
  };

  const showStats = () => {
    const totalGames = gameStats.scores.X + gameStats.scores.O + gameStats.scores.draws;
    const winRate = totalGames > 0 ? ((gameStats.scores.X / totalGames) * 100).toFixed(1) : 0;
    
    const statsMessage = `📊 Game Statistics

🎮 Total Games: ${totalGames}
🏆 ${settings.playerNames.player1}: ${gameStats.scores.X} wins
${settings.gameMode === 'pvc' ? '🤖' : '👤'} ${settings.playerNames.player2}: ${gameStats.scores.O} wins
🤝 Draws: ${gameStats.scores.draws}
📈 Win Rate: ${winRate}%

⏱️ This Game: ${gameStats.gameDuration}s
🎯 Grid Size: ${settings.gridSize}×${settings.gridSize}
${settings.gameMode === 'pvc' ? `🧠 AI Difficulty: ${settings.difficulty}` : ''}`;

    Alert.alert('Game Statistics', statsMessage, [
      { text: 'Share Stats', onPress: () => copyToClipboard('stats') },
      { text: 'Close', style: 'default' }
    ]);
  };

  const icon = getResultIcon();
  const experiencePoints = getExperiencePoints();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon="close" 
          onPress={goToSettings}
          size={24}
          iconColor={theme.colors.onSurface}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Game Result
        </Text>
        <IconButton 
          icon="share-variant" 
          onPress={shareResult}
          size={24}
          iconColor={theme.colors.primary}
        />
      </View>

      {/* Result Header */}
      <Card style={[styles.resultCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.resultContent}>
          <MaterialCommunityIcons
            name={icon.name}
            size={80}
            color={icon.color}
            style={styles.resultIcon}
          />
          
          <Title style={[styles.resultTitle, { color: theme.colors.onSurface }]}>
            {getResultMessage()}
          </Title>
          
          <Text style={[styles.resultSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            {getResultSubMessage()}
          </Text>

          {experiencePoints > 0 && (
            <Surface style={[styles.experienceCard, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[styles.experienceText, { color: theme.colors.onPrimaryContainer }]}>
                +{experiencePoints} XP Earned!
              </Text>
            </Surface>
          )}
        </Card.Content>
      </Card>

      {/* Game Statistics */}
      {gameStats && (
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={[styles.statsTitle, { color: theme.colors.onSurface }]}>
              This Game
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {gameStats.totalMoves}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Moves
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.secondary }]}>
                  {gameStats.gameDuration}s
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Game Time
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.tertiary }]}>
                  {settings.gridSize}×{settings.gridSize}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Grid Size
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Overall Score Display */}
      <View style={styles.scoreContainer}>
        <Surface style={[styles.scoreCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={styles.scoreName}>{settings.playerNames.player1}</Text>
          <Text style={styles.scoreValue}>{gameStats?.scores?.X || 0}</Text>
        </Surface>
        
        <Surface style={[styles.scoreCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={styles.scoreName}>Draws</Text>
          <Text style={styles.scoreValue}>{gameStats?.scores?.draws || 0}</Text>
        </Surface>
        
        <Surface style={[styles.scoreCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Text style={styles.scoreName}>{settings.playerNames.player2}</Text>
          <Text style={styles.scoreValue}>{gameStats?.scores?.O || 0}</Text>
        </Surface>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={playAgain}
          style={[styles.actionButton, styles.playAgainButton]}
          contentStyle={styles.buttonContent}
          icon="refresh"
        >
          Play Again
        </Button>
        
        <Button
          mode="outlined"
          onPress={goToSettings}
          style={styles.actionButton}
          contentStyle={styles.buttonContent}
          icon="cog"
        >
          New Game
        </Button>
      </View>

      {/* Secondary Actions */}
      <View style={styles.secondaryActions}>
        <Button
          mode="text"
          onPress={shareResult}
          icon="share-variant"
          textColor={theme.colors.primary}
        >
          Share Result
        </Button>
        
        <Button
          mode="text"
          onPress={showStats}
          icon="chart-line"
          textColor={theme.colors.primary}
        >
          View Stats
        </Button>
      </View>

      {/* Quick Social Share (Web only) */}
      {Platform.OS === 'web' && (
        <View style={styles.socialShareContainer}>
          <Text style={[styles.socialShareTitle, { color: theme.colors.onSurfaceVariant }]}>
            Quick Share:
          </Text>
          <View style={styles.socialButtons}>
            <IconButton
              icon="twitter"
              size={24}
              iconColor="#1DA1F2"
              onPress={() => shareToSocial('twitter')}
            />
            <IconButton
              icon="facebook"
              size={24}
              iconColor="#4267B2"
              onPress={() => shareToSocial('facebook')}
            />
            <IconButton
              icon="whatsapp"
              size={24}
              iconColor="#25D366"
              onPress={() => shareToSocial('whatsapp')}
            />
            <IconButton
              icon="send"
              size={24}
              iconColor="#0088CC"
              onPress={() => shareToSocial('telegram')}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultCard: {
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  resultContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultIcon: {
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  experienceCard: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  experienceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  scoreCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 0.48,
  },
  playAgainButton: {
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialShareContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  socialShareTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
