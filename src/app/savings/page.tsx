"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PiggyBank,
  TrendingUp,
  Target,
  Sparkles,
  Calendar,
  Percent,
  Info,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  calculateSavingsRecommendation,
  formatMoney,
  SAVINGS_RATIOS,
  type SavingsLevel,
} from "@/lib/calculations";

const INTEREST_RATES = [
  { value: 2.5, label: "2.5%" },
  { value: 3.5, label: "3.5%" },
  { value: 4.5, label: "4.5%" },
  { value: 5.5, label: "5.5%" },
];

const PERIOD_OPTIONS = [
  { value: 1, label: "1년" },
  { value: 3, label: "3년" },
  { value: 5, label: "5년" },
  { value: 10, label: "10년" },
];


export default function SavingsPage() {
  const [monthlySalary, setMonthlySalary] = useState<number>(300);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [savingsPeriod, setSavingsPeriod] = useState<number>(5);
  const [savingsLevel, setSavingsLevel] = useState<SavingsLevel>("recommended");
  const [emergencyFundTarget, setEmergencyFundTarget] = useState<number>(1000);

  const result = useMemo(
    () => calculateSavingsRecommendation(monthlySalary, true, true, 0, interestRate, savingsPeriod, savingsLevel),
    [monthlySalary, interestRate, savingsPeriod, savingsLevel]
  );

  const currentSavings = result.monthlySavings[savingsLevel];

  // 비상금 목표 달성까지 걸리는 개월 수 계산
  const monthsToReachEmergency = Math.ceil(emergencyFundTarget / currentSavings);
  const emergencyFundProgress = Math.min(100, (currentSavings * 12 / emergencyFundTarget) * 100);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            뒤로
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <PiggyBank className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">저축 플래너</h1>
            <p className="text-sm text-muted-foreground">
              내 소득에 맞는 적정 저축액을 알아보세요
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">소득 정보 입력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 월급 슬라이더 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>월급 (세전)</Label>
                <span className="text-2xl font-bold text-primary">
                  {formatMoney(monthlySalary)}
                  <span className="text-sm font-normal text-muted-foreground"> 만원</span>
                </span>
              </div>
              <Slider
                value={[monthlySalary]}
                onValueChange={(value) => setMonthlySalary(value[0])}
                min={150}
                max={1500}
                step={10}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>150만원</span>
                <span>1,500만원</span>
              </div>
            </div>

            {/* 저축 강도 선택 */}
            <div className="space-y-2">
              <Label>저축 강도</Label>
              <Tabs
                value={savingsLevel}
                onValueChange={(v) => setSavingsLevel(v as typeof savingsLevel)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="minimum">최소 ({SAVINGS_RATIOS.minimum * 100}%)</TabsTrigger>
                  <TabsTrigger value="recommended">권장 ({SAVINGS_RATIOS.recommended * 100}%)</TabsTrigger>
                  <TabsTrigger value="aggressive">적극 ({SAVINGS_RATIOS.aggressive * 100}%)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 예금 금리 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                예상 연이율
              </Label>
              <Tabs
                value={interestRate.toString()}
                onValueChange={(v) => setInterestRate(parseFloat(v))}
              >
                <TabsList className="grid w-full grid-cols-4">
                  {INTEREST_RATES.map((rate) => (
                    <TabsTrigger key={rate.value} value={rate.value.toString()}>
                      {rate.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* 저축 기간 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                저축 기간
              </Label>
              <Tabs
                value={savingsPeriod.toString()}
                onValueChange={(v) => setSavingsPeriod(parseInt(v))}
              >
                <TabsList className="grid w-full grid-cols-4">
                  {PERIOD_OPTIONS.map((period) => (
                    <TabsTrigger key={period.value} value={period.value.toString()}>
                      {period.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* 세후 월급 안내 */}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                <Info className="mr-1 inline h-4 w-4" />
                예상 세후 월급:{" "}
                <span className="font-medium text-foreground">
                  {formatMoney(result.netMonthlySalary)}만원
                </span>
                <span className="text-xs"> (4대보험+소득세 약 15% 적용)</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-4">
          {/* 추천 저축액 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">추천 월 저축액</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 최소 범위 */}
              <div className="rounded-xl border border-muted-foreground/30 bg-muted/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    🌱 최소 저축
                  </span>
                  <span className="text-xs text-muted-foreground">
                    월급의 {SAVINGS_RATIOS.minimum * 100}%
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatMoney(result.monthlySavings.minimum)}
                  <span className="text-sm font-normal text-muted-foreground"> 만원</span>
                </p>
              </div>

              {/* 권장 범위 */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    🌿 권장 저축
                  </span>
                  <span className="text-xs text-muted-foreground">
                    월급의 {SAVINGS_RATIOS.recommended * 100}%
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatMoney(result.monthlySavings.recommended)}
                  <span className="text-sm font-normal text-muted-foreground"> 만원</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  일반적으로 권장되는 저축 수준
                </p>
              </div>

              {/* 적극 범위 */}
              <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-success">
                    🌳 적극 저축
                  </span>
                  <span className="text-xs text-muted-foreground">
                    월급의 {SAVINGS_RATIOS.aggressive * 100}%
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatMoney(result.monthlySavings.aggressive)}
                  <span className="text-sm font-normal text-muted-foreground"> 만원</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  빠른 자산 형성을 위한 적극적 저축
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 비상금 목표 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                비상금 목표
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 비상금 목표 금액 입력 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    목표 금액
                  </Label>
                  <span className="text-2xl font-bold text-primary">
                    {formatMoney(emergencyFundTarget)}
                    <span className="text-sm font-normal text-muted-foreground"> 만원</span>
                  </span>
                </div>
                <Slider
                  value={[emergencyFundTarget]}
                  onValueChange={(value) => setEmergencyFundTarget(value[0])}
                  min={100}
                  max={5000}
                  step={100}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>100만원</span>
                  <span>5,000만원</span>
                </div>
              </div>

              {/* 달성 예상 */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">현재 월 저축액</p>
                    <p className="text-lg font-bold">
                      {formatMoney(currentSavings)}
                      <span className="text-sm font-normal text-muted-foreground">만원</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">달성까지</p>
                    <p className="text-2xl font-bold text-primary">
                      {monthsToReachEmergency < 12
                        ? `${monthsToReachEmergency}개월`
                        : `${Math.floor(monthsToReachEmergency / 12)}년 ${monthsToReachEmergency % 12}개월`}
                    </p>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${emergencyFundProgress}%`
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  1년 저축 시 목표의 {emergencyFundProgress.toFixed(0)}% 달성
                </p>
              </div>

              {/* 참고 정보 */}
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <Info className="mr-1 inline h-3 w-3" />
                  일반적으로 3~6개월치 생활비를 비상금으로 권장해요.
                  현재 예상 월 생활비 기준 {formatMoney(Math.round(result.netMonthlySalary * 0.5 * 6))}만원 (6개월)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 복리 효과 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            {savingsPeriod}년 후 예상 자산 (복리 효과)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { year: 1, amount: result.yearlyProjection.year1 },
              { year: 3, amount: result.yearlyProjection.year3 },
              { year: 5, amount: result.yearlyProjection.year5 },
              { year: 10, amount: result.yearlyProjection.year10 },
            ].map((item) => (
              <div
                key={item.year}
                className={`p-4 rounded-xl text-center ${
                  savingsPeriod === item.year
                    ? "border-2 border-primary bg-primary/5"
                    : "bg-muted/50"
                }`}
              >
                <p className="text-xs text-muted-foreground mb-1">{item.year}년 후</p>
                <p className={`text-lg font-bold ${savingsPeriod === item.year ? "text-primary" : ""}`}>
                  {formatMoney(item.amount)}
                  <span className="text-xs font-normal text-muted-foreground">만원</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">단순 적립</p>
              <p className="font-bold">
                {formatMoney(result.compoundGrowth.withoutInterest)}
                <span className="text-xs font-normal text-muted-foreground">만원</span>
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-xs text-primary mb-1">복리 적용</p>
              <p className="font-bold text-primary">
                {formatMoney(result.compoundGrowth.withInterest)}
                <span className="text-xs font-normal">만원</span>
              </p>
            </div>
            <div className="rounded-lg bg-success/10 p-3 text-center">
              <p className="text-xs text-success mb-1">이자 수익</p>
              <p className="font-bold text-success">
                +{formatMoney(result.compoundGrowth.interestEarned)}
                <span className="text-xs font-normal">만원</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 팁 섹션 */}
      <Card className="mt-6 bg-muted/30">
        <CardContent className="p-6">
          <h3 className="mb-3 font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            저축 성공 팁
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 월급날 자동이체를 설정하면 저축을 잊지 않아요</li>
            <li>• 비상금을 먼저 모은 후 투자를 시작하세요 (최소 3개월, 권장 6개월)</li>
            <li>• 복리의 마법은 시간이 길수록 커집니다. 일찍 시작하세요!</li>
            <li>• 급여 인상 시 인상분의 50%를 저축에 추가하세요</li>
            <li>• 프리랜서나 불안정한 수입이라면 12개월치 비상금을 목표로 하세요</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
