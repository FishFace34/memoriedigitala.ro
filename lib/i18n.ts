// Internationalization configuration
export const languages = {
  ro: 'Română',
  en: 'English',
};

export type Locale = keyof typeof languages;

export const defaultLocale: Locale = 'ro';

// Translation strings
export const translations = {
  ro: {
    // Navigation
    nav: {
      home: 'Acasă',
      faq: 'Întrebări',
      contact: 'Contact',
      orderNow: 'Comandă Acum',
    },
    // Homepage
    home: {
      tagline: 'Colectează toate amintirile cu un singur cod QR',
      title: 'Toate amintirile evenimentului tău, într-un singur loc.',
      description: 'Colectează fără efort toate fotografiile, videoclipurile și mesajele de la invitați cu un singur cod QR. Fără aplicații, fără înregistrări.',
      cta: 'Creează Comanda Acum',
      demo: 'Vezi Demo',
      howItWorks: 'Cum Funcționează?',
      inSteps: 'În 3 pași simpli',
      simple: 'Simplu, rapid și elegant',
      step1: 'Comandă Pachetul',
      step1Desc: 'Alege pachetul și completează datele evenimentului tău.',
      step2: 'Distribuie Codul QR',
      step2Desc: 'Distribuie QR codul sau linkul invitaților tăi.',
      step3: 'Colectează Amintirile',
      step3Desc: 'Primești toate fotografiile și videoclipurile într-un singur loc.',
      packageTitle: 'Cutia cu Amintiri Digitale',
      packageDesc: 'Păstrează și împărtășește digital amintirile de la evenimentul tău.',
      features: {
        access: 'Acces timp de 12 luni',
        unlimited: 'Încărcări nelimitate de fotografii/video',
        templates: '8 șabloane de design pentru carduri QR',
        download: 'Descărcare în masă a conținutului',
        support: 'Suport tehnic',
      },
      oldPrice: '1190',
      newPrice: '950',
      currency: 'RON',
      offerNote: 'Ofertă Limită',
      orderNote: 'Comandă simplă în 2 minute',
      faqTitle: 'Întrebări Frecvente',
      faqSubtitle: 'Găsește răspunsuri la întrebările tale',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      faq: 'FAQ',
      contact: 'Contact',
      orderNow: 'Order Now',
    },
    // Homepage
    home: {
      tagline: 'Collect all memories with a single QR code',
      title: 'All your event memories, in one place.',
      description: 'Effortlessly collect all photos, videos and messages from guests with a single QR code. No apps, no registration.',
      cta: 'Create Order Now',
      demo: 'See Demo',
      howItWorks: 'How It Works?',
      inSteps: 'In 3 simple steps',
      simple: 'Simple, fast and elegant',
      step1: 'Order Package',
      step1Desc: 'Choose the package and fill in your event details.',
      step2: 'Share QR Code',
      step2Desc: 'Share the QR code or link with your guests.',
      step3: 'Collect Memories',
      step3Desc: 'Get all photos and videos in one place.',
      packageTitle: 'Digital Memory Box',
      packageDesc: 'Save and share event memories digitally.',
      features: {
        access: '12 months access',
        unlimited: 'Unlimited photo/video uploads',
        templates: '8 QR card design templates',
        download: 'Bulk content download',
        support: 'Technical support',
      },
      oldPrice: '1190',
      newPrice: '950',
      currency: 'RON',
      offerNote: 'Limited Offer',
      orderNote: 'Order in 2 minutes',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Find answers to your questions',
    },
  },
};

export function getTranslations(locale: Locale = defaultLocale) {
  return translations[locale];
}








