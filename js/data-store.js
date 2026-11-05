/**
 * Data Store & CMS Engine for Dynamic Portfolio
 * Handles persistence via localStorage, reactive events, export/import, and fallback defaults.
 */

const STORAGE_KEY = 'dawnie_portfolio_cms_v1';

export const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Dawnie Pratama",
    role: "Fullstack Web Developer & UI/UX Designer",
    tagline: "Merancang antarmuka digital bernilai estetika tinggi dengan pondasi rekayasa perangkat lunak yang kokoh & skalabel.",
    bio: "Halo! Saya seorang developer & desainer yang percaya bahwa perangkat lunak terbaik lahir dari pertemuan antara estetika tipografi yang presisi dan arsitektur kode yang bersih. Berpengalaman lebih dari 5 tahun membangun aplikasi web interaktif, design system terstruktur, hingga ekosistem backend berkinerja tinggi untuk brand lokal dan startup internasional.",
    statusBadge: "Tersedia untuk Proyek Baru & Kolaborasi (Q2 2026)",
    location: "Jakarta, Indonesia (Bisa Remote / On-site)",
    yearsExperience: "4+",
    completedProjects: "38+ Proyek",
    satisfactionRate: "99.4%",
    stats: [
      { id: "stat-1", number: "4+", label: "Pengalaman Industri", visible: true },
      { id: "stat-2", number: "38+ Proyek", label: "Proyek Terselesaikan", visible: true },
      { id: "stat-3", number: "99.4%", label: "Kepuasan Klien", visible: true }
    ],
    heroCta: {
      primaryText: "Mulai Diskusi Proyek",
      primaryUrl: "#contact",
      primaryVisible: true,
      secondaryText: "Jelajahi Karya Terpilih ↓",
      secondaryUrl: "#projects",
      secondaryVisible: true
    },
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    resumeUrl: "#",
    ctaText: "Mulai Diskusi Proyek",
    email: "dawnie.pratama@studio.id",
    phone: "+62 812-3456-7890"
  },
  projectCategories: [
    { id: "all", label: "Semua Karya" },
    { id: "fullstack", label: "Fullstack & Web" },
    { id: "saas", label: "Product & SaaS" },
    { id: "creative", label: "Creative & Audio" }
  ],
  theme: {
    accentColor: "#d4a373", // Warm champagne gold
    accentHover: "#c28f5c",
    fontPairing: "editorial", // editorial | modern-minimal | technical
    mode: "dark", // dark | light
    noiseTexture: true
  },
  layout: {
    sections: {
      hero: true,
      services: true,
      projects: true,
      skills: true,
      experience: true,
      testimonials: true,
      contact: true
    },
    components: {
      statusBadge: true,
      heroTagline: true,
      heroBio: true,
      heroCtaPrimary: true,
      heroCtaSecondary: true,
      heroStats: true,
      heroVisualCard: true,
      navCtaBtn: true,
      themeToggle: true,
      contactForm: true,
      directEmailCard: true
    },
    headings: {
      services: {
        label: "Filosofi & Kapabilitas",
        title: "Rekayasa presisi tinggi berpadu dengan sentuhan artistik",
        subtitle: "Setiap solusi digital dibangun dengan mempertimbangkan pengalaman pengguna yang intuitif, kecepatan waktu muat, dan skalabilitas kode jangka panjang."
      },
      projects: {
        label: "Karya Terpilih",
        title: "Eksplorasi proyek nyata dengan dampak terukur",
        subtitle: "Klik pada setiap proyek untuk membaca studi kasus lengkap mengenai tantangan, arsitektur teknis, dan hasil yang dicapai."
      },
      skills: {
        label: "Tech Stack & Disiplin",
        title: "Peralatan kerja & keahlian teknis teruji",
        subtitle: "Kombinasi modern antara rekayasa perangkat lunak modern dan metodologi perancangan produk digital standar industri global."
      },
      experience: {
        label: "Jejak Langkah Profesional",
        title: "Riwayat dedikasi & pencapaian karir",
        subtitle: "Pengalaman mendalam bekerja sama dengan startup tahap awal, agensi kreatif, hingga enterprise berskala besar."
      },
      testimonials: {
        label: "Kata Mereka",
        title: "Kolaborasi yang berakar pada kepercayaan & kualitas",
        subtitle: "Apa yang dikatakan oleh para pendiri perusahaan, rekan engineer, dan klien mengenai ritme kerja dan hasil akhir yang dihadirkan."
      },
      contact: {
        label: "Mari Terhubung",
        title: "Mari wujudkan ide digital Anda bersama",
        subtitle: "Punya proyek menarik, ide produk baru, atau ingin berdiskusi seputar web architecture & UI/UX? Pintu saya selalu terbuka."
      }
    }
  },
  services: [
    {
      id: "srv-1",
      number: "01",
      title: "Fullstack Web Engineering",
      tagline: "Performa Cepat, Arsitektur Bersih & Skalabel",
      description: "Membangun aplikasi web end-to-end dari frontend modern yang responsif hingga database & API yang tangguh, aman, dan siap menangani ribuan pengguna.",
      deliverables: ["Single Page & SSR Apps (React / Vue / Node)", "REST & GraphQL API Architecture", "Database Schema Optimization & Cloud Deploy", "Fast Loading & Core Web Vitals < 1s"]
    },
    {
      id: "srv-2",
      number: "02",
      title: "UI/UX & Design Systems",
      tagline: "Pengalaman Intuitif dengan Estetika Editorial",
      description: "Merancang alur pengguna (user journey) yang memikat, prototipe interaktif di Figma, serta design system modular yang siap diimplementasikan developer tanpa friksi.",
      deliverables: ["Figma Design System & Token Library", "Wireframing & Interactive Micro-prototypes", "UX Research, Usability Testing & Audit", "Aksesibilitas (WCAG AA) & Responsif Mobile-First"]
    },
    {
      id: "srv-3",
      number: "03",
      title: "Creative Development & Interaction",
      tagline: "Mikro-Interaksi Halus & Animasi Berkarakter",
      description: "Menghidupkan ide desain dengan transisi halus, kanvas interaktif, dan animasi berorientasi performa yang memberi sentuhan eksklusif pada web Anda.",
      deliverables: ["Smooth Micro-Interactions & Hover Physics", "Custom CSS Keyframes & View Transitions", "Canvas & SVG Data Visualization", "Sensasi Brand yang Berkelas & Elegan"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Kolektif — Platform Kurasi Desain & Kriya Nusantara",
      slug: "kolektif-craft-platform",
      category: "Fullstack & UI/UX",
      categoryFilter: "fullstack",
      year: "2025",
      client: "Yayasan Kriya Budaya",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
      shortDescription: "Platform e-commerce & katalog interaktif untuk 120+ pengrajin lokal dengan arsitektur headless checkout dan waktu muat di bawah 0.8 detik.",
      challenge: "Pengrajin kriya lokal kesulitan menampilkan keunikan material dan nilai sejarah produk mereka di platform e-commerce generik yang monoton dan lambat.",
      solution: "Merancang antarmuka bergaya editorial majalah dengan visual full-bleed, filter berbasis bahan kriya, dan sistem checkout instan tanpa login rumit.",
      impact: "Meningkatkan durasi rata-rata sesi pengguna sebesar 185% dan mencatat lebih dari Rp 1.4 Miliar transaksi di kuartal pertama.",
      tags: ["React", "Node.js", "PostgreSQL", "Figma", "Stripe API"],
      demoUrl: "https://example.com/kolektif",
      githubUrl: "https://github.com/example/kolektif"
    },
    {
      id: "proj-2",
      title: "ArchFlow — Studio Management OS for Architects",
      slug: "archflow-saas",
      category: "Product Design & SaaS",
      categoryFilter: "saas",
      year: "2025",
      client: "Atelier Studio Lab",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      shortDescription: "Sistem operasi terpadu bagi biro arsitektur untuk memantau blueprint, progres lapangan, revisi klien, dan estimasi biaya secara real-time.",
      challenge: "Komunikasi antara arsitek, drafter, dan kontraktor sering tercecer di puluhan grup chat dan spreadsheet yang rentan salah revisi.",
      solution: "Membangun kanban interaktif dengan viewer blueprint SVG interaktif, manajemen dokumen berbasis versi, dan dashboard biaya transparan.",
      impact: "Menghemat 14 jam kerja administratif per proyek dan diadopsi oleh 18 biro arsitek di Asia Tenggara.",
      tags: ["TypeScript", "Next.js", "Tailwind CSS", "Canvas API", "Supabase"],
      demoUrl: "https://example.com/archflow",
      githubUrl: "https://github.com/example/archflow"
    },
    {
      id: "proj-3",
      title: "Svara — Streaming Audio & Arsip Cerita Tradisi",
      slug: "svara-audio-app",
      category: "Mobile Web & Audio",
      categoryFilter: "creative",
      year: "2024",
      client: "Inisiatif Suara Nusantara",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      shortDescription: "Web player audio beresolusi tinggi dengan visualizer spektrum gelombang suara real-time dan kurasi cerita lisan nusantara.",
      challenge: "Menghadirkan pengalaman audio imersif di peramban seluler tanpa lagging atau konsumsi baterai yang boros.",
      solution: "Mengoptimalkan Web Audio API dan kanvas hardware-accelerated dengan antarmuka bertema warm charcoal yang nyaman di mata.",
      impact: "Mencatat 45.000 pendengar aktif bulanan dengan bounce rate rendah di angka 12%.",
      tags: ["Web Audio API", "HTML5 Canvas", "Vue 3", "Node.js", "Redis"],
      demoUrl: "https://example.com/svara",
      githubUrl: "https://github.com/example/svara"
    },
    {
      id: "proj-4",
      title: "Aethelgard — Minimalist Timepiece Atelier",
      slug: "aethelgard-luxury",
      category: "Design System & E-Commerce",
      categoryFilter: "fullstack",
      year: "2024",
      client: "Aethelgard Horology",
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      shortDescription: "Situs eksklusif jam tangan mewah dengan konfigurator material 360 derajat dan tipografi editorial berskala micro.",
      challenge: "Menampilkan presisi mekanik jam tangan mewah tanpa membuat calon pembeli merasa sedang membuka toko online biasa.",
      solution: "Mengombinasikan tata letak asimetris, mikro-animasi scroll, dan konfigurator tali kulit interaktif langsung di browser.",
      impact: "Meningkatkan permohonan temu janji butik fisik sebesar 240% dalam 6 bulan peluncuran.",
      tags: ["Vanilla JS", "WebGL", "Figma Token", "CSS Architecture"],
      demoUrl: "https://example.com/aethelgard",
      githubUrl: "https://github.com/example/aethelgard"
    }
  ],
  skills: [
    {
      category: "Frontend Architecture & Web",
      items: [
        { name: "JavaScript (ESNext) / TypeScript", level: "Mahir", badge: "Core" },
        { name: "HTML5 & Web Semantik", level: "Pakar", badge: "Markup" },
        { name: "Tailwind CSS & Modern Styling", level: "Pakar", badge: "Styling" },
        { name: "React, Next.js & Vue.js", level: "Mahir", badge: "Framework" },
        { name: "Modern CSS, Tokens & Glassmorphism", level: "Pakar", badge: "Styling" },
        { name: "Web Performance & Core Web Vitals", level: "Mahir", badge: "Optim" },
        { name: "Canvas, SVG & Micro-Interactions", level: "Mahir", badge: "Creative" }
      ]
    },
    {
      category: "Backend, Frameworks & Database",
      items: [
        { name: "PHP & Laravel Framework", level: "Mahir", badge: "Backend" },
        { name: "PostgreSQL & MySQL Database", level: "Mahir", badge: "Database" },
        { name: "Node.js, Express & Fastify", level: "Mahir", badge: "Runtime" },
        { name: "RESTful APIs & WebSockets Real-time", level: "Mahir", badge: "API" }
      ]
    },
    {
      category: "UI/UX & Interactive Design",
      items: [
        { name: "Figma & App Design (UI/UX)", level: "Pakar", badge: "Design" },
        { name: "Analisis Kebutuhan Sistem & Pengguna", level: "Mahir", badge: "Analysis" },
        { name: "Design System Architecture", level: "Pakar", badge: "System" },
        { name: "Game Design & Development", level: "Mahir", badge: "Creative" },
        { name: "User Journey & Interactive Prototyping", level: "Mahir", badge: "Prototype" },
        { name: "Aksesibilitas (WCAG 2.1 AA Standards)", level: "Mahir", badge: "A11y" }
      ]
    },
    {
      category: "DevOps, Version Control & Security",
      items: [
        { name: "Git & GitHub (Version Control)", level: "Mahir", badge: "VCS" },
        { name: "Keamanan Informasi & Kerahasiaan Data", level: "Mahir", badge: "Security" },
        { name: "Docker, Cloud VPS & CI/CD", level: "Kompeten", badge: "DevOps" },
        { name: "Auth & Security (JWT, OAuth2, RBAC)", level: "Mahir", badge: "Security" }
      ]
    },
    {
      category: "Kompetensi Profesional & Soft Skills",
      items: [
        { name: "Problem Solving & Analisis Kritis", level: "Pakar", badge: "Mindset" },
        { name: "Kerja Sama Tim & Komunikasi Efektif", level: "Pakar", badge: "Collab" },
        { name: "Disiplin, Tanggung Jawab & Etika Kerja", level: "Pakar", badge: "Ethics" },
        { name: "Penyusunan Laporan & Dokumentasi Teknis", level: "Mahir", badge: "Docs" },
        { name: "Tata Kelola, Regulasi & SOP Proyek", level: "Mahir", badge: "Governance" },
        { name: "Adaptif & Cepat Mempelajari Teknologi Baru", level: "Pakar", badge: "Agile" }
      ]
    }
  ],
  experiences: [
    {
      id: "exp-1",
      period: "2023 — Sekarang",
      role: "Lead Fullstack & Product Designer",
      company: "Studio Aksara Digital",
      location: "Jakarta (Hybrid)",
      description: "Memimpin perancangan produk web dari fase riset UX hingga arsitektur kode frontend/backend. Mengembangkan design system yang digunakan oleh 14 engineer dan memangkas waktu delivery fitur hingga 40%."
    },
    {
      id: "exp-2",
      period: "2021 — 2023",
      role: "Senior Frontend Engineer",
      company: "Nusa Finansia Labs",
      location: "Remote",
      description: "Bertanggung jawab atas performa dashboard analitik keuangan dengan ribuan data point real-time. Mengoptimalkan waktu render awal hingga di bawah 1 detik dengan teknik dynamic import dan virtualized list."
    },
    {
      id: "exp-3",
      period: "2019 — 2021",
      role: "UI/UX Designer & Web Developer",
      company: "Karsa Media Studio",
      location: "Bandung",
      description: "Merancang dan membangun 25+ situs interaktif serta landing page komersial berkonversi tinggi untuk berbagai klien ritel, F&B, dan institusi pendidikan."
    }
  ],
  testimonials: [
    {
      id: "testi-1",
      author: "Aditya Wardhana",
      role: "Co-Founder & CEO",
      company: "Atelier Studio Lab",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote: "Bekerja dengan Dawnie adalah pengalaman yang luar biasa. Sangat jarang menemukan talenta yang memahami detail estetika tipografi sekelas desainer senior sekaligus mampu menulis kode backend yang sangat rapi dan kokoh.",
      rating: 5,
      project: "ArchFlow SaaS Platform"
    },
    {
      id: "testi-2",
      author: "Ratna Kusuma",
      role: "Head of Marketing & Brand",
      company: "Yayasan Kriya Budaya",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      quote: "Hasil website Kolektif melampaui ekspektasi dewan kurator kami. Tampilannya sangat elegan, berjiwa seni, dan yang terpenting: tidak terasa kaku atau seperti template buatan AI. Pengunjung kami jatuh cinta sejak pandangan pertama.",
      rating: 5,
      project: "Kolektif Web Platform"
    },
    {
      id: "testi-3",
      author: "Bayu Wicaksono",
      role: "Engineering Director",
      company: "Nusa Finansia Labs",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      quote: "Kecepatan eksekusi dan perhatian terhadap detail aksesibilitas membuat setiap sprint menjadi mulus. Dawnie selalu memikirkan user experience bahkan saat menangani logika state yang rumit.",
      rating: 5,
      project: "Fintech Real-time Dashboard"
    }
  ],
  socialLinks: [
    { name: "GitHub", url: "https://github.com", icon: "github", handle: "@dawniepratama" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", handle: "Dawnie Pratama" },
    { name: "Figma Community", url: "https://figma.com", icon: "figma", handle: "@dawnie" },
    { name: "Dribbble", url: "https://dribbble.com", icon: "dribbble", handle: "dawniestudio" },
    { name: "WhatsApp", url: "https://wa.me/6281234567890", icon: "whatsapp", handle: "+62 812-3456-7890" }
  ],
    contactSettings: {
    heading: "Mari Wujudkan Ide Digital Anda Bersama",
    subheading: "Punya proyek menarik, ide produk baru, atau ingin berdiskusi seputar web architecture & UI/UX? Pintu saya selalu terbuka.",
    availableNotice: "Waktu respons rata-rata: < 24 jam",
    directEmail: "dawnie.pratama@studio.id"
  },
  security: {
    // Default password: dawnie2026
    passwordHash: "a54281dd3a1aa1cd0866a9f174093c66c25bb365e02c3981b0c3f7b7520be051",
    lastChanged: "2026-01-01"
  }
};

/**
 * Hash a plain string with SHA-256 using native browser Web Crypto API
 */
export async function hashString(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify input password against stored SHA-256 hash
 */
export async function verifyMasterPassword(plainPassword) {
  if (!plainPassword) return false;
  const data = getPortfolioData();
  const targetHash = (data.security && data.security.passwordHash) || DEFAULT_PORTFOLIO_DATA.security.passwordHash;
  const computedHash = await hashString(plainPassword.trim());
  return computedHash === targetHash;
}

/**
 * Update master password and persist SHA-256 hash
 */
export async function updateMasterPassword(newPassword) {
  if (!newPassword || newPassword.trim().length < 6) {
    throw new Error("Kata sandi baru minimal harus 6 karakter.");
  }
  const data = getPortfolioData();
  const newHash = await hashString(newPassword.trim());
  data.security = {
    passwordHash: newHash,
    lastChanged: new Date().toISOString().split('T')[0]
  };
  savePortfolioData(data);
  return true;
}

/**
 * Session storage authentication status (locks automatically when browser tab closes)
 */
export function isSessionAuthenticated() {
  const status = sessionStorage.getItem('dawnie_cms_auth');
  if (status === 'locked') return false;
  return true;
}

export function setSessionAuthenticated(auth) {
  if (auth) {
    sessionStorage.setItem('dawnie_cms_auth', 'authenticated_v1');
  } else {
    sessionStorage.setItem('dawnie_cms_auth', 'locked');
  }
}

/**
 * Get current portfolio data from storage, or fallback to defaults
 */
export function getPortfolioData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePortfolioData(DEFAULT_PORTFOLIO_DATA);
      return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    }
    const parsed = JSON.parse(raw);

    // Auto-migrate skills to ensure new skills from user's checklist are automatically merged
    if (parsed._skillsVersion !== 2) {
      if (!parsed.skills || !Array.isArray(parsed.skills)) parsed.skills = [];

      DEFAULT_PORTFOLIO_DATA.skills.forEach(defCat => {
        let existingCat = parsed.skills.find(c => 
          c.category.toLowerCase().includes(defCat.category.split(' ')[0].toLowerCase()) ||
          defCat.category.toLowerCase().includes(c.category.split(' ')[0].toLowerCase())
        );

        if (!existingCat) {
          parsed.skills.push(JSON.parse(JSON.stringify(defCat)));
        } else {
          if (!existingCat.items) existingCat.items = [];
          defCat.items.forEach(defItem => {
            const hasItem = existingCat.items.some(item => 
              item.name.toLowerCase().includes(defItem.name.split(' ')[0].toLowerCase()) ||
              defItem.name.toLowerCase().includes(item.name.split(' ')[0].toLowerCase())
            );
            if (!hasItem) {
              existingCat.items.push(JSON.parse(JSON.stringify(defItem)));
            }
          });
        }
      });

      parsed._skillsVersion = 2;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    // Deep merge with defaults to ensure all required keys exist if schema expanded
    return {
      ...DEFAULT_PORTFOLIO_DATA,
      ...parsed,
      profile: {
        ...DEFAULT_PORTFOLIO_DATA.profile,
        ...(parsed.profile || {}),
        stats: (parsed.profile && Array.isArray(parsed.profile.stats) && parsed.profile.stats.length > 0)
          ? parsed.profile.stats
          : [
              { id: "stat-1", number: parsed.profile?.yearsExperience || "4+", label: "Pengalaman Industri", visible: true },
              { id: "stat-2", number: parsed.profile?.completedProjects || "38+ Proyek", label: "Proyek Terselesaikan", visible: true },
              { id: "stat-3", number: parsed.profile?.satisfactionRate || "99.4%", label: "Kepuasan Klien", visible: true }
            ],
        heroCta: {
          ...DEFAULT_PORTFOLIO_DATA.profile.heroCta,
          ...(parsed.profile?.heroCta || {})
        }
      },
      services: (Array.isArray(parsed.services) && parsed.services.length > 0)
        ? parsed.services
        : DEFAULT_PORTFOLIO_DATA.services,
      projects: (Array.isArray(parsed.projects) && parsed.projects.length > 0)
        ? parsed.projects
        : DEFAULT_PORTFOLIO_DATA.projects,
      skills: (Array.isArray(parsed.skills) && parsed.skills.length > 0)
        ? parsed.skills
        : DEFAULT_PORTFOLIO_DATA.skills,
      experiences: (Array.isArray(parsed.experiences) && parsed.experiences.length > 0)
        ? parsed.experiences
        : DEFAULT_PORTFOLIO_DATA.experiences,
      testimonials: (Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0)
        ? parsed.testimonials
        : DEFAULT_PORTFOLIO_DATA.testimonials,
      projectCategories: (parsed.projectCategories && Array.isArray(parsed.projectCategories) && parsed.projectCategories.length > 0)
        ? parsed.projectCategories
        : DEFAULT_PORTFOLIO_DATA.projectCategories,
      theme: { ...DEFAULT_PORTFOLIO_DATA.theme, ...(parsed.theme || {}) },
      contactSettings: { ...DEFAULT_PORTFOLIO_DATA.contactSettings, ...(parsed.contactSettings || {}) },
      security: { ...DEFAULT_PORTFOLIO_DATA.security, ...(parsed.security || {}) },
      layout: {
        sections: { ...DEFAULT_PORTFOLIO_DATA.layout.sections, ...(parsed.layout?.sections || {}) },
        components: { ...DEFAULT_PORTFOLIO_DATA.layout.components, ...(parsed.layout?.components || {}) },
        headings: {
          services: { ...DEFAULT_PORTFOLIO_DATA.layout.headings.services, ...(parsed.layout?.headings?.services || {}) },
          projects: { ...DEFAULT_PORTFOLIO_DATA.layout.headings.projects, ...(parsed.layout?.headings?.projects || {}) },
          skills: { ...DEFAULT_PORTFOLIO_DATA.layout.headings.skills, ...(parsed.layout?.headings?.skills || {}) },
          experience: { ...DEFAULT_PORTFOLIO_DATA.layout.headings.experience, ...(parsed.layout?.headings?.experience || {}) },
          testimonials: { ...DEFAULT_PORTFOLIO_DATA.layout.headings.testimonials, ...(parsed.layout?.headings?.testimonials || {}) },
          contact: { ...DEFAULT_PORTFOLIO_DATA.layout.headings.contact, ...(parsed.layout?.headings?.contact || {}) }
        }
      }
    };
  } catch (err) {
    console.warn("Failed to read from localStorage, using defaults", err);
    return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  }
}

/**
 * Save updated portfolio data to localStorage and dispatch event
 */
export function savePortfolioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Broadcast custom event so other components or tabs can re-render immediately
    window.dispatchEvent(new CustomEvent('dawnie-data-updated', { detail: data }));
    return true;
  } catch (err) {
    console.error("Error saving portfolio data:", err);
    return false;
  }
}

/**
 * Reset data back to default curated human data
 */
export function resetPortfolioData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    savePortfolioData(DEFAULT_PORTFOLIO_DATA);
    return true;
  } catch (err) {
    console.error("Failed to reset:", err);
    return false;
  }
}

/**
 * Export portfolio data as a downloadable JSON file
 */
export function exportPortfolioJSON() {
  const data = getPortfolioData();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `portofolio-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import portfolio data from a JSON file
 */
export function importPortfolioJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("File tidak ditemukan"));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.profile || !Array.isArray(imported.projects)) {
          throw new Error("Format JSON tidak valid. Pastikan file adalah backup portofolio yang benar.");
        }
        savePortfolioData(imported);
        resolve(imported);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsText(file);
  });
}
