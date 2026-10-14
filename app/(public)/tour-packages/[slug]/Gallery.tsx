'use client'

import { useState } from 'react'
import CoverImage from '@/components/CoverImage'
import styles from './PackageDetail.module.css'

export default function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <CoverImage src={photos[active]} alt={`${title} photo ${active + 1}`} sizes="(max-width: 900px) 100vw, 760px" />
      </div>
      <div className={styles.galleryThumbs}>
        {photos.map((src, index) => (
          <button
            key={src + index}
            type="button"
            className={index === active ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
            onClick={() => setActive(index)}
            aria-label={`Show photo ${index + 1}`}
          >
            <CoverImage src={src} sizes="72px" />
          </button>
        ))}
      </div>
    </div>
  )
}
