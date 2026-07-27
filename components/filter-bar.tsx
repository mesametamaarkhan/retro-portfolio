'use client';

import { Subcategory } from '@/lib/supabase';

interface FilterBarProps {
  subcategories: Subcategory[];
  active: string[];
  onToggle: (name: string) => void;
  onAll: () => void;
}

export function FilterBar({ subcategories, active, onToggle, onAll }: FilterBarProps) {
  const allActive = active.length === 0;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onAll}
        className={`crt-chip ${allActive ? 'crt-chip-active' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        [ ALL ]
      </button>
      {subcategories.map((s) => {
        const on = active.includes(s.name);
        return (
          <button
            key={s.id}
            onClick={() => onToggle(s.name)}
            className={`crt-chip ${on ? 'crt-chip-active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            {on ? '[ ' : '  '}
            {s.name}
            {on ? ' ]' : '  '}
          </button>
        );
      })}
    </div>
  );
}
