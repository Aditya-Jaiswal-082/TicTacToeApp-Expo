import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import GameCell from './GameCell';

const { width } = Dimensions.get('window');

export default function GameBoard({ grid, gridSize, onCellPress, winningLine, disabled }) {
  const theme = useTheme();
  const boardSize = Math.min(width * 0.88, 380);
  const gap = 6; // Space between cells
  const totalGaps = (gridSize - 1) * gap;
  const cellSize = (boardSize - totalGaps - 16) / gridSize; // 16 for padding

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
      <View key={rowIndex} style={[styles.row, { gap }]}>
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
      styles.board, 
      { 
        width: boardSize, 
        backgroundColor: theme.colors.surfaceVariant,
        borderColor: theme.colors.outline,
      }
    ]}>
      <View style={[styles.gridContainer, { gap }]}>
        {renderBoard()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
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
  gridContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
