const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl shadow-md p-4 sm:p-6 md:p-8 border-2" style={{ backgroundColor: '#FFD9B3', borderColor: '#704214' }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-black mb-2 sm:mb-3 tracking-wide" style={{ color: '#704214' }}>{title}</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-black" style={{ color: '#704214' }}>{value}</p>
        </div>
        <div style={{ color: '#704214', opacity: 0.7 }} className="flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
