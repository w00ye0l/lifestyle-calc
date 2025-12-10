"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  calculateRentRecommendation,
  formatMoney,
  RENT_RATIOS,
} from "@/lib/calculations";

export default function RentCalculatorPage() {
  const [salary, setSalary] = useState<number>(300);
  const [isMonthly, setIsMonthly] = useState<boolean>(true);
  const [isGross, setIsGross] = useState<boolean>(true);

  const result = calculateRentRecommendation(salary, isMonthly, isGross);

  // 슬라이더 범위 설정
  const sliderMin = isMonthly ? 150 : 2000;
  const sliderMax = isMonthly ? 1500 : 20000;
  const sliderStep = isMonthly ? 10 : 100;

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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
            <Home className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">월세 계산기</h1>
            <p className="text-sm text-muted-foreground">
              내 소득에 맞는 적정 월세를 알아보세요
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
            {/* 월급/연봉 선택 */}
            <div className="space-y-2">
              <Label>소득 유형</Label>
              <Tabs
                value={isMonthly ? "monthly" : "yearly"}
                onValueChange={(v) => {
                  const newIsMonthly = v === "monthly";
                  setIsMonthly(newIsMonthly);
                  // 값 변환
                  if (newIsMonthly) {
                    setSalary(Math.round(salary / 12));
                  } else {
                    setSalary(salary * 12);
                  }
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">월급</TabsTrigger>
                  <TabsTrigger value="yearly">연봉</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 세전/세후 선택 */}
            <div className="space-y-2">
              <Label>세금 기준</Label>
              <Tabs
                value={isGross ? "gross" : "net"}
                onValueChange={(v) => setIsGross(v === "gross")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="gross">세전</TabsTrigger>
                  <TabsTrigger value="net">세후</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 급여 슬라이더 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{isMonthly ? "월급" : "연봉"} ({isGross ? "세전" : "세후"})</Label>
                <span className="text-2xl font-bold text-primary">
                  {formatMoney(salary)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}만원
                  </span>
                </span>
              </div>
              <Slider
                value={[salary]}
                onValueChange={(value) => setSalary(value[0])}
                min={sliderMin}
                max={sliderMax}
                step={sliderStep}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatMoney(sliderMin)}만원</span>
                <span>{formatMoney(sliderMax)}만원</span>
              </div>
            </div>

            {/* 세후 월급 안내 */}
            {isGross && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">
                  <Info className="mr-1 inline h-4 w-4" />
                  예상 세후 {isMonthly ? "월급" : "월급"}:{" "}
                  <span className="font-medium text-foreground">
                    {formatMoney(result.netMonthlySalary)}만원
                  </span>
                  <span className="text-xs"> (4대보험+소득세 약 15% 적용)</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">추천 월세 범위</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 안전 범위 */}
              <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-success">
                    💚 안전 범위
                  </span>
                  <span className="text-xs text-muted-foreground">
                    월급의 {RENT_RATIOS.safe * 100}%
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatMoney(result.safe)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}만원 이하
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  여유로운 저축과 생활이 가능한 수준
                </p>
              </div>

              {/* 적정 범위 */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    💛 적정 범위
                  </span>
                  <span className="text-xs text-muted-foreground">
                    월급의 {RENT_RATIOS.optimalMin * 100}~{RENT_RATIOS.optimalMax * 100}%
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatMoney(result.optimal.min)} ~ {formatMoney(result.optimal.max)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}만원
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  일반적으로 권장되는 주거비 수준
                </p>
              </div>

              {/* 위험 범위 */}
              <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-danger">
                    🔴 위험 범위
                  </span>
                  <span className="text-xs text-muted-foreground">
                    월급의 {RENT_RATIOS.limit * 100}%+
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatMoney(result.limit)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}만원 이상
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  생활비와 저축에 부담이 될 수 있는 수준
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 시각화 바 */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{formatMoney(result.netMonthlySalary)}만원</span>
                </div>
                <div className="relative h-8 overflow-hidden rounded-full bg-muted">
                  {/* 안전 영역 */}
                  <div
                    className="absolute left-0 top-0 h-full bg-success/60"
                    style={{ width: `${RENT_RATIOS.safe * 100}%` }}
                  />
                  {/* 적정 영역 */}
                  <div
                    className="absolute top-0 h-full bg-primary/60"
                    style={{
                      left: `${RENT_RATIOS.safe * 100}%`,
                      width: `${(RENT_RATIOS.optimalMax - RENT_RATIOS.safe) * 100}%`,
                    }}
                  />
                  {/* 위험 영역 */}
                  <div
                    className="absolute top-0 h-full bg-danger/60"
                    style={{
                      left: `${RENT_RATIOS.optimalMax * 100}%`,
                      width: `${(1 - RENT_RATIOS.optimalMax) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-success">안전</span>
                  <span className="text-primary">적정</span>
                  <span className="text-danger">위험</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 팁 섹션 */}
      <Card className="mt-8 bg-muted/30">
        <CardContent className="p-6">
          <h3 className="mb-3 font-semibold">💡 월세 선택 팁</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 보증금을 높이면 월세를 낮출 수 있어요 (전환율 약 5~8%)</li>
            <li>• 관리비, 공과금 등 추가 비용도 함께 고려하세요</li>
            <li>• 출퇴근 교통비도 주거비의 일부로 생각하면 좋아요</li>
            <li>• 비상금(월급 3~6개월분)을 확보한 후 이사를 결정하세요</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
