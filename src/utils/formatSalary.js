/**
 * Mapping of legacy mock USD salary figures to realistic Indian Rupee (INR) ranges
 */
const USD_SALARY_MAP = {
  '130,000 - 155,000': '18,00,000 - 24,00,000',
  '145,000 - 175,000': '22,00,000 - 30,00,000',
  '115,000 - 140,000': '16,00,000 - 22,00,000',
  '160,000 - 190,000': '28,00,000 - 38,00,000',
  '120,000 - 145,000': '14,00,000 - 20,00,000',
  '110,000 - 135,000': '15,00,000 - 21,00,000',
  '140,000 - 165,000': '24,00,000 - 32,00,000',
  '125,000 - 150,000': '16,00,000 - 22,00,000',
  '85,000 - 105,000': '12,00,000 - 16,00,000',
  '75,000 - 95,000': '8,00,000 - 11,00,000',
  '60,000 - 80,000': '6,00,000 - 9,00,000',
  '100,000 - 130,000': '12,00,000 - 18,00,000',
};

/**
 * Normalizes any salary input to clean Indian Rupee format,
 * converting legacy USD ranges if present.
 */
export const normalizeSalaryString = (rawSalary) => {
  if (!rawSalary || typeof rawSalary !== 'string') {
    return '18,00,000 - 24,00,000';
  }

  // Extract clean number pattern without symbols
  const digitsOnly = rawSalary.replace(/[^\d,\s-]/g, '').trim();

  // If matches an old USD mock range, map it to proper Indian lakhs
  if (USD_SALARY_MAP[digitsOnly]) {
    return USD_SALARY_MAP[digitsOnly];
  }

  // Otherwise remove any $, ₹, or Rs prefixes so the number part is clean
  return rawSalary
    .replace(/^(\s*₹\s*|\s*Rs\.?\s*|\s*\$\s*)/gi, '')
    .replace(/\$/g, '')
    .trim();
};

/**
 * Formats a salary for display next to an <IndianRupee /> icon.
 * Ensures NO double currency symbols (e.g. ₹ ₹...) are ever rendered.
 */
export const formatSalaryNumber = (salary) => {
  const normalized = normalizeSalaryString(salary);
  // Remove any remaining ₹ or Rs so that only the clean numbers appear next to the icon
  return normalized.replace(/[₹$]|Rs\.?/gi, '').trim();
};

/**
 * Formats a salary with full prefix (e.g., "₹18,00,000 - 24,00,000" or "₹18 - 24 LPA")
 * for places where no icon is used or for storage.
 */
export const formatSalaryWithSymbol = (salary) => {
  const num = formatSalaryNumber(salary);
  return `₹${num}`;
};

export default formatSalaryNumber;
