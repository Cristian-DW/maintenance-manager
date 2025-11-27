import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchBar({
    placeholder = 'Buscar...',
    onSearch,
    autoFocus = false,
    suggestions = []
}) {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);

    // Keyboard shortcut Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
        setShowSuggestions(value.length > 0 && suggestions.length > 0);
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        onSearch(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl">
            <div className="relative">
                {/* Search Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => query.length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="block w-full rounded-xl border-0 bg-white/90 backdrop-blur-sm py-3 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all"
                />

                {/* Clear Button */}
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                )}

                {/* Keyboard Shortcut Hint */}
                {!query && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-sans text-gray-500">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 mt-2 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto">
                    <ul className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <MagnifyingGlassIcon className="h-4 w-4 inline mr-2 text-gray-400" />
                                    {suggestion}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
