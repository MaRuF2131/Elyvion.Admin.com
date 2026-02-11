import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Users, Key } from 'lucide-react';
import { format } from 'date-fns';
import { adminService } from '../services/adminService.mjs';
import { id } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';

// Modal Components
const UpdateAdminModal = ({ open, onClose, userData }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-2xl font-bold text-[#1f2937]">Update Admin</h2>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 text-white bg-[#40566e] rounded-full hover:bg-black transition-all">
            <span className="text-2xl mb-1">×</span>
          </button>
        </div>
        <div className="px-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <InputGroup label="Whatsapp Url :" defaultValue={userData?.waUrl} />
          <InputGroup label="Telegram Url :" defaultValue={userData?.telegramUrl} />
          <InputGroup label="Telegram Url 2 :" defaultValue={userData?.telegramUrl2} />
          <InputGroup label="Telegram Url 3 :" defaultValue={userData?.telegramUrl3} />
        </div>
        <div className="flex justify-center pb-10">
          <button onClick={onClose} className="px-10 py-3 bg-[#6343D8] text-white rounded-lg font-bold text-sm shadow-lg hover:bg-[#5235b5] active:scale-95 transition-all">
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
};

const ChangePasswordModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-2xl font-bold text-[#1f2937]">Change Admin Password</h2>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 text-white bg-[#40566e] rounded-full hover:bg-black transition-all">
            <span className="text-2xl mb-1">×</span>
          </button>
        </div>
        <div className="px-12 py-10">
          <div className="flex items-center gap-4 max-w-md">
            <label className="text-gray-600 text-sm font-medium whitespace-nowrap min-w-[100px]">Password :</label>
            <input type="password" className="flex-1 border-2 border-[#3b82f6] rounded-xl px-4 py-2.5 focus:outline-none shadow-sm shadow-blue-100" />
          </div>
        </div>
        <div className="flex justify-center pb-10">
          <button onClick={onClose} className="px-10 py-3 bg-[#6343D8] text-white rounded-lg font-bold text-sm shadow-lg hover:bg-[#5235b5] active:scale-95 transition-all">
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, defaultValue }) => (
  <div className="flex items-center gap-4">
    <label className="text-gray-600 text-sm font-medium whitespace-nowrap min-w-[120px]">{label}</label>
    <input type="text" defaultValue={defaultValue} className="flex-1 border-2 border-gray-800 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" />
  </div>
);

// Main Component
const UserManagement = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({ startDate: '2026-02-02', endDate: '2026-02-03' });
  const {user} = useAuth();
  const [filters, setFilters] = useState({
    startDate: '2026-02-02',
    endDate: '2026-02-03'
  });
  const [rowsPerPage, setRowsPerPage] = useState(100);

  // Modal States
  const [updateModal, setUpdateModal] = useState({ open: false, user: null });
  const [passwordModal, setPasswordModal] = useState({ open: false, user: null });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getUsers({ limit: rowsPerPage,id: user?.id });
        console.log("ress",response);
        
        const usersData = response?.data || response || [];
        console.log("userData",usersData);
        
        setUsers([usersData]);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [rowsPerPage]);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers({ limit: rowsPerPage });
      setUsers(response?.data || response || []);
      setLoading(true);
      const response = await adminService.getUsers({ limit: rowsPerPage });
      const usersData = response?.data || response || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error filtering users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">*{t('createdDate')} :</label>
            <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50" />
            <span>-</span>
            <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50" />
          </div>
          <button onClick={handleFilter} disabled={loading} className="px-16 py-2 bg-[#7c3aed] text-white rounded-lg font-medium hover:bg-[#6d28d9] transition-colors">
            {loading ? 'Loading...' : t('filter')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('adminName')}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('whatsappUrl')}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('telegramUrl')}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('telegramUrl2')}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('telegramUrl3')}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100">
                <td className="px-6 py-4 text-sm text-gray-600">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.userName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.waUrl}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{user.telegramUrl}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.telegramUrl2}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.telegramUrl3}</td>

      <div className="overflow-x-auto">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('createdDate')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('adminName')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('whatsappUrl')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('telegramUrl')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('telegramUrl2')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t('telegramUrl3')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.telegramUrl1 || ''}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{user.whatsappUrl || ''}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.whatsappUrl2 || ''}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.whatsappUrl3 || ''}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setUpdateModal({ open: true, user })} className="p-2 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white rounded transition-colors">
                      <Users size={20} />
                    </button>
                    <button onClick={() => setPasswordModal({ open: true, user })} className="p-2 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white rounded transition-colors">
                      <Key size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <UpdateAdminModal open={updateModal.open} userData={updateModal.user} onClose={() => setUpdateModal({ open: false, user: null })} />
      <ChangePasswordModal open={passwordModal.open} onClose={() => setPasswordModal({ open: false, user: null })} />
    </div>
  );
};

export default UserManagement;