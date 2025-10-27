import React from 'react';
import { supabase } from '../services/supabaseClient';
import { PlusCircleIcon, LogoutIcon } from './icons';

type View = 'kanban' | 'companies' | 'contacts' | 'tasks';

interface HeaderProps {
  currentView: View;
  onNewItem: () => void;
}

const viewTitles: Record<View, string> = {
    kanban: 'Leads (Kanban)',
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

export const Header: React.FC<HeaderProps> = ({ currentView, onNewItem }) => {

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-800">{viewTitles[currentView]}</h1>
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
