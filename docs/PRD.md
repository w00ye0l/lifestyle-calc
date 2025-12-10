# PRD: 월급 기반 주거비/차량 추천 서비스

> **버전**: 2.0
> **최종 수정**: 2025-12-10
> **상태**: Draft

---

## 1. 제품 개요

### 1.1 서비스명
**내 월급으로 어디까지?** (가칭)

### 1.2 비전
한국 직장인이 자신의 소득 수준에 맞는 **합리적인 주거비**와 **차량 구매 가격**을 손쉽게 파악하고, 건전한 재정 계획을 세울 수 있도록 돕는 서비스

### 1.3 문제 정의
| 문제 | 영향 |
|------|------|
| 적정 월세 기준을 모름 | 과도한 주거비로 생활비 압박 |
| 차량 구매 예산 산정 어려움 | 충동 구매 → 재정 부담 |
| 재정 가이드라인 부재 | 체계적인 저축/투자 계획 실패 |

### 1.4 타겟 사용자
| 페르소나 | 특징 | 핵심 니즈 |
|----------|------|-----------|
| 사회초년생 (25-30세) | 첫 독립, 재정 경험 부족 | 적정 월세 범위 파악 |
| 이직자 (30-35세) | 새 직장, 지역 이동 고려 | 지역별 비용 비교 |
| 첫차 구매자 (28-35세) | 차량 구매 예산 고민 | 유지비 포함 총비용 계산 |

### 1.5 성공 지표 (KPI)
| 지표 | 목표 (Phase 1) |
|------|---------------|
| MAU (월간 활성 사용자) | 5,000+ |
| 계산기 완료율 | 70%+ |
| 평균 세션 시간 | 3분+ |
| 재방문율 | 30%+ |

---

## 2. 핵심 기능

### 2.1 월세 추천 계산기

#### 입력값
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 월급/연봉 | number | ✅ | 숫자 입력 (만원 단위) |
| 세전/세후 | toggle | ✅ | 기본값: 세후 |
| 보증금 가용액 | number | ❌ | 최대 투입 가능 보증금 |
| 희망 지역 | select | ❌ | 서울/경기/기타 |

#### 출력값
```
┌─────────────────────────────────────────────────┐
│  💚 안전 범위    세후 월급 × 20%    XX만원 이하   │
│  💛 적정 범위    세후 월급 × 25-30%  XX~XX만원   │
│  🔴 위험 범위    세후 월급 × 33%+   XX만원 이상   │
└─────────────────────────────────────────────────┘
```

#### 계산 로직
```typescript
interface RentRecommendation {
  safe: number      // 세후월급 * 0.20
  optimal: {
    min: number     // 세후월급 * 0.25
    max: number     // 세후월급 * 0.30
  }
  limit: number     // 세후월급 * 0.33
}

// 세전 → 세후 변환 (간이 계산)
const netSalary = grossSalary * 0.85  // 4대보험 + 소득세 약 15%
```

### 2.2 차량 구매 추천 계산기

#### 입력값
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 연봉 | number | ✅ | 세전 연봉 (만원) |
| 구매 방식 | radio | ✅ | 일시불/할부/리스 |
| 보유 현금 | number | ❌ | 차량용 현금 |
| 할부 기간 | select | ❌ | 12/24/36/48/60개월 |

#### 출력값
```
┌─────────────────────────────────────────────────┐
│  🚗 추천 차량가    연봉의 30-50%    XX~XX만원    │
│  📊 월 유지비 예상                   약 XX만원   │
│  💰 할부 시 월 납입금 (36개월 기준)   약 XX만원   │
└─────────────────────────────────────────────────┘
```

#### 계산 로직
```typescript
interface CarRecommendation {
  priceRange: {
    min: number     // 연봉 * 0.30
    max: number     // 연봉 * 0.50
  }
  monthlyMaintenance: {
    insurance: number    // 차량가 * 0.03 / 12
    fuel: number         // 월 15만원 (평균)
    tax: number          // 차량가 기준 자동차세 / 12
  }
  installment: {
    monthly: number      // 원리금균등
    totalInterest: number
  }
}
```

### 2.3 종합 재정 대시보드

#### 시각화 요소
- **도넛 차트**: 월급 대비 지출 비율
- **프로그레스 바**: 재정 건전성 점수 (0-100)
- **비교 카드**: 권장 vs 현재 지출

#### 재정 건전성 공식
```typescript
const healthScore = calculateHealthScore({
  housingRatio,      // 주거비 비율 (낮을수록 +)
  transportRatio,    // 교통비 비율 (낮을수록 +)
  savingsRatio,      // 저축률 (높을수록 +)
})
```

---

## 3. 기술 스택 (2025 Latest)

### 3.1 프론트엔드

| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Next.js** | 16.x | App Router 풀스택 프레임워크 | React 19 내장, RSC/Server Actions 지원 |
| **React** | 19.x | UI 라이브러리 | Next.js 16 내장 Canary |
| **TypeScript** | 5.7+ | 타입 안정성 | 최신 데코레이터, satisfies 연산자 |
| **Tailwind CSS** | 4.x | CSS-first 스타일링 | v4 CSS 설정, 향상된 성능 |
| **shadcn/ui** | 3.5+ | UI 컴포넌트 | Radix UI 기반, 완전한 커스터마이징 |
| **Lucide React** | 0.470+ | 아이콘 시스템 | Tree-shaking, TypeScript 지원 |

### 3.2 주요 라이브러리

| 라이브러리 | 버전 | 용도 |
|------------|------|------|
| `nuqs` | 2.x | URL 상태 관리 (type-safe) |
| `recharts` | 2.x | 차트 시각화 |
| `react-hook-form` | 7.x | 폼 상태 관리 |
| `zod` | 3.x | 런타임 스키마 검증 |

### 3.3 개발 도구

| 도구 | 용도 |
|------|------|
| `pnpm` | 패키지 매니저 (권장) |
| `ESLint` + `Prettier` | 코드 품질 |
| `Husky` + `lint-staged` | Git hooks |

### 3.4 배포

| 플랫폼 | 용도 |
|--------|------|
| **Vercel** | 프로덕션 호스팅 (권장) |
| **GitHub Actions** | CI/CD |

---

## 4. 프로젝트 구조

```
rent-calculator/
├── app/
│   ├── layout.tsx              # Root Layout (RootLayout)
│   ├── page.tsx                # Landing Page
│   ├── rent/
│   │   └── page.tsx            # 월세 계산기
│   ├── car/
│   │   └── page.tsx            # 차량 추천
│   └── dashboard/
│       └── page.tsx            # 종합 대시보드
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── slider.tsx
│   │   └── ...
│   ├── calculator/
│   │   ├── rent-calculator.tsx
│   │   ├── car-calculator.tsx
│   │   └── result-card.tsx
│   ├── charts/
│   │   ├── donut-chart.tsx
│   │   └── progress-bar.tsx
│   └── layout/
│       ├── header.tsx
│       ├── footer.tsx
│       └── navigation.tsx
├── lib/
│   ├── utils.ts                # cn() 유틸리티
│   ├── calculations.ts         # 계산 로직
│   └── constants.ts            # 상수 정의
├── hooks/
│   ├── use-calculator.ts
│   └── use-local-storage.ts
├── types/
│   └── index.ts                # 타입 정의
├── styles/
│   └── globals.css             # Tailwind v4 CSS
├── public/
│   └── og-image.png
├── docs/
│   └── PRD.md
├── components.json             # shadcn/ui 설정
├── tailwind.config.ts          # Tailwind 설정 (v4 호환)
├── next.config.ts              # Next.js 설정
├── tsconfig.json
└── package.json
```

---

## 5. 디자인 시스템

### 5.1 컬러 팔레트 (Warm Beige Theme)

#### CSS Variables (Tailwind v4)
```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Primary - Warm Beige */
  --color-primary-50: oklch(0.98 0.01 80);
  --color-primary-100: oklch(0.95 0.02 75);
  --color-primary-200: oklch(0.90 0.04 70);
  --color-primary-300: oklch(0.82 0.06 65);
  --color-primary-400: oklch(0.72 0.10 55);
  --color-primary-500: oklch(0.65 0.12 50);   /* Main */
  --color-primary-600: oklch(0.55 0.12 45);
  --color-primary-700: oklch(0.48 0.10 40);
  --color-primary-800: oklch(0.40 0.08 38);
  --color-primary-900: oklch(0.35 0.06 35);

  /* Neutral - Warm Stone */
  --color-neutral-50: oklch(0.98 0.005 60);
  --color-neutral-100: oklch(0.96 0.005 60);
  --color-neutral-200: oklch(0.92 0.01 55);
  --color-neutral-300: oklch(0.87 0.01 50);
  --color-neutral-400: oklch(0.70 0.01 45);
  --color-neutral-500: oklch(0.55 0.01 40);
  --color-neutral-600: oklch(0.45 0.01 38);
  --color-neutral-700: oklch(0.38 0.01 35);
  --color-neutral-800: oklch(0.25 0.01 30);
  --color-neutral-900: oklch(0.18 0.01 25);

  /* Semantic Colors */
  --color-success: oklch(0.65 0.18 140);   /* 안전 - 녹색 */
  --color-warning: oklch(0.75 0.18 70);    /* 주의 - 황색 */
  --color-danger: oklch(0.60 0.22 25);     /* 위험 - 적색 */

  /* Background */
  --color-background: var(--color-neutral-50);
  --color-foreground: var(--color-neutral-900);

  /* Card */
  --color-card: oklch(1 0 0);
  --color-card-foreground: var(--color-neutral-800);

  /* Border */
  --color-border: var(--color-neutral-200);

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: var(--color-neutral-900);
    --color-foreground: var(--color-neutral-50);
    --color-card: var(--color-neutral-800);
    --color-card-foreground: var(--color-neutral-100);
    --color-border: var(--color-neutral-700);
  }
}
```

### 5.2 디자인 토큰

#### 간격 (Spacing)
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

#### 그림자 (Shadow)
```css
--shadow-card: 0 1px 3px oklch(0 0 0 / 0.08), 0 1px 2px oklch(0 0 0 / 0.06);
--shadow-card-hover: 0 4px 6px oklch(0 0 0 / 0.1), 0 2px 4px oklch(0 0 0 / 0.08);
```

### 5.3 타이포그래피

```css
@theme {
  --font-sans: "Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
}
```

### 5.4 컴포넌트 스타일 가이드

#### 카드 (Card)
```tsx
<Card className="rounded-xl border-neutral-200 bg-card shadow-card hover:shadow-card-hover transition-shadow">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-neutral-800">
      제목
    </CardTitle>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

#### 버튼 (Button)
```tsx
// Primary
<Button className="bg-primary-500 hover:bg-primary-600 text-white">
  계산하기
</Button>

// Secondary
<Button variant="outline" className="border-primary-300 text-primary-700">
  초기화
</Button>
```

---

## 6. 페이지 구조 및 와이어프레임

### 6.1 랜딩 페이지 (`/`)

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]                            [월세] [차량] [대시보드] │  ← Header
├────────────────────────────────────────────────────────────┤
│                                                            │
│        🏠                                                  │
│     내 월급으로                                             │
│     어디까지 살 수 있을까?                                  │  ← Hero
│                                                            │
│     월급만 입력하면 적정 월세와 차량 가격을 알려드려요        │
│                                                            │
│         [ 지금 계산해보기 →]                                │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  🏠 월세  │  │  🚗 차량  │  │  📊 종합  │                 │  ← Features
│  │  계산기   │  │  추천     │  │  대시보드 │                 │
│  │          │  │          │  │          │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  💡 Quick Calculator                                       │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  월급 입력: [        만원 ]                          │  │  ← Quick Calc
│  │                                                     │  │
│  │  → 적정 월세: XX ~ XX만원                            │  │
│  │  → 추천 차량: XX ~ XX만원                            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📚 알아두면 좋은 재정 팁                                   │
│  ┌─────────────────┐  ┌─────────────────┐                 │  ← Tips
│  │ 월세는 월급의    │  │ 차량은 연봉의   │                 │
│  │ 25-30%가 적정   │  │ 30-50%가 적정   │                 │
│  └─────────────────┘  └─────────────────┘                 │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  [서비스 정보] [면책조항] [개인정보처리방침]                  │  ← Footer
│  © 2025 내 월급으로 어디까지?                               │
└────────────────────────────────────────────────────────────┘
```

### 6.2 월세 계산기 (`/rent`)

```
┌────────────────────────────────────────────────────────────┐
│  ← 뒤로  월세 계산기                                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📝 소득 정보 입력                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  월급/연봉: ( ) 월급  (●) 연봉                       │  │
│  │            [          만원 ]                        │  │
│  │                                                     │  │
│  │  세전/세후: (●) 세전  ( ) 세후                       │  │
│  │                                                     │  │
│  │  보증금 가용액 (선택):  [          만원 ]            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│               [ 계산하기 ]                                  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📊 추천 결과                                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │   💚 안전 범위      XX만원 이하    (월급의 20%)      │  │
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━          │  │
│  │                                                     │  │
│  │   💛 적정 범위      XX~XX만원      (월급의 25-30%)   │  │
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━          │  │
│  │                                                     │  │
│  │   🔴 위험 범위      XX만원 이상    (월급의 33%+)     │  │
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━          │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  💡 보증금 월세 전환 옵션                                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  보증금 5000만원 / 월세 50만원                       │  │
│  │  보증금 3000만원 / 월세 60만원                       │  │
│  │  보증금 1000만원 / 월세 70만원                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 6.3 차량 추천 (`/car`)

```
┌────────────────────────────────────────────────────────────┐
│  ← 뒤로  차량 추천                                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📝 소득 및 구매 정보                                       │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  연봉: [          만원 ]                             │  │
│  │                                                     │  │
│  │  구매 방식: (●) 일시불  ( ) 할부  ( ) 리스           │  │
│  │                                                     │  │
│  │  보유 현금 (선택): [          만원 ]                 │  │
│  │                                                     │  │
│  │  [할부 선택 시]                                      │  │
│  │  할부 기간: [36개월 ▼]   금리: [5.9% ▼]             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🚗 추천 차량 가격                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │   추천 범위: XX,XXX ~ XX,XXX 만원                    │  │
│  │   (연봉의 30~50%)                                   │  │
│  │                                                     │  │
│  │   [━━━━━━━━━━━━●━━━━━━━━━━]                        │  │
│  │    최소      적정      최대                          │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  📊 월 유지비 시뮬레이션                                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │   🛡️ 보험료        약 XX만원/월                      │  │
│  │   ⛽ 유류비        약 XX만원/월                      │  │
│  │   📋 자동차세      약 X만원/월                       │  │
│  │   🔧 정비/소모품    약 X만원/월                       │  │
│  │   ─────────────────────────────                     │  │
│  │   📍 총 유지비      약 XX만원/월                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  💰 할부 시뮬레이션 (3000만원 기준)                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │   월 납입금: XX만원 × 36개월                         │  │
│  │   총 이자: XXX만원                                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 7. 개발 로드맵

### Phase 1: MVP (4주)

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 1주 | 프로젝트 세팅, 디자인 시스템 | 기본 컴포넌트, 테마 설정 |
| 2주 | 랜딩 페이지, 기본 레이아웃 | 반응형 랜딩 페이지 |
| 3주 | 월세/차량 계산기 구현 | 핵심 계산 기능 |
| 4주 | QA, 버그 수정, 배포 | 프로덕션 릴리즈 |

### Phase 2: 고도화 (이후)

- [ ] 종합 대시보드 구현
- [ ] 지역별 실제 매물 가격 연동 (부동산 API)
- [ ] 사용자 계정 및 저장 기능
- [ ] 소셜 공유 기능
- [ ] PWA 지원

---

## 8. 비기능 요구사항

### 8.1 성능 (Core Web Vitals)

| 지표 | 목표 | 측정 도구 |
|------|------|-----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Lighthouse |
| **INP** (Interaction to Next Paint) | < 200ms | Lighthouse |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| **TTFB** (Time to First Byte) | < 800ms | WebPageTest |

### 8.2 접근성 (Accessibility)

| 요구사항 | 상세 |
|----------|------|
| WCAG 2.1 AA | 색상 대비 4.5:1, 포커스 표시 |
| 키보드 네비게이션 | Tab 순서, Enter/Space 활성화 |
| 스크린 리더 | ARIA labels, semantic HTML |
| 다크 모드 | 시스템 설정 연동 |

### 8.3 SEO

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: '내 월급으로 어디까지? | 월세 & 차량 추천 계산기',
  description: '월급과 연봉에 맞는 적정 월세와 차량 가격을 계산해보세요. 한국 직장인을 위한 무료 재정 가이드.',
  keywords: ['월세 계산기', '차량 추천', '재정 계획', '월급', '연봉'],
  openGraph: {
    title: '내 월급으로 어디까지?',
    description: '월급에 맞는 적정 월세와 차량을 알아보세요',
    images: ['/og-image.png'],
  },
}
```

### 8.4 보안

| 항목 | 대응 |
|------|------|
| XSS | React 기본 이스케이핑, CSP 헤더 |
| 민감 정보 | 서버 미전송, 로컬 계산만 수행 |
| HTTPS | Vercel 기본 제공 |

---

## 9. 설치 및 실행

### 9.1 요구 환경

```
Node.js >= 20.0.0
pnpm >= 9.0.0
```

### 9.2 설치

```bash
# 저장소 클론
git clone https://github.com/username/rent-calculator.git
cd rent-calculator

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
pnpm start
```

### 9.3 shadcn/ui 컴포넌트 추가

```bash
# 초기화 (최초 1회)
pnpm dlx shadcn@latest init

# 컴포넌트 추가
pnpm dlx shadcn@latest add button card input slider tabs
```

---

## 10. 면책조항

> **주의**: 이 서비스에서 제공하는 추천 금액은 일반적인 재정 가이드라인을 기반으로 한 **참고 자료**입니다.
>
> - 개인의 재정 상황, 부채, 저축 목표 등에 따라 적정 금액은 달라질 수 있습니다.
> - 실제 월세 시세와 차량 가격은 시장 상황에 따라 변동됩니다.
> - 중요한 재정 결정은 **전문가와 상담**하시기 바랍니다.
> - 본 서비스는 어떠한 금융 자문도 제공하지 않습니다.

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 2.0 | 2025-12-10 | 기술 스택 최신화 (Next.js 16, Tailwind v4, shadcn 3.5), 디자인 시스템 OKLCH 색상 적용, 상세 와이어프레임 추가 |
| 1.0 | 2025-12-10 | 초안 작성 |
