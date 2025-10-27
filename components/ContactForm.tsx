import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Contact, Company } from '../types';

interface ContactFormProps {
  onClose: () => void;
  onSave: () => void;
  companies: Company[];
  contactToEdit?: Contact | null;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onClose, onSave, companies, contactToEdit }) => {
  const [formData, setFormData] = useState({
    company_id: '',
    name: '',
    email: '',
    phone: '',
    position: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        company_id: contactToEdit.company_id || '',
        name: contactToEdit.name || '',
        email: contactToEdit.email || '',
        phone: contactToEdit.phone || '',
        position: contactToEdit.position || '',
      });
    } else {
        setFormData({ company_id: '', name: '', email: '', phone: '', position: '' });
    }
  }, [contactToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name || !formData.company_id) {
      setError('El nombre y la empresa son obligatorios.');
      setIsLoading(false);
      return;
    }
    
    const dataToUpsert = { ...formData };

    const { error: upsertError } = await supabase
      .from('contacts')
      .upsert(contactToEdit ? { ...dataToUpsert, id: contactToEdit.id } : dataToUpsert);

    if (upsertError) {
      setError(upsertError.message);
      console.error("Error saving contact:", upsertError);
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
      </div>

      <div>
        <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
        <select id="company_id" name="company_id" value={formData.company_id} onChange={handleChange} className={inputClasses} required>
          <option value="">Seleccione una empresa</option>
          {companies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} />
      </div>
      
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
        <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} className={inputClasses} />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-md border border-gray-300 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
          {isLoading ? 'Guardando...' : 'Guardar Contacto'}
        </button>
      </div>
    </form>
  );
};
