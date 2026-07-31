import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

export const GridEditor = styled.div`
  overflow: auto;
  flex: 1;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
`

export const GridTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: max-content;
`

export const GridTh = styled.th`
  padding: 4px 8px;
  background: #f5f5f5;
  border: 1px solid #d8d8d8;
  font-weight: 600;
  font-size: 13px;
  text-align: left;
  white-space: nowrap;
`

export const GridTd = styled.td`
  padding: 0;
  border: 1px solid #d8d8d8;
  min-width: 80px;
`

export const ActionTd = styled.td`
  padding: 2px 4px;
  border: 1px solid #d8d8d8;
  width: 28px;
  text-align: center;
  vertical-align: middle;
`

export const CellInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  padding: 5px 8px;
  font: inherit;
  font-size: 13px;
  background: transparent;
  text-align: center;

  &:focus {
    background: #eef6ff;
  }
`

export const SelectRowButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: #aaa;
  padding: 2px 4px;
  line-height: 1;
  font-size: 14px;

  &:hover {
    color: #c00;
  }
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`

export const AddRowButton = styled.button`
  padding: 4px 12px;
  border: 1px solid #00c424;
  border-radius: 4px;
  background: #fafafa;
  cursor: pointer;
  font-size: 12px;
  color: #00c424;

  &:hover {
    background: #00c424;
    color: #fafaaf;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`
export const DeleteRowButton = styled.button`
  padding: 4px 12px;
  border: 1px solid rgb(255, 0, 0);
  border-radius: 4px;
  background: #fafafa;
  cursor: pointer;
  font-size: 12px;
  color: rgb(255, 0, 0);

  &:hover {
    background: rgb(255, 0, 0);
    color: #fafaaf;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const SaveButton = styled.button<{ $saving: boolean }>`
  padding: 4px 12px;
  border: 1px solid ${(p) => (p.$saving ? '#aaa' : '#0084c4')};
  border-radius: 4px;
  background: ${(p) => (p.$saving ? '#fafafa' : '#0084c4')};
  color: ${(p) => (p.$saving ? '#666' : '#fff')};
  cursor: ${(p) => (p.$saving ? 'default' : 'pointer')};
  font-size: 12px;

  &:hover:not(:disabled) {
    background: ${(p) => (p.$saving ? '#fafafa' : '#006aa3')};
    border-color: ${(p) => (p.$saving ? '#aaa' : '#006aa3')};
  }
`

export const StatusText = styled.span`
  font-size: 12px;
  color: #6f6f6f;
  margin-left: auto;
`

export const EmptyMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #6f6f6f;
  font-size: 13px;
`
