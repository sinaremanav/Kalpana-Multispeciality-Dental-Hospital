/**
 * SEO Configuration for Kalpana Multispeciality Dental Hospital
 * Production Domain: https://kalpana-multispeciality-dental-hosp.vercel.app
 * Optimized for Google Top 1-3 Rankings in Kopargaon & Maharashtra
 */

export const SITE_CONFIG = {
  name: "Kalpana Multispeciality Dental Hospital",
  shortName: "Kalpana Dental",
  legalName: "Kalpana Multispeciality Dental Clinic & Hospital",
  domain: "https://kalpana-multispeciality-dental-hosp.vercel.app",
  phone: "+91 94211 46623",
  altPhone: "+91 89995 77794",
  whatsappNumber: "919421146623",
  email: "contact@kalpanadental.com",
  streetAddress: "Gandhi Statue Near Sudesh Picture Palace, Main Road Kopargaon, Kopargaon Bet",
  city: "Kopargaon",
  district: "Ahmednagar",
  state: "Maharashtra",
  postalCode: "423601",
  country: "IN",
  countryName: "India",
  latitude: 19.8808333,
  longitude: 74.4790833,
  googleMapsUrl: "https://www.google.com/maps?q=19.8808333,74.4790833",
  defaultImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&h=630&q=80",
  founder: "Dr. Nikhil Hiralal Mahanubhav",
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00"
    }
  ],
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com"
  }
};

export const PAGE_SEO = {
  home: {
    title: "Kalpana Multispeciality Dental Hospital | Best Dentist in Kopargaon",
    description: "Kalpana Multispeciality Dental Hospital in Kopargaon, led by Dr. Nikhil Hiralal Mahanubhav. Painless root canal, dental implants, teeth cleaning & cosmetic care.",
    path: "/",
    keywords: "Kalpana Multispeciality Dental Hospital, best dentist in Kopargaon, dentist in Kopargaon, dental hospital in Kopargaon, dental clinic Kopargaon, Dr Nikhil Hiralal Mahanubhav, root canal treatment Kopargaon, dental implants Kopargaon, teeth cleaning Kopargaon",
    ogType: "website"
  },
  about: {
    title: "About Kalpana Multispeciality Dental Hospital | Kopargaon",
    description: "About Kalpana Multispeciality Dental Hospital in Kopargaon, founded by Dr. Nikhil Hiralal Mahanubhav. Discover our sterile surgical suites and patient-first dentistry.",
    path: "/about",
    keywords: "about Kalpana dental hospital, Dr Nikhil Hiralal Mahanubhav, dentist Kopargaon, dental clinic team, dental surgery specialist Kopargaon, sterile dental hospital Kopargaon",
    ogType: "website"
  },
  services: {
    title: "Dental Services & Treatments in Kopargaon | Kalpana Hospital",
    description: "Comprehensive dental treatments in Kopargaon: Painless single-visit root canal, dental implants, cosmetic smile makeover, braces, aligners, and pediatric dentistry.",
    path: "/services",
    keywords: "dental services Kopargaon, root canal treatment Kopargaon, dental implants Kopargaon, teeth whitening Kopargaon, clear aligners Kopargaon, teeth cleaning, pediatric dentistry Kopargaon",
    ogType: "website"
  },
  doctors: {
    title: "Best Dental Specialists & Surgeons in Kopargaon | Kalpana Hospital",
    description: "Consult top dental specialists in Kopargaon led by Dr. Nikhil Hiralal Mahanubhav (BDS, MDS). Gentle, painless, and expert dental surgery care.",
    path: "/doctors",
    keywords: "dentists in Kopargaon, best dentist in Kopargaon, Dr Nikhil Hiralal Mahanubhav, dental implantologist Kopargaon, pediatric dentist Kopargaon, oral surgeon Kopargaon",
    ogType: "website"
  },
  events: {
    title: "Dental Camps & Events in Kopargaon | Kalpana Dental Hospital",
    description: "Stay updated on free community dental screening camps, oral hygiene awareness drives, and outreach programs in Kopargaon by Kalpana Dental Hospital.",
    path: "/events",
    keywords: "dental checkup camp Kopargaon, free dental camp Kopargaon, oral health awareness Shirdi Kopargaon, community dental healthcare",
    ogType: "website"
  },
  gallery: {
    title: "Clinic & Hospital Gallery | Kalpana Multispeciality Dental Hospital",
    description: "Tour the modern treatment operatories, sterilization room, advanced dental chairs, and surgical equipment at Kalpana Dental Hospital in Kopargaon.",
    path: "/gallery",
    keywords: "dental clinic photos Kopargaon, hospital facility tour, modern dental equipment Kopargaon, sterilization autoclave room, dental surgery operatory",
    ogType: "website"
  },
  reviewsFaqs: {
    title: "Patient Reviews & Dental FAQs | Kalpana Hospital Kopargaon",
    description: "Read verified 5-star patient reviews and expert answers to common dental questions about root canal, dental implants, and tooth pain in Kopargaon.",
    path: "/reviews-faqs",
    keywords: "Kalpana dental hospital reviews, dental clinic ratings Kopargaon, patient testimonials, dentist FAQ Kopargaon, tooth pain treatment questions",
    ogType: "website"
  },
  contact: {
    title: "Contact Kalpana Dental Hospital Kopargaon | Phone & Address",
    description: "Contact Kalpana Multispeciality Dental Hospital near Gandhi Statue, Kopargaon Bet. Call +91 94211 46623 for emergency dental care and consultations.",
    path: "/contact",
    keywords: "contact Kalpana dental hospital, dentist contact number Kopargaon, dental clinic address Kopargaon, emergency dentist Kopargaon, Gandhi Statue Kopargaon Bet",
    ogType: "website"
  },
  appointment: {
    title: "Book Dental Appointment in Kopargaon | Kalpana Dental Hospital",
    description: "Book an online dental appointment in Kopargaon with Dr. Nikhil Mahanubhav and team. Fast appointment confirmation with zero waiting time.",
    path: "/appointment",
    keywords: "book dental appointment Kopargaon, schedule dentist visit Kopargaon, online dental consultation Kopargaon, Dr Nikhil Mahanubhav appointment",
    ogType: "website"
  },
  notFound: {
    title: "Page Not Found | Kalpana Multispeciality Dental Hospital",
    description: "The requested page cannot be found. Visit our homepage to explore dental services, book appointments, or consult with our dental specialists in Kopargaon.",
    path: "/404",
    noIndex: true,
    ogType: "website"
  }
};

/**
 * Generate High-Ranking Dentist & LocalBusiness Schema.org JSON-LD
 */
export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalBusiness", "LocalBusiness"],
    "@id": `${SITE_CONFIG.domain}/#organization`,
    "name": SITE_CONFIG.name,
    "alternateName": [
      SITE_CONFIG.legalName,
      "Kalpana Dental Clinic",
      "Kalpana Dental Hospital Kopargaon"
    ],
    "url": SITE_CONFIG.domain,
    "logo": `${SITE_CONFIG.domain}/favicon.svg`,
    "image": SITE_CONFIG.defaultImage,
    "telephone": SITE_CONFIG.phone,
    "email": SITE_CONFIG.email,
    "hasMap": SITE_CONFIG.googleMapsUrl,
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, UPI, Credit Card, Debit Card, Net Banking",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.streetAddress,
      "addressLocality": SITE_CONFIG.city,
      "addressRegion": SITE_CONFIG.state,
      "postalCode": SITE_CONFIG.postalCode,
      "addressCountry": SITE_CONFIG.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": SITE_CONFIG.latitude,
      "longitude": SITE_CONFIG.longitude
    },
    "areaServed": [
      { "@type": "City", "name": "Kopargaon" },
      { "@type": "City", "name": "Shirdi" },
      { "@type": "AdministrativeArea", "name": "Ahmednagar" },
      { "@type": "AdministrativeArea", "name": "Maharashtra" }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "medicalSpecialty": [
      "Dentistry",
      "Endodontics",
      "Prosthodontics",
      "Orthodontics",
      "Pediatric Dentistry"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dental Treatments & Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Root Canal Treatment (RCT)",
            "description": "Painless single-visit rotary endodontic therapy in Kopargaon to relieve tooth pain and preserve natural teeth."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Dental Implants",
            "description": "Permanent titanium tooth replacements for single, multiple, or full mouth rehabilitation in Kopargaon."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Teeth Cleaning & Scaling",
            "description": "Ultrasonic plaque and tartar scaling, stain removal, and polishing for healthy gums."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Braces & Clear Aligners",
            "description": "Invisible clear aligners and modern ceramic braces to correct bite and straighten teeth."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cosmetic Dentistry & Smile Design",
            "description": "Porcelain veneers, cosmetic bonding, and smile transformation in Kopargaon."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pediatric Dentistry",
            "description": "Gentle, compassionate dental care tailored specifically for children and teenagers."
          }
        }
      ]
    },
    "founder": {
      "@type": "Person",
      "name": SITE_CONFIG.founder,
      "jobTitle": "Chief Dental Surgeon & Founder",
      "honorificPrefix": "Dr.",
      "knowsAbout": [
        "Root Canal Treatment",
        "Fixed Prosthodontics",
        "Maxillofacial Procedures",
        "Dental Surgery",
        "Dental Implants"
      ]
    },
    "sameAs": Object.values(SITE_CONFIG.socials).filter(Boolean)
  };
};

/**
 * Generate WebSite Schema.org JSON-LD
 */
export const getWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.domain}/#website`,
    "url": SITE_CONFIG.domain,
    "name": SITE_CONFIG.name,
    "alternateName": [
      SITE_CONFIG.legalName,
      "Kalpana Dental",
      "Kalpana Dental Clinic Kopargaon"
    ],
    "publisher": {
      "@id": `${SITE_CONFIG.domain}/#organization`
    }
  };
};

/**
 * Generate Physician / Person Schema for Doctors
 */
export const getPhysicianSchema = (doctors = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Specialist Dental Surgeons at Kalpana Multispeciality Dental Hospital",
    "itemListElement": doctors.map((doc, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Physician",
        "name": doc.name,
        "jobTitle": doc.role,
        "description": doc.bio,
        "medicalSpecialty": doc.specialties || ["Dentistry"],
        "worksFor": {
          "@type": "Dentist",
          "name": SITE_CONFIG.name,
          "url": SITE_CONFIG.domain
        },
        "image": doc.image_url || doc.image || SITE_CONFIG.defaultImage
      }
    }))
  };
};

/**
 * Generate FAQPage Schema.org JSON-LD
 */
export const getFAQSchema = (faqList = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
};

/**
 * Generate BreadcrumbList Schema.org JSON-LD
 */
export const getBreadcrumbSchema = (breadcrumbs = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.url.startsWith("http") ? crumb.url : `${SITE_CONFIG.domain}${crumb.url}`
    }))
  };
};
