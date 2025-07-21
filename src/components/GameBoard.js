import React from 'react';
import { View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppStyles } from '../styles/app';
import GameCell from './GameCell';

const { width } = Dimensions.get('window');

export default function GameBoard({ grid, gridSize, onCellPress, winningLine, disabled }) {
  const theme = useTheme();
  const boardSize = Math.min(width * 0.88, 380);
  const gap = 6;
  const totalGaps = (gridSize - 1) * gap;
  const cellSize = (boardSize - totalGaps - 16) / gridSize;

  const renderRow = (rowIndex) => {
    const cells = [];
    for (let colIndex = 0; colIndex < gridSize; colIndex++) {
      const cellIndex = rowIndex * gridSize + colIndex;
      cells.push(
        <GameCell
          key={cellIndex}
          index={cellIndex}
          value={grid[cellIndex]}
          size={cellSize}
          onPress={() => onCellPress(cellIndex)}
          isWinning={winningLine.includes(cellIndex)}
          disabled={disabled}
        />
      );
    }
    return (
      <View key={rowIndex} style={[AppStyles.gameBoardRow, { gap }]}>
        {cells}
      </View>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < gridSize; i++) {
      rows.push(renderRow(i));
    }
    return rows;
  };

  return (
    <View style={[
      AppStyles.gameBoard,
      { 
        width: boardSize, 
        backgroundColor: theme.colors.surfaceVariant,
        borderColor: theme.colors.outline,
      }
    ]}>
      <View style={[AppStyles.gameBoardGridContainer, { gap }]}>
        {renderBoard()}
      </View>
    </View>
  );
}
