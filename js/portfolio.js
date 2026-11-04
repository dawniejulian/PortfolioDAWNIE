/**
 * Portfolio Client Logic & Dynamic DOM Renderer
 * Connects with data-store to render all content reactively without touching code.
 */

import { getPortfolioData } from './data-store.js';

let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initCursorSpotlight();
  initTheme();
  renderPortfolio();
  initSecretAdminTrigger();

  // Listen to live data changes dispatched by Admin Studio or other tabs
  window.addEventListener('dawnie-data-updated', () => {
    renderPortfolio();
    showToast('Data portofolio diperbarui!');
  });
});

/**
 * Discreet Owner Shortcut to access CMS Studio:
 * - Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
 * - Or 3 consecutive clicks on the brand monogram
 */
function initSecretAdminTrigger() {
  // Keyboard shortcut: Ctrl + Shift + A
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  // Monogram triple-click
  const monogram = document.getElementById('brandMonogram');
  let clickCount = 0;
  let clickTimer = null;

  if (monogram) {
    monogram.addEventListener('click', (e) => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 3) {
        e.preventDefault();
        window.location.href = 'admin.html';
        clickCount = 0;
        return;
      }
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1000);
    });
  }
}

/**
 * Render all sections from the active data store
 */
export function renderPortfolio() {
  const data = getPortfolioData();

  applyThemeSettings(data.theme);
  renderProfile(data.profile);
  renderServices(data.services);
  renderProjects(data.projects);
  renderSkills(data.skills);
  renderExperiences(data.experiences);
  renderTestimonials(data.testimonials);
  renderSocialsAndContact(data.profile, data.socialLinks, data.contactSettings);
}

/**
 * Apply dynamic theme settings from CMS
 */
function applyThemeSettings(theme) {
  if (!theme) return;
  const root = document.documentElement;

  if (theme.accentColor) {
    root.style.setProperty('--accent-gold', theme.accentColor);
    root.style.setProperty('--accent-border', `${theme.accentColor}44`);
    root.style.setProperty('--accent-gold-subtle', `${theme.accentColor}18`);
  }

  if (theme.mode) {
    document.documentElement.setAttribute('data-theme', theme.mode);
  }
}

/**
 * Render Profile & Hero Content
 */
function renderProfile(profile) {
  if (!profile) return;

  // Header
  const brandNameEl = document.getElementById('brandName');
  const brandRoleEl = document.getElementById('brandRole');
  const brandMonogramEl = document.getElementById('brandMonogram');

  if (brandNameEl) brandNameEl.textContent = profile.name || 'Dawnie Pratama';
  if (brandRoleEl) brandRoleEl.textContent = profile.role || 'Fullstack Developer & UI/UX Designer';
  if (brandMonogramEl) {
    const initials = (profile.name || 'DP')
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('');
    brandMonogramEl.textContent = initials;
  }

  // Hero Section
  const statusBadgeText = document.getElementById('statusBadgeText');
  const heroRoleEl = document.getElementById('heroRole');
  const heroTaglineEl = document.getElementById('heroTagline');
  const heroBioEl = document.getElementById('heroBio');
  const heroAvatar = document.getElementById('heroAvatar');
  const heroLocation = document.getElementById('heroLocation');
  const heroCtaBtn = document.getElementById('heroCtaBtn');

  if (statusBadgeText) statusBadgeText.textContent = profile.statusBadge;
  if (heroRoleEl) heroRoleEl.innerHTML = formatHeroRole(profile.role);
  if (heroTaglineEl) heroTaglineEl.textContent = profile.tagline;
  if (heroBioEl) heroBioEl.textContent = profile.bio;
  if (heroAvatar && profile.avatarUrl) heroAvatar.src = profile.avatarUrl;
  if (heroLocation) heroLocation.textContent = profile.location;
  if (heroCtaBtn) heroCtaBtn.textContent = profile.ctaText || 'Mulai Diskusi Proyek';

  // Stats
  const statYears = document.getElementById('statYears');
  const statProjects = document.getElementById('statProjects');
  const statSatisfaction = document.getElementById('statSatisfaction');

  if (statYears) statYears.innerHTML = `${profile.yearsExperience}`;
  if (statProjects) statProjects.innerHTML = `${profile.completedProjects}`;
  if (statSatisfaction) statSatisfaction.innerHTML = `${profile.satisfactionRate}`;
}

function formatHeroRole(roleText) {
  if (!roleText) return 'Fullstack Web <em>Developer</em> &amp; UI/UX <em>Architect</em>';
  // Highlight keywords aesthetically
  return roleText
    .replace('Fullstack', 'Fullstack')
    .replace('Developer', '<span class="highlight">Developer</span>')
    .replace('Designer', '<span class="highlight">Designer</span>')
    .replace('Architect', '<span class="highlight">Architect</span>');
}

/**
 * Render Services & Philosophy
 */
function renderServices(services) {
  const container = document.getElementById('servicesContainer');
  if (!container || !services) return;

  container.innerHTML = services.map(service => `
    <article class="service-card" data-service-id="${service.id}">
      <div class="service-number">${service.number || '01'} // SERVICES</div>
      <h3 class="service-title">${escapeHTML(service.title)}</h3>
      <div class="service-tagline">${escapeHTML(service.tagline)}</div>
      <p class="service-description">${escapeHTML(service.description)}</p>
      <ul class="service-deliverables">
        ${(service.deliverables || []).map(item => `<li>${escapeHTML(item)}</li>`).join('')}
      </ul>
    </article>
  `).join('');
}

/**
 * Render Projects Showcase with Filtering & Dialog Details
 */
function renderProjects(projects) {
  const container = document.getElementById('projectsContainer');
  const filterContainer = document.getElementById('projectsFilter');
  if (!container || !projects) return;

  // Filter Buttons
  if (filterContainer) {
    const categories = [
      { id: 'all', label: 'Semua Karya' },
      { id: 'fullstack', label: 'Fullstack & Web' },
      { id: 'saas', label: 'Product & SaaS' },
      { id: 'creative', label: 'Creative & Audio' }
    ];

    filterContainer.innerHTML = categories.map(cat => `
      <button class="filter-btn ${activeCategory === cat.id ? 'active' : ''}" data-filter="${cat.id}">
        ${cat.label}
      </button>
    `).join('');

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeCategory = e.currentTarget.getAttribute('data-filter');
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderProjects(projects);
      });
    });
  }

  // Filtered List
  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.categoryFilter === activeCategory || (p.category && p.category.toLowerCase().includes(activeCategory)));

  container.innerHTML = filtered.map(proj => `
    <div class="project-card" data-project-id="${proj.id}">
      <div class="project-thumb-box">
        <img class="project-thumb" src="${proj.coverImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'}" alt="${escapeHTML(proj.title)}" loading="lazy">
        <span class="project-overlay-badge">${escapeHTML(proj.year || '2025')}</span>
      </div>
      <div class="project-content">
        <div class="project-meta-line">
          <span class="project-category">${escapeHTML(proj.category)}</span>
          <span class="project-client">${escapeHTML(proj.client || 'Klien Konfidensial')}</span>
        </div>
        <h3 class="project-title">${escapeHTML(proj.title)}</h3>
        <p class="project-desc">${escapeHTML(proj.shortDescription)}</p>
        <div class="project-tags-row">
          ${(proj.tags || []).map(tag => `<span class="tag-pill">${escapeHTML(tag)}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Attach modal trigger
  container.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projId = card.getAttribute('data-project-id');
      const targetProj = projects.find(p => p.id === projId);
      if (targetProj) openProjectModal(targetProj);
    });
  });
}

/**
 * Open Project Case Study Dialog (with Multi-Image Interactive Gallery Carousel)
 */
function openProjectModal(project) {
  const dialog = document.getElementById('projectDialog');
  if (!dialog) return;

  const heroImg = document.getElementById('dialogHeroImg');
  const title = document.getElementById('dialogTitle');
  const clientLine = document.getElementById('dialogClientLine');
  const tagsRow = document.getElementById('dialogTags');
  const challenge = document.getElementById('dialogChallenge');
  const solution = document.getElementById('dialogSolution');
  const impact = document.getElementById('dialogImpact');
  const demoLink = document.getElementById('dialogDemoLink');
  const githubLink = document.getElementById('dialogGithubLink');

  const prevBtn = document.getElementById('dialogPrevImgBtn');
  const nextBtn = document.getElementById('dialogNextImgBtn');
  const counter = document.getElementById('dialogImgCounter');
  const strip = document.getElementById('dialogThumbnailsStrip');

  // Multi-image gallery list
  const gallery = Array.isArray(project.gallery) && project.gallery.length
    ? project.gallery
    : (project.coverImage ? [project.coverImage] : []);

  let activeImgIndex = 0;

  function setModalImage(idx) {
    if (!gallery.length) return;
    activeImgIndex = (idx + gallery.length) % gallery.length;
    if (heroImg) heroImg.src = gallery[activeImgIndex];

    if (counter) {
      counter.textContent = `${activeImgIndex + 1} / ${gallery.length}`;
    }

    if (strip) {
      strip.querySelectorAll('.dialog-thumb-pill').forEach((pill, pIdx) => {
        pill.classList.toggle('active', pIdx === activeImgIndex);
      });
    }
  }

  // Setup gallery controls if multiple images exist
  if (gallery.length > 1) {
    if (prevBtn) {
      prevBtn.style.display = 'grid';
      prevBtn.onclick = (e) => {
        e.stopPropagation();
        setModalImage(activeImgIndex - 1);
      };
    }
    if (nextBtn) {
      nextBtn.style.display = 'grid';
      nextBtn.onclick = (e) => {
        e.stopPropagation();
        setModalImage(activeImgIndex + 1);
      };
    }
    if (counter) counter.style.display = 'block';

    if (strip) {
      strip.style.display = 'flex';
      strip.innerHTML = gallery.map((imgUrl, i) => `
        <div class="dialog-thumb-pill ${i === 0 ? 'active' : ''}" data-idx="${i}">
          <img src="${imgUrl}" alt="Thumbnail ${i + 1}">
        </div>
      `).join('');

      strip.querySelectorAll('.dialog-thumb-pill').forEach(pill => {
        pill.onclick = (e) => {
          e.stopPropagation();
          const idx = parseInt(pill.getAttribute('data-idx'), 10);
          setModalImage(idx);
        };
      });
    }
  } else {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (counter) counter.style.display = 'none';
    if (strip) strip.style.display = 'none';
  }

  setModalImage(0);

  if (title) title.textContent = project.title;
  if (clientLine) clientLine.textContent = `${project.client} • Tahun ${project.year || '2025'} • ${project.category}`;
  if (tagsRow) {
    tagsRow.innerHTML = (project.tags || []).map(t => `<span class="tag-pill">${escapeHTML(t)}</span>`).join('');
  }
  if (challenge) challenge.textContent = project.challenge || project.shortDescription;
  if (solution) solution.textContent = project.solution || 'Pendekatan berfokus pada arsitektur modular dan estetika yang konsisten.';
  if (impact) impact.textContent = project.impact || 'Meningkatkan kepuasan pengguna dan performa sistem.';

  if (demoLink) {
    if (project.demoUrl && project.demoUrl !== '#') {
      demoLink.href = project.demoUrl;
      demoLink.style.display = 'inline-flex';
    } else {
      demoLink.style.display = 'none';
    }
  }

  if (githubLink) {
    if (project.githubUrl && project.githubUrl !== '#') {
      githubLink.href = project.githubUrl;
      githubLink.style.display = 'inline-flex';
    } else {
      githubLink.style.display = 'none';
    }
  }

  dialog.showModal();
}

// Close dialog handler
document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('projectDialog');
  const closeBtn = document.getElementById('dialogCloseBtn');
  if (closeBtn && dialog) {
    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }
});

/**
 * Render Skills Matrix
 */
function renderSkills(skillsData) {
  const container = document.getElementById('skillsContainer');
  if (!container || !skillsData) return;

  container.innerHTML = skillsData.map(group => `
    <div class="skill-category-box">
      <h3 class="category-name">${escapeHTML(group.category)}</h3>
      <div class="skills-list">
        ${(group.items || []).map(item => `
          <div class="skill-row">
            <span class="skill-name">${escapeHTML(item.name)}</span>
            <div class="skill-badge-group">
              <span class="skill-badge">${escapeHTML(item.badge || 'Tech')}</span>
              <span class="skill-level">${escapeHTML(item.level || 'Kompeten')}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * Render Experience & Milestones Timeline
 */
function renderExperiences(experiences) {
  const container = document.getElementById('experienceContainer');
  if (!container || !experiences) return;

  container.innerHTML = experiences.map(exp => `
    <div class="exp-item">
      <div class="exp-node"></div>
      <div class="exp-period">${escapeHTML(exp.period)}</div>
      <div class="exp-role-line">
        <h4 class="exp-role">${escapeHTML(exp.role)}</h4>
        <span class="exp-company">@ ${escapeHTML(exp.company)}</span>
        <span class="exp-location">• ${escapeHTML(exp.location || 'Indonesia')}</span>
      </div>
      <p class="exp-desc">${escapeHTML(exp.description)}</p>
    </div>
  `).join('');
}

/**
 * Render Client Testimonials
 */
function renderTestimonials(testimonials) {
  const container = document.getElementById('testimonialsContainer');
  if (!container || !testimonials) return;

  container.innerHTML = testimonials.map(testi => `
    <article class="testi-card">
      <div>
        <div class="testi-stars">${'★'.repeat(testi.rating || 5)}</div>
        <p class="testi-quote">"${escapeHTML(testi.quote)}"</p>
      </div>
      <div class="testi-author-box">
        <img class="testi-avatar" src="${testi.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" alt="${escapeHTML(testi.author)}" loading="lazy">
        <div>
          <div class="testi-name">${escapeHTML(testi.author)}</div>
          <div class="testi-role">${escapeHTML(testi.role)} — ${escapeHTML(testi.company)}</div>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Render Social Links & Contact Details
 */
function renderSocialsAndContact(profile, socialLinks, contactSettings) {
  const directEmailVal = document.getElementById('directEmailVal');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const socialsRow = document.getElementById('socialsRow');
  const contactHeading = document.getElementById('contactHeading');
  const contactSubheading = document.getElementById('contactSubheading');
  const footerCopy = document.getElementById('footerCopy');

  const email = (contactSettings && contactSettings.directEmail) || (profile && profile.email) || 'dawnie.pratama@studio.id';

  if (directEmailVal) directEmailVal.textContent = email;
  if (contactHeading && contactSettings) contactHeading.textContent = contactSettings.heading;
  if (contactSubheading && contactSettings) contactSubheading.textContent = contactSettings.subheading;

  if (footerCopy && profile) {
    footerCopy.textContent = `© ${new Date().getFullYear()} ${profile.name}. Dirancang dengan estetika atelier & rekayasa web modern.`;
  }

  // Copy email functionality
  if (copyEmailBtn) {
    copyEmailBtn.onclick = () => {
      navigator.clipboard.writeText(email).then(() => {
        showToast('Alamat email berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast('Gagal menyalin email.');
      });
    };
  }

  // Socials
  if (socialsRow && socialLinks) {
    socialsRow.innerHTML = socialLinks.map(s => `
      <a class="social-pill" href="${s.url}" target="_blank" rel="noopener noreferrer">
        ${escapeHTML(s.name)} ↗
      </a>
    `).join('');
  }

  // Contact Form submit handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.onsubmit = (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value;
      const clientEmail = contactForm.querySelector('[name="email"]').value;
      const message = contactForm.querySelector('[name="message"]').value;

      if (!name || !clientEmail || !message) {
        showToast('Mohon lengkapi seluruh formulir');
        return;
      }

      showToast(`Terima kasih, ${name}! Pesan Anda telah diterima.`);
      contactForm.reset();
    };
  }
}

/**
 * Theme Toggle Handler
 */
function initTheme() {
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      showToast(`Mode tampilan diubah ke ${next === 'dark' ? 'Warm Obsidian' : 'Editorial Cream'}`);
    });
  }
}

/**
 * Subtle Spotlight Effect following cursor
 */
function initCursorSpotlight() {
  const spotlight = document.createElement('div');
  spotlight.className = 'cursor-spotlight';
  document.body.appendChild(spotlight);

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spotlight.style.left = `${mouseX}px`;
    spotlight.style.top = `${mouseY}px`;
  });
}

/**
 * Toast Notice Utility
 */
export function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✨</span> <span>${escapeHTML(message)}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
