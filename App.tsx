import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { CrmDataTable } from './components/CrmDataTable';
import { Modal } from './components/Modal';
import { LeadForm } from './components/LeadForm';
import { CompanyForm } from './components/CompanyForm';
import { ContactForm } from './components/ContactForm';
import { TaskForm } from './components/TaskForm';
import { useCrmData } from './hooks/useCrmData';
import { Company, Contact, Lead, Task } from './types';
import type { Session, User } from '@supabase/supabase-js';


type View = 'kanban' | 'companies' | 'contacts' | 'tasks';
type ModalType = 'lead' | 'company' | 'contact' | 'task' | null;

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { leads, companies, contacts, tasks, loading, error, refreshData } = useCrmData();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setLeadToEdit(null);
    setCompanyToEdit(null);
    setContactToEdit(null);
    setTaskToEdit(null);
  };

  const handleNewItem = () => {
    switch (currentView) {
      case 'kanban': openModal('lead'); break;
      case 'companies': openModal('company'); break;
      case 'contacts': openModal('contact'); break;
      case 'tasks': openModal('task'); break;
    }
  };

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    openModal('lead');
  };

  const handleEditCompany = (company: Company) => {
    setCompanyToEdit(company);
    openModal('company');
  };

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    openModal('contact');
  };
    
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    openModal('task');
  };

  const renderContent = () => {
    if (loading) return <div className="flex-1 flex items-center justify-center"><p>Cargando datos...</p></div>;
    if (error) return <div className="flex-1 flex items-center justify-center text-red-500"><p>Error: {error}</p></div>;

    switch (currentView) {
      case 'kanban':
        return <KanbanBoard leads={leads} onUpdate={refreshData} onEditLead={handleEditLead} />;
      case 'companies':
        return <CrmDataTable 
                  data={companies} 
                  columns={[
                    { header: 'Nombre', accessor: 'name' },
                    { header: 'Industria', accessor: 'industry' },
                    { header: 'Ubicación', accessor: 'location' },
                    { header: 'Creado', accessor: 'created_at' },
                  ]}
                  title="Empresas"
                  onRowClick={handleEditCompany}
               />;
      case 'contacts':
         return <CrmDataTable 
                  data={contacts} 
                  columns={[
                    { header: 'Nombre', accessor: 'name' },
                    { header: 'Empresa', accessor: 'companies.name' },
                    { header: 'Email', accessor: 'email' },
                    { header: 'Teléfono', accessor: 'phone' },
                    { header: 'Cargo', accessor: 'position' },
                  ]}
                  title="Contactos"
                  onRowClick={handleEditContact}
               />;
      case 'tasks':
        return <CrmDataTable
                  data={tasks}
                  columns={[
                    { header: 'Descripción', accessor: 'description' },
                    { header: 'Tipo', accessor: 'type' },
                    { header: 'Estado', accessor: 'status' },
                    { header: 'Fecha Límite', accessor: 'due_date' },
                    { header: 'Lead (Empresa)', accessor: 'leads.companies.name' },
                  ]}
                  title="Tareas"
                  onRowClick={handleEditTask}
                />;
      default:
        return null;
    }
  };
  
  const getModalTitle = () => {
    switch(modalType) {
        case 'lead': return leadToEdit ? 'Editar Lead' : 'Añadir Lead';
        case 'company': return companyToEdit ? 'Editar Empresa' : 'Añadir Empresa';
        case 'contact': return contactToEdit ? 'Editar Contacto' : 'Añadir Contacto';
        case 'task': return taskToEdit ? 'Editar Tarea' : 'Añadir Tarea';
        default: return '';
    }
  }


  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} onNewItem={handleNewItem} />
        <main className="flex-1 flex overflow-hidden">
          {renderContent()}
        </main>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()}>
        {modalType === 'lead' && <LeadForm onClose={closeModal} onSave={refreshData} companies={companies} contacts={contacts} leadToEdit={leadToEdit} />}
        {/* FIX: Corrected typo from `closeal` to `closeModal`. */}
        {modalType === 'company' && <CompanyForm onClose={closeModal} onSave={refreshData} companyToEdit={companyToEdit} />}
        {modalType === 'contact' && <ContactForm onClose={closeModal} onSave={refreshData} companies={companies} contactToEdit={contactToEdit} />}
        {modalType === 'task' && <TaskForm onClose={closeModal} onSave={refreshData} leads={leads} taskToEdit={taskToEdit} />}
      </Modal>

    </div>
  );
};

export default App;