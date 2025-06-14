import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Fetch suggestions with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setIsFocused(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchSuggestions = async (keyword) => {
    try {
      const response = await axios.get('http://localhost:8080/api/events/suggestions', {
        params: { keyword },
      });
      setSuggestions(response.data || []);
      setIsFocused(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  const handleSearch = () => {
    navigate(`/search?keyword=${encodeURIComponent(searchTerm.trim() || '')}`);
    setSearchTerm(''); // Reset ô nhập
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    navigate(`/search?keyword=${encodeURIComponent(suggestion)}`);
    setSearchTerm(''); // Reset ô nhập
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="hidden md:flex relative">
          <Link to="/search">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <SearchIcon style={{ fontSize: 20 }} />
            </span>
          </Link>
          <input
            type="text"
            placeholder="Bạn tìm gì hôm nay?"
            className="pl-10 pr-4 py-1 rounded-l-md text-black dark:text-white w-48 sm:w-56 md:w-64 focus:outline-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {isFocused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 w-48 sm:w-56 md:w-64 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md shadow-lg z-30"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  onMouseDown={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </motion.div>
          )}
          <button
            onClick={handleSearch}
            className="bg-white text-black dark:text-black border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-300 font-semibold text-sm md:px-4"
          >
            Tìm kiếm
          </button>
        </div>
        <Link to="/search">
          <button className="md:hidden flex items-center justify-center w-10 h-11 rounded-full bg-white dark:bg-gray-800 text-green-500 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <SearchIcon style={{ fontSize: 24 }} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SearchBar;