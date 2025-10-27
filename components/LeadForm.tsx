import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lead, Company, Contact, LEAD_STAGES } from '../types';

interface LeadFormProps {
  onClose: () => void;
  onSave: () => void;
  companies: Company[];
  contacts: Contact[];
  leadToEdit?: Lead | null;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onClose, onSave, companies, contacts: allContacts, leadToEdit }) => {
  const [formData, setFormData] = useState({
    company_id: leadToEdit?.company_id || '',
    contact_id: leadToEdit?.contact_id || '',
    stage: leadToEdit?.stage || 'prospect',
    amount: leadToEdit?.amount || 0,
    currency: leadToEdit?.currency || 'USD',
    notes: leadToEdit?.notes || '',
  });
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        company_id: leadToEdit.company_id,
        contact_id: leadToEdit.contact_id || '',
        stage: leadToEdit.stage,
        amount: leadToEdit.amount || 0,
        currency: leadToEdit.currency || 'USD',
        notes: leadToEdit.notes || '',
      });
    }
  }, [leadToEdit]);

  useEffect(() => {
    if (formData.company_id) {
      setFilteredContacts(allContacts.filter(c => c.company_id === formData.company_id));
    } else {
      setFilteredContacts([]);
    }
    if (!leadToEdit) {
        setFormData(prev => ({ ...prev, contact_id: '' }));
    }
  }, [formData.company_id, allContacts, leadToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.company_id) {
        setError('Por favor, seleccione una empresa.');
        setIsLoading(false);
        return;
    }
    
    const dataToUpsert = {
        ...formData,
        contact_id: formData.contact_id === '' ? null : formData.contact_id,
    };

    const { error: upsertError } = await supabase
      .from('leads')
      .upsert(leadToEdit ? { ...dataToUpsert, id: leadToEdit.id } : dataToUpsert);

    if (upsertError) {
      setError(upsertError.message);
      console.error("Error saving lead:", upsertError);
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
        <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
        <select id="company_id" name="company_id" value={formData.company_id} onChange={handleChange} className={inputClasses} required>
          <option value="">Seleccione una empresa</option>
          {companies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="contact_id" className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
        <select id="contact_id" name="contact_id" value={formData.contact_id} onChange={handleChange} className={inputClasses} disabled={!formData.company_id}>
          <option value="">Seleccione un contacto (Opcional)</option>
          {filteredContacts.map(contact => <option key={contact.id} value={contact.id}>{contact.name}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
        <select id="stage" name="stage" value={formData.stage} onChange={handleChange} className={inputClasses} required>
          {LEAD_STAGES.map(stage => <option key={stage} value={stage}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</option>)}
        </select>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
          <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className={inputClasses} />
        </div>
        <div className="w-1/3">
           <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
           <input type="text" id="currency" name="currency" value={formData.currency} onChange={handleChange} className={inputClasses} />
        </div>
      </div>


      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className={inputClasses}></textarea>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-md border border-gray-300 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
          {isLoading ? 'Guardando...' : 'Guardar Lead'}
        </button>
      </div>
    </form>
  );
};