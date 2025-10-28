import React from 'react';
import { supabase } from '../services/supabaseClient';
import { PlusCircleIcon, LogoutIcon, KanbanIcon, TableIcon } from './icons';

type View = 'kanban' | 'companies' | 'contacts' | 'tasks';

interface HeaderProps {
  currentView: View;
  onNewItem: () => void;
  leadViewMode?: 'kanban' | 'list';
  onLeadViewChange?: (mode: 'kanban' | 'list') => void;
}

const viewTitles: Record<View, string> = {
    kanban: 'Leads',
    companies: 'Empresas',
    contacts: 'Contactos',
    tasks: 'Tareas'
};

const newItemButtonText: Record<View, string> = {
    kanban: 'Añadir Lead',
    companies: 'Añadir Empresa',
    contacts: 'Añadir Contacto',
    tasks: 'Añadir Tarea'
};

export const Header: React.FC<HeaderProps> = ({ currentView, onNewItem, leadViewMode, onLeadViewChange }) => {

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800">
                    {currentView === 'kanban' ? `Leads (${leadViewMode === 'kanban' ? 'Kanban' : 'Lista'})` : viewTitles[currentView]}
                </h1>
                {currentView === 'kanban' && onLeadViewChange && (
                    <div className="flex items-center bg-gray-100 rounded-md p-1">
                        <button
                            onClick={() => onLeadViewChange('kanban')}
                            className={`p-1 rounded-md transition-colors ${leadViewMode === 'kanban' ? 'bg-white shadow text-brand-primary' : 'text-gray-500 hover:text-gray-600'}`}
                            title="Vista Kanban"
                        >
                            <KanbanIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onLeadViewChange('list')}
                            className={`p-1 rounded-md transition-colors ${leadViewMode === 'list' ? 'bg-white shadow text-brand-primary' : 'text-gray-500 hover:text-gray-600'}`}
                            title="Vista de Lista"
                        >
                            <TableIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-4">
                 <button
                    onClick={onNewItem}
                    className="flex items-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {newItemButtonText[currentView]}
                </button>
                <button
                    onClick={handleLogout}
                    title="Cerrar sesión"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                    <LogoutIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};