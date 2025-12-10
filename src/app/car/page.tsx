"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Car, Shield, Fuel, FileText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  calculateCarRecommendation,
  formatMoney,
  CAR_RATIOS,
} from "@/lib/calculations";

const INSTALLMENT_OPTIONS = [
  { value: 12, label: "12개월" },
  { value: 24, label: "24개월" },
  { value: 36, label: "36개월" },
  { value: 48, label: "48개월" },
  { value: 60, label: "60개월" },
];

const INTEREST_RATES = [
  { value: 4.9, label: "4.9%" },
  { value: 5.9, label: "5.9%" },
  { value: 6.9, label: "6.9%" },
  { value: 7.9, label: "7.9%" },
];

export default function CarRecommendationPage() {
  const [annualSalary, setAnnualSalary] = useState<number>(4000);
  const [purchaseMethod, setPurchaseMethod] = useState<"cash" | "installment" | "lease">("installment");
  const [installmentMonths, setInstallmentMonths] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(5.9);

  const result = calculateCarRecommendation(annualSalary, installmentMonths, interestRate);

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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
            <Car className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">차량 추천</h1>
            <p className="text-sm text-muted-foreground">
              내 연봉에 맞는 적정 차량 가격을 알아보세요
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">소득 및 구매 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 연봉 슬라이더 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>연봉 (세전)</Label>
                <span className="text-2xl font-bold text-primary">
                  {formatMoney(annualSalary)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}만원
                  </span>
                </span>
              </div>
              <Slider
                value={[annualSalary]}
                onValueChange={(value) => setAnnualSalary(value[0])}
                min={2000}
                max={20000}
                step={100}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2,000만원</span>
                <span>2억원</span>
              </div>
            </div>

            {/* 구매 방식 */}
            <div className="space-y-2">
              <Label>구매 방식</Label>
              <Tabs
                value={purchaseMethod}
                onValueChange={(v) => setPurchaseMethod(v as typeof purchaseMethod)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cash">일시불</TabsTrigger>
                  <TabsTrigger value="installment">할부</TabsTrigger>
                  <TabsTrigger value="lease">리스</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 할부 옵션 */}
            {purchaseMethod === "installment" && (
              <>
                <div className="space-y-2">
                  <Label>할부 기간</Label>
                  <Tabs
                    value={installmentMonths.toString()}
                    onValueChange={(v) => setInstallmentMonths(parseInt(v))}
                  >
                    <TabsList className="grid w-full grid-cols-5">
                      {INSTALLMENT_OPTIONS.map((option) => (
                        <TabsTrigger
                          key={option.value}
                          value={option.value.toString()}
                          className="text-xs"
                        >
                          {option.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label>할부 금리</Label>
                  <Tabs
                    value={interestRate.toString()}
                    onValueChange={(v) => setInterestRate(parseFloat(v))}
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      {INTEREST_RATES.map((rate) => (
                        <TabsTrigger
                          key={rate.value}
                          value={rate.value.toString()}
                        >
                          {rate.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-4">
          {/* 추천 차량가 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">추천 차량 가격</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-warning">
                    🚗 적정 차량가
                  </span>
                  <span className="text-xs text-muted-foreground">
                    연봉의 {CAR_RATIOS.min * 100}~{CAR_RATIOS.max * 100}%
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatMoney(result.priceRange.min)} ~ {formatMoney(result.priceRange.max)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}만원
                  </span>
                </p>
              </div>

              {/* 시각화 바 */}
              <div className="mt-4 space-y-2">
                <div className="relative h-4 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute left-0 top-0 h-full bg-warning/60 transition-all"
                    style={{
                      width: `${((result.priceRange.max - result.priceRange.min) / result.priceRange.max) * 50 + 30}%`,
                    }}
                  />
                  <div
                    className="absolute top-0 h-full w-1 bg-warning"
                    style={{
                      left: `${30}%`,
                    }}
                  />
                  <div
                    className="absolute top-0 h-full w-1 bg-warning"
                    style={{
                      left: `${50}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>최소</span>
                  <span className="text-warning font-medium">적정 범위</span>
                  <span>최대</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 월 유지비 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">예상 월 유지비</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">보험료</span>
                </div>
                <span className="font-medium">
                  약 {formatMoney(result.monthlyMaintenance.insurance)}만원
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">유류비</span>
                </div>
                <span className="font-medium">
                  약 {formatMoney(result.monthlyMaintenance.fuel)}만원
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">자동차세</span>
                </div>
                <span className="font-medium">
                  약 {formatMoney(result.monthlyMaintenance.tax)}만원
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">정비/소모품</span>
                </div>
                <span className="font-medium">
                  약 {formatMoney(result.monthlyMaintenance.maintenance)}만원
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
                <span className="font-medium">총 월 유지비</span>
                <span className="text-lg font-bold text-primary">
                  약 {formatMoney(result.monthlyMaintenance.total)}만원
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 할부 시뮬레이션 */}
          {purchaseMethod === "installment" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  할부 시뮬레이션
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({formatMoney((result.priceRange.min + result.priceRange.max) / 2)}만원 기준)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">월 납입금</span>
                  <span className="text-xl font-bold text-primary">
                    {formatMoney(result.installment.monthly)}만원
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">총 이자</span>
                  <span>{formatMoney(result.installment.totalInterest)}만원</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">총 납입금</span>
                  <span>{formatMoney(result.installment.totalPayment)}만원</span>
                </div>

                <div className="mt-2 rounded-lg bg-warning/10 p-3">
                  <p className="text-sm text-muted-foreground">
                    💡 할부 + 유지비 합산:{" "}
                    <span className="font-semibold text-foreground">
                      월 약 {formatMoney(result.installment.monthly + result.monthlyMaintenance.total)}만원
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 팁 섹션 */}
      <Card className="mt-8 bg-muted/30">
        <CardContent className="p-6">
          <h3 className="mb-3 font-semibold">💡 차량 구매 팁</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 신차보다 1~2년된 중고차를 고려하면 감가상각 부담을 줄일 수 있어요</li>
            <li>• 할부 이자율은 은행, 캐피탈, 제조사 금융을 비교해보세요</li>
            <li>• 보험료는 차량 가격, 연식, 운전자 나이에 따라 크게 달라져요</li>
            <li>• 리스는 초기 비용이 적지만 장기적으로는 할부보다 비쌀 수 있어요</li>
            <li>• 차량 구매 시 취등록세(약 7%)도 함께 고려하세요</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
