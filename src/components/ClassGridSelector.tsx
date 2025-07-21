import React from 'react';
import classImg from '../images/class.jpg';

interface ClassGridSelectorProps {
  onSelect: (classId: number) => void;
  selectedClassId?: number;
}

const classes = [
  { id: 1, name: 'P1' },
  { id: 2, name: 'P2' },
  { id: 3, name: 'P3' },
  { id: 4, name: 'P4' },
  { id: 5, name: 'P5' },
  { id: 6, name: 'P6' },
];

const ClassGridSelector: React.FC<ClassGridSelectorProps> = ({ onSelect, selectedClassId }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 tracking-tight text-gray-900">Select a Class</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {classes.map(cls => (
          <button
            key={cls.id}
            onClick={() => onSelect(cls.id)}
            className={`group relative rounded-2xl overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all border-2 ${selectedClassId === cls.id ? 'border-blue-600' : 'border-transparent hover:border-blue-400'}`}
            style={{ aspectRatio: '1 / 1', minHeight: '160px' }}
            aria-label={`Select ${cls.name}`}
          >
            <img
              src={classImg}
              alt={cls.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">{cls.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClassGridSelector; 