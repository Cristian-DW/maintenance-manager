import React, { useState, useEffect } from 'react';
import {
    FunnelIcon,
    XMarkIcon,
    AdjustmentsHorizontalIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';

export default function FilterPanel({
    filters = [],
    onFilterChange,
    savedFilters = [],
    onSaveFilter,
    onLoadFilter
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [filterName, setFilterName] = useState('');
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    useEffect(() => {
        onFilterChange(activeFilters);
    }, [activeFilters, onFilterChange]);

    const handleFilterChange = (filterKey, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
    };

    const handleClearAll = () => {
        setActiveFilters({});
    };

    const handleSave = () => {
        if (filterName.trim()) {
            onSaveFilter({ name: filterName, filters: activeFilters });
            setFilterName('');
            setShowSaveDialog(false);
        }
    };

    const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== null && v !== undefined).length;

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeFilterCount > 0
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-inset ring-gray-300'
                    }`}
            >
                <FunnelIcon className="h-5 w-5" />
                Filtros
                {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white text-primary-600 text-xs font-bold">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {/* Filter Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-30 bg-black/20"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 z-40 mt-2 w-96 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="max-h-96 overflow-y-auto p-6 space-y-4">
                            {filters.map((filter) => (
                                <div key={filter.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {filter.label}
                                    </label>

                                    {filter.type === 'select' && (
                                        <select
                                            value={activeFilters[filter.key] || ''}
                                            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                            className="input w-full"
                                        >
                                            <option value="">Todos</option>
                                            {filter.options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {filter.type === 'date' && (
                                        <input
                                            type="date"
                                            value={activeFilters[filter.key] || ''}
                                            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                            className="input w-full"
                                        />
                                    )}

                                    {filter.type === 'dateRange' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                value={activeFilters[`${filter.key}From`] || ''}
                                                onChange={(e) => handleFilterChange(`${filter.key}From`, e.target.value)}
                                                placeholder="Desde"
                                                className="input w-full"
                                            />
                                            <input
                                                type="date"
                                                value={activeFilters[`${filter.key}To`] || ''}
                                                onChange={(e) => handleFilterChange(`${filter.key}To`, e.target.value)}
                                                placeholder="Hasta"
                                                className="input w-full"
                                            />
                                        </div>
                                    )}

                                    {filter.type === 'multiSelect' && (
                                        <div className="space-y-2">
                                            {filter.options.map((option) => (
                                                <label key={option.value} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={(activeFilters[filter.key] || []).includes(option.value)}
                                                        onChange={(e) => {
                                                            const current = activeFilters[filter.key] || [];
                                                            const updated = e.target.checked
                                                                ? [...current, option.value]
                                                                : current.filter(v => v !== option.value);
                                                            handleFilterChange(filter.key, updated);
                                                        }}
                                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Saved Filters */}
                            {savedFilters.length > 0 && (
                                <div className="pt-4 border-t border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Filtros Guardados
                                    </label>
                                    <div className="space-y-2">
                                        {savedFilters.map((saved, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setActiveFilters(saved.filters);
                                                    onLoadFilter(saved);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <BookmarkIcon className="h-4 w-4 text-primary-600" />
                                                <span className="text-gray-700">{saved.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-2">
                            <button
                                onClick={handleClearAll}
                                className="btn btn-secondary btn-sm"
                            >
                                Limpiar Todo
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowSaveDialog(true)}
                                    disabled={activeFilterCount === 0}
                                    className="btn btn-secondary btn-sm disabled:opacity-50"
                                >
                                    <BookmarkIcon className="h-4 w-4 mr-1" />
                                    Guardar
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="btn btn-primary btn-sm"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Save Dialog */}
                    {showSaveDialog && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardar Filtro</h3>
                                <input
                                    type="text"
                                    value={filterName}
                                    onChange={(e) => setFilterName(e.target.value)}
                                    placeholder="Nombre del filtro"
                                    className="input w-full mb-4"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setShowSaveDialog(false);
                                            setFilterName('');
                                        }}
                                        className="btn btn-secondary"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={!filterName.trim()}
                                        className="btn btn-primary"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
