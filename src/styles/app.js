import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const AppStyles = StyleSheet.create({
  // ======================
  // APP.JS STYLES
  // ======================
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ======================
  // COMMON/SHARED STYLES
  // ======================
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
  card: {
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontWeight: 'bold',
  },
  homeSubtitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  homeCard: {
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  homeSectionDescription: {
    fontSize: 14,
    marginBottom: 15,
  },
  homeSegmentedButtons: {
    marginBottom: 10,
  },
  homeRadioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  homeRadioText: {
    flex: 1,
    marginLeft: 8,
  },
  homeRadioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  homeRadioSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  homeTextInput: {
    marginBottom: 15,
  },
  homeSummaryCard: {
    marginBottom: 25,
  },
  homeSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  homeSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  homeSummaryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  homeSummaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  homeStartButton: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  homeStartButtonContent: {
    paddingVertical: 12,
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
  },
  gameHeaderCenter: {
    alignItems: 'center',
  },
  gameHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gameStatusCard: {
    marginBottom: 15,
    elevation: 4,
  },
  gameStatusContent: {
    alignItems: 'center',
  },
  gameStatus: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
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
    elevation: 2,
  },
  gameScoreName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  gameScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  gameActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    marginBottom: 15,
  },
  gameActionButton: {
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

  // ======================
  // GAME BOARD STYLES
  // ======================
  gameBoard: {
    alignSelf: 'center',
    borderRadius: 16,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 2,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
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
  },
  gameCellEmptyIndicator: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0,
  },

  // ======================
  // RESULT SCREEN STYLES
  // ======================
  resultContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
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
  resultExperienceCard: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  resultExperienceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultStatsCard: {
    marginBottom: 20,
  },
  resultStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resultStatItem: {
    alignItems: 'center',
  },
  resultStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultStatLabel: {
    fontSize: 12,
    textAlign: 'center',
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
  },
  resultScoreName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  resultScoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resultActionButton: {
    flex: 0.48,
  },
  resultPlayAgainButton: {
    elevation: 4,
  },
  resultSecondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  resultSocialShareContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  resultSocialShareTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  resultSocialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default AppStyles;
