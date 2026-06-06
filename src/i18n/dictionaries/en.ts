import type { Dictionary } from "./tr";

const en: Dictionary = {
  meta: {
    siteName: "Borsan Teknoloji",
    tagline: "CNC Machine Tools",
    titleSuffix: "Borsan Teknoloji",
  },
  nav: {
    home: "Home",
    products: "Products",
    about: "About",
    service: "Service",
    contact: "Contact",
    getQuote: "Get a Quote",
  },
  common: {
    getQuote: "Get a Quote",
    requestQuote: "Request a Quote",
    viewAllProducts: "View All Products",
    exploreCategory: "Explore Category",
    viewDetails: "View Details",
    downloadCatalog: "Download Catalog (PDF)",
    readMore: "Read More",
    backToProducts: "Back to Products",
    backToCategory: "Back to Category",
    home: "Home",
    products: "Products",
    technicalSpecs: "Technical Specifications",
    productFeatures: "Product Features",
    highlights: "Highlights",
    gallery: "Gallery",
    catalog: "Catalog",
    relatedProducts: "Related Products",
    inThisCategory: "In this category",
    machineCount: "models",
    callUs: "Call Us",
    emailUs: "Email Us",
  },
  hero: {
    eyebrow: "CNC Machine Tools · Engineering · Service",
    titleLine1: "The Industrial Power",
    titleLine2: "of Precision",
    subtitle:
      "From CNC lathes to vertical and horizontal machining centers, grinding and gear-profile grinding machines — machine-tool solutions that advance your production, with uninterrupted service for every machine you buy from us.",
    ctaPrimary: "Explore Products",
    ctaSecondary: "Get a Quote",
    stat1Value: "30+",
    stat1Label: "Years of industry experience",
    stat2Value: "7",
    stat2Label: "Machine categories",
    stat3Value: "100%",
    stat3Label: "After-sales service",
    slides: [
      {
        image: "/hero/hero.svg",
        href: "/urunler",
        eyebrow: "CNC Machine Tools · Engineering · Service",
        titleLine1: "The Industrial Power",
        titleLine2: "of Precision",
        subtitle:
          "From CNC lathes to vertical and horizontal machining centers, grinding and gear-profile grinding machines — machine-tool solutions that advance your production, with uninterrupted service for every machine you buy from us.",
      },
      {
        image: "/categories/cnc-tornalar.svg",
        href: "/urunler/cnc-tornalar",
        eyebrow: "CNC Lathes · High Torque",
        titleLine1: "Micron-Level",
        titleLine2: "Turning Power",
        subtitle:
          "From serial production to single-part manufacturing — cut your cycle times and boost productivity with high-speed, rigid, live-tooling CNC turning solutions.",
      },
      {
        image: "/categories/disli-taslama.svg",
        href: "/urunler/disli-profil-taslama",
        eyebrow: "Grinding · Gear Profile Grinding",
        titleLine1: "Flawless Surfaces,",
        titleLine2: "Repeatable Quality",
        subtitle:
          "Machine-tool technologies delivering DIN-class precision and long-term stability across cylindrical, surface and gear-profile grinding applications.",
      },
      {
        image: "/hero/swiss-type-v2.jpg",
        href: "/urunler/cnc-kayar-otomatlar",
        eyebrow: "CNC Swiss Type Lathes · Serial Production",
        titleLine1: "Maximum Speed on",
        titleLine2: "Small-Diameter Parts",
        subtitle:
          "Micron-accurate, high-speed and uninterrupted serial production with Swiss-type lathes; guide-bushing technology for a complete finished part in a single setup.",
      },
    ],
  },
  categories: {
    eyebrow: "Product Families",
    title: "The Right Machine for Every Application",
    subtitle:
      "We define the ideal machine for your part geometry, tolerances and production volume — together with an engineering approach.",
  },
  advantages: {
    eyebrow: "Why Borsan",
    title: "We Deliver a Production Solution, Not Just a Machine",
    subtitle:
      "From machine selection to commissioning, operator training to spare parts — we are with you across the entire process.",
    items: [
      {
        title: "Engineering Consultancy",
        text: "We analyze your part and production goals, then recommend the right machine and configuration.",
      },
      {
        title: "Precision & Repeatability",
        text: "Rigid machine structures delivering micron-level tolerances and long-term stability.",
      },
      {
        title: "Commissioning & Training",
        text: "Installation, calibration and operator training so your machine runs at full capacity from day one.",
      },
      {
        title: "Guaranteed After-Sales Service",
        text: "Uninterrupted technical service and spare-part support for customers who buy machines from us.",
      },
    ],
  },
  references: {
    eyebrow: "Trust",
    title: "A Solution Partner the Industry Relies On",
    subtitle:
      "We build long-lasting partnerships with manufacturers across automotive, defense, energy and general production.",
    placeholder: "Reference logo",
  },
  cta: {
    title: "Let's define the right machine for your production together",
    subtitle:
      "Share your part and production goals with us; our engineering team will prepare the most suitable solution and quotation.",
    primary: "Get a Quote",
    secondary: "Contact Us",
  },
  productsPage: {
    eyebrow: "Product Catalog",
    title: "CNC Machine Tools",
    subtitle:
      "Six core machine families with solutions for every production need. Select a category and explore the models.",
  },
  categoryPage: {
    modelsTitle: "Models",
    noProducts: "Models for this category are coming soon. Please contact us for details.",
  },
  productPage: {
    requestQuoteTitle: "Request a Quote for This Model",
    requestQuoteText:
      "Fill in the form for configuration, delivery and pricing; our team will get back to you shortly.",
    catalogTitle: "Technical Catalog",
    catalogText: "Download the catalog for full technical details, drawings and the option list.",
    specsNote: "Technical values may vary depending on the model and configuration.",
  },
  quoteForm: {
    title: "Quote Form",
    name: "Full Name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    product: "Product of Interest",
    message: "Your Message",
    messagePlaceholder: "Briefly describe your part, material, production volume and expectations.",
    submit: "Send Quote Request",
    consent: "By submitting this form, I agree to my information being processed for quotation purposes.",
    successTitle: "Your request has been received",
    successText: "We will contact you shortly. (This is a prototype form; no data is sent.)",
    required: "Required field",
  },
  about: {
    eyebrow: "About Us",
    title: "Production Power Shaped by Engineering",
    intro:
      "Borsan Teknoloji is an engineering and sales organization providing end-to-end CNC machine-tool solutions. We don't just sell machines; we build solutions that make your production more efficient, precise and sustainable.",
    missionTitle: "Our Mission",
    missionText:
      "To bring world-class machine-tool technologies to industry, supported by strong engineering and service, and to increase our customers' competitiveness.",
    visionTitle: "Our Vision",
    visionText:
      "To be the first solution partner that comes to mind in metal-cutting manufacturing, known for reliability and technical competence.",
    valuesTitle: "Our Values",
    values: [
      { title: "Engineering First", text: "We start every project with technical analysis." },
      { title: "Trust", text: "We back our word with the service we sell." },
      { title: "Continuity", text: "We invest in long-term partnerships." },
      { title: "Precision", text: "For us, a micron is a standard, not a detail." },
    ],
    statsTitle: "Borsan in Numbers",
    stats: [
      { value: "30+", label: "Years of experience" },
      { value: "500+", label: "Machines commissioned" },
      { value: "7", label: "Machine categories" },
      { value: "100%", label: "Customer-dedicated service" },
    ],
  },
  service: {
    eyebrow: "Service",
    title: "Full After-Sales Support",
    intro:
      "Our service is exclusive to customers who purchase machines from us. Our goal is to keep every machine we sell running at peak efficiency throughout its lifetime.",
    note: "Important: Service is offered only to customers who purchase machines from Borsan Teknoloji.",
    items: [
      {
        title: "Installation & Commissioning",
        text: "Machine placement, calibration and getting it production-ready.",
      },
      {
        title: "Periodic Maintenance",
        text: "Minimize breakdown risk with planned maintenance programs.",
      },
      {
        title: "Spare Parts Supply",
        text: "Fast access to original spare parts and consumables.",
      },
      {
        title: "Operator Training",
        text: "Training so your team uses the machine safely and efficiently.",
      },
      {
        title: "Breakdown Response",
        text: "Fast diagnosis and resolution with an expert technical team.",
      },
      {
        title: "Remote Support",
        text: "Remote intervention for control-unit and software-related issues.",
      },
    ],
    ctaTitle: "Is your machine from Borsan?",
    ctaText: "Contact us for your service request; our technical team is here to help.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in Touch",
    intro:
      "Reach us through the channels below for quotes, technical consultancy or service requests.",
    addressTitle: "Address",
    address: "Organized Industrial Zone, Sample St. No: 1\nTürkiye",
    phoneTitle: "Phone",
    phone: "+90 (000) 000 00 00",
    emailTitle: "Email",
    email: "info@borsanteknoloji.com",
    hoursTitle: "Working Hours",
    hours: "Monday – Friday: 08:30 – 18:00",
    formTitle: "Send a Message",
    mapPlaceholder: "Map area",
  },
  footer: {
    about:
      "Sales and engineering solutions for CNC machine tools. Uninterrupted service support for every machine we sell.",
    productsTitle: "Products",
    companyTitle: "Company",
    contactTitle: "Contact",
    rights: "All rights reserved.",
    prototypeNote: "This site is a prototype. Content and images are representative.",
  },
};

export default en;
