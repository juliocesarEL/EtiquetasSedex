import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function UploadCloudIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 18a4.6 4.6 0 0 1-.6-9.16 5.5 5.5 0 0 1 10.7-1.79A4.5 4.5 0 0 1 17.5 18H7Z" />
      <path d="M12 12v7" />
      <path d="m9 15 3-3 3 3" />
    </svg>
  )
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6M9 9h1" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 11.5v.5a9 9 0 1 1-5.3-8.2" />
      <path d="m8.5 12 2.5 2.5L20 5.5" />
    </svg>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12" />
      <path d="m6.5 10.5 5.5 5.5 5.5-5.5" />
      <path d="M5 20h14" />
    </svg>
  )
}

export function PrinterIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <path d="M3 21v-5h5" />
      <path d="M21 3v5h-5" />
    </svg>
  )
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10.3 3.9 1.9 18a1.6 1.6 0 0 0 1.4 2.5h17.4a1.6 1.6 0 0 0 1.4-2.5L13.7 3.9a1.6 1.6 0 0 0-2.8 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 8h11v8H2z" />
      <path d="M13 11h4l4 3v2h-8z" />
      <circle cx="6.5" cy="18.5" r="1.6" />
      <circle cx="16.5" cy="18.5" r="1.6" />
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

export function GlassIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h12l-1.2 9.5a4.8 4.8 0 0 1-9.6 0Z" />
      <path d="M12 15v6M8 21h8" />
    </svg>
  )
}

export function ArrowsUpIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21V8M7 13l5-5 5 5" />
      <path d="M6 4h12" />
    </svg>
  )
}

export function HandsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v9" />
      <path d="M8 22h8l3-6-2-4-3 2-1-1H9l-3 2-2 4Z" />
      <path d="M9 12 5 9" />
      <path d="M15 12l4-3" />
    </svg>
  )
}

export function UmbrellaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z" />
      <path d="M12 12v7a2 2 0 0 1-4 0" />
      <path d="M12 3v2" />
    </svg>
  )
}
