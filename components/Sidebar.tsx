import React from 'react';
import { KanbanIcon, BuildingIcon, UsersIcon, TasksIcon } from './icons';

type View = 'kanban' | 'companies' | 'contacts' | 'tasks';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const navItems: { id: View; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'kanban', name: 'Leads (Kanban)', icon: KanbanIcon },
    { id: 'companies', name: 'Empresas', icon: BuildingIcon },
    { id: 'contacts', name: 'Contactos', icon: UsersIcon },
    { id: 'tasks', name: 'Tareas', icon: TasksIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold text-white border-b border-gray-700">
        Mini CRM
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
              currentView === item.id
                ? 'bg-brand-primary text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="w-6 h-6 mr-3" />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};
