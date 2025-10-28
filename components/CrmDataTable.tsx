import React from 'react';

// Formatea una cadena de fecha a DD-MM-AAAA
const formatDate = (dateString: string) => {
  try {
    // Evita formatear cadenas que no son fechas válidas
    if (!dateString || !/\d{4}-\d{2}-\d{2}/.test(dateString)) {
        return dateString;
    }
    const date = new Date(dateString);
    // getTime() devuelve NaN para fechas inválidas
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = date.getUTCFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (e) {
    return dateString; // Devuelve el original si hay error
  }
};


// Un ayudante para renderizar objetos complejos o formatear fechas
const renderCell = (item: any, accessor: string): React.ReactNode => {
    const value = accessor.split('.').reduce((o, i) => (o ? o[i] : undefined), item);

    if (value instanceof Date) {
        return formatDate(value.toISOString());
    }
    // Si es una cadena de texto, verifica si parece una fecha
    if (typeof value === 'string' && (value.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(value))) {
        return formatDate(value);
    }
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }
    
    return value;
}


interface CrmDataTableProps<T> {
  data: T[];
  columns: { header: string; accessor: string }[];
  title: string;
  onRowClick?: (item: T) => void;
}

export function CrmDataTable<T extends { id: React.Key }>({ data, columns, title, onRowClick }: CrmDataTableProps<T>) {
  return (
    <div className="p-6 bg-gray-100 flex-1">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                {columns.map((col) => (
                    <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.header}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                <tr 
                  key={item.id} 
                  className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
                  onClick={() => onRowClick?.(item)}
                >
                    {columns.map((col) => (
                    <td key={`${item.id}-${col.accessor}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {renderCell(item, col.accessor)}
                    </td>
                    ))}
                </tr>
                ))}
                 {data.length === 0 && (
                    <tr>
                        <td colSpan={columns.length} className="text-center py-10 text-gray-500">
                            No hay datos para mostrar.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};