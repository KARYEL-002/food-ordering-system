import { Menu, ArrowLeft } from 'lucide-react';

const AdminTopBar = ({ onMenuClick }) => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 fade-transition flex-wrap gap-3" style={{ backgroundColor: '#FFFDF1' }}>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 rounded-lg btn-hover scale-transition lg:hidden" style={{ backgroundColor: '#FFD9B3' }} onClick={onMenuClick}>
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#704214' }} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-wrap" />
    </div>
  );
};

export default AdminTopBar;
