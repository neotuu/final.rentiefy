import { useEffect } from 'react'

interface BreadcrumbItem {
  name: string
  url: string
}

interface SeoProps {
  title: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
  breadcrumbs?: BreadcrumbItem[]
}

export default function Seo({
  title,
  description,
  keywords,
  image = 'https://rentiefy.com/rentiefy-og-image.svg',
  url,
  type = 'website',
  jsonLd,
  breadcrumbs
}: SeoProps) {
  useEffect(() => {
    // 1. Title
    document.title = title

    // Helper for setting meta tag
    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // 2. Meta description
    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, 'property')
      setMeta('twitter:description', description)
    }

    // 3. Keywords
    if (keywords) {
      setMeta('keywords', keywords)
    }

    // 4. OG & Twitter Titles / Type
    setMeta('og:title', title, 'property')
    setMeta('twitter:title', title)
    setMeta('og:type', type, 'property')
    setMeta('og:site_name', 'Rentiefy', 'property')

    // 5. Image
    if (image) {
      setMeta('og:image', image, 'property')
      setMeta('twitter:image', image)
      setMeta('twitter:card', 'summary_large_image')
    }

    // 6. Canonical URL & og:url
    if (url) {
      setMeta('og:url', url, 'property')
      let canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', url)
      } else {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        canonical.setAttribute('href', url)
        document.head.appendChild(canonical)
      }
    }

    // 7. Dynamic JSON-LD Structured Data
    const scriptsToClean: HTMLScriptElement[] = []

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': item.name,
          'item': item.url.startsWith('http') ? item.url : `https://rentiefy.com${item.url}`
        }))
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'dynamic-breadcrumb-schema'
      script.text = JSON.stringify(breadcrumbSchema)
      document.head.appendChild(script)
      scriptsToClean.push(script)
    }

    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'dynamic-page-schema'
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
      scriptsToClean.push(script)
    }

    return () => {
      scriptsToClean.forEach((s) => s.remove())
    }
  }, [title, description, keywords, image, url, type, jsonLd, breadcrumbs])

  return null
}
