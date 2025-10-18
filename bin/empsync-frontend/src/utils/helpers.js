export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const getDepartmentColor = (department) => {
  const colors = {
    'IT': '#6366f1',
    'HR': '#10b981',
    'Finance': '#f59e0b'
  };
  return colors[department] || '#6b7280';
};

export const calculateNetSalary = (employee) => {
  const salary = employee.salary || 0;
  const bonus = employee.bonus || 0;
  const pf = employee.pf || 0;
  const tax = employee.tax || 0;
  return salary + bonus - pf - tax;
};