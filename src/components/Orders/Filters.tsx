'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface OrderFilters {
  search: string;
  dateRange: 'all' | 'week' | 'month' | 'quarter';
}

interface FiltersProps {
  filters: OrderFilters;
  onFilterChange: (
    key: keyof OrderFilters,
    value: string
  ) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID do pedido ou produto..."
                value={filters.search}
                onChange={(e) =>
                  onFilterChange(
                    'search',
                    e.target.value
                  )
                }
                className="input pl-10 w-full"
              />
            </div>
          </div>

          <select
            value={filters.dateRange}
            onChange={(e) =>
              onFilterChange(
                'dateRange',
                e.target.value
              )
            }
            className="input w-auto"
          >
            <option value="all">
              Todos os períodos
            </option>
            <option value="week">
              Última semana
            </option>
            <option value="month">
              Último mês
            </option>
            <option value="quarter">
              Últimos 3 meses
            </option>
          </select>

          {(filters.search ||
            filters.dateRange !== 'all') && (
            <button
              onClick={onClearFilters}
              className="btn btn-outline btn-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
