import type { IFinanceUtil, AmortizationRow } from '@/types/common';

/** 원리금균등상환의 월 상환액(반올림 전)을 계산합니다. */
function rawMonthlyPayment(principal: number, annualRate: number, months: number): number {
	if (months <= 0) return 0;
	const mr = annualRate / 12;
	if (mr === 0) return principal / months;
	return (principal * mr * (1 + mr) ** months) / ((1 + mr) ** months - 1);
}

export const financeUtil: IFinanceUtil = {
	simpleInterest(principal: number, annualRate: number, years: number): number {
		if (!Number.isFinite(principal * annualRate * years)) return 0;
		return Math.round(principal * annualRate * years);
	},

	compoundInterest(principal: number, annualRate: number, years: number, timesPerYear: number = 1): number {
		if (timesPerYear <= 0) return 0;
		const total = principal * (1 + annualRate / timesPerYear) ** (timesPerYear * years);
		return Math.round(total - principal);
	},

	maturityAmount(principal: number, annualRate: number, years: number, timesPerYear: number = 1): number {
		if (timesPerYear <= 0) return 0;
		return Math.round(principal * (1 + annualRate / timesPerYear) ** (timesPerYear * years));
	},

	monthlyPayment(principal: number, annualRate: number, months: number): number {
		return Math.round(rawMonthlyPayment(principal, annualRate, months));
	},

	amortization(principal: number, annualRate: number, months: number): AmortizationRow[] {
		if (months <= 0) return [];
		const mr = annualRate / 12;
		const pay = rawMonthlyPayment(principal, annualRate, months);
		const rows: AmortizationRow[] = [];
		let balance = principal;

		for (let i = 1; i <= months; i++) {
			const interest = balance * mr;
			// 마지막 회차는 잔액을 모두 상환해 누적 오차를 보정합니다.
			const principalPaid = i === months ? balance : pay - interest;
			const payment = principalPaid + interest;
			balance -= principalPaid;
			rows.push({
				round: i,
				payment: Math.round(payment),
				principal: Math.round(principalPaid),
				interest: Math.round(interest),
				balance: Math.max(0, Math.round(balance)),
			});
		}
		return rows;
	},

	exchange(amount: number, rate: number, digits: number = 0): number {
		const factor = 10 ** digits;
		return Math.round(amount * rate * factor) / factor;
	},

	splitAmount(total: number, count: number): number[] {
		if (count <= 0) return [];
		const base = Math.floor(total / count);
		const remainder = total - base * count;
		// 나머지(remainder)를 앞에서부터 1원씩 더해 합계가 total과 정확히 일치하도록 합니다.
		return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
	},

	supplyPrice(total: number, rate: number = 0.1): number {
		// 부가세 포함 금액 = 공급가액 × (1 + 세율) 이므로 역산합니다.
		return Math.round(total / (1 + rate));
	},
};
