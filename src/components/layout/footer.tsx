export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 내 월급으로 어디까지?
          </p>
          <p className="text-center text-xs text-muted-foreground/70">
            본 서비스는 참고용이며 금융 자문을 제공하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
