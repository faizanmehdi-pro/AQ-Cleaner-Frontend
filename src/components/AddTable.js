import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

const TableBoxManager = ({ tableVisible, setTableVisible }) => {
  const [tableBoxes, setTableBoxes] = useState([]);
  const [newTablePosition, setNewTablePosition] = useState({ x: 10, y: 10 });
  const [tableSize, setTableSize] = useState({ width: 300, height: 300 });
  const [newTableRows, setNewTableRows] = useState(3);
  const [newTableColumns, setNewTableColumns] = useState(3);
  const [newTableData, setNewTableData] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(''))
  );

  const handleSubmitTable = () => {
    setTableBoxes([
      ...tableBoxes,
      {
        rows: newTableRows,
        columns: newTableColumns,
        data: newTableData,
        x: newTablePosition.x,
        y: newTablePosition.y,
        width: tableSize.width,
        height: tableSize.height,
      },
    ]);
    setTableVisible(false);
  };

  const handleCellChange = (index, rowIndex, colIndex, newValue) => {
    setTableBoxes((prev) =>
      prev.map((box, i) =>
        i === index
          ? {
              ...box,
              data: box.data.map((row, rIdx) =>
                rIdx === rowIndex
                  ? row.map((cell, cIdx) =>
                      cIdx === colIndex ? newValue : cell
                    )
                  : row
              ),
            }
          : box
      )
    );
  };

  const updateTableSize = (rows, columns, isNewTable = false, index = null) => {
    if (isNewTable) {
      setNewTableRows(rows);
      setNewTableColumns(columns);
      setNewTableData(
        Array(rows)
          .fill(null)
          .map(() =>
            Array(columns)
              .fill('')
              .map((_, j) => '')
          )
      );
    } else {
      setTableBoxes((prev) =>
        prev.map((box, i) =>
          i === index
            ? {
                ...box,
                rows,
                columns,
                data: Array(rows)
                  .fill(null)
                  .map((_, r) =>
                    Array(columns)
                      .fill('')
                      .map((_, c) => (box.data[r] && box.data[r][c] ? box.data[r][c] : ''))
                  ),
              }
            : box
        )
      );
    }
  };

  const updateTableBoxPosition = (index, x, y) => {
    setTableBoxes((prev) =>
      prev.map((box, i) => (i === index ? { ...box, x, y } : box))
    );
  };

  const updateTableBoxSize = (index, width, height) => {
    setTableBoxes((prev) =>
      prev.map((box, i) => (i === index ? { ...box, width, height } : box))
    );
  };

  const deleteTableBox = (index) => {
    setTableBoxes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {tableVisible && (
        <StyledRnd
          size={tableSize}
          position={{ x: newTablePosition.x, y: newTablePosition.y }}
          onDragStop={(e, d) => setNewTablePosition({ x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            setNewTablePosition(position);
            setTableSize({ width: ref.offsetWidth, height: ref.offsetHeight });
          }}
          style={{ zIndex: 1000 }} // Set a higher z-index for the new table
        >
          <TableContainer>
            <TableControls>
              <label>
                Rows:
                <input
                  type="number"
                  value={newTableRows}
                  min={1}
                  onChange={(e) =>
                    updateTableSize(Number(e.target.value), newTableColumns, true)
                  }
                />
              </label>
              <label>
                Columns:
                <input
                  type="number"
                  value={newTableColumns}
                  min={1}
                  onChange={(e) =>
                    updateTableSize(newTableRows, Number(e.target.value), true)
                  }
                />
              </label>
            </TableControls>
            <StyledTable>
              <tbody>
                {newTableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex}>
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(
                              tableBoxes.length,
                              rowIndex,
                              colIndex,
                              e.target.value
                            )
                          }
                          style={{
                            display: 'none',
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            <TableButtons>
                <SaveButton onClick={handleSubmitTable}>Save Table</SaveButton>
                <CancelButton onClick={() => setTableVisible(false)}>Cancel</CancelButton>
            </TableButtons>
          </TableContainer>
        </StyledRnd>
      )}

      {tableBoxes.map((box, index) => (
        <StyledRnd
          key={index}
          size={{ width: box.width, height: box.height }}
          position={{ x: box.x, y: box.y }}
          onDragStop={(e, d) => updateTableBoxPosition(index, d.x, d.y)}
          onResizeStop={(e, direction, ref) =>
            updateTableBoxSize(index, ref.offsetWidth, ref.offsetHeight)
          }
          style={{ zIndex: 10 }} // Set a lower z-index for saved tables
        >
          <TableContainer>
            <StyledTable>
              <tbody>
                {box.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex}>
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(index, rowIndex, colIndex, e.target.value)
                          }
                          style={{
                            textAlign: 'left',
                            direction: 'ltr',
                            width: '100%',
                            height: '100%',
                            padding: '5px',
                            background: 'none',
                            border: 'none'
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            <DeleteButton onClick={() => deleteTableBox(index)}>🗑️</DeleteButton>
          </TableContainer>
        </StyledRnd>
      ))}
    </div>
  );
};

const StyledRnd = styled(Rnd)`
  cursor: move;
  z-index: 10;
  border: 1px solid #165277;
`;

const TableContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  border: 1px solid #165277;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  position: relative;

  &:hover button {
    visibility: visible;
  }
`;

const TableControls = styled.div`
  margin-bottom: 10px;

  label {
    margin-right: 10px;
    color: #165277;
    font-weight: bold;

    input {
      margin-left: 5px;
      width: 60px;
      padding: 5px;
      outline: #165277;
      color: #165277;
    }
  }
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  overflow: auto;

  td {
    border: 1px solid #165277;
    padding: 5px;
    text-align: center;
    color: #165277;
    word-wrap: break-word;
  }
`;


const TableButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const SaveButton = styled.button`
  margin-top: 10px;
  background: #165277;
  border: none;
  height: 40px;
  width: 100px;
  color: #fff;
  border-radius: 4px;
  height: 40px;
  cursor: pointer;
  font-weight: bold;
`;

const CancelButton = styled.button`
  margin-top: 10px;
  background: #fff;
  border: 1px solid #165277;
  height: 40px;
  width: 100px;
  color: #165277;
  border-radius: 4px;
  height: 40px;
  cursor: pointer;
  font-weight: bold;
`;

const DeleteButton = styled.button`
  visibility: hidden;
  position: absolute;
  top: 5px;
  right: 5px;
  color: white;
  border: 1px solid #165277;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background: red;
  }
`;

export default TableBoxManager;
