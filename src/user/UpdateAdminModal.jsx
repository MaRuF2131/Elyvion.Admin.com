import { useState, useEffect } from "react";

export default function UpdateAdminModal({ open, onClose, userData }) {
  const [formData, setFormData] = useState({
    whatsappUrl: "",
    telegramUrl: "",
    telegramUrl2: "",
    telegramUrl3: "",
  });


  useEffect(() => {
    if (userData) {
      setFormData({
        whatsappUrl: userData.waUrl || "",
        telegramUrl: userData.telegramUrl || "",
        telegramUrl2: userData.telegramUrl2 || "",
        telegramUrl3: userData.telegramUrl3 || "",
      });
    }
  }, [userData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-2xl font-bold text-[#333]">Update Admin</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-white bg-[#40566e] rounded-full hover:bg-black transition-all shadow-md"
          >
            <span className="text-2xl font-light leading-none mb-1">×</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="px-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          
          <InputGroup 
            label="Whatsapp Url :" 
            value={formData.whatsappUrl}
            onChange={(val) => setFormData({...formData, whatsappUrl: val})}
          />
          
          <InputGroup 
            label="Telegram Url :" 
            value={formData.telegramUrl}
            onChange={(val) => setFormData({...formData, telegramUrl: val})}
          />

          <InputGroup 
            label="Telegram Url 2 :" 
            value={formData.telegramUrl2}
            onChange={(val) => setFormData({...formData, telegramUrl2: val})}
          />

          <InputGroup 
            label="Telegram Url 3 :" 
            value={formData.telegramUrl3}
            onChange={(val) => setFormData({...formData, telegramUrl3: val})}
          />

        </div>

        {/* Footer Action */}
        <div className="flex justify-center pb-12 pt-4">
          <button
            className="px-10 py-3 bg-[#6343D8] text-white rounded-lg font-bold text-sm shadow-lg hover:bg-[#5235b5] transition-all transform active:scale-95"
            onClick={() => {
              console.log("Updated Data:", formData);
              onClose();
            }}
          >
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Input Component for exact UI matching
function InputGroup({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-gray-600 font-medium text-sm whitespace-nowrap w-32">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-[200px] px-4 py-2.5 border-2 border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all font-medium text-gray-700"
      />
    </div>
  );
}