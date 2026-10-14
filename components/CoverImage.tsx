import Image from 'next/image'
import { canOptimize } from '@/lib/images'
import styles from './CoverImage.module.css'

type Props = {
  src: string
  // How wide the image is at each viewport width, so the browser downloads a suitably small version.
  sizes: string
  alt?: string
  // Preload the main above-the-fold image (the largest contentful paint).
  preload?: boolean
  // Place under sibling content (e.g. below a hero's gradient overlay); the parent needs `isolation: isolate`.
  behind?: boolean
}

// Replaces `background-size: cover` backgrounds. The parent must be `position: relative` with a set size.
export default function CoverImage({ src, sizes, alt = '', preload, behind }: Props) {
  return (
    <>
      {/* Sits just under the photo (which is z-index -1 when `behind`), so it only shows while the photo loads. */}
      <span className={styles.placeholder} style={behind ? { zIndex: -2 } : undefined} aria-hidden="true">
        Loading photo…
      </span>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        unoptimized={!canOptimize(src)}
        style={{ objectFit: 'cover', ...(behind ? { zIndex: -1 } : {}) }}
      />
    </>
  )
}
