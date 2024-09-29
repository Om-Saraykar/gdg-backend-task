const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Are you sure you want to delete this movie?</h3>
        <div className="flex justify-end mt-4">
          <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
