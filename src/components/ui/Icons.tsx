import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  "aria-hidden": true,
  focusable: false,
} as const;

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" strokeLinecap="square" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.6 2.5H3.2a.7.7 0 0 0-.7.75A10.6 10.6 0 0 0 12.75 13.5a.7.7 0 0 0 .75-.7v-2.4l-2.6-1-1.3 1.3a7.6 7.6 0 0 1-4.3-4.3l1.3-1.3-1-2.6Z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" width={24} height={24} {...props}>
      <path d="M3 8.5h18M3 15.5h18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" width={24} height={24} {...props}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M8 1.2 10 5.6l4.8.5-3.6 3.2 1 4.7L8 11.6 3.8 14l1-4.7L1.2 6.1 6 5.6 8 1.2Z" />
    </svg>
  );
}
