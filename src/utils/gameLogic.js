export const createGrid = (size) => {
  return Array(size * size).fill(null);
};

export const checkWinner = (grid, size) => {
  const lines = [];
  
  // Rows
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(i * size + j);
    }
    lines.push(row);
  }
  
  // Columns
  for (let i = 0; i < size; i++) {
    const col = [];
    for (let j = 0; j < size; j++) {
      col.push(j * size + i);
    }
    lines.push(col);
  }
  
  // Diagonals
  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < size; i++) {
    diag1.push(i * size + i);
    diag2.push(i * size + (size - 1 - i));
  }
  lines.push(diag1, diag2);

  // Check each line
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
