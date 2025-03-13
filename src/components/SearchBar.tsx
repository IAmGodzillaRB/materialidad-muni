import React from 'react';
import { Input } from 'antd';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <Input
      placeholder="Buscar por denominación, RFC o municipio"
      onChange={(e) => onSearch(e.target.value)}
      aria-label="Buscar municipios"
      style={{ maxWidth: '400px' }}
    />
  );
};

export default SearchBar;