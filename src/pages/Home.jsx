import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  
  // Create icon components
  const UserCheckIcon = getIcon('UserCheck');
  const CalendarDaysIcon = getIcon('CalendarDays');
  const DollarSignIcon = getIcon('DollarSign');
  const PercentIcon = getIcon('Percent');
  const UsersIcon = getIcon('Users');
  
  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: UserCheckIcon },
    { id: 'leave', label: 'Leave Management', icon: CalendarDaysIcon },
    { id: 'payroll', label: 'Payroll', icon: DollarSignIcon },
    { id: 'tax', label: 'Tax Calculator', icon: PercentIcon },
    { id: 'hiring', label: 'Hiring', icon: UsersIcon },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    toast.info(`Switched to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} module`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <section>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-gradient">
          StaffSphere HR Management
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-300 max-w-3xl">
          Your comprehensive solution for internal HR operations — manage attendance, 
          leave requests, payroll, tax calculations, and hiring processes in one place.
        </p>
      </section>

      {/* Module Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex flex-col items-center p-4 md:p-5 rounded-xl transition-all duration-300 
                ${isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-800 dark:text-surface-200 border border-surface-200 dark:border-surface-700'
                }`}
            >
              <div className={`p-2 rounded-full mb-2 
                ${isActive 
                  ? 'bg-white/20' 
                  : 'bg-primary/10 dark:bg-primary/20'
                }`}>
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-white' : 'text-primary dark:text-primary-light'}`} />
              </div>
              <span className="text-xs md:text-sm font-medium text-center">{tab.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-b-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Main Feature Component */}
      <div className="pt-4">
        <MainFeature activeModule={activeTab} />
      </div>
    </motion.div>
  );
};

export default Home;