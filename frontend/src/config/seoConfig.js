/**
 * SEO Configuration for Kalpana Multispeciality Dental Hospital
 * Production Domain: https://kalpana-multispeciality-dental-hosp.vercel.app
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
    title: "Kalpana Multispeciality Dental Hospital | Dental Care",
    description: "Kalpana Multispeciality Dental Hospital in Kopargaon provides painless root canal treatment, dental implants, teeth cleaning, aligners, and cosmetic dentistry.",
    path: "/",
    keywords: "multispeciality dental hospital, dental hospital Kopargaon, dentist in Kopargaon, dental clinic Kopargaon, root canal treatment Kopargaon, dental implants, teeth cleaning, painless dentistry",
    ogType: "website"
  },
  about: {
    title: "About Kalpana Multispeciality Dental Hospital",
    description: "Learn about Kalpana Multispeciality Dental Hospital in Kopargaon, led by Dr. Nikhil Hiralal Mahanubhav. Discover our sterile protocols and patient-first care.",
    path: "/about",
    keywords: "about Kalpana dental, Dr. Nikhil Hiralal Mahanubhav, dentist Kopargaon, dental clinic team, dental surgery specialist Kopargaon, sterile dental clinic",
    ogType: "website"
  },
  services: {
    title: "Dental Services | Kalpana Multispeciality Dental Hospital",
    description: "Explore advanced dental treatments at Kalpana Multispeciality Dental Hospital: root canal therapy, dental implants, smile makeover, braces, aligners, and pediatric care.",
    path: "/services",
    keywords: "dental services Kopargaon, root canal treatment, dental implants, teeth whitening, clear aligners, teeth cleaning, pediatric dentistry, cosmetic dentistry Kopargaon",
    ogType: "website"
  },
  doctors: {
    title: "Specialist Doctors | Kalpana Multispeciality Dental Hospital",
    description: "Meet experienced dental surgeons and specialists at Kalpana Multispeciality Dental Hospital in Kopargaon, dedicated to gentle and precise oral healthcare.",
    path: "/doctors",
    keywords: "dentists in Kopargaon, Dr. Nikhil Hiralal Mahanubhav, dental implantologist Kopargaon, pediatric dentist Kopargaon, oral surgeon Kopargaon",
    ogType: "website"
  },
  events: {
    title: "Dental Camps & Events | Kalpana Multispeciality Dental Hospital",
    description: "Stay updated on free community dental screening camps, oral hygiene awareness drives, and outreach programs organized by Kalpana Dental Hospital.",
    path: "/events",
    keywords: "dental checkup camp Kopargaon, free dental camp, oral health awareness, community dental healthcare Kopargaon",
    ogType: "website"
  },
  gallery: {
    title: "Clinic Gallery | Kalpana Multispeciality Dental Hospital",
    description: "Tour the modern treatment suites, sterilization room, advanced dental chairs, and surgical equipment at Kalpana Multispeciality Dental Hospital in Kopargaon.",
    path: "/gallery",
    keywords: "dental clinic photos Kopargaon, hospital facility tour, modern dental equipment, sterilization autoclave room, dental surgery operatory",
    ogType: "website"
  },
  reviewsFaqs: {
    title: "Patient Reviews & FAQs | Kalpana Multispeciality Dental Hospital",
    description: "Read verified patient reviews and get clear answers to common dental questions about root canal, dental implants, teeth scaling, and appointments in Kopargaon.",
    path: "/reviews-faqs",
    keywords: "dental hospital reviews Kopargaon, patient testimonials, dentist FAQ, tooth pain treatment questions, dental appointment Kopargaon",
    ogType: "website"
  },
  contact: {
    title: "Contact Kalpana Multispeciality Dental Hospital",
    description: "Contact Kalpana Multispeciality Dental Hospital at Gandhi Statue, Near Sudesh Picture Palace, Kopargaon Bet. Call +91 94211 46623 or visit us today.",
    path: "/contact",
    keywords: "contact Kalpana dental hospital, dentist contact number Kopargaon, dental clinic address Kopargaon, emergency dentist Kopargaon",
    ogType: "website"
  },
  appointment: {
    title: "Book Dental Appointment | Kalpana Multispeciality Dental Hospital",
    description: "Book an appointment online with specialist doctors at Kalpana Multispeciality Dental Hospital in Kopargaon. Fast confirmation and zero waiting time.",
    path: "/appointment",
    keywords: "book dental appointment Kopargaon, schedule dentist visit, online dental consultation Kopargaon, Dr. Nikhil Mahanubhav appointment",
    ogType: "website"
  },
  notFound: {
    title: "Page Not Found | Kalpana Multispeciality Dental Hospital",
    description: "The requested page cannot be found. Visit our homepage to explore dental services, book appointments, or consult with our dental specialists.",
    path: "/404",
    noIndex: true,
    ogType: "website"
  }
};

/**
 * Generate Dentist & LocalBusiness Schema.org JSON-LD
 */
export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalBusiness", "LocalBusiness"],
    "@id": `${SITE_CONFIG.domain}/#organization`,
    "name": SITE_CONFIG.name,
    "alternateName": SITE_CONFIG.legalName,
    "url": SITE_CONFIG.domain,
    "logo": `${SITE_CONFIG.domain}/favicon.svg`,
    "image": SITE_CONFIG.defaultImage,
    "telephone": SITE_CONFIG.phone,
    "email": SITE_CONFIG.email,
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
    "founder": {
      "@type": "Person",
      "name": SITE_CONFIG.founder,
      "jobTitle": "Chief Dental Surgeon & Founder",
      "honorificPrefix": "Dr.",
      "knowsAbout": ["Root Canal Treatment", "Prosthodontics", "Oral Surgery", "Dental Implants"]
    },
    "sameAs": Object.values(SITE_CONFIG.socials).filter(Boolean)
  };
};

/**
 * Generate WebSite Schema.org JSON-LD with Sitelinks Searchbox
 */
export const getWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.domain}/#website`,
    "url": SITE_CONFIG.domain,
    "name": SITE_CONFIG.name,
    "alternateName": SITE_CONFIG.legalName,
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
    "name": "Specialist Doctors at Kalpana Multispeciality Dental Hospital",
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
