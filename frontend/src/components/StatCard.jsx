const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="rounded-2xl shadow-md p-8 border-2" style={{ backgroundColor: '#FFD9B3', borderColor: '#704214' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black mb-3 tracking-wide" style={{ color: '#704214' }}>{title}</p>
          <p className="text-4xl font-black" style={{ color: '#704214' }}>{value}</p>
        </div>
        <div style={{ color: '#704214', opacity: 0.7 }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
