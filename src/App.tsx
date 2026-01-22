import { useState, useEffect } from 'react';

export default function App() {
  // Navigation state
  const [activePage, setActivePage] = useState('dashboard');

  // Expense Tracker State
  const [expenses, setExpenses] = useState([]);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Savings Calculator State
  const [goalAmount, setGoalAmount] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [monthsToGoal, setMonthsToGoal] = useState(null);

  // Tax Estimator State
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [selectedState, setSelectedState] = useState('CA');
  const [filingStatus, setFilingStatus] = useState('single');
  const [estimatedTaxes, setEstimatedTaxes] = useState(null);

  // Animation states
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculatingTaxes, setIsCalculatingTaxes] = useState(false);
  const [particles, setParticles] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  // State tax rates (simplified for demo purposes)
  const stateTaxRates = {
    'AL': 5.0, 'AK': 0.0, 'AZ': 4.54, 'AR': 6.9, 'CA': 13.3,
    'CO': 4.63, 'CT': 6.99, 'DE': 6.6, 'FL': 0.0, 'GA': 5.75,
    'HI': 11.0, 'ID': 7.4, 'IL': 4.95, 'IN': 3.23, 'IA': 8.53,
    'KS': 5.7, 'KY': 5.0, 'LA': 6.0, 'ME': 7.15, 'MD': 5.75,
    'MA': 5.0, 'MI': 4.25, 'MN': 9.85, 'MS': 5.0, 'MO': 5.4,
    'MT': 6.9, 'NE': 6.84, 'NV': 0.0, 'NH': 5.0, 'NJ': 10.75,
    'NM': 4.9, 'NY': 8.82, 'NC': 5.25, 'ND': 2.9, 'OH': 4.797,
    'OK': 5.0, 'OR': 9.9, 'PA': 3.07, 'RI': 5.99, 'SC': 7.0,
    'SD': 0.0, 'TN': 0.0, 'TX': 0.0, 'UT': 4.95, 'VT': 8.75,
    'VA': 5.75, 'WA': 0.0, 'WV': 6.5, 'WI': 7.65, 'WY': 0.0
  };

  const states = Object.keys(stateTaxRates).map(code => ({ code, name: code }));

  const filingStatuses = [
    { id: 'single', name: 'Single' },
    { id: 'married', name: 'Married Filing Jointly' },
    { id: 'head', name: 'Head of Household' }
  ];

  // Federal tax brackets (2023, simplified)
  const federalTaxBrackets = {
    single: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11001, max: 44725, rate: 0.12 },
      { min: 44726, max: 95375, rate: 0.22 },
      { min: 95376, max: 182100, rate: 0.24 },
      { min: 182101, max: 231250, rate: 0.32 },
      { min: 231251, max: 578125, rate: 0.35 },
      { min: 578126, max: Infinity, rate: 0.37 }
    ],
    married: [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22001, max: 89450, rate: 0.12 },
      { min: 89451, max: 190750, rate: 0.22 },
      { min: 190751, max: 364200, rate: 0.24 },
      { min: 364201, max: 462500, rate: 0.32 },
      { min: 462501, max: 693750, rate: 0.35 },
      { min: 693751, max: Infinity, rate: 0.37 }
    ],
    head: [
      { min: 0, max: 15700, rate: 0.10 },
      { min: 15701, max: 59850, rate: 0.12 },
      { min: 59851, max: 95350, rate: 0.22 },
      { min: 95351, max: 182100, rate: 0.24 },
      { min: 182101, max: 231250, rate: 0.32 },
      { min: 231251, max: 578100, rate: 0.35 },
      { min: 578101, max: Infinity, rate: 0.37 }
    ]
  };

  // Initialize particles for background animation
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 1.5 + 0.5,
      color: ['from-amber-500', 'from-yellow-500', 'from-orange-500', 'from-amber-400'][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
    
    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y > 100 ? 0 : p.y + p.speed * 0.1,
        x: (p.x + Math.sin(p.y * 0.02) * 0.3) % 100
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedExpenses = localStorage.getItem('wealthflow_expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wealthflow_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Set today's date as default for expenseDate (in local timezone)
  useEffect(() => {
    const today = new Date();
    // Format as YYYY-MM-DD in local timezone
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setExpenseDate(formattedDate);
  }, []);

  // Filter expenses for selected month/year
  const filteredExpenses = expenses.filter(expense => {
    const expenseDateObj = new Date(expense.date);
    return expenseDateObj.getMonth() === selectedMonth && expenseDateObj.getFullYear() === selectedYear;
  });

  // Calculate total expenses for the selected period
  const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate total expenses for current month
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDateObj = new Date(expense.date);
    const now = new Date();
    return expenseDateObj.getMonth() === now.getMonth() && expenseDateObj.getFullYear() === now.getFullYear();
  }).reduce((total, expense) => total + expense.amount, 0);

  // Handle adding a new expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseDescription || !expenseAmount || !expenseDate) return;

    setIsAddingExpense(true);
    
    setTimeout(() => {
      const newExpense = {
        id: Date.now(),
        description: expenseDescription,
        amount: parseFloat(expenseAmount),
        date: expenseDate // Keep the date as string to preserve user input
      };

      setExpenses([...expenses, newExpense]);
      setExpenseDescription('');
      setExpenseAmount('');
      // Keep the same date for convenience
      setIsAddingExpense(false);
    }, 600);
  };

  // Handle deleting an expense
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calculate savings goal timeline
  const calculateSavingsTimeline = () => {
    if (!goalAmount || !currentSavings || !monthlyContribution) return;
    
    setIsCalculating(true);
    
    setTimeout(() => {
      const remainingAmount = Math.max(0, goalAmount - currentSavings);
      if (monthlyContribution <= 0) {
        setMonthsToGoal(remainingAmount > 0 ? Infinity : 0);
        setIsCalculating(false);
        return;
      }
      
      const monthsNeeded = Math.ceil(remainingAmount / monthlyContribution);
      setMonthsToGoal(monthsNeeded);
      setIsCalculating(false);
    }, 800);
  };

  // Calculate federal taxes
  const calculateFederalTaxes = (annualIncome, status) => {
    const brackets = federalTaxBrackets[status];
    let taxOwed = 0;
    
    for (const bracket of brackets) {
      if (annualIncome > bracket.min) {
        const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
        taxOwed += taxableInBracket * bracket.rate;
      } else {
        break;
      }
    }
    
    return taxOwed;
  };

  // Calculate tax estimate
  const calculateTaxEstimate = () => {
    if (!monthlyIncome) return;
    
    setIsCalculatingTaxes(true);
    
    setTimeout(() => {
      const annualIncome = parseFloat(monthlyIncome) * 12;
      const stateRate = stateTaxRates[selectedState] / 100;
      
      // Calculate federal taxes
      const federalTaxes = calculateFederalTaxes(annualIncome, filingStatus);
      
      // Calculate state taxes
      const stateTaxes = annualIncome * stateRate;
      
      // Total taxes
      const totalTaxes = federalTaxes + stateTaxes;
      
      setEstimatedTaxes({
        annualIncome,
        federalTaxes,
        stateTaxes,
        totalTaxes,
        monthlyTaxes: totalTaxes / 12
      });
      
      setIsCalculatingTaxes(false);
    }, 800);
  };

  // Dashboard Summary Data
  const totalAllExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const avgMonthlyExpenses = expenses.length > 0 ? totalAllExpenses / 12 : 0;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute rounded-full bg-gradient-to-br ${particle.color} to-transparent`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%)`,
              transition: 'top 0.1s linear',
            }}
          />
        ))}
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

      {/* Header */}
      <header className="relative z-10 bg-black/90 backdrop-blur-md text-white shadow-xl border-b border-amber-900/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-1 rounded-full animate-pulse">
              <div className="bg-black p-1 rounded-full">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center">
                  <span className="text-black font-bold text-lg">$</span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
              WealthFlow
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li 
                className={`font-medium cursor-pointer transition-all duration-300 ${
                  activePage === 'dashboard' 
                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1' 
                    : 'hover:text-amber-300'
                }`}
                onClick={() => setActivePage('dashboard')}
              >
                Dashboard
              </li>
              <li 
                className={`font-medium cursor-pointer transition-all duration-300 ${
                  activePage === 'expenses' 
                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1' 
                    : 'hover:text-amber-300'
                }`}
                onClick={() => setActivePage('expenses')}
              >
                Expense Tracker
              </li>
              <li 
                className={`font-medium cursor-pointer transition-all duration-300 ${
                  activePage === 'savings' 
                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1' 
                    : 'hover:text-amber-300'
                }`}
                onClick={() => setActivePage('savings')}
              >
                Savings Calculator
              </li>
              <li 
                className={`font-medium cursor-pointer transition-all duration-300 ${
                  activePage === 'taxes' 
                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1' 
                    : 'hover:text-amber-300'
                }`}
                onClick={() => setActivePage('taxes')}
              >
                Tax Estimator
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Dashboard Page */}
        {activePage === 'dashboard' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Financial Dashboard</h1>
              <p className="text-gray-400">Get a snapshot of your financial health</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Expenses Card */}
              <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-900/30 transform transition-transform duration-300 hover:scale-105 hover:border-amber-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Total Expenses</p>
                    <p className="text-3xl font-bold text-white mt-2">${totalAllExpenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-amber-900/20 p-3 rounded-full border border-amber-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-sm">Across all time</p>
                </div>
              </div>
              
              {/* Current Month Expenses Card */}
              <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-900/30 transform transition-transform duration-300 hover:scale-105 hover:border-amber-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">This Month</p>
                    <p className="text-3xl font-bold text-white mt-2">${currentMonthExpenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-amber-900/20 p-3 rounded-full border border-amber-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-sm">Current spending</p>
                </div>
              </div>
              
              {/* Average Monthly Expenses Card */}
              <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-900/30 transform transition-transform duration-300 hover:scale-105 hover:border-amber-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Avg. Monthly</p>
                    <p className="text-3xl font-bold text-white mt-2">${avgMonthlyExpenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-amber-900/20 p-3 rounded-full border border-amber-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-sm">Average spending</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Recent Expenses */}
              <div className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-900/30">
                <div className="bg-gradient-to-r from-black to-amber-900/10 text-white p-4 border-b border-amber-900/30">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Expenses
                  </h2>
                </div>
                <div className="p-4">
                  {expenses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No expenses recorded yet</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {[...expenses].reverse().slice(0, 5).map(expense => (
                        <div key={expense.id} className="flex justify-between items-center border-b border-amber-900/20 pb-3">
                          <div>
                            <p className="font-medium text-white">{expense.description}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="font-medium text-amber-400">${expense.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Savings Preview */}
              <div className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-900/30">
                <div className="bg-gradient-to-r from-black to-amber-900/10 text-white p-4 border-b border-amber-900/30">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Savings Goals
                  </h2>
                </div>
                <div className="p-4">
                  {monthsToGoal === null ? (
                    <div className="text-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-gray-500 mt-2">Set up your first savings goal</p>
                      <button 
                        onClick={() => setActivePage('savings')}
                        className="mt-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-black py-2 px-4 rounded-md text-sm hover:from-amber-700 hover:to-yellow-700 transition-all font-medium"
                      >
                        Go to Savings Calculator
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Time to reach goal:</span>
                        <span className="font-bold text-amber-400">
                          {monthsToGoal} month{monthsToGoal !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-amber-900/30">
                          <div 
                            style={{ width: `${Math.min(100, (currentSavings / goalAmount) * 100)}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/50 p-2 rounded-lg border border-amber-900/30">
                          <p className="text-xs text-gray-500">Goal</p>
                          <p className="font-bold text-white">${parseFloat(goalAmount || 0).toFixed(2)}</p>
                        </div>
                        <div className="bg-black/50 p-2 rounded-lg border border-amber-900/30">
                          <p className="text-xs text-gray-500">Saved</p>
                          <p className="font-bold text-white">${parseFloat(currentSavings || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expense Tracker Page */}
        {activePage === 'expenses' && (
          <section className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-900/30 transform transition-all duration-500">
            <div className="bg-gradient-to-r from-black to-amber-900/10 text-white p-6 border-b border-amber-900/30">
              <h2 className="text-2xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Monthly Expense Tracker
              </h2>
              <p className="text-gray-400">Track and manage your monthly spending</p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Month</label>
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index} className="bg-gray-800">{month}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year} className="bg-gray-800">{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <form onSubmit={handleAddExpense} className="mb-6 bg-black/50 p-4 rounded-xl border border-amber-900/30">
                <h3 className="font-medium text-lg mb-3 text-white">Add New Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <input
                      type="text"
                      value={expenseDescription}
                      onChange={(e) => setExpenseDescription(e.target.value)}
                      className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Groceries, Rent, etc."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isAddingExpense}
                  className={`mt-4 w-full flex items-center justify-center font-medium py-2 px-4 rounded-md transition-all duration-300 ${
                    isAddingExpense 
                      ? 'bg-amber-600 text-black' 
                      : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isAddingExpense ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add Expense'
                  )}
                </button>
              </form>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-black to-amber-900/10 rounded-xl border border-amber-900/30">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg text-white">Total Expenses</h3>
                  <span className="text-2xl font-bold text-amber-400">${totalExpenses.toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3 text-white">Expense List</h3>
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-8 bg-black/50 rounded-xl border border-amber-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-500 mt-2">No expenses recorded for this period</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {filteredExpenses.map(expense => (
                      <div 
                        key={expense.id} 
                        className="flex justify-between items-center border-b border-amber-900/20 pb-3 bg-black/50 p-3 rounded-lg hover:bg-black/70 transition-all duration-300"
                      >
                        <div>
                          <p className="font-medium text-white">{expense.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-amber-400">${expense.amount.toFixed(2)}</span>
                          <button 
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-400 transition-colors duration-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Savings Calculator Page */}
        {activePage === 'savings' && (
          <section className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-900/30 transform transition-all duration-500">
            <div className="bg-gradient-to-r from-black to-amber-900/10 text-white p-6 border-b border-amber-900/30">
              <h2 className="text-2xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Savings Calculator
              </h2>
              <p className="text-gray-400">Plan and reach your financial goals</p>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Savings Goal ($)</label>
                  <input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="10000"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Savings ($)</label>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="2000"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Contribution ($)</label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="500"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <button 
                  type="button"
                  onClick={calculateSavingsTimeline}
                  disabled={isCalculating}
                  className={`w-full flex items-center justify-center font-medium py-3 px-4 rounded-md transition-all duration-300 ${
                    isCalculating 
                      ? 'bg-amber-600 text-black' 
                      : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isCalculating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </>
                  ) : (
                    'Calculate Timeline'
                  )}
                </button>
              </form>
              
              {monthsToGoal !== null && (
                <div className="mt-8 p-6 bg-gradient-to-r from-black to-amber-900/10 rounded-xl border border-amber-900/30 animate-fadeIn">
                  <h3 className="font-medium text-lg mb-3 text-white">Your Savings Projection</h3>
                  
                  {monthsToGoal === Infinity ? (
                    <div className="text-center py-4">
                      <p className="text-gray-400 font-medium">Increase your monthly contribution to reach your goal!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Time to reach goal:</span>
                        <span className="font-bold text-amber-400 text-xl">
                          {monthsToGoal} month{monthsToGoal !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-300 bg-black">
                              Progress
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-amber-300">
                              {Math.min(100, ((currentSavings / goalAmount) * 100).toFixed(1))}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-amber-900/30">
                          <div 
                            style={{ width: `${Math.min(100, (currentSavings / goalAmount) * 100)}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-1000 ease-out"
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-black/50 p-3 rounded-xl border border-amber-900/30">
                          <p className="text-sm text-gray-500">Goal Amount</p>
                          <p className="font-bold text-white">${parseFloat(goalAmount || 0).toFixed(2)}</p>
                        </div>
                        <div className="bg-black/50 p-3 rounded-xl border border-amber-900/30">
                          <p className="text-sm text-gray-500">Current Savings</p>
                          <p className="font-bold text-white">${parseFloat(currentSavings || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-3 text-white">Financial Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start bg-black/50 p-3 rounded-lg border border-amber-900/30 hover:border-amber-500 transition-all duration-300">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-300">Set aside 20% of your income for savings</span>
                  </li>
                  <li className="flex items-start bg-black/50 p-3 rounded-lg border border-amber-900/30 hover:border-amber-500 transition-all duration-300">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-300">Automate your savings contributions</span>
                  </li>
                  <li className="flex items-start bg-black/50 p-3 rounded-lg border border-amber-900/30 hover:border-amber-500 transition-all duration-300">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-300">Review your budget monthly</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Tax Estimator Page */}
        {activePage === 'taxes' && (
          <section className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-900/30 transform transition-all duration-500">
            <div className="bg-gradient-to-r from-black to-amber-900/10 text-white p-6 border-b border-amber-900/30">
              <h2 className="text-2xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Tax Estimator
              </h2>
              <p className="text-gray-400">Estimate your federal and state taxes based on income</p>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Income ($)</label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="5000"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {states.map(state => (
                      <option key={state.code} value={state.code} className="bg-gray-800">
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Filing Status</label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    className="w-full bg-black text-gray-200 border border-amber-900/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {filingStatuses.map(status => (
                      <option key={status.id} value={status.id} className="bg-gray-800">
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  type="button"
                  onClick={calculateTaxEstimate}
                  disabled={isCalculatingTaxes}
                  className={`w-full flex items-center justify-center font-medium py-3 px-4 rounded-md transition-all duration-300 ${
                    isCalculatingTaxes 
                      ? 'bg-amber-600 text-black' 
                      : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isCalculatingTaxes ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </>
                  ) : (
                    'Calculate Tax Estimate'
                  )}
                </button>
              </form>
              
              {estimatedTaxes && (
                <div className="mt-8 p-6 bg-gradient-to-r from-black to-amber-900/10 rounded-xl border border-amber-900/30 animate-fadeIn">
                  <h3 className="font-medium text-lg mb-4 text-white">Tax Estimate Results</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/50 p-4 rounded-lg border border-amber-900/30">
                        <p className="text-sm text-gray-400">Annual Income</p>
                        <p className="text-xl font-bold text-amber-400">${estimatedTaxes.annualIncome.toLocaleString()}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-amber-900/30">
                        <p className="text-sm text-gray-400">Monthly Taxes</p>
                        <p className="text-xl font-bold text-amber-400">${estimatedTaxes.monthlyTaxes.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-black/50 p-4 rounded-lg border border-amber-900/30">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">Federal Taxes</span>
                        <span className="font-medium text-white">${estimatedTaxes.federalTaxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">State Taxes ({stateTaxRates[selectedState]}%)</span>
                        <span className="font-medium text-white">${estimatedTaxes.stateTaxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t border-amber-900/30">
                        <span className="text-gray-300 font-medium">Total Annual Taxes</span>
                        <span className="font-bold text-amber-400">${estimatedTaxes.totalTaxes.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/50 p-4 rounded-lg border border-amber-900/30">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Effective Tax Rate</span>
                        <span className="font-bold text-amber-400">
                          {((estimatedTaxes.totalTaxes / estimatedTaxes.annualIncome) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-3 text-white">Tax Planning Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start bg-black/50 p-3 rounded-lg border border-amber-900/30 hover:border-amber-500 transition-all duration-300">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-300">Maximize contributions to retirement accounts</span>
                  </li>
                  <li className="flex items-start bg-black/50 p-3 rounded-lg border border-amber-900/30 hover:border-amber-500 transition-all duration-300">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-300">Consider tax-loss harvesting for investments</span>
                  </li>
                  <li className="flex items-start bg-black/50 p-3 rounded-lg border border-amber-900/30 hover:border-amber-500 transition-all duration-300">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-300">Keep track of deductible expenses</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 bg-black border-t border-amber-900/30 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">© {new Date().getFullYear()} WealthFlow. All rights reserved.</p>
          <p className="mt-2 text-gray-500">Take control of your finances today</p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse delay-200"></div>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(180, 83, 9, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180, 83, 9, 0.2) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}