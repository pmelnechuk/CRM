import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Company } from '../types';

interface CompanyFormProps {
  onClose: () => void;
  onSave: () => void;
  companyToEdit?: Company | null;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ onClose, onSave, companyToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (companyToEdit) {
      setFormData({
        name: companyToEdit.name || '',
        industry: companyToEdit.industry || '',
        location: companyToEdit.location || '',
      });
    } else {
      setFormData({ name: '', industry: '', location: '' });
    }
  }, [companyToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name) {
      setError('El nombre de la empresa es obligatorio.');
      setIsLoading(false);
      return;
    }
    
    const dataToUpsert = { ...formData };

    const { error: upsertError } = await supabase
      .from('companies')
      .upsert(companyToEdit ? { ...dataToUpsert, id: companyToEdit.id } : dataToUpsert);

    if (upsertError) {
      setError(upsertError.message);
      console.error("Error saving company:", upsertError);
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa *</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industria</label>
        <input type="text" id="industry" name="industry" value={formData.industry} onChange={handleChange} className={inputClasses} />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className={inputClasses} />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-md border border-gray-300 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
          {isLoading ? 'Guardando...' : 'Guardar Empresa'}
        </button>
      </div>
    </form>
  );
};
