// Modified checkWinner function with flexible win criteria
export const createGrid = (size) => {
  return Array(size * size).fill(null);
};

export const checkWinner = (grid, gridSize) => {
  // Dynamic win criteria based on grid size
  const getWinLength = (size) => {
    switch (size) {
      case 3: return 3; // Classic 3-in-a-row
      case 4: return 3; // 3-in-a-row for 4×4 (your suggestion!)
      case 5: return 4; // 4-in-a-row for 5×5 (your suggestion!)
      default: return size; // Fallback to full line
    }
  };

  const winLength = getWinLength(gridSize);
  const lines = [];
  
  // Generate all possible winning lines of required length
  
  // Horizontal lines
  for (let row = 0; row < gridSize; row++) {
    for (let startCol = 0; startCol <= gridSize - winLength; startCol++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push(row * gridSize + startCol + i);
      }
      lines.push(line);
    }
  }
  
  // Vertical lines  
  for (let col = 0; col < gridSize; col++) {
    for (let startRow = 0; startRow <= gridSize - winLength; startRow++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((startRow + i) * gridSize + col);
      }
      lines.push(line);
    }
  }
  
  // Diagonal lines (top-left to bottom-right)
  for (let row = 0; row <= gridSize - winLength; row++) {
    for (let col = 0; col <= gridSize - winLength; col++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((row + i) * gridSize + col + i);
      }
      lines.push(line);
    }
  }
  
  // Diagonal lines (top-right to bottom-left)
  for (let row = 0; row <= gridSize - winLength; row++) {
    for (let col = winLength - 1; col < gridSize; col++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((row + i) * gridSize + col - i);
      }
      lines.push(line);
    }
  }

  // Check each line for a winner
  for (let line of lines) {
    const values = line.map(index => grid[index]);
    if (values[0] && values.every(val => val === values[0])) {
      return { winner: values[0], line };
    }
  }
  
  // Check for draw
  if (grid.every(cell => cell !== null)) {
    return { winner: 'draw', line: [] };
  }
  
  return { winner: null, line: [] };
};

export const getAvailableMoves = (grid) => {
  return grid.map((cell, index) => cell === null ? index : null)
           .filter(index => index !== null);
};

// Helper function to get win length for any grid size
export const getWinLength = (gridSize) => {
  switch (gridSize) {
    case 3: return 3;
    case 4: return 3; // Your suggestion
    case 5: return 4; // Your suggestion
    default: return gridSize;
  }
};

// Enhanced helper function for AI to detect potential winning lines
export const getWinningOpportunities = (grid, gridSize, player) => {
  const winLength = getWinLength(gridSize);
  const opportunities = [];
  
  // Check all possible lines for potential wins
  const lines = [];
  
  // Generate all possible lines (same logic as checkWinner)
  // Horizontal lines
  for (let row = 0; row < gridSize; row++) {
    for (let startCol = 0; startCol <= gridSize - winLength; startCol++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push(row * gridSize + startCol + i);
      }
      lines.push(line);
    }
  }
  
  // Vertical lines  
  for (let col = 0; col < gridSize; col++) {
    for (let startRow = 0; startRow <= gridSize - winLength; startRow++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((startRow + i) * gridSize + col);
      }
      lines.push(line);
    }
  }
  
  // Diagonal lines (both directions)
  for (let row = 0; row <= gridSize - winLength; row++) {
    for (let col = 0; col <= gridSize - winLength; col++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((row + i) * gridSize + col + i);
      }
      lines.push(line);
    }
  }
  
  for (let row = 0; row <= gridSize - winLength; row++) {
    for (let col = winLength - 1; col < gridSize; col++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((row + i) * gridSize + col - i);
      }
      lines.push(line);
    }
  }
  
  // Analyze each line for opportunities
  for (let line of lines) {
    const values = line.map(index => grid[index]);
    const playerCount = values.filter(val => val === player).length;
    const emptyCount = values.filter(val => val === null).length;
    const opponentCount = values.filter(val => val && val !== player).length;
    
    // This line has potential if no opponent pieces and has player pieces
    if (opponentCount === 0 && playerCount > 0 && emptyCount > 0) {
      opportunities.push({
        line,
        playerCount,
        emptyCount,
        priority: playerCount / emptyCount // Higher is better
      });
    }
  }
  
  return opportunities.sort((a, b) => b.priority - a.priority);
};
