import * as React from 'react'
import Image from 'next/image'

interface LogoMarkProps {
  className?: string
  alt?: string
  /** Forwarded to the underlying next/image element. */
  priority?: boolean
}

/**
 * Official DrugEye Intelligence brand mark.
 * Sourced from /public/drugeye-logo.png — do not recreate in code.
 */
export function LogoMark({
  className,
  alt = 'DrugEye Intelligence',
  priority = false,
}: LogoMarkProps) {
  return (
    <Image
      src="/drugeye-logo.png"
      alt={alt}
      width={1152}
      height={896}
      priority={priority}
      sizes="(max-width: 768px) 160px, 240px"
      className={className}
    />
  )
}

export default LogoMark
