import React, { useState } from 'react';
import { Lead, LeadStage, LEAD_STAGES } from '../types';
import { supabase } from '../services/supabaseClient';

interface KanbanCardProps {
  lead: Lead;
  onClick: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
}

const stageTranslations: Record<LeadStage, string> = {
  prospect: 'Prospecto',
  contacted: 'Contactado',
  interested: 'Interesado',
  proposal: 'Propuesta',
  negotiation: 'Negociación',
  won: 'Ganado',
  lost: 'Perdido'
};

const KanbanCard: React.FC<KanbanCardProps> = ({ lead, onClick, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, lead.id)}
    onClick={onClick}
    className="bg-white p-3 rounded-md shadow cursor-pointer border-l-4 border-brand-primary mb-3 hover:shadow-lg transition-shadow"
  >
    <p className="font-semibold text-gray-800">{lead.companies?.name || 'Empresa desconocida'}</p>
    <p className="text-sm text-gray-600">{lead.contacts?.name || 'Sin contacto'}</p>
    {lead.amount != null && (
      <p className="text-sm font-bold text-green-600 mt-2">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: lead.currency || 'USD' }).format(lead.amount)}
      </p>
    )}
  </div>
);

interface KanbanColumnProps {
  stage: LeadStage;
  leads: Lead[];
  onCardClick: (lead: Lead) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, stage: LeadStage) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, leads, onCardClick, onDragStart, onDrop }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(e, stage);
    setIsOver(false);
  }

  return (
    <div 
        className={`w-72 bg-gray-100 rounded-lg p-3 flex-shrink-0 transition-colors ${isOver ? 'bg-blue-100' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
      <h3 className="font-bold text-gray-700 mb-3 px-1 flex justify-between items-center">
        <span>{stageTranslations[stage]}</span>
        <span className="text-sm font-normal bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">{leads.length}</span>
      </h3>
      <div className="h-full overflow-y-auto">
        {leads.map(lead => (
          <KanbanCard key={lead.id} lead={lead} onClick={() => onCardClick(lead)} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  leads: Lead[];
  onUpdate: () => void;
  onEditLead: (lead: Lead) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, onUpdate, onEditLead }) => {
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStage: LeadStage) => {
    const leadId = e.dataTransfer.getData("leadId");
    if (!leadId) return;

    const leadToMove = leads.find(l => l.id === leadId);
    if (leadToMove && leadToMove.stage === newStage) return;

    const { error } = await supabase
      .from('leads')
      .update({ stage: newStage })
      .eq('id', leadId);
    
    if (error) {
      console.error("Failed to update lead stage", error);
    } else {
      onUpdate();
    }
  };

  return (
    <div className="flex-1 flex space-x-4 p-4 overflow-x-auto bg-gray-50">
      {LEAD_STAGES.map(stage => (
        <KanbanColumn
          key={stage}
          stage={stage}
          leads={leads.filter(lead => lead.stage === stage)}
          onCardClick={onEditLead}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};