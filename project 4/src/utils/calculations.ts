import { WORKING_DAYS_PER_MONTH, MONTHS_PER_YEAR, EXPERIENCE_LEVELS } from '../constants';

export const calculateMonthlyIncome = (experienceId: string, hoursPerDay: number): number => {
  const experienceLevel = EXPERIENCE_LEVELS.find(exp => exp.id === experienceId);
  if (!experienceLevel) return 0;
  
  const hourlyRate = experienceLevel.rate;
  return Math.round(hourlyRate * hoursPerDay * WORKING_DAYS_PER_MONTH);
};

export const calculateAnnualIncome = (monthlyIncome: number): number => {
  return Math.round(monthlyIncome * MONTHS_PER_YEAR);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
};