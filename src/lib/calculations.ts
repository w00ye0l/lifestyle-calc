// 세전 → 세후 변환 (4대보험 + 소득세 약 15% 기준)
export const GROSS_TO_NET_RATIO = 0.85;

// 월세 비율 기준
export const RENT_RATIOS = {
  safe: 0.20,      // 안전: 20%
  optimalMin: 0.25, // 적정 최소: 25%
  optimalMax: 0.30, // 적정 최대: 30%
  limit: 0.33,     // 한도: 33%
} as const;

// 차량 비율 기준 (연봉 대비)
export const CAR_RATIOS = {
  min: 0.30,  // 최소: 30%
  max: 0.50,  // 최대: 50%
} as const;

// 차량 유지비 기준
export const CAR_MAINTENANCE = {
  insuranceRate: 0.03,  // 연간 보험료 (차량가의 3%)
  monthlyFuel: 15,      // 월 평균 유류비 (만원)
  maintenanceRate: 0.02, // 연간 정비비 (차량가의 2%)
} as const;

export interface RentRecommendation {
  safe: number;
  optimal: {
    min: number;
    max: number;
  };
  limit: number;
  netMonthlySalary: number;
}

export interface CarRecommendation {
  priceRange: {
    min: number;
    max: number;
  };
  monthlyMaintenance: {
    insurance: number;
    fuel: number;
    tax: number;
    maintenance: number;
    total: number;
  };
  installment: {
    monthly: number;
    totalInterest: number;
    totalPayment: number;
  };
}

/**
 * 월급을 기준으로 적정 월세 범위 계산
 */
export function calculateRentRecommendation(
  salary: number,
  isMonthly: boolean,
  isGross: boolean
): RentRecommendation {
  // 월급으로 변환
  let monthlySalary = isMonthly ? salary : salary / 12;

  // 세후로 변환
  const netMonthlySalary = isGross ? monthlySalary * GROSS_TO_NET_RATIO : monthlySalary;

  return {
    safe: Math.round(netMonthlySalary * RENT_RATIOS.safe),
    optimal: {
      min: Math.round(netMonthlySalary * RENT_RATIOS.optimalMin),
      max: Math.round(netMonthlySalary * RENT_RATIOS.optimalMax),
    },
    limit: Math.round(netMonthlySalary * RENT_RATIOS.limit),
    netMonthlySalary: Math.round(netMonthlySalary),
  };
}

/**
 * 연봉을 기준으로 적정 차량 가격 범위 계산
 */
export function calculateCarRecommendation(
  annualSalary: number,
  installmentMonths: number = 36,
  interestRate: number = 5.9
): CarRecommendation {
  const minPrice = Math.round(annualSalary * CAR_RATIOS.min);
  const maxPrice = Math.round(annualSalary * CAR_RATIOS.max);
  const avgPrice = (minPrice + maxPrice) / 2;

  // 월 유지비 계산
  const monthlyInsurance = Math.round((avgPrice * CAR_MAINTENANCE.insuranceRate) / 12);
  const monthlyFuel = CAR_MAINTENANCE.monthlyFuel;
  const monthlyTax = Math.round(calculateCarTax(avgPrice) / 12);
  const monthlyMaintenance = Math.round((avgPrice * CAR_MAINTENANCE.maintenanceRate) / 12);

  // 할부 계산 (원리금균등상환)
  const installment = calculateInstallment(avgPrice, installmentMonths, interestRate);

  return {
    priceRange: {
      min: minPrice,
      max: maxPrice,
    },
    monthlyMaintenance: {
      insurance: monthlyInsurance,
      fuel: monthlyFuel,
      tax: monthlyTax,
      maintenance: monthlyMaintenance,
      total: monthlyInsurance + monthlyFuel + monthlyTax + monthlyMaintenance,
    },
    installment,
  };
}

/**
 * 자동차세 계산 (간이 계산 - 배기량 기준 평균)
 */
function calculateCarTax(carPrice: number): number {
  // 차량 가격 기준 간이 계산 (실제로는 배기량 기준)
  // 평균적으로 연간 30~50만원 수준
  if (carPrice < 2000) return 30;
  if (carPrice < 3500) return 40;
  if (carPrice < 5000) return 50;
  return 65;
}

/**
 * 원리금균등상환 계산
 */
function calculateInstallment(
  principal: number,
  months: number,
  annualRate: number
): { monthly: number; totalInterest: number; totalPayment: number } {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return {
      monthly: Math.round(principal / months),
      totalInterest: 0,
      totalPayment: principal,
    };
  }

  // 원리금균등상환 공식
  const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, months))
                  / (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = monthly * months;
  const totalInterest = totalPayment - principal;

  return {
    monthly: Math.round(monthly),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
  };
}

/**
 * 숫자 포맷팅 (만원 단위)
 */
export function formatMoney(value: number): string {
  return value.toLocaleString('ko-KR');
}

// 저축 비율 기준
export const SAVINGS_RATIOS = {
  minimum: 0.10,    // 최소: 10%
  recommended: 0.20, // 권장: 20%
  aggressive: 0.30,  // 적극: 30%
} as const;

// 저축 목표 유형
export const SAVINGS_GOALS = {
  emergency: { months: 6, label: '비상금 (6개월치 생활비)' },
  house: { years: 5, downPaymentRatio: 0.20, label: '내 집 마련 (5년)' },
  retirement: { years: 30, label: '은퇴 자금 (30년)' },
  shortTerm: { years: 1, label: '단기 목표 (1년)' },
} as const;

export interface SavingsRecommendation {
  monthlySavings: {
    minimum: number;
    recommended: number;
    aggressive: number;
  };
  yearlyProjection: {
    year1: number;
    year3: number;
    year5: number;
    year10: number;
  };
  compoundGrowth: {
    withoutInterest: number;
    withInterest: number;
    interestEarned: number;
  };
  netMonthlySalary: number;
  remainingAfterExpenses: number;
}

export interface GoalProjection {
  goalAmount: number;
  monthlyRequired: number;
  yearsToReach: number;
  totalContribution: number;
  totalInterest: number;
}

export type SavingsLevel = 'minimum' | 'recommended' | 'aggressive';

/**
 * 월급을 기준으로 적정 저축 범위 계산
 */
export function calculateSavingsRecommendation(
  salary: number,
  isMonthly: boolean,
  isGross: boolean,
  monthlyExpenses: number = 0, // 예상 월 지출 (월세 + 생활비 등)
  savingsRate: number = 3.5,   // 예금 금리 (%)
  years: number = 5,           // 투자 기간
  savingsLevel: SavingsLevel = 'recommended' // 저축 강도
): SavingsRecommendation {
  // 월급으로 변환
  let monthlySalary = isMonthly ? salary : salary / 12;

  // 세후로 변환
  const netMonthlySalary = isGross ? monthlySalary * GROSS_TO_NET_RATIO : monthlySalary;

  // 지출 후 남는 금액 (지출이 0이면 세후 월급의 50%를 생활비로 가정)
  const estimatedExpenses = monthlyExpenses > 0 ? monthlyExpenses : netMonthlySalary * 0.5;
  const remainingAfterExpenses = netMonthlySalary - estimatedExpenses;

  // 저축 추천액
  const monthlySavings = {
    minimum: Math.round(netMonthlySalary * SAVINGS_RATIOS.minimum),
    recommended: Math.round(netMonthlySalary * SAVINGS_RATIOS.recommended),
    aggressive: Math.round(netMonthlySalary * SAVINGS_RATIOS.aggressive),
  };

  // 선택된 저축 강도에 따른 월 저축액
  const selectedMonthlySavings = monthlySavings[savingsLevel];

  // 연도별 예상 저축액 (복리 계산) - 선택된 저축 강도 적용
  const monthlyRate = savingsRate / 100 / 12;
  const yearlyProjection = {
    year1: calculateCompoundSavings(selectedMonthlySavings, 12, monthlyRate),
    year3: calculateCompoundSavings(selectedMonthlySavings, 36, monthlyRate),
    year5: calculateCompoundSavings(selectedMonthlySavings, 60, monthlyRate),
    year10: calculateCompoundSavings(selectedMonthlySavings, 120, monthlyRate),
  };

  // 복리 효과 비교 (지정된 기간) - 선택된 저축 강도 적용
  const months = years * 12;
  const withoutInterest = selectedMonthlySavings * months;
  const withInterest = calculateCompoundSavings(selectedMonthlySavings, months, monthlyRate);
  const interestEarned = withInterest - withoutInterest;

  return {
    monthlySavings,
    yearlyProjection: {
      year1: Math.round(yearlyProjection.year1),
      year3: Math.round(yearlyProjection.year3),
      year5: Math.round(yearlyProjection.year5),
      year10: Math.round(yearlyProjection.year10),
    },
    compoundGrowth: {
      withoutInterest: Math.round(withoutInterest),
      withInterest: Math.round(withInterest),
      interestEarned: Math.round(interestEarned),
    },
    netMonthlySalary: Math.round(netMonthlySalary),
    remainingAfterExpenses: Math.round(remainingAfterExpenses),
  };
}

/**
 * 목표 금액 달성을 위한 계산
 */
export function calculateGoalProjection(
  goalAmount: number,
  monthlySavings: number,
  annualRate: number = 3.5
): GoalProjection {
  const monthlyRate = annualRate / 100 / 12;

  // 목표 달성까지 필요한 개월 수 계산
  let months = 0;
  let accumulated = 0;

  while (accumulated < goalAmount && months < 600) { // 최대 50년
    accumulated = calculateCompoundSavings(monthlySavings, months + 1, monthlyRate);
    months++;
  }

  const totalContribution = monthlySavings * months;
  const totalInterest = accumulated - totalContribution;

  return {
    goalAmount,
    monthlyRequired: monthlySavings,
    yearsToReach: Math.round((months / 12) * 10) / 10,
    totalContribution: Math.round(totalContribution),
    totalInterest: Math.round(totalInterest),
  };
}

/**
 * 복리 저축 계산 (매월 적립)
 */
function calculateCompoundSavings(
  monthlyAmount: number,
  months: number,
  monthlyRate: number
): number {
  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }

  // 복리 적립 공식: PMT * (((1 + r)^n - 1) / r)
  return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}
