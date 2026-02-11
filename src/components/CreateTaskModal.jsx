import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { taskService } from '../services/taskService';

const CreateTaskModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    taskValue: 0,
    imageFile: null,
  });

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('taskValue', formData.taskValue);
      if (formData.imageFile) submissionData.append('image', formData.imageFile);

      await taskService.createTask(submissionData);
      onSuccess?.();
      onClose();
      // Reset
      setFormData({ name: '', taskValue: 0, imageFile: null });
      setImagePreview(null);
    } catch (error) {
      setError(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-2xl font-bold text-[#1f2937]">
            {t('createProduct') || 'Create Product'}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-white bg-[#40566e] rounded-full hover:bg-black transition-all"
          >
            <span className="text-2xl mb-1 leading-none">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-12 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {/* Product Name */}
            <div className="flex items-center gap-4">
              <label className="text-gray-600 text-sm font-medium whitespace-nowrap w-32">
                {t('productName') || 'Product Name'} :
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex-1 min-w-[200px] px-4 py-2 border-2 border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
              />
            </div>

            {/* Product Price */}
            <div className="flex items-center gap-4">
              <label className="text-gray-600 text-sm font-medium whitespace-nowrap w-32">
                {t('productPrice') || 'Product Price'} :
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.taskValue}
                onChange={(e) => setFormData({ ...formData, taskValue: e.target.value })}
                className="flex-1 min-w-[200px] px-4 py-2 border-2 border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
              />
            </div>

            {/* Image Upload */}
            <div className="flex items-start gap-4">
              <label className="text-gray-600 text-sm font-medium whitespace-nowrap w-32 pt-2">
                {t('productImage') || 'Product Image'} :
              </label>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Image Area */}
            <div className="flex items-center gap-4 h-24">
              <div className="w-32"></div>
              <div className="flex-1 h-full border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-widest">Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-12 pb-4">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3 bg-[#6343D8] text-white rounded-lg font-bold text-sm shadow-lg hover:bg-[#5235b5] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : (t('createProduct') || 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;