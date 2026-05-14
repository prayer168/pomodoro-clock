interface AcornIconProps {
  className?: string
  size?: number
}

export function AcornIcon({ className, size = 24 }: AcornIconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Stem */}
      <path d="M12 6.5 Q13.2 4.2 15.5 4.8" />
      {/* Cap dome */}
      <path d="M6.5 12 Q6.5 8 12 8 Q17.5 8 17.5 12" />
      {/* Cap horizontal lines (texture) */}
      <path d="M7 10 Q12 9.2 17 10" strokeWidth="0.8" opacity="0.6"/>
      {/* Cap rim */}
      <path d="M5.5 12 Q5.5 13.5 12 13.5 Q18.5 13.5 18.5 12" strokeWidth="1.8"/>
      {/* Body */}
      <path d="M7.8 13.5 Q7.2 20 12 22 Q16.8 20 16.2 13.5" />
      {/* Body vertical lines */}
      <line x1="10.5" y1="14" x2="10" y2="20.5" strokeWidth="0.7" opacity="0.5"/>
      <line x1="13.5" y1="14" x2="14" y2="20.5" strokeWidth="0.7" opacity="0.5"/>
    </svg>
  )
}
