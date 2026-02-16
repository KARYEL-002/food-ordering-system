import { Menu, ArrowLeft } from 'lucide-react';

const AdminTopBar = ({ onMenuClick }) => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 fade-transition flex-wrap gap-3" style={{ backgroundColor: '#FFFDF1' }}>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => { window.location.href = '/'; }}
          className="px-3 py-2 rounded-lg font-bold transition-opacity hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: 'white', border: '2px solid #704214', color: '#704214' }}
          title="Back to Website"
        >
          <ArrowLeft className="w-4 h-4" style={{ color: '#704214' }} />
          <span className="hidden sm:inline">Back to Website</span>
        </button>

        <button className="p-2 rounded-lg btn-hover scale-transition lg:hidden" style={{ backgroundColor: '#FFD9B3' }} onClick={onMenuClick}>
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#704214' }} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-wrap" />
    </div>
  );
};

export default AdminTopBar;
