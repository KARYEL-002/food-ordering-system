import { MdClose } from 'react-icons/md';
import { Edit2 } from 'lucide-react';

const MenuItemPreviewModal = ({ isOpen, item, onClose, onEdit }) => {
  if (!isOpen || !item) return null;

  const formatCurrency = (value) => {
    return `₱${parseFloat(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[78vh] overflow-y-auto border" style={{ borderColor: '#704214' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white px-3 py-2 flex items-center justify-between border-b" style={{ borderColor: '#E8DCC8' }}>
          <h2 style={{ color: '#704214' }} className="text-lg md:text-xl font-semibold">
            {item.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: '#704214' }}
            aria-label="Close preview"
          >
            <MdClose size={26} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div className="col-span-1 flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center" style={{ border: '1px solid #E8DCC8' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-sm text-gray-400">No image</div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Category</p>
                <p style={{ color: '#704214' }} className="text-sm font-semibold">{item.category || 'N/A'}</p>

                <p className="text-xs uppercase font-bold mt-2" style={{ color: '#997755' }}>Price</p>
                <p style={{ color: '#704214' }} className="text-sm font-medium">{formatCurrency(item.price)}</p>
              </div>

              <div>
                <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Stock</p>
                <p style={{ color: '#704214' }} className="text-sm font-medium">{item.quantity_available || 0}</p>

                <p className="text-xs uppercase font-bold mt-2" style={{ color: '#997755' }}>Status</p>
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-bold mt-2"
                  style={{
                    backgroundColor: item.availability_status ? '#C0F4C4' : '#FFB3B3',
                    color: item.availability_status ? '#065F46' : '#7C2D12'
                  }}
                >
                  {item.availability_status ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#704214' }} className="text-sm font-bold mb-2">Description</h3>
            <div className="bg-[#FFFDF1] p-2 rounded-lg border" style={{ borderColor: '#E8DCC8' }}>
              <p style={{ color: '#704214' }} className="text-sm">{item.description || 'No description'}</p>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #E8DCC8' }}></div>

          <div className="flex flex-col md:flex-row gap-2">
            {onEdit && (
              <button
                onClick={() => { onEdit(item); onClose(); }}
                className="flex-1 px-3 py-2 rounded-md font-semibold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#00BCD4' }}
              >
                <Edit2 size={14} />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 rounded-md font-semibold"
              style={{ 
                backgroundColor: '#FFFDF1',
                color: '#704214',
                border: '2px solid #704214'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemPreviewModal;
