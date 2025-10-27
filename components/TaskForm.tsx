import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Task, Lead, TASK_STATUSES, TaskStatus, TASK_TYPES, TaskType } from '../types';

interface TaskFormProps {
  onClose: () => void;
  onSave: () => void;
  leads: Lead[];
  taskToEdit?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSave, leads, taskToEdit }) => {
  const [formData, setFormData] = useState({
    description: '',
    type: 'call' as TaskType,
    status: 'pending' as TaskStatus,
    due_date: '',
    lead_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        description: taskToEdit.description || '',
        type: taskToEdit.type || 'call',
        status: taskToEdit.status || 'pending',
        due_date: taskToEdit.due_date ? new Date(taskToEdit.due_date).toISOString().substring(0, 10) : '',
        lead_id: taskToEdit.lead_id || '',
      });
    } else {
      setFormData({
        description: '',
        type: 'call',
        status: 'pending',
        due_date: '',
        lead_id: '',
      });
    }
  }, [taskToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.description || !formData.lead_id || !formData.due_date || !formData.type) {
      setError('Los campos marcados con * son obligatorios.');
      setIsLoading(false);
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();

    const dataToUpsert = { 
        ...formData,
        assigned_to: user?.id,
    };

    const { error: upsertError } = await supabase
      .from('tasks')
      .upsert(taskToEdit ? { ...dataToUpsert, id: taskToEdit.id } : dataToUpsert);

    if (upsertError) {
      setError(upsertError.message);
      console.error("Error saving task:", upsertError);
    } else {
      onSave();
      onClose();
    }
    setIsLoading(false);
  };

  const inputClasses = "w-full bg-white text-gray-800 rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-700 bg-red-100 p-3 rounded-md">{error}</div>}
      
      <div>
        <label htmlFor="lead_id" className="block text-sm font-medium text-gray-700 mb-1">Lead Asociado *</label>
        <select id="lead_id" name="lead_id" value={formData.lead_id} onChange={handleChange} className={inputClasses} required>
          <option value="">Seleccione un lead</option>
          {leads.map(lead => (
            <option key={lead.id} value={lead.id}>
              {lead.companies?.name || 'Empresa sin nombre'} ({lead.contacts?.name || 'Sin contacto'})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
        <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} className={inputClasses} required></textarea>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-1">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} className={inputClasses} required>
                {TASK_TYPES.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
            </select>
        </div>
        <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClasses} required>
                {TASK_STATUSES.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
            </select>
        </div>
      </div>
      
      <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite *</label>
            <input type="date" id="due_date" name="due_date" value={formData.due_date} onChange={handleChange} className={inputClasses} required />
      </div>


      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-md border border-gray-300 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
          {isLoading ? 'Guardando...' : 'Guardar Tarea'}
        </button>
      </div>
    </form>
  );
};