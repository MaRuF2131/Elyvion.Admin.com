export function ChangePasswordModal({ open, onClose }) {
  const [password, setPassword] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden p-8 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-[#1f2937]">Change Admin Password</h2>
          <button onClick={onClose} className="bg-[#374151] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black transition-colors">
            <span className="text-2xl mb-1">×</span>
          </button>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-4 max-w-md">
            <label className="text-gray-600 text-sm font-medium whitespace-nowrap min-w-[100px]">Password :</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 border-[1.5px] border-[#3b82f6] rounded-xl px-4 py-2.5 focus:outline-none shadow-sm shadow-blue-100"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-[#6d28d9] text-white px-12 py-3 rounded-lg font-bold shadow-lg hover:bg-[#5b21b6] active:scale-95 transition-all">
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
}