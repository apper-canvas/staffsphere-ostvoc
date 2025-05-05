import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isWithinInterval, parseISO, differenceInDays, getDaysInMonth } from 'date-fns';
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
  const DollarSignIcon = getIcon('DollarSign');
  const PercentIcon = getIcon('Percent');
  const UsersIcon = getIcon('Users');
  const BuildingIcon = getIcon('Building');
  const GraduationCapIcon = getIcon('GraduationCap');
  const AwardIcon = getIcon('Award');
  const HelpCircleIcon = getIcon('HelpCircle');
  const InfoIcon = getIcon('Info');
  const RupeeIcon = getIcon('IndianRupee');
  
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
    { date: '2023-06-24', clockIn: '09:10 AM', clockOut: '01:30 PM', status: 'Half Day' },
    { date: '2023-06-25', clockIn: '08:45 AM', clockOut: '05:15 PM', status: 'Work from Home' },
  ]);

  // Leave Management Module State
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'Sick Leave', start: '2023-07-12', end: '2023-07-14', status: 'Approved' },
    { id: 2, type: 'Vacation', start: '2023-08-10', end: '2023-08-20', status: 'Pending' },
    { id: 3, type: 'Personal Leave', start: '2023-06-05', end: '2023-06-07', status: 'Approved' }
  ]);

  // Payroll Module State (Updated for Indian Structure with TDS)
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [workingDays, setWorkingDays] = useState(22); // Default working days in a month
  const [presentDays, setPresentDays] = useState(20); // Default present days
  const [halfDays, setHalfDays] = useState(1); // Default half days
  const [absentDays, setAbsentDays] = useState(1); // Default absent days
  const [leaveDays, setLeaveDays] = useState(0); // Default leave days
  const [paidLeaves, setPaidLeaves] = useState(0); // Default paid leaves
  const [unpaidLeaves, setUnpaidLeaves] = useState(0); // Default unpaid leaves
  const [basicSalary, setBasicSalary] = useState(35000); // Default basic salary

  const [payrollData, setPayrollData] = useState({
    basicSalary: 35000,
    allowances: { 
      hra: 14000, 
      da: 7000, 
      conveyance: 1600, 
      specialAllowance: 8400 
    },
    deductions: { 
      professionalTax: 200, 
      epf: 4200, 
      esi: 0, 
      tds: 3200 
    },
    attendanceBasedDeduction: 0,
    leaveBasedDeduction: 0,
    netSalary: 58400
  });

  // Tax Calculator Module State (Updated for Indian Tax System)
  const [income, setIncome] = useState(750000);
  const [taxRegime, setTaxRegime] = useState('old');
  const [standard80c, setStandard80c] = useState(100000);
  const [medical80d, setMedical80d] = useState(25000);
  const [hraExemption, setHraExemption] = useState(60000);
  const [otherDeductions, setOtherDeductions] = useState(20000);
  const [taxBreakdown, setTaxBreakdown] = useState({
    incomeTax: 27500,
    surcharge: 0,
    cessAmount: 550,
    totalTax: 28050,
    effectiveRate: 3.74
  });

  // Hiring Module State
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Alex Johnson", email: "alex@example.com", position: "Software Engineer", status: "Interview", phone: "555-123-4567", education: "MS Computer Science", experience: "5 years", skills: ["JavaScript", "React", "Node.js"] },
    { id: 2, name: "Taylor Smith", email: "taylor@example.com", position: "UX Designer", status: "Applied", phone: "555-987-6543", education: "BA Design", experience: "3 years", skills: ["UI/UX", "Figma", "Adobe XD"] },
    { id: 3, name: "Jordan Lee", email: "jordan@example.com", position: "Product Manager", status: "Offer", phone: "555-246-8135", education: "MBA", experience: "7 years", skills: ["Product Strategy", "Agile", "Data Analysis"] },
    { id: 4, name: "Casey Brown", email: "casey@example.com", position: "Marketing Specialist", status: "Screening", phone: "555-369-1478", education: "BA Marketing", experience: "2 years", skills: ["Content Marketing", "Social Media", "Analytics"] }
  ]);
  
  // Hiring Module Modal States
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showViewCandidateModal, setShowViewCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Add Candidate Form State
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    education: '',
    experience: '',
    skills: '',
    status: 'Applied'
  });
  
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

  // Calculate attendance and leave based salary adjustments
  const calculateSalaryAdjustments = () => {
    // Parse selected month
    const selectedDate = new Date(selectedMonth);
    const daysInMonth = getDaysInMonth(selectedDate);
    const monthYear = format(selectedDate, 'yyyy-MM');
    
    // Count attendance types from records for the selected month
    let presentCount = 0;
    let halfDayCount = 0;
    let absentCount = 0;
    let wfhCount = 0;
    
    // Filter records for the selected month
    const monthRecords = attendanceRecords.filter(record => {
      const recordDate = record.date.substring(0, 7); // Get YYYY-MM part
      return recordDate === monthYear;
    });
    
    // Count status types
    monthRecords.forEach(record => {
      if (record.status === 'Present') presentCount++;
      else if (record.status === 'Half Day') halfDayCount++;
      else if (record.status === 'Absent') absentCount++;
      else if (record.status === 'Work from Home') wfhCount++;
    });
    
    // Calculate approved leaves in the selected month
    let approvedLeaveCount = 0;
    let paidLeaveCount = 0;
    let unpaidLeaveCount = 0;
    
    leaveRequests.forEach(leave => {
      if (leave.status === 'Approved') {
        const startDate = parseISO(leave.start);
        const endDate = parseISO(leave.end);
        const leaveDuration = differenceInDays(endDate, startDate) + 1;
        
        // Check if leave falls within the selected month
        const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        
        // Check if leave intersects with the selected month
        if (
          (startDate <= lastDayOfMonth && endDate >= firstDayOfMonth) ||
          (endDate >= firstDayOfMonth && startDate <= lastDayOfMonth)
        ) {
          approvedLeaveCount += leaveDuration;
          
          // Determine if it's a paid or unpaid leave
          if (leave.type === 'Sick Leave' || leave.type === 'Casual Leave') {
            paidLeaveCount += leaveDuration;
          } else {
            unpaidLeaveCount += leaveDuration;
          }
        }
      }
    });
    
    // Update state with the counts
    setPresentDays(presentCount);
    setHalfDays(halfDayCount);
    setAbsentDays(absentCount);
    setLeaveDays(approvedLeaveCount);
    setPaidLeaves(paidLeaveCount);
    setUnpaidLeaves(unpaidLeaveCount);
    setWorkingDays(daysInMonth);
    
    // Calculate salary adjustments
    const dailyRate = basicSalary / daysInMonth;
    const halfDayDeduction = (dailyRate * 0.5) * halfDayCount;
    const absentDeduction = dailyRate * absentCount;
    const unpaidLeaveDeduction = dailyRate * unpaidLeaveCount;
    
    // Total deductions from attendance and leaves
    const attendanceDeduction = halfDayDeduction + absentDeduction;
    const leaveDeduction = unpaidLeaveDeduction;
    
    // Calculate TDS based on projected annual income
    const monthlyGross = basicSalary + 
      payrollData.allowances.hra + 
      payrollData.allowances.da + 
      payrollData.allowances.conveyance + 
      payrollData.allowances.specialAllowance;
    
    const projectedAnnualIncome = monthlyGross * 12;
    let tdsAmount = calculateMonthlyTDS(projectedAnnualIncome);
    
    // Update payroll data with new calculations
    setPayrollData({
      ...payrollData,
      basicSalary: basicSalary,
      attendanceBasedDeduction: Math.round(attendanceDeduction),
      leaveBasedDeduction: Math.round(leaveDeduction),
      deductions: {
        ...payrollData.deductions,
        tds: tdsAmount
      },
      netSalary: Math.round(
        basicSalary + 
        payrollData.allowances.hra + 
        payrollData.allowances.da + 
        payrollData.allowances.conveyance + 
        payrollData.allowances.specialAllowance - 
        (payrollData.deductions.professionalTax + 
         payrollData.deductions.epf + 
         payrollData.deductions.esi + 
         tdsAmount + 
         attendanceDeduction + 
         leaveDeduction)
      )
    });
  };

  // Calculate monthly TDS based on annual income
  const calculateMonthlyTDS = (annualIncome) => {
    // Simplified TDS calculation based on old tax regime
    let annualTax = 0;
    
    if (annualIncome <= 250000) {
      annualTax = 0;
    } else if (annualIncome <= 500000) {
      annualTax = (annualIncome - 250000) * 0.05;
    } else if (annualIncome <= 1000000) {
      annualTax = 12500 + (annualIncome - 500000) * 0.2;
    } else {
      annualTax = 112500 + (annualIncome - 1000000) * 0.3;
    }
    
    // Add 4% cess
    annualTax = annualTax + (annualTax * 0.04);
    
    // Return monthly TDS (annual tax divided by 12)
    return Math.round(annualTax / 12);
  };

  // Tax Calculator Functions
  const calculateTax = () => {
    let incomeTax = 0;
    let surcharge = 0;
    let cessAmount = 0;
    let totalTax = 0;
    let effectiveRate = 0;
    let taxableIncome = income;
    
    // Calculate taxable income based on regime
    if (taxRegime === 'old') {
      // Old regime allows standard deductions
      // Deduct Section 80C (max 150000)
      const deduction80c = Math.min(standard80c, 150000);
      // Deduct Section 80D (max 50000 for self + parents)
      const deduction80d = Math.min(medical80d, 50000);
      // HRA exemption and other deductions
      const totalDeductions = deduction80c + deduction80d + hraExemption + otherDeductions;
      
      taxableIncome = Math.max(0, income - totalDeductions);
      
      // Calculate tax as per old slabs
      if (taxableIncome <= 250000) {
        incomeTax = 0;
      } else if (taxableIncome <= 500000) {
        incomeTax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        incomeTax = 12500 + (taxableIncome - 500000) * 0.2;
      } else {
        incomeTax = 112500 + (taxableIncome - 1000000) * 0.3;
      }
    } else {
      // New regime has different slabs with no exemptions
      if (taxableIncome <= 300000) {
        incomeTax = 0;
      } else if (taxableIncome <= 600000) {
        incomeTax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 900000) {
        incomeTax = 15000 + (taxableIncome - 600000) * 0.1;
      } else if (taxableIncome <= 1200000) {
        incomeTax = 45000 + (taxableIncome - 900000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        incomeTax = 90000 + (taxableIncome - 1200000) * 0.2;
      } else {
        incomeTax = 150000 + (taxableIncome - 1500000) * 0.3;
      }
    }
    
    // Surcharge calculation (simplified)
    if (income > 5000000 && income <= 10000000) {
      surcharge = incomeTax * 0.1;
    } else if (income > 10000000 && income <= 20000000) {
      surcharge = incomeTax * 0.15;
    } else if (income > 20000000 && income <= 50000000) {
      surcharge = incomeTax * 0.25;
    } else if (income > 50000000) {
      surcharge = incomeTax * 0.37;
    }
    
    // Health and Education Cess (4% of tax + surcharge)
    cessAmount = (incomeTax + surcharge) * 0.04;
    
    totalTax = incomeTax + surcharge + cessAmount;
    effectiveRate = ((totalTax / income) * 100).toFixed(2);
    
    setTaxBreakdown({
      incomeTax: incomeTax.toFixed(0),
      surcharge: surcharge.toFixed(0),
      cessAmount: cessAmount.toFixed(0),
      totalTax: totalTax.toFixed(0),
      effectiveRate,
      taxableIncome: taxableIncome.toFixed(0)
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
  
  // Function to handle opening Add Candidate modal
  const handleAddCandidateClick = () => {
    setShowAddCandidateModal(true);
  };
  
  // Function to handle form field changes for new candidate
  const handleNewCandidateChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate({
      ...newCandidate,
      [name]: value
    });
  };
  
  // Function to handle adding a new candidate
  const handleAddCandidate = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newCandidate.name || !newCandidate.email || !newCandidate.position) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    // Create new candidate object
    const candidateToAdd = {
      id: candidates.length + 1,
      name: newCandidate.name,
      email: newCandidate.email,
      phone: newCandidate.phone,
      position: newCandidate.position,
      education: newCandidate.education,
      experience: newCandidate.experience,
      skills: newCandidate.skills.split(',').map(skill => skill.trim()),
      status: newCandidate.status
    };
    
    // Add candidate to the list
    setCandidates([candidateToAdd, ...candidates]);
    
    // Reset form and close modal
    setNewCandidate({
      name: '',
      email: '',
      phone: '',
      position: '',
      education: '',
      experience: '',
      skills: '',
      status: 'Applied'
    });
    setShowAddCandidateModal(false);
    
    toast.success(`Added new candidate: ${candidateToAdd.name}`, {
      icon: '👤'
    });
  };
  
  // Function to handle viewing candidate details
  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowViewCandidateModal(true);
  };

  // Update basic salary when changed
  const handleBasicSalaryChange = (e) => {
    const newBasicSalary = parseInt(e.target.value);
    setBasicSalary(newBasicSalary);
    
    // Recalculate allowances based on basic salary
    const newHRA = Math.round(newBasicSalary * 0.4); // 40% of basic as HRA
    const newDA = Math.round(newBasicSalary * 0.2); // 20% of basic as DA
    const newSpecialAllowance = Math.round(newBasicSalary * 0.24); // 24% of basic as special allowance
    
    // Update PF deduction (12% of basic)
    const newPF = Math.round(newBasicSalary * 0.12);
    
    // Update payroll data with new calculations
    setPayrollData(prev => ({
      ...prev,
      basicSalary: newBasicSalary,
      allowances: {
        ...prev.allowances,
        hra: newHRA,
        da: newDA,
        specialAllowance: newSpecialAllowance
      },
      deductions: {
        ...prev.deductions,
        epf: newPF
      }
    }));
  };
  
  // Update tax calculations when inputs change
  useEffect(() => {
    calculateTax();
  }, [income, taxRegime, standard80c, medical80d, hraExemption, otherDeductions]);
  
  // Update filtered candidates when candidates change
  useEffect(() => {
    if (candidateSearchQuery) {
      handleCandidateSearch({ target: { value: candidateSearchQuery } });
    }
  }, [candidates]);
  
  // Update salary calculations when month, attendance or basic salary changes
  useEffect(() => {
    calculateSalaryAdjustments();
  }, [selectedMonth, attendanceRecords, leaveRequests, basicSalary]);

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
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
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
                  <RupeeIcon className="w-5 h-5 mr-2 text-primary" />
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
                    
                    <div className="mb-4">
                      <label className="form-label">Basic Salary (₹)</label>
                      <input 
                        type="number" 
                        value={basicSalary}
                        onChange={handleBasicSalaryChange}
                        className="form-input"
                        min="1000"
                        step="1000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Basic Salary</span>
                        <span className="font-medium">₹{payrollData.basicSalary.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>House Rent Allowance (HRA)</span>
                        <span>₹{payrollData.allowances.hra.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Dearness Allowance (DA)</span>
                        <span>₹{payrollData.allowances.da.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Conveyance Allowance</span>
                        <span>₹{payrollData.allowances.conveyance.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Special Allowance</span>
                        <span>₹{payrollData.allowances.specialAllowance.toLocaleString()}</span>
                      </div>
                      
                      <div className="border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Earnings</span>
                          <span>
                            ₹{(payrollData.basicSalary + 
                              payrollData.allowances.hra + 
                              payrollData.allowances.da + 
                              payrollData.allowances.conveyance + 
                              payrollData.allowances.specialAllowance).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                    <h4 className="text-lg font-medium mb-3">Attendance & Leave Summary</h4>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-900">
                        <div className="text-sm text-green-800 dark:text-green-300">Present Days</div>
                        <div className="text-xl font-semibold mt-1">{presentDays} <span className="text-xs text-green-700 dark:text-green-400">days</span></div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900">
                        <div className="text-sm text-yellow-800 dark:text-yellow-300">Half Days</div>
                        <div className="text-xl font-semibold mt-1">{halfDays} <span className="text-xs text-yellow-700 dark:text-yellow-400">days</span></div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900">
                        <div className="text-sm text-red-800 dark:text-red-300">Absent Days</div>
                        <div className="text-xl font-semibold mt-1">{absentDays} <span className="text-xs text-red-700 dark:text-red-400">days</span></div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-900">
                        <div className="text-sm text-blue-800 dark:text-blue-300">Leave Days</div>
                        <div className="text-xl font-semibold mt-1">{leaveDays} <span className="text-xs text-blue-700 dark:text-blue-400">days</span></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Working Days in Month</span>
                        <span className="font-medium">{workingDays} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Paid Leaves</span>
                        <span className="font-medium">{paidLeaves} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Unpaid Leaves</span>
                        <span className="font-medium">{unpaidLeaves} days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                    <h4 className="text-lg font-medium mb-3">Payment Information</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Payment Method</span>
                        <span className="bg-surface-200 dark:bg-surface-700 px-3 py-1 rounded text-sm">NEFT Transfer</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Bank Account</span>
                        <span>XXXX-XXXX-1234</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Payment Date</span>
                        <span>Last working day of month</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                    <h4 className="text-lg font-medium mb-3">Deductions</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span>Employee PF (12% of Basic)</span>
                          <div className="relative group ml-1">
                            <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                            <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                              Employee contribution to EPF, deducted from salary.
                            </div>
                          </div>
                        </div>
                        <span>₹{payrollData.deductions.epf.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span>Professional Tax</span>
                          <div className="relative group ml-1">
                            <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                            <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                              State-specific professional tax based on salary bracket.
                            </div>
                          </div>
                        </div>
                        <span>₹{payrollData.deductions.professionalTax.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span>Income Tax (TDS)</span>
                          <div className="relative group ml-1">
                            <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                            <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                              Tax Deducted at Source as per Income Tax Act, based on projected annual income.
                            </div>
                          </div>
                        </div>
                        <span>₹{payrollData.deductions.tds.toLocaleString()}</span>
                      </div>
                      
                      {payrollData.deductions.esi > 0 && (
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span>ESI Contribution</span>
                            <div className="relative group ml-1">
                              <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                              <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                                Employee's State Insurance for employees with gross salary below ₹21,000.
                              </div>
                            </div>
                          </div>
                          <span>₹{payrollData.deductions.esi.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {payrollData.attendanceBasedDeduction > 0 && (
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span>Attendance-based Deduction</span>
                            <div className="relative group ml-1">
                              <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                                Deductions for half days and absences. Full day salary is deducted for absence, and half day for half-day attendance.
                              </div>
                            </div>
                          </div>
                          <span>₹{payrollData.attendanceBasedDeduction.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {payrollData.leaveBasedDeduction > 0 && (
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span>Leave-based Deduction</span>
                            <div className="relative group ml-1">
                              <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                                Deductions for unpaid leaves. Sick leaves and casual leaves are paid, while other types may be unpaid depending on company policy.
                              </div>
                            </div>
                          </div>
                          <span>₹{payrollData.leaveBasedDeduction.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Deductions</span>
                          <span>
                            ₹{(payrollData.deductions.professionalTax + 
                              payrollData.deductions.epf + 
                              payrollData.deductions.esi + 
                              payrollData.deductions.tds +
                              payrollData.attendanceBasedDeduction +
                              payrollData.leaveBasedDeduction).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-lg bg-primary text-white">
                    <h4 className="text-lg font-medium mb-4">Net Salary</h4>
                    
                    <div className="text-3xl font-bold">₹{payrollData.netSalary.toLocaleString()}</div>
                    <div className="text-sm opacity-80 mt-1">for {format(new Date(selectedMonth), 'MMMM yyyy')}</div>
                    
                    <button className="mt-4 bg-white text-primary hover:bg-surface-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                      Download Pay Slip
                    </button>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                    <h4 className="text-lg font-medium mb-3 flex items-center">
                      <InfoIcon className="w-4 h-4 mr-2 text-primary" />
                      Salary Calculation Breakdown
                    </h4>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Earnings (A)</span>
                        <span className="font-medium">
                          ₹{(payrollData.basicSalary + 
                              payrollData.allowances.hra + 
                              payrollData.allowances.da + 
                              payrollData.allowances.conveyance + 
                              payrollData.allowances.specialAllowance).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Standard Deductions (B)</span>
                        <span className="font-medium">
                          ₹{(payrollData.deductions.professionalTax + 
                              payrollData.deductions.epf + 
                              payrollData.deductions.esi +
                              payrollData.deductions.tds).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Attendance & Leave Deductions (C)</span>
                        <span className="font-medium text-red-500 dark:text-red-400">
                          ₹{(payrollData.attendanceBasedDeduction + 
                              payrollData.leaveBasedDeduction).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between pt-1 border-t border-surface-200 dark:border-surface-700 mt-1 font-medium">
                        <span>Net Salary (A-B-C)</span>
                        <span>₹{payrollData.netSalary.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-surface-500">
                      <p>* Salary is calculated based on your attendance and approved leaves for the month.</p>
                      <p>* TDS is calculated based on your projected annual income and tax regime.</p>
                    </div>
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
                Indian Income Tax Calculator
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="form-label">Gross Annual Income (₹)</label>
                    <input 
                      type="number" 
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="form-input"
                      min="0"
                      step="10000"
                    />
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0"
                        max="2000000"
                        step="10000"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>₹0</span>
                        <span>₹10,00,000</span>
                        <span>₹20,00,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label flex items-center">
                      <span>Tax Regime</span>
                      <div className="relative group ml-1">
                        <InfoIcon className="w-4 h-4 text-primary" />
                        <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                          <p className="mb-1"><strong>Old Regime:</strong> Allows deductions/exemptions but has higher tax rates</p>
                          <p><strong>New Regime:</strong> Lower tax rates but no deductions/exemptions allowed</p>
                        </div>
                      </div>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {['old', 'new'].map((regime) => (
                        <button
                          key={regime}
                          type="button"
                          onClick={() => setTaxRegime(regime)}
                          className={`py-2 px-4 rounded-lg border transition-all text-center ${
                            taxRegime === regime 
                              ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                              : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                          }`}
                        >
                          {regime === 'old' ? 'Old Regime' : 'New Regime'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {taxRegime === 'old' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-surface-600">Deductions & Exemptions</h4>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm flex items-center">
                            <span>Section 80C (₹)</span>
                            <div className="relative group ml-1">
                              <InfoIcon className="w-3.5 h-3.5 text-surface-500" />
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                                Includes PF, ELSS, PPF, Life Insurance, etc. Maximum deduction of ₹1.5 lakhs.
                              </div>
                            </div>
                          </label>
                          <span className="text-xs text-surface-500">Max: ₹1,50,000</span>
                        </div>
                        <input 
                          type="number" 
                          value={standard80c}
                          onChange={(e) => setStandard80c(Number(e.target.value))}
                          className="form-input"
                          min="0"
                          max="150000"
                          step="1000"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm flex items-center">
                            <span>Section 80D - Medical Insurance (₹)</span>
                            <div className="relative group ml-1">
                              <InfoIcon className="w-3.5 h-3.5 text-surface-500" />
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                                Health insurance premium for self, family and parents. Maximum deduction of ₹25,000 (₹50,000 for senior citizens).
                              </div>
                            </div>
                          </label>
                          <span className="text-xs text-surface-500">Max: ₹50,000</span>
                        </div>
                        <input 
                          type="number" 
                          value={medical80d}
                          onChange={(e) => setMedical80d(Number(e.target.value))}
                          className="form-input"
                          min="0"
                          max="50000"
                          step="1000"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm flex items-center">
                            <span>HRA Exemption (₹)</span>
                            <div className="relative group ml-1">
                              <InfoIcon className="w-3.5 h-3.5 text-surface-500" />
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                                House Rent Allowance exemption based on actual HRA received, rent paid, and location (metro/non-metro).
                              </div>
                            </div>
                          </label>
                        </div>
                        <input 
                          type="number" 
                          value={hraExemption}
                          onChange={(e) => setHraExemption(Number(e.target.value))}
                          className="form-input"
                          min="0"
                          step="1000"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm flex items-center">
                            <span>Other Deductions (₹)</span>
                            <div className="relative group ml-1">
                              <InfoIcon className="w-3.5 h-3.5 text-surface-500" />
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                                Other deductions like 80E (Education Loan), 80G (Donations), 80TTA (Savings interest), etc.
                              </div>
                            </div>
                          </label>
                        </div>
                        <input 
                          type="number" 
                          value={otherDeductions}
                          onChange={(e) => setOtherDeductions(Number(e.target.value))}
                          className="form-input"
                          min="0"
                          step="1000"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                    <h4 className="font-medium mb-3">Income Breakdown</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Gross Annual Income</span>
                        <span className="font-medium">₹{income.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Income</span>
                        <span>₹{(income / 12).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      {taxRegime === 'old' && (
                        <div className="flex justify-between text-primary font-medium">
                          <span>Total Deductions</span>
                          <span>₹{(parseInt(standard80c) + parseInt(medical80d) + parseInt(hraExemption) + parseInt(otherDeductions)).toLocaleString()}</span>
                        </div>
                      )}
                      {taxBreakdown.taxableIncome && (
                        <div className="flex justify-between font-medium pt-1 border-t border-surface-200 dark:border-surface-700 mt-1">
                          <span>Taxable Income</span>
                          <span>₹{parseInt(taxBreakdown.taxableIncome).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="p-5 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Tax Calculation Results</h4>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {taxRegime === 'old' ? 'Old Regime' : 'New Regime'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span>Income Tax</span>
                          <div className="relative group ml-1">
                            <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                            <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                              Base tax calculated on taxable income as per applicable tax slabs.
                            </div>
                          </div>
                        </div>
                        <span className="font-medium">₹{taxBreakdown.incomeTax}</span>
                      </div>
                      
                      {parseInt(taxBreakdown.surcharge) > 0 && (
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span>Surcharge</span>
                            <div className="relative group ml-1">
                              <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                              <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                                Additional tax for income above ₹50 lakhs (10-37% of income tax based on income slab).
                              </div>
                            </div>
                          </div>
                          <span>₹{taxBreakdown.surcharge}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span>Health & Education Cess (4%)</span>
                          <div className="relative group ml-1">
                            <HelpCircleIcon className="w-4 h-4 text-surface-400" />
                            <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-surface-800 shadow-md rounded p-2 text-xs hidden group-hover:block z-10">
                              4% cess on total of income tax and surcharge.
                            </div>
                          </div>
                        </div>
                        <span>₹{taxBreakdown.cessAmount}</span>
                      </div>
                      
                      <div className="border-t border-surface-200 dark:border-surface-700 pt-3 mt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total Tax Liability</span>
                          <span>₹{taxBreakdown.totalTax}</span>
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
                        <span>₹{(income - parseInt(taxBreakdown.totalTax)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-surface-500 mt-1">
                        <span>Monthly Take-Home</span>
                        <span>₹{((income - parseInt(taxBreakdown.totalTax)) / 12).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-surface-500 dark:text-surface-400">
                    <p className="mb-1"><strong>Tax Slabs for FY 2023-24 (AY 2024-25):</strong></p>
                    
                    <div className="flex space-x-4 mt-2">
                      <div className="flex-1">
                        <p className="font-medium mb-1">Old Regime:</p>
                        <ul className="text-xs space-y-1">
                          <li>Up to ₹2.5L: Nil</li>
                          <li>₹2.5L to ₹5L: 5%</li>
                          <li>₹5L to ₹10L: 20%</li>
                          <li>Above ₹10L: 30%</li>
                        </ul>
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium mb-1">New Regime:</p>
                        <ul className="text-xs space-y-1">
                          <li>Up to ₹3L: Nil</li>
                          <li>₹3L to ₹6L: 5%</li>
                          <li>₹6L to ₹9L: 10%</li>
                          <li>₹9L to ₹12L: 15%</li>
                          <li>₹12L to ₹15L: 20%</li>
                          <li>Above ₹15L: 30%</li>
                        </ul>
                      </div>
                    </div>
                    
                    <p className="mt-3">Disclaimer: This is a simplified tax calculator for estimation purposes only. 
                       Actual tax calculations may vary based on specific deductions, exemptions, and other factors. 
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
                
                <button 
                  className="btn btn-primary"
                  onClick={handleAddCandidateClick}
                >
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
                        
                        <button 
                          className="flex items-center text-primary hover:text-primary-dark text-sm font-medium"
                          onClick={() => handleViewCandidate(candidate)}
                        >
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
            
            {/* Add Candidate Modal */}
            <AnimatePresence>
              {showAddCandidateModal && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowAddCandidateModal(false)}
                  ></div>
                  
                  <div className="relative w-full max-w-xl bg-white dark:bg-surface-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-5 border-b border-surface-200 dark:border-surface-700">
                      <h3 className="text-xl font-semibold flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2 text-primary" />
                        Add New Candidate
                      </h3>
                    </div>
                    
                    <form onSubmit={handleAddCandidate} className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Full Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="name"
                            value={newCandidate.name}
                            onChange={handleNewCandidateChange}
                            className="form-input"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="form-label">Email <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            name="email"
                            value={newCandidate.email}
                            onChange={handleNewCandidateChange}
                            className="form-input"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="form-label">Phone Number</label>
                          <input
                            type="text"
                            name="phone"
                            value={newCandidate.phone}
                            onChange={handleNewCandidateChange}
                            className="form-input"
                            placeholder="555-123-4567"
                          />
                        </div>
                        
                        <div>
                          <label className="form-label">Position <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="position"
                            value={newCandidate.position}
                            onChange={handleNewCandidateChange}
                            className="form-input"
                            placeholder="Software Engineer"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="form-label">Education</label>
                          <input
                            type="text"
                            name="education"
                            value={newCandidate.education}
                            onChange={handleNewCandidateChange}
                            className="form-input"
                            placeholder="BS Computer Science"
                          />
                        </div>
                        
                        <div>
                          <label className="form-label">Experience</label>
                          <input
                            type="text"
                            name="experience"
                            value={newCandidate.experience}
                            onChange={handleNewCandidateChange}
                            className="form-input"
                            placeholder="3 years"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="form-label">Skills (comma separated)</label>
                        <input
                          type="text"
                          name="skills"
                          value={newCandidate.skills}
                          onChange={handleNewCandidateChange}
                          className="form-input"
                          placeholder="JavaScript, React, Node.js"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label className="form-label">Status</label>
                        <select
                          name="status"
                          value={newCandidate.status}
                          onChange={handleNewCandidateChange}
                          className="form-input"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Screening">Screening</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddCandidateModal(false)}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Add Candidate
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* View Candidate Modal */}
            <AnimatePresence>
              {showViewCandidateModal && selectedCandidate && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowViewCandidateModal(false)}
                  ></div>
                  
                  <div className="relative w-full max-w-2xl bg-white dark:bg-surface-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                      <h3 className="text-xl font-semibold flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-primary" />
                        Candidate Details
                      </h3>
                      <button
                        onClick={() => setShowViewCandidateModal(false)}
                        className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 mb-5 md:mb-0 md:pr-5">
                          <div className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-4xl font-bold mb-3">
                            {selectedCandidate.name.charAt(0)}
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-lg font-medium">{selectedCandidate.name}</h4>
                            <div className="text-sm text-surface-500">{selectedCandidate.position}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <MailIcon className="w-4 h-4 mr-2 mt-0.5 text-surface-500" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Email</div>
                                <div className="text-sm text-surface-500">{selectedCandidate.email}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <PhoneIcon className="w-4 h-4 mr-2 mt-0.5 text-surface-500" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Phone</div>
                                <div className="text-sm text-surface-500">{selectedCandidate.phone || "Not provided"}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <GraduationCapIcon className="w-4 h-4 mr-2 mt-0.5 text-surface-500" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Education</div>
                                <div className="text-sm text-surface-500">{selectedCandidate.education || "Not provided"}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <BriefcaseIcon className="w-4 h-4 mr-2 mt-0.5 text-surface-500" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Experience</div>
                                <div className="text-sm text-surface-500">{selectedCandidate.experience || "Not provided"}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 md:border-l md:border-surface-200 md:dark:border-surface-700 md:pl-5">
                          <div className="mb-5">
                            <h5 className="text-md font-medium mb-2 flex items-center">
                              <AwardIcon className="w-4 h-4 mr-2 text-primary" />
                              Skills
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {selectedCandidate.skills && selectedCandidate.skills.map((skill, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                              {(!selectedCandidate.skills || selectedCandidate.skills.length === 0) && (
                                <span className="text-sm text-surface-500">No skills provided</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-5">
                            <h5 className="text-md font-medium mb-2 flex items-center">
                              <CheckCircleIcon className="w-4 h-4 mr-2 text-primary" />
                              Application Status
                            </h5>
                            <div className="flex items-center">
                              <span className={`badge mr-3 ${
                                selectedCandidate.status === 'Applied' ? 'badge-info' : 
                                selectedCandidate.status === 'Screening' ? 'badge-neutral' :
                                selectedCandidate.status === 'Interview' ? 'badge-warning' :
                                selectedCandidate.status === 'Offer' ? 'badge-success' :
                                selectedCandidate.status === 'Rejected' ? 'badge-danger' :
                                'badge-neutral'
                              }`}>
                                {selectedCandidate.status}
                              </span>
                              <span className="text-sm text-surface-500">Updated on {format(new Date(), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-md font-medium mb-2 flex items-center">
                              <BuildingIcon className="w-4 h-4 mr-2 text-primary" />
                              Update Status
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                              {['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].map(status => (
                                <button
                                  key={status}
                                  className={`px-3 py-2 text-xs text-center rounded-lg border transition-colors ${
                                    selectedCandidate.status === status 
                                      ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20' 
                                      : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                                  }`}
                                  onClick={() => {
                                    const updatedCandidate = { ...selectedCandidate, status: status };
                                    setCandidates(candidates.map(c => 
                                      c.id === selectedCandidate.id ? updatedCandidate : c
                                    ));
                                    setSelectedCandidate(updatedCandidate);
                                    toast.success(`Candidate status updated to ${status}`, {
                                      icon: '👤'
                                    });
                                  }}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/60 flex justify-end">
                      <button
                        onClick={() => setShowViewCandidateModal(false)}
                        className="btn btn-primary"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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