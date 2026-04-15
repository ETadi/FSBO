import { Map, List } from 'lucide-react'

export default function MapListToggle({ view, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => onChange('list')}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
          view === 'list'
            ? 'bg-navy-800 text-white'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <List size={16} />
        <span className="hidden sm:inline">List</span>
      </button>
      <button
        onClick={() => onChange('map')}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
          view === 'map'
            ? 'bg-navy-800 text-white'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Map size={16} />
        <span className="hidden sm:inline">Map</span>
      </button>
      <button
        onClick={() => onChange('split')}
        className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
          view === 'split'
            ? 'bg-navy-800 text-white'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <div className="flex gap-0.5">
          <div className="w-2 h-3.5 border border-current rounded-sm" />
          <div className="w-2 h-3.5 border border-current rounded-sm" />
        </div>
        <span>Split</span>
      </button>
    </div>
  )
}
