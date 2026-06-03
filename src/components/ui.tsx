import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "light";
  className?: string;
}) {
  const color = tone === "light" ? "text-brand-300" : "text-brand-600";
  return (
    <span className={`eyebrow inline-flex items-center gap-2 ${color} ${className}`}>
      <span className="h-px w-7 bg-current opacity-70" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "dark",
  align = "left",
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  const titleColor = tone === "light" ? "text-white" : "text-ink-900";
  const subColor = tone === "light" ? "text-steel-300" : "text-ink-500";
  const alignment = align === "center" ? "text-center mx-auto items-center" : "";
  const maxW = align === "center" ? "max-w-3xl" : "max-w-2xl";
  return (
    <div className={`flex flex-col gap-4 ${maxW} ${alignment} ${className}`}>
      {eyebrow && <Eyebrow tone={tone === "light" ? "light" : "brand"}>{eyebrow}</Eyebrow>}
      <h2
        className={`font-display text-3xl leading-[1.05] sm:text-4xl lg:text-[2.75rem] ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && <p className={`text-base leading-relaxed sm:text-lg ${subColor}`}>{subtitle}</p>}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "light";
type ButtonSize = "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-900/20",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800",
  ghost:
    "bg-transparent text-ink-900 ring-1 ring-inset ring-ink-200 hover:ring-brand-600 hover:text-brand-600",
  light:
    "bg-white text-ink-900 hover:bg-steel-300/40 ring-1 ring-inset ring-white/0",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className = "") {
  return `group inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-tight transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
} & ComponentProps<"button">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </button>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 ${className}`}
      aria-hidden
    >
      <path
        d="M4 10h11M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
