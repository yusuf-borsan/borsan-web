import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ---- Category icons ---- */

export function LatheIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 30h40" />
      <rect x="7" y="20" width="9" height="10" rx="1" />
      <path d="M16 23h14l4 3-4 3H16" />
      <path d="M34 22v12" />
      <path d="M38 24v8" />
      <circle cx="11.5" cy="25" r="1.4" />
      <path d="M9 34v4M39 34v4" />
    </svg>
  );
}

export function VmcIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 8h28v9H10z" />
      <path d="M24 17v8" />
      <path d="M22 25h4l-2 4z" />
      <path d="M8 36h32" />
      <path d="M14 30h20v6H14z" />
      <path d="M10 17v6M38 17v6" />
    </svg>
  );
}

export function HmcIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 14h12v14H6z" />
      <path d="M18 21h7" />
      <path d="M25 19l4 2-4 2z" />
      <path d="M29 12h13v22H29z" />
      <path d="M33 16v14M38 16v14" />
      <path d="M6 32h12" />
    </svg>
  );
}

export function VtlIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 38h24" />
      <ellipse cx="24" cy="34" rx="13" ry="4" />
      <path d="M24 12v18" />
      <path d="M20 12h8" />
      <path d="M16 20h6M26 20h6" />
      <path d="M22 26h4" />
    </svg>
  );
}

export function GrinderIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="18" cy="20" r="9" />
      <circle cx="18" cy="20" r="2" />
      <path d="M27 20h9" />
      <path d="M36 16v8" />
      <path d="M6 34h36" />
      <path d="M14 29l-2 5M22 29l2 5" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 7v5M24 36v5M7 24h5M36 24h5M12 12l3.5 3.5M32.5 32.5L36 36M36 12l-3.5 3.5M15.5 32.5L12 36" />
      <circle cx="24" cy="24" r="10" />
      <circle cx="24" cy="24" r="4" />
    </svg>
  );
}

const categoryIcons: Record<string, (p: IconProps) => React.ReactElement> = {
  lathe: LatheIcon,
  vmc: VmcIcon,
  hmc: HmcIcon,
  vtl: VtlIcon,
  grinder: GrinderIcon,
  gear: GearIcon,
};

export function CategoryIcon({ name, ...props }: { name: string } & IconProps) {
  const Icon = categoryIcons[name] ?? LatheIcon;
  return <Icon {...props} />;
}

/* ---- Feature / advantage icons ---- */

export function ConsultIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 12h28v18H22l-7 6v-6h-5z" />
      <path d="M17 19h14M17 24h9" />
    </svg>
  );
}

export function PrecisionIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="6" />
      <path d="M24 9v6M24 33v6M9 24h6M33 24h6" />
    </svg>
  );
}

export function CommissionIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 30l-5 8 8-3 3 5 6-12" />
      <path d="M30 12l6 6-10 10-6-6z" />
      <path d="M34 8l4 4" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 8l13 5v9c0 9-6 14-13 18-7-4-13-9-13-18v-9z" />
      <path d="M18 24l4 4 8-9" />
    </svg>
  );
}

const featureIcons: Record<string, (p: IconProps) => React.ReactElement> = {
  consult: ConsultIcon,
  precision: PrecisionIcon,
  commission: CommissionIcon,
  shield: ShieldIcon,
};

export function FeatureIcon({ name, ...props }: { name: string } & IconProps) {
  const Icon = featureIcons[name] ?? ShieldIcon;
  return <Icon {...props} />;
}

/* ---- Inline utility icons ---- */

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 10c0 12 12 24 24 24l-2-7-7-2-2 3c-3-1.5-7.5-6-9-9l3-2-2-7z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="12" width="32" height="24" rx="2" />
      <path d="M9 14l15 12 15-12" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 42c8-8 13-14 13-21a13 13 0 1 0-26 0c0 7 5 13 13 21z" />
      <circle cx="24" cy="21" r="5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 15v9l6 4" />
    </svg>
  );
}

export function DocIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 6h14l8 8v28H14z" />
      <path d="M28 6v8h8" />
      <path d="M19 26h12M19 32h12" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 25l8 8 20-20" />
    </svg>
  );
}
