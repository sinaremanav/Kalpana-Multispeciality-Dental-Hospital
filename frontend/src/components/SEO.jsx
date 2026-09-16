import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG, PAGE_SEO, getBreadcrumbSchema } from '../config/seoConfig';

/**
 * Updates or creates a <meta> element in document.head
 */
const setMetaTag = (attributeName, attributeValue, content) => {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Updates or creates a <link rel="..."> element in document.head
 */
const setLinkTag = (rel, href) => {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * Lightweight, zero-dependency SEO Head Manager for React 19 SPA
 */
const SEO = ({
  page,
  title,
  description,
  canonical,
  keywords,
  ogImage,
  ogType,
  noIndex = false,
  schema = null,
  breadcrumbs = null,
}) => {
  const location = useLocation();
  const pageMeta = (page && PAGE_SEO[page]) || {};

  const finalTitle = title || pageMeta.title || SITE_CONFIG.name;
  const finalDescription = description || pageMeta.description || `${SITE_CONFIG.name} in Kopargaon, Maharashtra.`;
  const finalKeywords = keywords || pageMeta.keywords || SITE_CONFIG.keywords || 'dental hospital, dentist, Kopargaon';
  const finalOgImage = ogImage || pageMeta.ogImage || SITE_CONFIG.defaultImage;
  const finalOgType = ogType || pageMeta.ogType || 'website';
  const finalCanonical = canonical || `${SITE_CONFIG.domain}${pageMeta.path || location.pathname}`;
  const shouldNoIndex = noIndex || pageMeta.noIndex || false;

  useEffect(() => {
    // 1. Title Tag
    document.title = finalTitle;

    // 2. Primary Meta Tags
    setMetaTag('name', 'title', finalTitle);
    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'keywords', finalKeywords);
    setMetaTag('name', 'author', SITE_CONFIG.name);
    setMetaTag(
      'name',
      'robots',
      shouldNoIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 3. Canonical Link
    setLinkTag('canonical', finalCanonical);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:site_name', SITE_CONFIG.name);
    setMetaTag('property', 'og:locale', 'en_IN');
    setMetaTag('property', 'og:type', finalOgType);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:image', finalOgImage);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', `${SITE_CONFIG.name} Clinic Facility`);

    // 5. Twitter Card Tags
    setMetaTag('property', 'twitter:card', 'summary_large_image');
    setMetaTag('property', 'twitter:url', finalCanonical);
    setMetaTag('property', 'twitter:title', finalTitle);
    setMetaTag('property', 'twitter:description', finalDescription);
    setMetaTag('property', 'twitter:image', finalOgImage);

    // 6. JSON-LD Structured Data
    const scriptId = 'page-jsonld-schema';
    let scriptTag = document.getElementById(scriptId);
    
    // Combine provided schema with breadcrumbs if any
    const schemasToInject = [];
    if (schema) {
      if (Array.isArray(schema)) {
        schemasToInject.push(...schema);
      } else {
        schemasToInject.push(schema);
      }
    }
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemasToInject.push(getBreadcrumbSchema(breadcrumbs));
    }

    if (schemasToInject.length > 0) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(
        schemasToInject.length === 1 ? schemasToInject[0] : schemasToInject
      );
    } else if (scriptTag) {
      scriptTag.remove();
    }

    // Cleanup when component unmounts
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    finalCanonical,
    finalOgImage,
    finalOgType,
    shouldNoIndex,
    schema,
    breadcrumbs,
  ]);

  return null;
};

export default SEO;
