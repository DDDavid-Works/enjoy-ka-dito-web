'use client'

import { useState } from 'react'
import styles from './PackageDetail.module.css'

export default function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className={styles.gallery}>
      <div
        className={styles.galleryMain}
        role="img"
        aria-label={`${title} photo ${active + 1}`}
        style={{ backgroundImage: `url(${photos[active]})` }}
      />
      <div className={styles.galleryThumbs}>
        {photos.map((src, index) => (
          <button
            key={src + index}
            type="button"
            className={index === active ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
            style={{ backgroundImage: `url(${src})` }}
            onClick={() => setActive(index)}
            aria-label={`Show photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
