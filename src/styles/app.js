import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const GameColors = {
  // Core pastel theme
  primary: "#7C83FD",        // Soft indigo
  primaryLight: "#AAB3FF",   // Light lavender
  primaryDark: "#545CFF",    // Deeper indigo

  secondary: "#F6A9A3",      // Soft coral-pink
  secondaryLight: "#FBD2CE",
  secondaryDark: "#E57F76",

  accent: "#9ED2C6",         // Mint pastel
  accentLight: "#CDEFE7",
  accentDark: "#6FB7A8",

  // Backgrounds
  background: "#F7F7FB",     // Near-white pastel gray
  backgroundDark: "#ECECF5", // Slightly darker pastel
  surface: "#FFFFFF",
  surfaceVariant: "#F1F1FA",

  // Game-specific colors
  playerX: "#FF6B6B",        // Soft red
  playerO: "#4ECDC4",        // Pastel teal
  gridLines: "#D1D1E0",

  // Status colors
  success: "#7FD1AE",
  warning: "#FFD97D",
  error: "#FF8A80",
  info: "#82A0FF",

  // Text colors
  textPrimary: "#333333",
  textSecondary: "#696984",
  textMuted: "#A3A3B5",

  // Others
  border: "#DDDDDD",
  overlay: "rgba(0,0,0,0.08)",
  shadow: "rgba(0,0,0,0.1)",
};


export const AppStyles = StyleSheet.create({
  // ======================
  // APP.JS STYLES
  // ======================
  appContainer: {
    flex: 1,
    backgroundColor: GameColors.background,
  },

  // ======================
  // COMMON/SHARED STYLES
  // ======================
  safeArea: {
    flex: 1,
    backgroundColor: GameColors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 20,
    elevation: 6,
    shadowColor: GameColors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: GameColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GameColors.border,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  bottomSpacer: {
    height: 50,
  },

  // ======================
  // HOME SCREEN STYLES
  // ======================
  homeScrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  homeHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  homeTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 32,
    color: GameColors.primary,
    fontWeight: 'bold',
    textShadowColor: GameColors.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  homeSubtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: GameColors.textSecondary,
  },
  homeCard: {
    marginBottom: 20,
    elevation: 6,
    shadowColor: GameColors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: GameColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GameColors.border,
  },
  homeSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: GameColors.textPrimary,
  },
  homeSectionDescription: {
    fontSize: 14,
    marginBottom: 15,
    color: GameColors.textSecondary,
  },
  homeSegmentedButtons: {
    marginBottom: 10,
  },
  homeRadioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: GameColors.surfaceVariant,
  },
  homeRadioText: {
    flex: 1,
    marginLeft: 8,
  },
  homeRadioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: GameColors.textPrimary,
  },
  homeRadioSubtext: {
    fontSize: 12,
    marginTop: 2,
    color: GameColors.textMuted,
  },
  homeTextInput: {
    marginBottom: 15,
  },
  homeSummaryCard: {
    marginBottom: 25,
    backgroundColor: GameColors.primary,
    borderRadius: 16,
    elevation: 8,
    shadowColor: GameColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  homeSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: GameColors.backgroundLight,
  },
  homeSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  homeSummaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: GameColors.backgroundLight,
  },
  homeSummaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GameColors.backgroundLight,
  },
  homeStartButton: {
    elevation: 10,
    shadowColor: GameColors.secondary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    backgroundColor: GameColors.secondary,
    borderRadius: 16,
  },
  homeStartButtonContent: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  // ======================
  // GAME SCREEN STYLES
  // ======================
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  gameHeaderCenter: {
    alignItems: 'center',
  },
  gameHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: GameColors.textPrimary,
  },
  gameStatusCard: {
    marginBottom: 15,
    elevation: 6,
    backgroundColor: GameColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GameColors.border,
  },
  gameStatusContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  gameStatus: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: GameColors.primary,
  },
  gameThinkingProgress: {
    width: '100%',
    marginTop: 10,
  },
  gameScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gameScoreCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    backgroundColor: GameColors.surface,
    borderWidth: 1,
    borderColor: GameColors.border,
  },
  gameScoreName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: GameColors.textSecondary,
  },
  gameScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GameColors.textPrimary,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  gameInfoChip: {
    marginHorizontal: 4,
    marginVertical: 2,
    backgroundColor: GameColors.surfaceVariant,
  },
  gameActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    marginBottom: 15,
  },
  gameActionButton: {
    minWidth: 120,
    borderRadius: 12,
  },
  gameOverActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  gameOverButton: {
    minWidth: 140,
    borderRadius: 12,
  },

  // ======================
  // GAME BOARD STYLES
  // ======================
  gameBoard: {
    alignSelf: 'center',
    borderRadius: 20,
    padding: 12,
    elevation: 12,
    shadowColor: GameColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: GameColors.primary,
    backgroundColor: GameColors.gridBackground,
  },
  gameBoardGridContainer: {
    alignItems: 'center',
  },
  gameBoardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ======================
  // GAME CELL STYLES
  // ======================
  gameCell: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GameColors.gridLines,
    elevation: 6,
    shadowColor: GameColors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative',
    backgroundColor: GameColors.surfaceLight,
    margin: 2,
  },
  gameCellText: {
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      default: 'System',
    }),
    textAlign: 'center',
    textShadowColor: GameColors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameCellEmptyIndicator: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.3,
    backgroundColor: GameColors.textMuted,
  },

  // Player-specific cell styles
  gameCellX: {
    color: GameColors.playerX,
    fontSize: 36,
  },
  gameCellO: {
    color: GameColors.playerO,
    fontSize: 36,
  },
  
  // Winning cell highlight
  gameCellWinning: {
    backgroundColor: GameColors.primary,
    borderColor: GameColors.primaryDark,
    elevation: 8,
    shadowOpacity: 0.5,
    transform: [{ scale: 1.05 }],
  },

  // ======================
  // RESULT SCREEN STYLES
  // ======================
  resultContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: GameColors.background,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GameColors.textPrimary,
  },
  resultCard: {
    marginBottom: 30,
    elevation: 8,
    shadowColor: GameColors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    backgroundColor: GameColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GameColors.border,
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
    color: GameColors.textPrimary,
    textShadowColor: GameColors.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resultSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: GameColors.textSecondary,
    lineHeight: 22,
  },
  resultExperienceCard: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: GameColors.primary,
    elevation: 4,
    shadowColor: GameColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  resultExperienceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GameColors.backgroundLight,
    textAlign: 'center',
  },
  resultStatsCard: {
    marginBottom: 20,
    backgroundColor: GameColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GameColors.border,
    elevation: 4,
  },
  resultStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: GameColors.textPrimary,
  },
  resultStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  resultStatItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  resultStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: GameColors.primary,
  },
  resultStatLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: GameColors.textMuted,
  },
  resultScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  resultScoreCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: GameColors.surfaceVariant,
    elevation: 3,
    borderWidth: 1,
    borderColor: GameColors.border,
  },
  resultScoreName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: GameColors.textPrimary,
  },
  resultScoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GameColors.primary,
  },
  resultActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resultActionButton: {
    flex: 0.48,
    borderRadius: 12,
  },
  resultPlayAgainButton: {
    elevation: 6,
    backgroundColor: GameColors.secondary,
    shadowColor: GameColors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  resultSecondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  resultSocialShareContainer: {
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
    backgroundColor: GameColors.surfaceVariant,
    borderRadius: 12,
  },
  resultSocialShareTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: GameColors.textSecondary,
    fontWeight: '500',
  },
  resultSocialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },

  // ======================
  // STATUS-SPECIFIC STYLES
  // ======================
  // Win state styles
  resultWin: {
    color: GameColors.success,
  },
  resultWinCard: {
    backgroundColor: GameColors.success,
    borderColor: GameColors.success,
  },
  
  // Loss state styles
  resultLoss: {
    color: GameColors.error,
  },
  resultLossCard: {
    backgroundColor: GameColors.error,
    borderColor: GameColors.error,
  },
  
  // Draw state styles
  resultDraw: {
    color: GameColors.warning,
  },
  resultDrawCard: {
    backgroundColor: GameColors.warning,
    borderColor: GameColors.warning,
  },

  // ======================
  // UTILITY STYLES
  // ======================
  // Text utilities
  textPrimary: {
    color: GameColors.textPrimary,
  },
  textSecondary: {
    color: GameColors.textSecondary,
  },
  textAccent: {
    color: GameColors.textAccent,
  },
  textSuccess: {
    color: GameColors.success,
  },
  textWarning: {
    color: GameColors.warning,
  },
  textError: {
    color: GameColors.error,
  },
  
  // Background utilities
  bgPrimary: {
    backgroundColor: GameColors.primary,
  },
  bgSecondary: {
    backgroundColor: GameColors.secondary,
  },
  bgSurface: {
    backgroundColor: GameColors.surface,
  },
  bgSuccess: {
    backgroundColor: GameColors.success,
  },
  bgWarning: {
    backgroundColor: GameColors.warning,
  },
  bgError: {
    backgroundColor: GameColors.error,
  },
  
  // Border utilities
  borderPrimary: {
    borderColor: GameColors.primary,
  },
  borderSecondary: {
    borderColor: GameColors.secondary,
  },
  borderSuccess: {
    borderColor: GameColors.success,
  },
  borderWarning: {
    borderColor: GameColors.warning,
  },
  borderError: {
    borderColor: GameColors.error,
  },

  // ======================
  // ANIMATION HELPERS
  // ======================
  fadeIn: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
  scaleUp: {
    transform: [{ scale: 1.1 }],
  },
  scaleDown: {
    transform: [{ scale: 0.9 }],
  },
  
  // Press states
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cellPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },

  // ======================
  // RESPONSIVE HELPERS
  // ======================
  // For different screen sizes
  smallScreen: {
    paddingHorizontal: 10,
  },
  largeScreen: {
    paddingHorizontal: 30,
    maxWidth: 600,
    alignSelf: 'center',
  },
  
  // Tablet optimizations
  tabletContainer: {
    maxWidth: 800,
    alignSelf: 'center',
  },
  tabletGameBoard: {
    maxWidth: 400,
  },
});

// Only export once at the end
export default AppStyles;
