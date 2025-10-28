export const LEAD_STAGES = [
  'prospect',
  'contacted',
  'interested',
  'proposal',
  'negotiation',
  'won',
  'lost',
] as const;

export type LeadStage = typeof LEAD_STAGES[number];

export interface Company {
  id: string;
  name: string;
  industry?: string | null;
  location?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  company_id?: string | null;
  created_at?: string;
  updated_at?: string;
  companies?: Company | null; // For joined data
}

export interface Lead {
  id: string;
  stage: LeadStage;
  amount?: number | null;
  currency?: string | null;
  notes?: string | null;
  company_id: string;
  contact_id?: string | null;
  created_at?: string;
  updated_at?: string;
  companies?: Company | null; // For joined data
  contacts?: Contact | null; // For joined data
}

export const TASK_STATUSES = ['pending', 'done'] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

export const TASK_STATUS_TRANSLATIONS: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  done: 'Hecho',
};

export const TASK_TYPES = ['call', 'email', 'meeting', 'followup'] as const;
export type TaskType = typeof TASK_TYPES[number];

export const TASK_TYPE_TRANSLATIONS: Record<TaskType, string> = {
  call: 'Llamada',
  email: 'Correo',
  meeting: 'Reunión',
  followup: 'Seguimiento',
};

export interface Task {
    id: string;
    description: string;
    type: TaskType;
    status: TaskStatus;
    due_date: string;
    created_at?: string;
    updated_at?: string;
    assigned_to?: string | null;
    lead_id: string;
    leads?: Lead | null;
}