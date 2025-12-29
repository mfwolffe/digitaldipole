import React, { useState, useMemo } from 'react';

/**
 * Color map for element group blocks
 */
export const GROUP_COLORS = {
  "Nonmetal": "#F6BE9A",
  "Noble gas": "#FCAA67",
  "Alkali metal": "#B0413E",
  "Alkaline earth metal": "#30638E",
  "Metalloid": "#4DAA57",
  "Halogen": "#A39594",
  "Transition metal": "#548687",
  "Post-transition metal": "#B5DDA4",
  "Lanthanide": "#B4C5E4",
  "Actinide": "#94ECBE"
};

/**
 * Get contrasting text color (black or white) based on background
 */
export function getContrastColor(hexColor) {
  if (!hexColor) return '#000000';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Get color intensity based on value within a range (for gradient displays)
 */
export function getGradientColor(value, min, max, lowColor = '#e0f2fe', highColor = '#0369a1') {
  if (value === null || value === undefined || value === '') return '#f3f4f6';
  const ratio = (value - min) / (max - min);

  // Parse colors
  const low = {
    r: parseInt(lowColor.slice(1, 3), 16),
    g: parseInt(lowColor.slice(3, 5), 16),
    b: parseInt(lowColor.slice(5, 7), 16),
  };
  const high = {
    r: parseInt(highColor.slice(1, 3), 16),
    g: parseInt(highColor.slice(3, 5), 16),
    b: parseInt(highColor.slice(5, 7), 16),
  };

  const r = Math.round(low.r + (high.r - low.r) * ratio);
  const g = Math.round(low.g + (high.g - low.g) * ratio);
  const b = Math.round(low.b + (high.b - low.b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Sort indicator icon
 */
function SortIcon({ direction }) {
  if (!direction) {
    return (
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
      />
    </svg>
  );
}

/**
 * ElementTable - Sortable, filterable table for element data
 *
 * @param {Object} props
 * @param {Array} props.data - Array of element objects
 * @param {Array} props.columns - Column definitions [{key, label, unit?, sortable?, render?}]
 * @param {string} props.defaultSort - Default sort column key
 * @param {string} props.defaultDirection - Default sort direction ('asc' or 'desc')
 * @param {boolean} props.showGroupColors - Show group block color indicator
 * @param {boolean} props.stickyHeader - Make header sticky on scroll
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onRowClick - Callback when row is clicked
 * @param {number} props.maxHeight - Max height in pixels for scrollable area
 */
export function ElementTable({
  data,
  columns,
  defaultSort = 'AtomicNumber',
  defaultDirection = 'asc',
  showGroupColors = true,
  stickyHeader = true,
  className = '',
  onRowClick,
  maxHeight = 500,
}) {
  const [sortKey, setSortKey] = useState(defaultSort);
  const [sortDirection, setSortDirection] = useState(defaultDirection);
  const [filter, setFilter] = useState('');

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filter
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      result = result.filter(item =>
        item.Name?.toLowerCase().includes(lowerFilter) ||
        item.Symbol?.toLowerCase().includes(lowerFilter) ||
        item.AtomicNumber?.toString().includes(lowerFilter) ||
        item.GroupBlock?.toLowerCase().includes(lowerFilter)
      );
    }

    // Apply sort
    if (sortKey) {
      result.sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];

        // Handle empty/null values
        if (aVal === '' || aVal === null || aVal === undefined) return 1;
        if (bVal === '' || bVal === null || bVal === undefined) return -1;

        // Numeric comparison
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // String comparison
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        }
        return bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, filter, sortKey, sortDirection]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`element-table ${className}`}>
      {/* Filter input */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Filter by name, symbol, or group..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <span className="ml-3 text-sm text-gray-500">
          {processedData.length} of {data.length} elements
        </span>
      </div>

      {/* Table container */}
      <div
        className="overflow-auto border border-gray-300 rounded-lg"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <table className="w-full border-collapse">
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr className="bg-gray-100">
              {showGroupColors && (
                <th className="w-3 p-0 bg-gray-200"></th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2 text-left text-sm font-semibold text-gray-700 bg-gray-100 border-b border-gray-300 ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-gray-200 select-none' : ''
                  }`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.unit && (
                      <span className="text-xs text-gray-500">({col.unit})</span>
                    )}
                    {col.sortable !== false && (
                      <SortIcon direction={sortKey === col.key ? sortDirection : null} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, index) => {
              const groupColor = GROUP_COLORS[item.GroupBlock] || '#e5e7eb';
              return (
                <tr
                  key={item.AtomicNumber || index}
                  className={`
                    border-b border-gray-200
                    ${onRowClick ? 'cursor-pointer hover:bg-teal-50' : 'hover:bg-gray-50'}
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  `}
                  onClick={() => onRowClick?.(item)}
                >
                  {showGroupColors && (
                    <td
                      className="w-3 p-0"
                      style={{ backgroundColor: groupColor }}
                      title={item.GroupBlock}
                    ></td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-2 text-sm text-gray-700"
                      style={col.cellStyle?.(item)}
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key] ?? '—'
                      }
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend for group colors */}
      {showGroupColors && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {Object.entries(GROUP_COLORS).map(([group, color]) => (
            <div key={group} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-sm border border-gray-300"
                style={{ backgroundColor: color }}
              ></span>
              <span className="text-gray-600">{group}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ElementTable;
