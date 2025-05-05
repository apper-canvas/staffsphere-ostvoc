import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ activeModule }) => {
  // Create icon components
  const ClockIcon = getIcon('Clock');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const UserIcon = getIcon('User');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const BriefcaseIcon = getIcon('Briefcase');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ChevronDownIcon = getIcon('ChevronDown');
  const SearchIcon = getIcon('Search');
  const PlusIcon = getIcon('Plus');
  const ChevronRightIcon = getIcon('ChevronRight');
  const CalendarPlusIcon = getIcon('CalendarPlus');
  
  // Attendance Module State
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [attendanceNote, setAttendanceNote] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([
    { date: '2023-06-20', clockIn: '09:02 AM', clockOut: '05:30 PM', status: 'Present' },
    { date: '2023-06-21', clockIn: '09:15 AM', clockOut: '05:45 PM', status: 'Present' },
    { date: '2023-06-22', clockIn: '08:55 AM', clockOut: '06:05 PM', status: 'Present' },
    { date: '2023-06-23', clockIn: '-', clockOut: '-', status: 'Absent' },
  ]);

  // Leave Management Module State
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'Sick Leave', start: '2023-07-12', end: '2023-07-14', status: 'Approved' },
    { id: 2, type: 'Vacation', start: '2023-08-10', end: '2023-08-20', status: 'Pending' }
  ]);

  // Payroll Module State
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [payrollData, setPayrollData] = useState({
    baseSalary: 5000,
    allowances: { housing: 500, transport: 300, meal: 200 },
    deductions: { tax: 600, insurance: 250, pension: 350 },
    netSalary: 4800
  });

  // Tax Calculator Module State
  const [income, setIncome] = useState(60000);
  const [taxFilingStatus, setTaxFilingStatus] = useState('single');
  const [taxBreakdown, setTaxBreakdown] = useState({
    federalTax: 9200,
    stateTax: 3000,
    socialSecurity: 3720,
    medicare: 870,
    totalTax: 16790,
    effectiveRate: 27.98
  });

  // Hiring Module State
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Alex Johnson", email: "alex@example.com", position: "Software Engineer", status: "Interview" },
    { id: 2, name: "Taylor Smith", email: "taylor@example.com", position: "UX Designer", status: "Applied" },
    { id: 3, name: "Jordan Lee", email: "jordan@example.com", position: "Product Manager", status: "Offer" },
    { id: 4, name: "Casey Brown", email: "casey@example.com", position: "Marketing Specialist", status: "Screening" }
  ]);
  
  // Attendance Module Functions
  const handleClockIn = () => {
    const now = new Date();
    const timeString = format(now, 'hh:mm a');
    setIsClockedIn(true);
    setClockInTime(timeString);
    setAttendanceStatus('Present');
    
    toast.success('Successfully clocked in at ' + timeString, {
      icon: '⏰'
    });
  };

  const handleClockOut = () => {
    if (!isClockedIn) {
      toast.error('You must clock in before clocking out!');
      return;
    }
    
    const now = new Date();
    const timeString = format(now, 'hh:mm a');
    setIsClockedIn(false);
    setClockOutTime(timeString);
    
    // Add today's record to attendance history
    const today = format(now, 'yyyy-MM-dd');
    const newRecord = {
      date: today,
      clockIn: clockInTime,
      clockOut: timeString,
      status: attendanceStatus || 'Present',
      note: attendanceNote
    };
    
    setAttendanceRecords([newRecord, ...attendanceRecords]);
    
    // Reset attendance state
    setClockInTime(null);
    setClockOutTime(null);
    setAttendanceStatus('');
    setAttendanceNote('');
    
    toast.success('Successfully clocked out at ' + timeString, {
      icon: '👋'
    });
  };

  // Leave Request Functions
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    
    if (!leaveType || !startDate || !endDate || !leaveReason) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    const newLeave = {
      id: leaveRequests.length + 1,
      type: leaveType,
      start: startDate,
      end: endDate,
      reason: leaveReason,
      status: 'Pending'
    };
    
    setLeaveRequests([newLeave, ...leaveRequests]);
    
    // Reset form
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setLeaveReason('');
    
    toast.success('Leave request submitted successfully', {
      icon: '📅'
    });
  };

  // Tax Calculator Functions
  const calculateTax = () => {
    let federalTax, stateTax, socialSecurity, medicare, totalTax, effectiveRate;
    
    // Simple tax calculation logic (illustrative only)
    if (taxFilingStatus === 'single') {
      federalTax = income * 0.22;
      stateTax = income * 0.05;
    } else if (taxFilingStatus === 'married') {
      federalTax = income * 0.18;
      stateTax = income * 0.045;
    } else {
      federalTax = income * 0.15;
      stateTax = income * 0.04;
    }
    
    socialSecurity = Math.min(income * 0.062, 9114); // Cap at $147,000 income
    medicare = income * 0.0145;
    
    totalTax = federalTax + stateTax + socialSecurity + medicare;
    effectiveRate = ((totalTax / income) * 100).toFixed(2);
    
    setTaxBreakdown({
      federalTax: federalTax.toFixed(0),
      stateTax: stateTax.toFixed(0),
      socialSecurity: socialSecurity.toFixed(0),
      medicare: medicare.toFixed(0),
      totalTax: totalTax.toFixed(0),
      effectiveRate
    });
    
    toast.info('Tax calculation updated', {
      icon: '📊'
    });
  };

  // Hiring Module Functions
  const handleCandidateSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setCandidateSearchQuery(query);
    
    if (query) {
      const filtered = candidates.filter(candidate => 
        candidate.name.toLowerCase().includes(query) || 
        candidate.position.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.status.toLowerCase().includes(query)
      );
      setFilteredCandidates(filtered);
    } else {
      setFilteredCandidates([]);
    }
  };
  
  // Update tax calculations when inputs change
  useEffect(() => {
    calculateTax();
  }, [income, taxFilingStatus]);
  
  // Update filtered candidates when candidates change
  useEffect(() => {
    if (candidateSearchQuery) {
      handleCandidateSearch({ target: { value: candidateSearchQuery } });
    }
  }, [candidates]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    },
    exit: { opacity: 0, y: 20 }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Render the active module
  const renderModule = () => {
    switch (activeModule) {
      case 'attendance':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-primary" />
                Today's Attendance
              </h3>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="mb-4">
                    <label className="form-label">Status</label>
                    <select 
                      value={attendanceStatus}
                      onChange={(e) => setAttendanceStatus(e.target.value)}
                      className="form-input"
                      disabled={isClockedIn}
                    >
                      <option value="">Select status</option>
                      <option value="Present">Present</option>
                      <option value="Work from Home">Work from Home</option>
                      <option value="Half Day">Half Day</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Note (Optional)</label>
                    <textarea 
                      value={attendanceNote}
                      onChange={(e) => setAttendanceNote(e.target.value)}
                      className="form-input h-20 resize-none"
                      placeholder="Add any notes about today's attendance"
                      disabled={!isClockedIn}
                    />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-0">
                    <div className="mb-4 sm:mb-0">
                      <span className="form-label">Clock In</span>
                      <div className="text-2xl font-medium mt-1">
                        {clockInTime || '--:--'}
                      </div>
                    </div>
                    <div>
                      <span className="form-label">Clock Out</span>
                      <div className="text-2xl font-medium mt-1">
                        {clockOutTime || '--:--'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleClockIn}
                      disabled={isClockedIn}
                      className="btn btn-primary flex-1"
                    >
                      <CheckIcon className="w-5 h-5 mr-1" />
                      Clock In
                    </button>
                    
                    <button
                      onClick={handleClockOut}
                      disabled={!isClockedIn}
                      className="btn btn-outline flex-1"
                    >
                      <XIcon className="w-5 h-5 mr-1" />
                      Clock Out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                Recent Attendance History
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <thead>
                    <tr>
                      <th className="py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Clock In</th>
                      <th className="py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Clock Out</th>
                      <th className="py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                    {attendanceRecords.map((record, index) => (
                      <tr key={index} className="hover:bg-surface-50 dark:hover:bg-surface-800/60">
                        <td className="py-3 text-sm font-medium">{record.date}</td>
                        <td className="py-3 text-sm">{record.clockIn}</td>
                        <td className="py-3 text-sm">{record.clockOut}</td>
                        <td className="py-3 text-sm">
                          <span className={`badge ${
                            record.status === 'Present' ? 'badge-success' : 
                            record.status === 'Absent' ? 'badge-danger' : 
                            record.status === 'Half Day' ? 'badge-warning' : 'badge-info'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        );
        
      case 'leave':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants} className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CalendarPlusIcon className="w-5 h-5 mr-2 text-primary" />
                Request Leave
              </h3>
              
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Leave Type</label>
                  <select 
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select leave type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Family Leave">Family Leave</option>
                    <option value="Bereavement">Bereavement</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Date</label>
                    <input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">End Date</label>
                    <input 
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Reason</label>
                  <textarea 
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="form-input h-24 resize-none"
                    placeholder="Briefly explain the reason for your leave request"
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-full">
                  Submit Leave Request
                </button>
              </form>
            </motion.div>
            
            <motion.div variants={itemVariants} className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                Leave Requests
              </h3>
              
              {leaveRequests.length === 0 ? (
                <div className="text-center py-8 text-surface-500">
                  No leave requests found.
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((leave) => (
                    <div 
                      key={leave.id}
                      className="p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{leave.type}</span>
                        <span className={`badge ${
                          leave.status === 'Approved' ? 'badge-success' : 
                          leave.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-surface-600 dark:text-surface-400 mb-1">
                        {leave.start} to {leave.end}
                      </div>
                      
                      {leave.reason && (
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 italic">
                          "{leave.reason}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        );
        
      case 'payroll':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center mb-3 sm:mb-0">
                  <DollarSignIcon className="w-5 h-5 mr-2 text-primary" />
                  Payroll Information
                </h3>
                
                <div className="w-full sm:w-auto">
                  <label className="form-label">Select Month</label>
                  <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="form-input w-full sm:w-auto"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                    <h4 className="text-lg font-medium mb-3">Earnings</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Base Salary</span>
                        <span className="font-medium">${payrollData.baseSalary.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Housing Allowance</span>
                        <span>${payrollData.allowances.housing.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Transport Allowance</span>
                        <span>${payrollData.allowances.transport.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Meal Allowance</span>
                        <span>${payrollData.allowances.meal.toLocaleString()}</span>
                      </div>
                      
                      <div className="border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Earnings</span>
                          <span>
                            ${(payrollData.baseSalary + 
                              payrollData.allowances.housing + 
                              payrollData.allowances.transport + 
                              payrollData.allowances.meal).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                    <h4 className="text-lg font-medium mb-3">Payment Information</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Payment Method</span>
                        <span className="bg-surface-200 dark:bg-surface-700 px-3 py-1 rounded text-sm">Direct Deposit</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Bank Account</span>
                        <span>XXXX-XXXX-1234</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Payment Date</span>
                        <span>25th of every month</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                    <h4 className="text-lg font-medium mb-3">Deductions</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Income Tax</span>
                        <span>${payrollData.deductions.tax.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Health Insurance</span>
                        <span>${payrollData.deductions.insurance.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Retirement Contribution</span>
                        <span>${payrollData.deductions.pension.toLocaleString()}</span>
                      </div>
                      
                      <div className="border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Deductions</span>
                          <span>
                            ${(payrollData.deductions.tax + 
                              payrollData.deductions.insurance + 
                              payrollData.deductions.pension).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-lg bg-primary text-white">
                    <h4 className="text-lg font-medium mb-4">Net Salary</h4>
                    
                    <div className="text-3xl font-bold">${payrollData.netSalary.toLocaleString()}</div>
                    <div className="text-sm opacity-80 mt-1">for {format(new Date(selectedMonth), 'MMMM yyyy')}</div>
                    
                    <button className="mt-4 bg-white text-primary hover:bg-surface-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                      Download Pay Slip
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
        
      case 'tax':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="card">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <PercentIcon className="w-5 h-5 mr-2 text-primary" />
                Tax Calculator
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="form-label">Annual Income ($)</label>
                    <input 
                      type="number" 
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="form-input"
                      min="0"
                      step="1000"
                    />
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="1000"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>$0</span>
                        <span>$100,000</span>
                        <span>$200,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Filing Status</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                      {['single', 'married', 'head'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setTaxFilingStatus(status)}
                          className={`py-2 px-4 rounded-lg border transition-all text-center ${
                            taxFilingStatus === status 
                              ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                              : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                          }`}
                        >
                          {status === 'single' ? 'Single' : 
                           status === 'married' ? 'Married' : 
                           'Head of Household'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                    <h4 className="font-medium mb-3">Income Breakdown</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Gross Annual Income</span>
                        <span className="font-medium">${income.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Income</span>
                        <span>${(income / 12).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bi-weekly Income</span>
                        <span>${(income / 26).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="p-5 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <h4 className="font-medium mb-4">Tax Calculation Results</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Federal Income Tax</span>
                        <span className="font-medium">${taxBreakdown.federalTax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State Income Tax</span>
                        <span>${taxBreakdown.stateTax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Security (6.2%)</span>
                        <span>${taxBreakdown.socialSecurity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medicare (1.45%)</span>
                        <span>${taxBreakdown.medicare}</span>
                      </div>
                      
                      <div className="border-t border-surface-200 dark:border-surface-700 pt-3 mt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total Tax</span>
                          <span>${taxBreakdown.totalTax}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Effective Tax Rate</span>
                          <span>{taxBreakdown.effectiveRate}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-surface-200 dark:border-surface-700 rounded-lg p-3 mt-5">
                      <div className="flex justify-between font-semibold">
                        <span>After-Tax Income</span>
                        <span>${(income - taxBreakdown.totalTax).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-surface-500 mt-1">
                        <span>Monthly Take-Home</span>
                        <span>${((income - taxBreakdown.totalTax) / 12).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-surface-500 dark:text-surface-400">
                    <p>Disclaimer: This is a simplified tax calculator for estimation purposes only. 
                       Actual tax calculations may vary based on specific deductions, credits, and other factors. 
                       Please consult a tax professional for advice on your specific situation.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
        
      case 'hiring':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center mb-3 sm:mb-0">
                  <UsersIcon className="w-5 h-5 mr-2 text-primary" />
                  Candidate Management
                </h3>
                
                <button className="btn btn-primary">
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Candidate
                </button>
              </div>
              
              <div className="relative mb-6">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search candidates by name, position, or status..."
                  value={candidateSearchQuery}
                  onChange={handleCandidateSearch}
                  className="form-input pl-10"
                />
              </div>
              
              <div className="space-y-4">
                {(candidateSearchQuery ? filteredCandidates : candidates).map((candidate) => (
                  <div 
                    key={candidate.id}
                    className="p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <div className="mb-2 sm:mb-0">
                        <h4 className="font-medium flex items-center">
                          <UserIcon className="w-4 h-4 mr-2 text-primary" />
                          {candidate.name}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-surface-500 dark:text-surface-400 mt-1 space-y-1 sm:space-y-0 sm:space-x-4">
                          <div className="flex items-center">
                            <MailIcon className="w-3.5 h-3.5 mr-1" />
                            {candidate.email}
                          </div>
                          <div className="flex items-center">
                            <BriefcaseIcon className="w-3.5 h-3.5 mr-1" />
                            {candidate.position}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                        <span className={`badge mr-3 sm:mr-4 ${
                          candidate.status === 'Applied' ? 'badge-info' : 
                          candidate.status === 'Screening' ? 'badge-neutral' :
                          candidate.status === 'Interview' ? 'badge-warning' :
                          candidate.status === 'Offer' ? 'badge-success' :
                          'badge-neutral'
                        }`}>
                          {candidate.status}
                        </span>
                        
                        <button className="flex items-center text-primary hover:text-primary-dark text-sm font-medium">
                          View Details
                          <ChevronRightIcon className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {candidateSearchQuery && filteredCandidates.length === 0 && (
                  <div className="text-center py-8 text-surface-500">
                    No candidates match your search.
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-surface-500">
                  Showing {(candidateSearchQuery ? filteredCandidates : candidates).length} candidates
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="py-1 px-2 rounded border border-surface-200 dark:border-surface-700 text-sm">
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-primary text-white rounded text-sm">1</span>
                  <button className="py-1 px-2 rounded border border-surface-200 dark:border-surface-700 text-sm">
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Module Not Found</h3>
            <p className="text-surface-500">The selected module could not be loaded.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {renderModule()}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;