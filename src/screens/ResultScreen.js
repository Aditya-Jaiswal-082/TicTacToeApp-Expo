import React from 'react';
import { View, Platform, Alert, Share } from 'react-native';
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
import { AppStyles } from '../styles/app';
import * as Clipboard from 'expo-clipboard';

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
        return `🎮 ${getResultMessage()} Dekh Bhai !!! (${settings.gridSize}×${settings.gridSize})! ${winner === 'X' ? '🎉' : winner === 'O' ? '😅' : '🤝'}`;
    }
  };

  const shareResult = async () => {
    if (Platform.OS === 'web') {
      showWebShareOptions();
    } else {
      showMobileShareOptions();
    }
  };

  const showMobileShareOptions = () => {
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
        title: 'Dekh Bhai! Tic-Tac-Toe Result',
      });

      if (result.action === Share.sharedAction) {
        Alert.alert('Success', 'Result shared successfully!');
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
          title: 'Dekh Bhai! Tic-Tac-Toe Result',
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
    <View style={AppStyles.resultContainer}>
      <View style={AppStyles.resultHeader}>
        <IconButton 
          icon="close" 
          onPress={goToSettings}
          size={24}
          iconColor={theme.colors.onSurface}
        />
        <Text style={[AppStyles.resultHeaderTitle, { color: theme.colors.onSurface }]}>
          Game Result
        </Text>
        <IconButton 
          icon="share-variant" 
          onPress={shareResult}
          size={24}
          iconColor={theme.colors.primary}
        />
      </View>

      <Card style={[AppStyles.resultCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={AppStyles.resultContent}>
          <MaterialCommunityIcons
            name={icon.name}
            size={80}
            color={icon.color}
            style={AppStyles.resultIcon}
          />
          
          <Title style={[AppStyles.resultTitle, { color: theme.colors.onSurface }]}>
            {getResultMessage()}
          </Title>
          
          <Text style={[AppStyles.resultSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            {getResultSubMessage()}
          </Text>

          {experiencePoints > 0 && (
            <Surface style={[AppStyles.resultExperienceCard, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[AppStyles.resultExperienceText, { color: theme.colors.onPrimaryContainer }]}>
                +{experiencePoints} XP Earned!
              </Text>
            </Surface>
          )}
        </Card.Content>
      </Card>

      {gameStats && (
        <Card style={AppStyles.resultStatsCard}>
          <Card.Content>
            <Text style={[AppStyles.resultStatsTitle, { color: theme.colors.onSurface }]}>
              This Game
            </Text>
            
            <View style={AppStyles.resultStatsGrid}>
              <View style={AppStyles.resultStatItem}>
                <Text style={[AppStyles.resultStatValue, { color: theme.colors.primary }]}>
                  {gameStats.totalMoves}
                </Text>
                <Text style={[AppStyles.resultStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Moves
                </Text>
              </View>
              
              <View style={AppStyles.resultStatItem}>
                <Text style={[AppStyles.resultStatValue, { color: theme.colors.secondary }]}>
                  {gameStats.gameDuration}s
                </Text>
                <Text style={[AppStyles.resultStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Game Time
                </Text>
              </View>
              
              <View style={AppStyles.resultStatItem}>
                <Text style={[AppStyles.resultStatValue, { color: theme.colors.tertiary }]}>
                  {settings.gridSize}×{settings.gridSize}
                </Text>
                <Text style={[AppStyles.resultStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Grid Size
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      <View style={AppStyles.resultScoreContainer}>
        <Surface style={[AppStyles.resultScoreCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={AppStyles.resultScoreName}>{settings.playerNames.player1}</Text>
          <Text style={AppStyles.resultScoreValue}>{gameStats?.scores?.X || 0}</Text>
        </Surface>
        
        <Surface style={[AppStyles.resultScoreCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={AppStyles.resultScoreName}>Draws</Text>
          <Text style={AppStyles.resultScoreValue}>{gameStats?.scores?.draws || 0}</Text>
        </Surface>
        
        <Surface style={[AppStyles.resultScoreCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Text style={AppStyles.resultScoreName}>{settings.playerNames.player2}</Text>
          <Text style={AppStyles.resultScoreValue}>{gameStats?.scores?.O || 0}</Text>
        </Surface>
      </View>

      <View style={AppStyles.resultActionButtons}>
        <Button
          mode="contained"
          onPress={playAgain}
          style={[AppStyles.resultActionButton, AppStyles.resultPlayAgainButton]}
          contentStyle={AppStyles.buttonContent}
          icon="refresh"
        >
          Play Again
        </Button>
        
        <Button
          mode="outlined"
          onPress={goToSettings}
          style={AppStyles.resultActionButton}
          contentStyle={AppStyles.buttonContent}
          icon="cog"
        >
          New Game
        </Button>
      </View>

      <View style={AppStyles.resultSecondaryActions}>
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

      {Platform.OS === 'web' && (
        <View style={AppStyles.resultSocialShareContainer}>
          <Text style={[AppStyles.resultSocialShareTitle, { color: theme.colors.onSurfaceVariant }]}>
            Quick Share:
          </Text>
          <View style={AppStyles.resultSocialButtons}>
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
