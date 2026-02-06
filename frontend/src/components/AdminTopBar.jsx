import { Search, Menu, User } from 'lucide-react';

const AdminTopBar = ({ onMenuClick }) => {
  return (
    <div className="flex items-center justify-between px-8 py-4 fade-transition" style={{ backgroundColor: '#FFFDF1' }}>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg btn-hover scale-transition" style={{ backgroundColor: '#FFD9B3' }} onClick={onMenuClick}>
          <Menu className="w-6 h-6" style={{ color: '#704214' }} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center px-4 py-2 rounded-full border-2 fade-transition" style={{ borderColor: '#704214', backgroundColor: '#FFFDF1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none flex-1 text-sm"
            style={{ color: '#704214' }}
          />
          <Search className="w-5 h-5" style={{ color: '#704214' }} />
        </div>
        <button className="p-2 rounded-full btn-hover scale-transition" style={{ backgroundColor: '#FFD9B3' }}>
          <User className="w-6 h-6" style={{ color: '#704214' }} />
        </button>
      </div>
    </div>
  );
};

export default AdminTopBar;
