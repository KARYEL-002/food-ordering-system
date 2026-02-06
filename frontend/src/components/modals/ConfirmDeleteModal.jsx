const ConfirmDeleteModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 border-2 modal-content" style={{ borderColor: '#704214' }}>
        <h2 style={{ color: '#704214' }} className="text-2xl font-bold mb-4">
          {title || 'Confirm Delete'}
        </h2>
        <p style={{ color: '#704214' }} className="text-base mb-8">
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg font-bold border-2 transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ borderColor: '#704214', color: '#704214' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: '#FF6B6B' }}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
