
import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter
}) => {
  return (
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <button className="flex items-center text-sm text-gray-700 mr-4">
          <Filter size={16} className="mr-1" />
          Filter
        </button>
        <div className="flex border rounded-lg overflow-hidden">
          <button 
            className={`px-4 py-2 text-sm ${filter === 'all' ? 'bg-purple-600 text-white' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 text-sm ${filter === 'beginner' ? 'bg-purple-600 text-white' : ''}`}
            onClick={() => setFilter('beginner')}
          >
            Beginner
          </button>
          <button 
            className={`px-4 py-2 text-sm ${filter === 'intermediate' ? 'bg-purple-600 text-white' : ''}`}
            onClick={() => setFilter('intermediate')}
          >
            Intermediate
          </button>
          <button 
            className={`px-4 py-2 text-sm ${filter === 'advanced' ? 'bg-purple-600 text-white' : ''}`}
            onClick={() => setFilter('advanced')}
          >
            Advanced
          </button>
          <button 
            className={`px-4 py-2 text-sm ${filter === 'pack' ? 'bg-purple-600 text-white' : ''}`}
            onClick={() => setFilter('pack')}
          >
            AI Generated Packs
          </button>
        </div>
      </div>
      <div className="relative w-full md:w-64">
        <input 
          type="text" 
          placeholder="Search workouts..." 
          className="w-full pl-10 pr-3 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchAndFilter;
