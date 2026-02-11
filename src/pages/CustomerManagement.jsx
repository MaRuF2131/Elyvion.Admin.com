import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { customerService } from "../services/customerService";
import CreateCustomerModal from "../components/CreateCustomerModal";
import EditCustomerModal from "../components/EditCustomerModal";
import CustomerTaskDetails from "./../customer/CustomerTaskDetails";

const CustomerManagement = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "2026-01-27",
    endDate: "2026-02-03",
    loginUserName: "",
    code: "",
    ipAddress: "",
    phoneNumber: "",
    customerStatus: "",
    onlineOffline: "all",
  });

  // State to manage account management toggles for each customer
  const [accountSettings, setAccountSettings] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskCustomer, setTaskCustomer] = useState(null);
  const [taskTab, setTaskTab] = useState("all");

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await customerService.getCustomers(filters);
        console.log("customers response", response);
        const customersData = response?.data || response || [];
        setCustomers(customersData);

        // Initialize account settings
        const initial = {};
        customersData.forEach((customer) => {
          initial[customer.id] = {
            isActualAccount: customer.isActualAccount ?? true,
            isAllowToTakeTask: customer.isAllowToTakeTask ?? true,
            isAllowToCompleteTask: customer.isAllowToCompleteTask ?? true,
            isAllowToWithdrawWithoutTask:
              customer.isAllowToWithdrawWithoutTask ?? false,
            isAllowToWithdraw: customer.isAllowToWithdraw ?? true,
            isAllowToWithdrawWhenPresetTask:
              customer.isAllowToWithdrawWhenPresetTask ?? false,
            isAllowToUseReferralCode: customer.isAllowToUseReferralCode ?? true,
            isUnconditionalWithdrawalAllowed:
              customer.isUnconditionalWithdrawalAllowed ?? false,
          };
        });
        setAccountSettings(initial);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [filters.startDate, filters.endDate]); // Only refetch when date filters change

  const handleDeleteCustomer = async (id) => {
    if (
      !window.confirm(
        t("confirmDelete") || "Are you sure you want to delete this customer?",
      )
    ) {
      return;
    }

    try {
      await customerService.deleteCustomer(id);
      handleFilter(); // Refresh list
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(error.message || "Failed to delete customer");
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers(filters);
      const customersData = response?.data || response || [];
      setCustomers(customersData);

      // Update account settings
      const initial = {};
      customersData.forEach((customer) => {
        initial[customer.id] = {
          isActualAccount: customer.isActualAccount ?? true,
          isAllowToTakeTask: customer.isAllowToTakeTask ?? true,
          isAllowToCompleteTask: customer.isAllowToCompleteTask ?? true,
          isAllowToWithdrawWithoutTask:
            customer.isAllowToWithdrawWithoutTask ?? false,
          isAllowToWithdraw: customer.isAllowToWithdraw ?? true,
          isAllowToWithdrawWhenPresetTask:
            customer.isAllowToWithdrawWhenPresetTask ?? false,
          isAllowToUseReferralCode: customer.isAllowToUseReferralCode ?? true,
          isUnconditionalWithdrawalAllowed:
            customer.isUnconditionalWithdrawalAllowed ?? false,
        };
      });
      setAccountSettings(initial);
    } catch (error) {
      console.error("Error filtering customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "yyyy-MM-dd hh:mm:ss a");
    } catch {
      return dateStr;
    }
  };

  const handleToggle = async (customerId, settingKey) => {
    const newValue = !accountSettings[customerId]?.[settingKey];

    // Optimistic update
    setAccountSettings((prev) => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [settingKey]: newValue,
      },
    }));

    // Save to backend
    try {
      await customerService.updateCustomerSettings(customerId, {
        [settingKey]: newValue,
      });
    } catch (error) {
      console.error(
        `Error updating ${settingKey} for customer ${customerId}:`,
        error,
      );
      // Revert on error
      setAccountSettings((prev) => ({
        ...prev,
        [customerId]: {
          ...prev[customerId],
          [settingKey]: !newValue,
        },
      }));
    }
  };

  const ToggleableStatus = ({
    customerId,
    settingKey,
    active,
    label,
    isInverted = false,
  }) => {
    const displayActive = isInverted ? !active : active;

    return (
      <button
        onClick={() => handleToggle(customerId, settingKey)}
        className="flex items-center gap-1 text-sm hover:bg-gray-100 px-2 py-1 rounded transition-colors w-full text-left cursor-pointer"
      >
        {displayActive ? (
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
        ) : (
          <X className="w-4 h-4 text-red-500 flex-shrink-0" />
        )}
        <span className={displayActive ? "text-green-600" : "text-red-500"}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full">
      {/* Header with Create Button */}
      <div className="flex justify-end p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-[#7c3aed] text-white rounded-lg font-medium hover:bg-[#007aff] transition-colors whitespace-nowrap"
        >
          {t("createCustomer")}
        </button>
      </div>

      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Refresh customers list
          handleFilter();
        }}
      />

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSuccess={() => {
          handleFilter();
        }}
        customer={selectedCustomer}
      />

      {/* Filters */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              *{t("createdDate")} :
            </label>
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
              <span>-</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
              {t("loginUserName")} :
            </label>
            <input
              type="text"
              value={filters.loginUserName}
              onChange={(e) =>
                setFilters({ ...filters, loginUserName: e.target.value })
              }
              className="flex-1 w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
              {t("code")} :
            </label>
            <input
              type="text"
              value={filters.code}
              onChange={(e) => setFilters({ ...filters, code: e.target.value })}
              className="flex-1 w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
              {t("ipAddress")} :
            </label>
            <input
              type="text"
              value={filters.ipAddress}
              onChange={(e) =>
                setFilters({ ...filters, ipAddress: e.target.value })
              }
              className="flex-1 w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
              {t("phoneNumber")} :
            </label>
            <input
              type="text"
              value={filters.phoneNumber}
              onChange={(e) =>
                setFilters({ ...filters, phoneNumber: e.target.value })
              }
              className="flex-1 w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
              {t("customerStatus")} :
            </label>
            <select
              value={filters.customerStatus}
              onChange={(e) =>
                setFilters({ ...filters, customerStatus: e.target.value })
              }
              className="flex-1 w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            >
              <option value="">{t("pleaseSelectStatus")}</option>
              <option value="1">Active</option>
              <option value="2">Inactive</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
              {t("onlineOffline")} :
            </label>
            <select
              value={filters.onlineOffline}
              onChange={(e) =>
                setFilters({ ...filters, onlineOffline: e.target.value })
              }
              className="flex-1 w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            >
              <option value="all">{t("all")}</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleFilter}
            disabled={loading}
            className="px-16 py-2 bg-[#7c3aed] text-white rounded-lg font-medium hover:bg-[#007aff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("loading") || "Loading..." : t("filter")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading && customers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <table className="w-full min-w-[1400px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[250px]">
                  {t("details")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[200px]">
                  {t("accountManagement")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[180px]">
                  {t("bankAccountDetails")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[180px]">
                  {t("ip")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[200px]">
                  {t("taskPlan")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[150px]">
                  {t("setting")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                  {t("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer, index) => {
                  const settings = accountSettings[customer.id] || {};
                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {customer.numberCode}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1 min-w-[250px]">
                          <div>
                            <span className="text-gray-500">Code :</span>{" "}
                            {customer.numberCode}
                          </div>
                          <div>
                            {customer.loginUserName} ( {customer.name} )
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Actual Wallet Balance :
                            </span>{" "}
                            {customer.actualWalletBalance}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Wallet Balance :
                            </span>{" "}
                            {customer.assetBalance}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Login Password :
                            </span>{" "}
                            {customer.loginPassword}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Withdrawal Password :
                            </span>{" "}
                            {customer.withdrawalPassword || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Phone Number :
                            </span>{" "}
                            {customer.phoneNumber}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Referral Code :
                            </span>{" "}
                            {customer.referralCode}
                          </div>
                          <div>
                            <span className="text-gray-500">By :</span>{" "}
                            {customer.createdBy} Created
                          </div>
                          <div>
                            <span className="text-gray-500">By :</span>{" "}
                            {customer.recommendBy} Updated
                          </div>
                          <div>
                            <span className="text-gray-500">Created At</span>{" "}
                            {formatDateTime(customer.createdDate)}
                          </div>
                          <div>
                            <span className="text-gray-500">Last Online</span>{" "}
                            {formatDateTime(customer.loginLogCreatedDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 min-w-[200px]">
                          <ToggleableStatus
                            customerId={customer.id}
                            settingKey="isActualAccount"
                            active={settings.isActualAccount}
                            label={t("actualAccount")}
                          />
                          <ToggleableStatus
                            customerId={customer.id}
                            settingKey="isAllowToTakeTask"
                            active={settings.isAllowToTakeTask}
                            label={t("allowToStartTask")}
                          />
                          <ToggleableStatus
                            customerId={customer.id}
                            settingKey="isAllowToCompleteTask"
                            active={settings.isAllowToCompleteTask}
                            label={t("allowToCompleteTask")}
                          />
                          <ToggleableStatus
                            customerId={customer.id}
                            settingKey="isAllowToWithdrawWithoutTask"
                            active={settings.isAllowToWithdrawWithoutTask}
                            label={t("notAllowedToWithdrawWithoutTask")}
                            isInverted={true}
                          />
                          <ToggleableStatus
                            customerId={customer.id}
                            settingKey="isAllowToWithdraw"
                            active={settings.isAllowToWithdraw}
                            label={t("allowToWithdraw")}
                          />
                          <ToggleableStatus
                            customerId={customer.id}
                            settingKey="isAllowToWithdrawWhenPresetTask"
                            active={settings.isAllowToWithdrawWhenPresetTask}
                            label={t("notAllowedToWithdrawWhenPresetTask")}
                            isInverted={true}
                          />
                          <ToggleableStatus
                            customerId={customer.id}
                            settingKey="isAllowToUseReferralCode"
                            active={settings.isAllowToUseReferralCode}
                            label={t("allowToUseReferralCode")}
                          />
                          <ToggleableStatus
                            customerId={customer.id}
                            settingKey="isUnconditionalWithdrawalAllowed"
                            active={settings.isUnconditionalWithdrawalAllowed}
                            label={t("notAllowedToWithdrawUnconditionally")}
                            isInverted={true}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1 min-w-[180px]">
                          <div>
                            <span className="text-gray-500">Bank Name :</span>{" "}
                            {customer.bankVendorName || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Bank Account Holder :
                            </span>{" "}
                            {customer.bankHolderName || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">IBAN :</span>{" "}
                            {customer.bankAccount || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Phone Number :
                            </span>{" "}
                            {customer.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1 min-w-[180px]">
                          <div>
                            <span className="text-gray-500">IP Address :</span>{" "}
                            {customer.loginLogIPAddress || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">IP Country :</span>{" "}
                            {customer.loginLogCountry || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">IP City :</span>{" "}
                            {customer.loginLogCity || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">IP Region :</span>{" "}
                            {customer.loginLogRegion || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">IP ISP :</span>{" "}
                            {customer.loginLogISP || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1 min-w-[200px]">
                          <div>
                            <span className="text-gray-500">Level :</span>{" "}
                            {customer.ambassadorLevelName}
                          </div>
                          <div>
                            <span className="text-gray-500">Everyday :</span>{" "}
                            {customer.eachSetTaskNumber}
                          </div>
                          <div>{customer.totalTaskSet}Set</div>
                          <div>
                            <span className="text-gray-500">
                              Today Completed :
                            </span>{" "}
                            {customer.todayCompletedTaskCount || 0}
                          </div>
                          <div>
                            <span className="text-gray-500">Task / (</span>
                            {customer.currentTotalRoundNumber} set){" "}
                            <span className="text-gray-500">Completed :</span>{" "}
                            {customer.allTimeCompletedTaskCount || 0}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Current Task :
                            </span>{" "}
                            {customer.currentTaskNumber || 0}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Total Deposit :
                            </span>{" "}
                            $ {customer.totalDepositAmount || 0}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Today Commission :
                            </span>{" "}
                            $ {customer.todayTaskProfit || 0}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Total Commission :
                            </span>{" "}
                            $ {customer.allTimeTaskProfit || 0}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Current Task Commission :
                            </span>{" "}
                            $ {customer.currentPendingTaskProfit || 0}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Credit Score :
                            </span>{" "}
                            {customer.creditScore}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2 min-w-[150px]">
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setTaskCustomer(customer);
                                setIsTaskModalOpen(true);
                              }}
                              className="px-4 py-1.5 bg-[#6d28d9] text-white text-sm rounded font-medium whitespace-nowrap"
                            >
                              {t("task")}
                            </button>

                            <button className="px-4 py-1.5 bg-[#6d28d9] text-white text-sm rounded font-medium whitespace-nowrap">
                              {t("comboTask")}
                            </button>
                          </div>

                          <button className="px-4 py-1.5 bg-[#6d28d9] text-white text-sm rounded font-medium  whitespace-nowrap">
                            {t("level")}
                          </button>
                          <button className="px-4 py-1.5 bg-[#6d28d9] text-white text-sm rounded font-medium whitespace-nowrap">
                            {t("editBalance")}
                          </button>
                          <button className="px-4 py-1.5 bg-[#f97316] text-white text-sm rounded font-medium hover:bg-[#ea580c] whitespace-nowrap">
                            {t("resetTask")}
                          </button>
                          <button className="px-4 py-1.5 bg-[#f97316] text-white text-sm rounded font-medium hover:bg-[#ea580c] whitespace-nowrap">
                            {t("resetRecord")}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsEditModalOpen(true);
                            }}
                            className="px-4 py-1.5 bg-[#7c3aed] text-white text-sm rounded font-medium hover:bg-[#6d28d9] whitespace-nowrap"
                          >
                            {t("editProfile")}
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="px-4 py-1.5 bg-red-500 text-white text-sm rounded font-medium hover:bg-red-600 whitespace-nowrap"
                          >
                            {t("delete") || "Delete"}
                          </button>
                          <button className="px-4 py-1.5 bg-[#7c3aed] text-white text-sm rounded font-medium hover:bg-[#6d28d9] whitespace-nowrap">
                            {t("comboTaskHistory")}
                          </button>
                          <button className="px-4 py-1.5 bg-[#f97316] text-white text-sm rounded font-medium hover:bg-[#ea580c] whitespace-nowrap">
                            {t("transactionHistory")}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            className={`px-4 py-1.5 text-sm rounded font-medium whitespace-nowrap ${
                              customer.customerStatusID === 1
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {customer.customerStatusID === 1
                              ? t("deactivate")
                              : t("activate")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Customer Task Modal */}
      <CustomerTaskDetails
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        customer={taskCustomer}
        defaultTab={taskTab}
      />
    </div>
  );
};

export default CustomerManagement;