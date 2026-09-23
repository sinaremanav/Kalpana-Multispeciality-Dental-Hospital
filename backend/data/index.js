export const clinicConfig = {
  clinicName: "Kalpana Multispeciality Dental Clinic",
  tagline: "Advanced & Painless Dental Care in Kopargaon",
  subTagline: "Providing compassionate, modern, and personalized dental care led by Dr. Nikhil Hiralal Mahanubhav.",
  doctorName: "Dr. Nikhil Hiralal Mahanubhav",
  doctorDegree: "BDS, MDS (Dental Surgery Specialist & Oral Healthcare)",
  doctorExperience: "4 Years in Healthcare",
  registrationNo: "D-94211",
  phone: "+91 74472 26136",
  displayPhone: "+91 74472 26136 / +91 89995 77794",
  whatsappNumber: "917447226136",
  email: "contact@kalpanadental.com",
  address: "Gandhi Statue Near Sudesh Picture Palace, Main Road Kopargaon, Kopargaon Bet, Shirdi-423601, Maharashtra",
  landmark: "Near Sudesh Picture Palace & Gandhi Statue, Main Road Kopargaon",
  workingHours: {
    weekdays: "Monday – Saturday: 9:00 AM – 8:00 PM",
    sunday: "Sunday: By Prior Appointment Only",
  },
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
  googleMapsUrl: "https://maps.google.com/?q=Kalpana+Multispecility+Dental+Clinic+Kopargaon",
  stats: {
    experienceYears: "4+",
    happyPatients: "8,000+",
    proceduresDone: "15,000+",
    satisfactionRate: "99.4%"
  }
};

export const doctorsData = [
  {
    id: "dr-nikhil-mahanubhav",
    name: "Dr. Nikhil Hiralal Mahanubhav",
    qualification: "BDS, MDS (Dental Surgery Specialist & Oral Healthcare)",
    role: "Chief Dental Surgeon & Founder",
    experience: "4 Years in Healthcare",
    image: "/dr-nikhil-mahanubhav.png",
    specialties: [
      "RCT (Root Canal) Treatment",
      "Maxillofacial Prosthetics",
      "RCT (Root Canal) Surgery",
      "Oral And Maxillofacial Procedures",
      "Fixed Prosthodontics"
    ],
    schedule: "Mon - Sat (9:00 AM - 8:00 PM)",
    languages: ["Marathi", "Hindi", "English"]
  },
  {
    id: "dr-rohit-verma",
    name: "Dr. Rohit Verma",
    qualification: "BDS, MDS (Oral & Maxillofacial Implantology)",
    role: "Senior Dental Implantologist & Surgeon",
    experience: "10+ Years Experience",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    specialties: ["Dental Implants", "Full Mouth Rehabilitation", "Wisdom Tooth Surgery", "Bone Grafting"],
    schedule: "Tue, Thu, Sat (10:00 AM - 6:00 PM)",
    languages: ["English", "Hindi"]
  },
  {
    id: "dr-ananya-deshmukh",
    name: "Dr. Ananya Deshmukh",
    qualification: "BDS, Fellowship in Pediatric Dentistry",
    role: "Pediatric Dental Specialist",
    experience: "7+ Years Experience",
    image: "https://images.unsplash.com/photo-1594824813566-78a994787a74?auto=format&fit=crop&w=800&q=80",
    specialties: ["Pediatric Care", "Preventive Sealants", "Interceptive Braces", "Kids Dental Hygiene"],
    schedule: "Mon, Wed, Fri (10:00 AM - 5:00 PM)",
    languages: ["English", "Hindi", "Marathi"]
  }
];

export const servicesData = [
  {
    id: "general-dentistry",
    title: "General Dentistry",
    shortDesc: "Routine checkups, comprehensive oral screening, and preventive dental care to protect your smile.",
    badge: "Preventive",
    priceRange: "Routine Care"
  },
  {
    id: "teeth-cleaning",
    title: "Teeth Cleaning & Scaling",
    shortDesc: "Professional ultrasonic scaling and polishing to eliminate plaque, tartar, and surface stains.",
    badge: "Popular",
    priceRange: "Essential"
  },
  {
    id: "root-canal",
    title: "Root Canal Treatment",
    shortDesc: "Painless single-visit endodontic therapy to save severely infected teeth and relieve toothache.",
    badge: "Painless",
    priceRange: "Specialized"
  },
  {
    id: "dental-implants",
    title: "Dental Implants",
    shortDesc: "Permanent, natural-looking tooth replacement solution anchored securely into your jawbone.",
    badge: "Permanent",
    priceRange: "Advanced"
  },
  {
    id: "cosmetic-dentistry",
    title: "Cosmetic Dentistry",
    shortDesc: "Smile redesign with porcelain veneers, composite bonding, and alignment corrections.",
    badge: "Aesthetic",
    priceRange: "Premium"
  },
  {
    id: "teeth-whitening",
    title: "Teeth Whitening",
    shortDesc: "Safe, in-office laser whitening treatment that brightens teeth by several shades in 45 minutes.",
    badge: "Instant Results",
    priceRange: "Quick & Effective"
  },
  {
    id: "orthodontics-aligners",
    title: "Braces & Clear Aligners",
    shortDesc: "Discreet clear aligners and modern ceramic braces to straighten crooked teeth and fix bite alignment.",
    badge: "Modern",
    priceRange: "Comprehensive"
  },
  {
    id: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    shortDesc: "Gentle, friendly dental treatments specifically designed to make children feel comfortable and safe.",
    badge: "Kids Friendly",
    priceRange: "Gentle Care"
  }
];

export const galleryData = [
  { id: 1, title: "Modern Reception Area", category: "Clinic" },
  { id: 2, title: "Advanced Dental Treatment Suite", category: "Equipment" },
  { id: 3, title: "Digital Smile Transformation", category: "Smiles" },
  { id: 4, title: "Painless Root Canal & Crown", category: "Treatments" },
  { id: 5, title: "Sterilization & Autoclave Room", category: "Equipment" },
  { id: 6, title: "Clear Aligner Consultation", category: "Treatments" },
  { id: 7, title: "Happy Patient Smile", category: "Smiles" },
  { id: 8, title: "Pediatric Care Corner", category: "Clinic" }
];

export const testimonialsData = [
  { id: 1, name: "Rahul Joshi", treatment: "RCT (Root Canal) Treatment", rating: 5, comment: "Had severe tooth pain last week. Dr. Nikhil completed the root canal smoothly with minimal pain. Really relieved with the treatment." },
  { id: 2, name: "Priya Jadhav", treatment: "Teeth Cleaning & Scaling", rating: 5, comment: "Very clean clinic near Gandhi Statue. The doctor explained everything nicely and took good care during scaling." },
  { id: 3, name: "Sanjay Shinde", treatment: "Fixed Prosthodontics", rating: 5, comment: "Got a crown fitted after my treatment. Fitting is comfortable and feels completely natural. Friendly staff too." },
  { id: 4, name: "Archana Gawali", treatment: "General Consultation", rating: 5, comment: "Visited with my mother for routine checkup. Honest advice and no unnecessary procedures suggested. Very satisfied." },
  { id: 5, name: "Amit Deshmukh", treatment: "RCT (Root Canal) Surgery", rating: 5, comment: "Doctor Nikhil is calm and experienced. Had my root canal surgery done without any stress or complications." }
];

export const faqData = [
  {
    question: "Do I need to visit a hospital for a mild viral infection?",
    answer: "It is not necessary to visit a hospital for a mild infection. You can visit any general physician's clinic near your home to get treatment. If the infection is major, the doctor will refer you to a hospital."
  },
  {
    question: "Where is Kalpana Multispecility Dental Clinic located in Shirdi?",
    answer: "Kalpana Multispecility Dental Clinic in Kopargaon Bet, Shirdi is easy to reach. It is located Gandhi Statue Near Sudesh Picture Palace."
  },
  {
    question: "Do I need an appointment before visiting Kalpana Multispecility Dental Clinic?",
    answer: "Yes, it is recommended to book an appointment before visiting Kalpana Multispecility Dental Clinic. You can scroll up to get the contact number."
  },
  {
    question: "Are there special clinics for skin infections?",
    answer: "Yes, there are skin care clinics with certified dermatologists who treat skin infections and other skin-related issues."
  },
  {
    question: "Is there a blood test facility available at Kalpana Multispecility Dental Clinic?",
    answer: "While some clinics offer blood testing facility, it is best to confirm the same with Kalpana Multispecility Dental Clinic."
  },
  {
    question: "How can I contact Kalpana Multispecility Dental Clinic in Kopargaon Bet, Shirdi?",
    answer: "You can contact Kalpana Multispecility Dental Clinic in Kopargaon Bet directly through the contact details available above for enquiries."
  }
];

// In-memory store for appointments and contact inquiries submitted via API
export const appointmentsStore = [];
export const contactInquiriesStore = [];
