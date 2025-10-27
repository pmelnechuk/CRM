import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lead, Company, Contact, Task } from '../types';

export function useCrmData() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // We can fetch in parallel
      const [leadsRes, companiesRes, contactsRes, tasksRes] = await Promise.all([
        supabase.from('leads').select('*, companies(*), contacts(*)').order('created_at', { ascending: false }),
        supabase.from('companies').select('*').order('name'),
        supabase.from('contacts').select('*, companies(name)').order('name'),
        supabase.from('tasks').select('*, leads(*, companies(*), contacts(*))').order('due_date'),
      ]);

      if (leadsRes.error) throw new Error(`Leads: ${leadsRes.error.message}`);
      if (companiesRes.error) throw new Error(`Companies: ${companiesRes.error.message}`);
      if (contactsRes.error) throw new Error(`Contacts: ${contactsRes.error.message}`);
      if (tasksRes.error) throw new Error(`Tasks: ${tasksRes.error.message}`);

      setLeads(leadsRes.data as Lead[]);
      setCompanies(companiesRes.data as Company[]);
      setContacts(contactsRes.data as Contact[]);
      setTasks(tasksRes.data as Task[]);

    } catch (err: any) {
      console.error("Error fetching CRM data:", err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { leads, companies, contacts, tasks, loading, error, refreshData: fetchData };
}