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

/**
 * Standard salary filter brackets for filtering jobs by compensation
 */
export const SALARY_FILTER_OPTIONS = [
  { id: 'all', label: 'All Salary Ranges', min: 0, max: Infinity },
  { id: 'under-10', label: 'Under ₹10 Lakhs (< 10 LPA)', min: 0, max: 1000000 },
  { id: '10-15', label: '₹10 - ₹15 Lakhs (10 - 15 LPA)', min: 1000000, max: 1500000 },
  { id: '15-25', label: '₹15 - ₹25 Lakhs (15 - 25 LPA)', min: 1500000, max: 2500000 },
  { id: 'above-25', label: 'Above ₹25 Lakhs (> 25 LPA)', min: 2500000, max: Infinity },
];

/**
 * Extracts minimum and maximum numerical salary values from a salary string
 */
export const parseSalaryMinMax = (rawSalary) => {
  if (!rawSalary) return { min: 0, max: 0 };
  const normalized = normalizeSalaryString(String(rawSalary));
  const parts = normalized.split(/[-–—]|to/i).map((p) => p.trim()).filter(Boolean);

  const parseNum = (str) => {
    if (!str) return 0;
    const clean = str.replace(/[^\d.]/g, '');
    const val = parseFloat(clean);
    if (isNaN(val)) return 0;
    if (val < 200 && /lpa|lakh|lac/i.test(str || normalized)) {
      return val * 100000;
    }
    return val;
  };

  if (parts.length >= 2) {
    const min = parseNum(parts[0]);
    const max = parseNum(parts[1]);
    return { min: Math.min(min, max), max: Math.max(min, max) };
  } else if (parts.length === 1) {
    const val = parseNum(parts[0]);
    return { min: val, max: val };
  }
  return { min: 0, max: 0 };
};

/**
 * Checks whether a job's salary range matches or overlaps with the selected salary filter
 */
export const matchesSalaryRange = (salaryString, salaryFilterId) => {
  if (!salaryFilterId || salaryFilterId === 'all') return true;
  const option = SALARY_FILTER_OPTIONS.find((opt) => opt.id === salaryFilterId);
  if (!option) return true;
  const { min: jobMin, max: jobMax } = parseSalaryMinMax(salaryString);
  if (jobMin === 0 && jobMax === 0) return true;
  return jobMax >= option.min && jobMin <= option.max;
};

export default formatSalaryNumber;
