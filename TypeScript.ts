// types/character.ts

export interface FateCharacter {
  id: string;
  name: string;
  description: string;
  // Aspects
  highConcept: string;
  trouble: string;
  additionalAspects: string[]; // Usually up to 3 more
  // Skills (The Pyramid: One at +4, Two at +3, etc.)
  skills: CharacterSkill[];
  // Stunts & Refresh
  stunts: Stunt[];
  refresh: number;
  // Stress Tracks
  physicalStress: number;
  mentalStress: number;
  // Consequences
  consequences: Consequence[];
}

export interface CharacterSkill {
  name: string;
  level: number; // e.g., 4 for Great, 3 for Good
}

export interface Stunt {
  name: string;
  description: string;
}

export interface Consequence {
  severity: 2 | 4 | 6; // Mild, Moderate, Severe
  description: string;
}
import React, { useState } from 'react';

interface AspectsProps {
  highConcept: string;
  trouble: string;
  onUpdate: (field: string, value: string) => void;
}

export const CharacterAspects: React.FC<AspectsProps> = ({ highConcept, trouble, onUpdate }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Core Aspects</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">High Concept</label>
        <input 
          type="text" 
          value={highConcept}
          onChange={(e) => onUpdate('highConcept', e.target.value)}
          placeholder="e.g., Cynical Smuggler with a Heart of Gold"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-1">Your character's core identity.</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Trouble</label>
        <input 
          type="text" 
          value={trouble}
          onChange={(e) => onUpdate('trouble', e.target.value)}
          placeholder="e.g., The Syndicate Wants Me Dead"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-1">What constantly complicates your life?</p>
      </div>
    </div>
  );
};