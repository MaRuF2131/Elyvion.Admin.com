import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import VIPLevelForm from './VIPLevelForm';
import { vipService } from '../services/vipservice.mjs';

const VIPLevelManagement = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);


  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await vipService.getLevels();
      const levelsData = response?.data || response || [];
      setLevels(levelsData);
    } catch (error) {
      console.error('Error fetching VIP levels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleEdit = (level) => {
    setSelectedLevel(level);
    setIsModalOpen(true);
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">

      <VIPLevelForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLevel(null);
        }}
        onSuccess={() => {
          fetchLevels();
        }}
        level={selectedLevel}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        {loading && levels.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-32">{t('vipLevel')}</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">{t('taskSettings')}</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">{t('withdrawalLimitation')}</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {levels.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No levels found
                  </td>
                </tr>
              ) : (
                levels.map((level) => (
              <tr key={level.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-6 text-sm font-semibold text-gray-900">
                  {`VIP ${level.level}`}
                </td>
                <td className="px-6 py-6">
                  <div className="text-sm space-y-1 text-gray-600">
                    <div><span className="text-[#7c3aed]">{t('minAmount')}:</span> {level.minAmount}</div>
                    <div><span className="text-[#7c3aed]">{t('taskCount')}:</span> {level.taskCount}</div>
                    <div><span className="text-[#7c3aed]">{level.taskSet}Task Set</span></div>
                    <div><span className="text-[#7c3aed]">{t('commissionPercentage')}:</span> {level.commissionPercentage}</div>
                    <div><span className="text-[#7c3aed]">{t('comboCommissionPercentage')}:</span> {level.comboCommissionPercentage}</div>
                    <div>
                      <span className="text-[#7c3aed]">{t('productRange')} %:</span> {level.productRangeMaxPercent}% {t('productRange')} % {level.productRangeMinPercent}%
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="text-sm space-y-1 text-gray-600">
                    <div><span className="text-[#7c3aed]">{t('minWithdrawalAmount')}:</span> {level.minWithdrawalAmount}</div>
                    <div><span className="text-[#7c3aed]">{t('maxWithdrawalAmount')}:</span> {level.maxWithdrawalAmount}</div>
                    <div><span className="text-[#7c3aed]">{t('completedTaskDayToWithdraw')}:</span> {level.completedTasksPerDayToWithdraw}</div>
                    <div><span className="text-[#7c3aed]">{t('withdrawalFees')}:</span> {level.withdrawalFeesPercent}%</div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(level)}
                      className="px-6 py-2 bg-[#7c3aed] text-white text-sm rounded font-medium hover:bg-[#6d28d9] transition-colors">
                      {t('edit')}
                    </button>
                  </div>
                </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VIPLevelManagement;

