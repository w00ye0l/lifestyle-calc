"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Car,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Calculator,
  Wallet,
  PiggyBank,
  Sprout,
  ChevronDown,
  Star,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  calculateRentRecommendation,
  calculateCarRecommendation,
  calculateSavingsRecommendation,
  formatMoney,
} from "@/lib/calculations";

export default function LandingPage() {
  const [salary, setSalary] = useState<number>(300);

  const rentResult = calculateRentRecommendation(salary, true, true);
  const carResult = calculateCarRecommendation(salary * 12);
  const savingsResult = calculateSavingsRecommendation(salary, true, true);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 mesh-gradient noise-overlay -z-10" />

      {/* Floating Decorative Elements - More animations */}
      <div className="fixed top-20 left-10 w-72 h-72 rounded-full bg-linear-to-br from-primary/15 to-warning/10 blur-3xl animate-float -z-10" />
      <div className="fixed top-40 right-20 w-96 h-96 rounded-full bg-linear-to-br from-success/10 to-primary/15 blur-3xl animate-float-delayed -z-10" />
      <div className="fixed bottom-20 left-1/3 w-80 h-80 rounded-full bg-linear-to-br from-warning/10 to-success/10 blur-3xl animate-pulse-soft -z-10" />
      <div className="fixed top-1/2 right-10 w-64 h-64 rounded-full bg-linear-to-br from-primary/10 to-transparent blur-3xl animate-bounce-slow -z-10" />
      <div className="fixed bottom-40 right-1/4 w-48 h-48 rounded-full bg-linear-to-br from-warning/15 to-primary/10 blur-2xl animate-wiggle -z-10" />

      {/* Floating Icons */}
      <div className="fixed top-32 right-[15%] animate-float-icon opacity-20 -z-10">
        <Home className="h-12 w-12 text-success" />
      </div>
      <div className="fixed top-48 left-[10%] animate-float-icon-delayed opacity-20 -z-10">
        <Car className="h-10 w-10 text-warning" />
      </div>
      <div className="fixed bottom-32 right-[20%] animate-float-icon opacity-15 -z-10">
        <PiggyBank className="h-14 w-14 text-primary" />
      </div>
      <div className="fixed top-[60%] left-[5%] animate-spin-slow opacity-10 -z-10">
        <Star className="h-8 w-8 text-warning" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="animate-slide-up opacity-0 delay-100">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-pulse-badge">
                <Sparkles className="h-4 w-4 animate-twinkle" />
                한국 직장인을 위한 재정 가이드
                <Zap className="h-3 w-3 animate-twinkle delay-300" />
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="animate-slide-up opacity-0 delay-200 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-foreground/90 animate-text-shimmer">내 월급으로</span>
              <span className="block mt-2 gradient-text animate-gradient-flow">어디까지 살 수 있을까?</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-slide-up opacity-0 delay-300 mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              월급만 입력하면 적정 월세와 차량 가격을 알려드려요.
              <br className="hidden sm:block" />
              현명한 재정 계획의 첫걸음을 시작하세요.
            </p>

            {/* CTA Buttons */}
            <div className="animate-slide-up opacity-0 delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="btn-shine gap-3 h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Link href="/home">
                  <Home className="h-5 w-5 animate-bounce-subtle" />
                  월세 계산하기
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-3 h-14 px-8 text-base font-semibold rounded-2xl border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Link href="/car">
                  <Car className="h-5 w-5" />
                  차량 추천받기
                </Link>
              </Button>
            </div>

            {/* Scroll indicator */}
            <div className="animate-bounce-slow mt-16 flex justify-center">
              <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="animate-slide-up opacity-0 delay-500 grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto">
            {[
              { value: "25~30%", label: "적정 월세 비율", icon: Home },
              { value: "30~50%", label: "적정 차량가 비율", icon: Car },
              { value: "100%", label: "무료 서비스", icon: Star },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-110 transition-transform duration-300 cursor-default"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:animate-wiggle transition-colors" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Rent Card */}
            <Link href="/home" className="group animate-slide-in-left opacity-0 delay-100">
              <Card className="card-hover h-full overflow-hidden border-2 border-transparent hover:border-success/30 bg-linear-to-br from-card to-success/5 hover:shadow-2xl hover:shadow-success/10 transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-success/20 to-success/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Home className="h-6 w-6 text-success group-hover:animate-wiggle" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-success group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-success transition-colors duration-300">
                    월세 계산기
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
                    내 월급에 맞는 적정 월세를 계산해보세요.
                  </p>
                  <div className="mt-4 pt-4 border-t border-border/50 group-hover:border-success/30 transition-colors">
                    <div className="flex items-center gap-2 text-xs text-success font-medium">
                      <Shield className="h-3.5 w-3.5 group-hover:animate-pulse" />
                      월급의 25~30%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Car Card */}
            <Link href="/car" className="group animate-scale-in opacity-0 delay-200">
              <Card className="card-hover h-full overflow-hidden border-2 border-transparent hover:border-warning/30 bg-linear-to-br from-card to-warning/5 hover:shadow-2xl hover:shadow-warning/10 transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-warning/20 to-warning/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Car className="h-6 w-6 text-warning group-hover:animate-wiggle" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-warning group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-warning transition-colors duration-300">
                    차량 추천
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
                    연봉에 맞는 적정 차량가와 유지비를 계산해요.
                  </p>
                  <div className="mt-4 pt-4 border-t border-border/50 group-hover:border-warning/30 transition-colors">
                    <div className="flex items-center gap-2 text-xs text-warning font-medium">
                      <TrendingUp className="h-3.5 w-3.5 group-hover:animate-pulse" />
                      연봉의 30~50%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Savings Card - Changed to primary (beige) color */}
            <Link href="/savings" className="group animate-slide-in-right opacity-0 delay-300">
              <Card className="card-hover h-full overflow-hidden border-2 border-transparent hover:border-primary/30 bg-linear-to-br from-card to-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <PiggyBank className="h-6 w-6 text-primary group-hover:animate-wiggle" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    저축 플래너
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
                    복리의 마법으로 자산을 키워보세요.
                  </p>
                  <div className="mt-4 pt-4 border-t border-border/50 group-hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 text-xs text-primary font-medium">
                      <Sprout className="h-3.5 w-3.5 group-hover:animate-pulse" />
                      월급의 20% 권장
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Quick Calculator Section */}
        <section className="py-12">
          <Card className="animate-scale-in opacity-0 delay-400 overflow-hidden border-0 shadow-2xl shadow-primary/10 bg-linear-to-br from-card via-card to-primary/5 hover:shadow-3xl hover:shadow-primary/15 transition-all duration-500">
            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 animate-pulse-soft">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">빠른 계산기</h2>
                  <p className="text-sm text-muted-foreground">
                    슬라이더를 움직여 바로 확인해보세요
                  </p>
                </div>
              </div>

              {/* Salary Input */}
              <div className="mb-10">
                <div className="flex items-end justify-between mb-6">
                  <label className="text-sm font-medium text-muted-foreground">
                    월급 (세전)
                  </label>
                  <div className="text-right">
                    <span className="text-4xl md:text-5xl font-bold text-primary animate-number-pop">
                      {formatMoney(salary)}
                    </span>
                    <span className="text-xl text-muted-foreground ml-1">
                      만원
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <Slider
                    value={[salary]}
                    onValueChange={(value) => setSalary(value[0])}
                    min={150}
                    max={1000}
                    step={10}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>150만원</span>
                    <span>500만원</span>
                    <span>1,000만원</span>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Rent Result */}
                <div className="relative group animate-slide-up opacity-0 delay-500">
                  <div className="absolute inset-0 bg-linear-to-br from-success/20 to-success/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50 group-hover:opacity-70" />
                  <div className="relative rounded-2xl border border-success/20 bg-linear-to-br from-success/10 to-transparent p-5 backdrop-blur-sm group-hover:scale-[1.02] group-hover:border-success/40 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20 group-hover:animate-bounce-subtle">
                        <Home className="h-4 w-4 text-success" />
                      </div>
                      <span className="font-medium text-sm">적정 월세</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-2xl md:text-3xl font-bold text-success">
                        {formatMoney(rentResult.optimal.min)}~{formatMoney(rentResult.optimal.max)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">만원</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      월급의 25~30%
                    </p>
                  </div>
                </div>

                {/* Car Result */}
                <div className="relative group animate-slide-up opacity-0 delay-600">
                  <div className="absolute inset-0 bg-linear-to-br from-warning/20 to-warning/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50 group-hover:opacity-70" />
                  <div className="relative rounded-2xl border border-warning/20 bg-linear-to-br from-warning/10 to-transparent p-5 backdrop-blur-sm group-hover:scale-[1.02] group-hover:border-warning/40 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/20 group-hover:animate-bounce-subtle">
                        <Car className="h-4 w-4 text-warning" />
                      </div>
                      <span className="font-medium text-sm">추천 차량가</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-2xl md:text-3xl font-bold text-warning">
                        {formatMoney(carResult.priceRange.min)}~{formatMoney(carResult.priceRange.max)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">만원</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      연봉의 30~50%
                    </p>
                  </div>
                </div>

                {/* Savings Result - Changed to primary (beige) color */}
                <div className="relative group animate-slide-up opacity-0 delay-700">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50 group-hover:opacity-70" />
                  <div className="relative rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 to-transparent p-5 backdrop-blur-sm group-hover:scale-[1.02] group-hover:border-primary/40 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 group-hover:animate-bounce-subtle">
                        <PiggyBank className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">권장 저축</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-2xl md:text-3xl font-bold text-primary">
                        {formatMoney(savingsResult.monthlySavings.recommended)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">만원/월</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      월급의 20%
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-center mt-8 animate-fade-in delay-700">
                <Button
                  asChild
                  variant="outline"
                  className="gap-2 rounded-xl hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <Link href="/home">
                    자세히 계산하기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Tips Section */}
        <section className="py-12">
          <div className="text-center mb-10 animate-slide-up opacity-0 delay-100">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              알아두면 좋은 재정 팁
            </h2>
            <p className="text-muted-foreground">
              현명한 재정 관리를 위한 기본 원칙들
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Home,
                emoji: "🏠",
                title: "월세 25~30%",
                description: "주거비가 30%를 넘으면 생활비와 저축에 압박이 생겨요.",
                color: "success",
                delay: "delay-200",
              },
              {
                icon: Car,
                emoji: "🚗",
                title: "차량 30~50%",
                description: "차량가 외에도 보험, 유류비, 세금 등 유지비를 고려하세요.",
                color: "warning",
                delay: "delay-300",
              },
              {
                icon: Wallet,
                emoji: "💰",
                title: "비상금 6개월치",
                description: "예상치 못한 상황에 대비해 생활비 6개월치를 준비하세요.",
                color: "primary",
                delay: "delay-400",
              },
              {
                icon: Target,
                emoji: "🎯",
                title: "저축 20%",
                description: "복리의 힘을 믿고 일찍 시작할수록 자산이 빠르게 성장해요.",
                color: "primary",
                delay: "delay-500",
              },
            ].map((tip, index) => (
              <Card
                key={index}
                className={`group animate-slide-up opacity-0 ${tip.delay} border-0 bg-linear-to-br from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/40 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-default`}
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4 group-hover:animate-bounce-subtle group-hover:scale-110 transition-transform duration-300">{tip.emoji}</div>
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto animate-scale-in opacity-0 delay-300">
            <div className="inline-flex items-center gap-2 mb-6 animate-float">
              <Sparkles className="h-5 w-5 text-primary animate-twinkle" />
              <Star className="h-4 w-4 text-warning animate-twinkle delay-200" />
              <Sparkles className="h-5 w-5 text-primary animate-twinkle delay-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-muted-foreground mb-8">
              복잡한 계산 없이 월급만 입력하면 됩니다.
              <br />
              당신의 현명한 재정 계획을 도와드릴게요.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-shine gap-3 h-14 px-10 text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Link href="/home">
                <Calculator className="h-5 w-5 animate-bounce-subtle" />
                계산 시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
