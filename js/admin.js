import {
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData,
  exportPortfolioJSON,
  importPortfolioJSON,
  isSessionAuthenticated,
  setSessionAuthenticated,
  verifyMasterPassword,
  updateMasterPassword
} from './data-store.js';
import { mountMediaUploader, mountMultiMediaUploader } from './media-uploader.js';

let currentData = null;

document.addEventListener('DOMContentLoaded', () => {
  currentData = getPortfolioData();

  // Initialize Security Gate
  initAuthGate();

  initSidebarTabs();
  initProfileTab();
  initProjectsTab();
  initSkillsTab();
  initServicesTab();
  initExperienceTab();
  initTestimonialsTab();
  initSocialsTab();
  initThemeTab();
  initSecurityTab();
  initBackupTab();
  initGlobalActions();
});

/**
 * Authentication Gate (Vault Lock Screen)
 */
function initAuthGate() {
  const authGate = document.getElementById('authGate');
  const adminApp = document.getElementById('adminApp');
  const authForm = document.getElementById('formAuthGate');
  const passwordInput = document.getElementById('authPasswordInput');
  const errorMsg = document.getElementById('authErrorMsg');
  const authCard = document.getElementById('authCard');
  const btnLogout = document.getElementById('btnLogoutCms');

  // Check existing session
  if (isSessionAuthenticated()) {
    if (authGate) authGate.style.display = 'none';
    if (adminApp) adminApp.style.display = 'block';
  } else {
    if (authGate) authGate.style.display = 'flex';
    if (adminApp) adminApp.style.display = 'none';
    if (passwordInput) passwordInput.focus();
  }

  // Handle Login Form
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredPassword = passwordInput.value;
      const isValid = await verifyMasterPassword(enteredPassword);

      if (isValid) {
        setSessionAuthenticated(true);
        if (errorMsg) errorMsg.classList.remove('show');
        if (authGate) authGate.style.display = 'none';
        if (adminApp) adminApp.style.display = 'block';
        showAdminToast('Selamat datang kembali di CMS Studio!');
      } else {
        if (errorMsg) errorMsg.classList.add('show');
        if (authCard) {
          authCard.classList.remove('shake');
          void authCard.offsetWidth; // Trigger reflow
          authCard.classList.add('shake');
        }
        if (passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }
      }
    });
  }

  // Handle Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Kunci dashboard CMS dan keluar sekarang?')) {
        setSessionAuthenticated(false);
        if (authGate) authGate.style.display = 'flex';
        if (adminApp) adminApp.style.display = 'none';
        if (passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }
        if (errorMsg) errorMsg.classList.remove('show');
        showAdminToast('Dashboard CMS telah dikunci.');
      }
    });
  }
}

/**
 * Security & Master Password Tab
 */
function initSecurityTab() {
  const form = document.getElementById('formChangePassword');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPass = document.getElementById('currentPasswordInput').value;
    const newPass = document.getElementById('newPasswordInput').value;
    const confirmPass = document.getElementById('confirmPasswordInput').value;

    const isCurrentValid = await verifyMasterPassword(currentPass);
    if (!isCurrentValid) {
      alert('Kata sandi saat ini salah. Mohon periksa kembali.');
      return;
    }

    if (newPass !== confirmPass) {
      alert('Kata sandi baru dan konfirmasi tidak cocok.');
      return;
    }

    if (newPass.length < 6) {
      alert('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    try {
      await updateMasterPassword(newPass);
      form.reset();
      showAdminToast('Kata sandi master berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui kata sandi: ' + err.message);
    }
  });
}

/**
 * Sidebar Navigation & Tab Switching
 */
function initSidebarTabs() {
  const links = document.querySelectorAll('.sidebar-link[data-tab]');
  const panes = document.querySelectorAll('.tab-pane');
  const topbarTitle = document.getElementById('topbarActiveTitle');

  links.forEach(link => {
    link.addEventListener('click', () => {
      const targetTabId = link.getAttribute('data-tab');

      links.forEach(l => l.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      link.classList.add('active');
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) targetPane.classList.add('active');

      const labelText = link.querySelector('span:last-child')?.textContent || 'Pengaturan';
      if (topbarTitle) topbarTitle.textContent = labelText;
    });
  });
}

/**
 * Profile & Hero Section
 */
function initProfileTab() {
  const form = document.getElementById('formProfile');
  const prof = currentData.profile || {};

  // Fill existing values
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setVal('profName', prof.name);
  setVal('profRole', prof.role);
  setVal('profStatusBadge', prof.statusBadge);
  setVal('profTagline', prof.tagline);
  setVal('profBio', prof.bio);
  setVal('profAvatarUrl', prof.avatarUrl);
  setVal('profYears', prof.yearsExperience);
  setVal('profCompleted', prof.completedProjects);
  setVal('profSatisfaction', prof.satisfactionRate);
  setVal('profLocation', prof.location);
  setVal('profEmail', prof.email);

  // Initialize Media Uploader for Avatar (Device & GDrive)
  mountMediaUploader({
    containerId: 'profAvatarUploaderContainer',
    hiddenInputId: 'profAvatarUrl',
    maxWidth: 600,
    initialValue: prof.avatarUrl || ''
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      currentData.profile = {
        ...currentData.profile,
        name: document.getElementById('profName').value,
        role: document.getElementById('profRole').value,
        statusBadge: document.getElementById('profStatusBadge').value,
        tagline: document.getElementById('profTagline').value,
        bio: document.getElementById('profBio').value,
        avatarUrl: document.getElementById('profAvatarUrl').value,
        yearsExperience: document.getElementById('profYears').value,
        completedProjects: document.getElementById('profCompleted').value,
        satisfactionRate: document.getElementById('profSatisfaction').value,
        location: document.getElementById('profLocation').value,
        email: document.getElementById('profEmail').value
      };

      savePortfolioData(currentData);
      showAdminToast('Data Profil & Hero berhasil disimpan!');
    });
  }
}

/**
 * Projects / Works CRUD Management
 */
let projMultiUploaderInstance = null;

function openProjectModal(project = null) {
  const form = document.getElementById('formProjectModal');
  const modal = document.getElementById('modalProjectBackdrop');
  const modalTitle = document.getElementById('modalProjectTitle');
  if (!form || !modal) return;

  form.reset();

  if (project) {
    modalTitle.textContent = 'Edit Proyek: ' + (project.title || '');
    document.getElementById('projFormId').value = project.id || '';
    document.getElementById('projFormTitle').value = project.title || '';
    document.getElementById('projFormClient').value = project.client || '';
    document.getElementById('projFormCategory').value = project.category || '';
    document.getElementById('projFormCategoryFilter').value = project.categoryFilter || 'fullstack';
    document.getElementById('projFormYear').value = project.year || '2025';
    document.getElementById('projFormCover').value = project.coverImage || '';
    document.getElementById('projFormShortDesc').value = project.shortDescription || '';
    document.getElementById('projFormChallenge').value = project.challenge || '';
    document.getElementById('projFormSolution').value = project.solution || '';
    document.getElementById('projFormImpact').value = project.impact || '';
    document.getElementById('projFormTags').value = (project.tags || []).join(', ');
    document.getElementById('projFormDemo').value = project.demoUrl || '';
    document.getElementById('projFormGithub').value = project.githubUrl || '';

    // Load multi-images gallery
    const gallery = Array.isArray(project.gallery) && project.gallery.length
      ? project.gallery
      : (project.coverImage ? [project.coverImage] : []);

    document.getElementById('projFormGallery').value = JSON.stringify(gallery);
    projMultiUploaderInstance?.setImages(gallery, project.coverImage || '');
  } else {
    modalTitle.textContent = 'Tambah Proyek Baru';
    document.getElementById('projFormId').value = '';
    document.getElementById('projFormCover').value = '';
    document.getElementById('projFormGallery').value = '[]';
    projMultiUploaderInstance?.setImages([]);
  }

  modal.classList.add('show');
}

function closeProjectModal() {
  const modal = document.getElementById('modalProjectBackdrop');
  if (modal) modal.classList.remove('show');
}

function initProjectsTab() {
  // Mount Multi-Media Uploader for Project Cover & Gallery
  projMultiUploaderInstance = mountMultiMediaUploader({
    containerId: 'projMultiUploaderContainer',
    coverInputId: 'projFormCover',
    galleryInputId: 'projFormGallery',
    maxWidth: 1400
  });

  renderAdminProjectsList();

  const btnAdd = document.getElementById('btnOpenAddProjectModal');
  const btnClose = document.getElementById('btnCloseProjectModal');
  const btnCancel = document.getElementById('btnCancelProjectModal');
  const form = document.getElementById('formProjectModal');

  if (btnAdd) btnAdd.onclick = () => openProjectModal(null);
  if (btnClose) btnClose.onclick = closeProjectModal;
  if (btnCancel) btnCancel.onclick = closeProjectModal;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('projFormId').value;
      const tagsStr = document.getElementById('projFormTags').value;
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

      let gallery = [];
      try {
        const rawGal = document.getElementById('projFormGallery').value;
        gallery = rawGal ? JSON.parse(rawGal) : [];
      } catch (err) {
        gallery = [];
      }

      const cover = document.getElementById('projFormCover').value || gallery[0] || '';
      if (!gallery.length && cover) {
        gallery = [cover];
      }

      const projectPayload = {
        id: id || 'proj-' + Date.now(),
        title: document.getElementById('projFormTitle').value,
        client: document.getElementById('projFormClient').value,
        category: document.getElementById('projFormCategory').value,
        categoryFilter: document.getElementById('projFormCategoryFilter').value,
        year: document.getElementById('projFormYear').value,
        coverImage: cover,
        gallery: gallery,
        shortDescription: document.getElementById('projFormShortDesc').value,
        challenge: document.getElementById('projFormChallenge').value,
        solution: document.getElementById('projFormSolution').value,
        impact: document.getElementById('projFormImpact').value,
        tags: tags,
        demoUrl: document.getElementById('projFormDemo').value,
        githubUrl: document.getElementById('projFormGithub').value
      };

      if (!currentData.projects) currentData.projects = [];

      if (id) {
        const idx = currentData.projects.findIndex(p => p.id === id);
        if (idx !== -1) currentData.projects[idx] = projectPayload;
      } else {
        currentData.projects.unshift(projectPayload);
      }

      savePortfolioData(currentData);
      renderAdminProjectsList();
      closeProjectModal();
      showAdminToast('Proyek berhasil disimpan!');
    });
  }
}

function renderAdminProjectsList() {
  const container = document.getElementById('adminProjectsList');
  if (!container) return;

  const projects = currentData.projects || [];
  if (projects.length === 0) {
    container.innerHTML = '<div style="color: var(--admin-text-muted); padding: 2rem; text-align: center;">Belum ada proyek. Klik tombol "+ Tambah Proyek Baru" di atas.</div>';
    return;
  }

  container.innerHTML = projects.map(p => `
    <div class="item-card" data-id="${p.id}">
      <div class="item-info">
        <img class="item-thumb" src="${p.coverImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80'}" alt="${p.title}">
        <div class="item-meta">
          <div class="item-title">${escapeHTML(p.title)}</div>
          <div class="item-sub">${escapeHTML(p.client || 'Klien')} • ${escapeHTML(p.category || 'Web')} • ${p.year || '2025'}</div>
        </div>
      </div>
      <div class="item-actions">
        <button type="button" class="btn-admin btn-edit-proj" data-id="${p.id}">Edit</button>
        <button type="button" class="btn-admin btn-admin-danger btn-del-proj" data-id="${p.id}">Hapus</button>
      </div>
    </div>
  `).join('');

  // Attach actions directly to openProjectModal
  container.querySelectorAll('.btn-edit-proj').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const target = currentData.projects.find(p => p.id === id);
      if (target) {
        openProjectModal(target);
      }
    };
  });

  container.querySelectorAll('.btn-del-proj').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
        currentData.projects = currentData.projects.filter(p => p.id !== id);
        savePortfolioData(currentData);
        renderAdminProjectsList();
        showAdminToast('Proyek telah dihapus.');
      }
    };
  });
}

/**
 * Skills & Capabilities Management
 */
function initSkillsTab() {
  renderAdminSkills();

  const modalSkill = document.getElementById('modalSkillBackdrop');
  const btnCloseSkill = document.getElementById('btnCloseSkillModal');
  const btnCancelSkill = document.getElementById('btnCancelSkillModal');
  const formSkill = document.getElementById('formSkillModal');
  const modalSkillTitle = document.getElementById('modalSkillTitle');
  const catSelect = document.getElementById('skillFormCategorySelect');
  const newCatGroup = document.getElementById('skillNewCatGroup');
  const newCatInput = document.getElementById('skillFormNewCategory');

  const modalCat = document.getElementById('modalCategoryBackdrop');
  const btnCloseCat = document.getElementById('btnCloseCategoryModal');
  const btnCancelCat = document.getElementById('btnCancelCategoryModal');
  const formCat = document.getElementById('formCategoryModal');
  const modalCatTitle = document.getElementById('modalCategoryTitle');

  // Toggle new category input when "__new__" is selected
  if (catSelect) {
    catSelect.addEventListener('change', () => {
      if (catSelect.value === '__new__') {
        newCatGroup.style.display = 'block';
        newCatInput.required = true;
        newCatInput.focus();
      } else {
        newCatGroup.style.display = 'none';
        newCatInput.required = false;
      }
    });
  }

  // Open Skill Modal
  window.openSkillModal = (catIdx = -1, itemIdx = -1) => {
    formSkill.reset();
    document.getElementById('skillFormCatIdx').value = catIdx;
    document.getElementById('skillFormItemIdx').value = itemIdx;

    const skills = currentData.skills || [];

    // Populate category dropdown
    catSelect.innerHTML = skills.map((c, i) => `
      <option value="${i}">${escapeHTML(c.category)}</option>
    `).join('') + '<option value="__new__">+ Buat Kategori Baru...</option>';

    if (skills.length === 0) {
      catSelect.value = '__new__';
      newCatGroup.style.display = 'block';
      newCatInput.required = true;
    } else {
      newCatGroup.style.display = 'none';
      newCatInput.required = false;
    }

    if (catIdx >= 0 && itemIdx >= 0 && skills[catIdx] && skills[catIdx].items[itemIdx]) {
      // EDIT EXISTING SKILL
      const item = skills[catIdx].items[itemIdx];
      modalSkillTitle.textContent = `Edit Keahlian: ${item.name}`;
      catSelect.value = String(catIdx);
      document.getElementById('skillFormName').value = item.name || '';
      document.getElementById('skillFormBadge').value = item.badge || 'Core';
      document.getElementById('skillFormLevel').value = item.level || 'Mahir';
    } else if (catIdx >= 0 && skills[catIdx]) {
      // ADD SKILL TO SPECIFIC CATEGORY
      modalSkillTitle.textContent = `Tambah Keahlian ke: ${skills[catIdx].category}`;
      catSelect.value = String(catIdx);
      document.getElementById('skillFormName').value = '';
      document.getElementById('skillFormBadge').value = 'Core';
      document.getElementById('skillFormLevel').value = 'Mahir';
    } else {
      // ADD NEW SKILL (DEFAULT)
      modalSkillTitle.textContent = 'Tambah Item Keahlian & Stack';
      document.getElementById('skillFormName').value = '';
      document.getElementById('skillFormBadge').value = 'Core';
      document.getElementById('skillFormLevel').value = 'Mahir';
    }

    modalSkill.classList.add('show');
  };

  const closeSkillModal = () => modalSkill.classList.remove('show');
  if (btnCloseSkill) btnCloseSkill.onclick = closeSkillModal;
  if (btnCancelSkill) btnCancelSkill.onclick = closeSkillModal;

  // Open Category Modal
  window.openCategoryModal = (catIdx = -1) => {
    formCat.reset();
    document.getElementById('categoryFormIdx').value = catIdx;
    const skills = currentData.skills || [];

    if (catIdx >= 0 && skills[catIdx]) {
      modalCatTitle.textContent = `Ganti Nama Kategori: ${skills[catIdx].category}`;
      document.getElementById('categoryFormName').value = skills[catIdx].category;
    } else {
      modalCatTitle.textContent = 'Tambah Kategori Keahlian Baru';
      document.getElementById('categoryFormName').value = '';
    }

    modalCat.classList.add('show');
  };

  const closeCatModal = () => modalCat.classList.remove('show');
  if (btnCloseCat) btnCloseCat.onclick = closeCatModal;
  if (btnCancelCat) btnCancelCat.onclick = closeCatModal;

  // Header Buttons
  const btnAddSkill = document.getElementById('btnOpenAddSkillModal');
  if (btnAddSkill) btnAddSkill.onclick = () => window.openSkillModal(-1, -1);

  const btnAddCat = document.getElementById('btnOpenAddCategoryModal');
  if (btnAddCat) btnAddCat.onclick = () => window.openCategoryModal(-1);

  // Submit Skill Form
  if (formSkill) {
    formSkill.addEventListener('submit', (e) => {
      e.preventDefault();
      const origCatIdx = parseInt(document.getElementById('skillFormCatIdx').value, 10);
      const itemIdx = parseInt(document.getElementById('skillFormItemIdx').value, 10);
      const name = document.getElementById('skillFormName').value.trim();
      const badge = document.getElementById('skillFormBadge').value.trim() || 'Core';
      const level = document.getElementById('skillFormLevel').value;

      if (!name) return;

      if (!currentData.skills) currentData.skills = [];

      let targetCatIdx = -1;
      if (catSelect.value === '__new__') {
        const newCatName = newCatInput.value.trim() || 'Keahlian Baru';
        const existIdx = currentData.skills.findIndex(c => c.category.toLowerCase() === newCatName.toLowerCase());
        if (existIdx !== -1) {
          targetCatIdx = existIdx;
        } else {
          currentData.skills.push({ category: newCatName, items: [] });
          targetCatIdx = currentData.skills.length - 1;
        }
      } else {
        targetCatIdx = parseInt(catSelect.value, 10);
      }

      const itemPayload = { name, badge, level };

      if (origCatIdx >= 0 && itemIdx >= 0 && currentData.skills[origCatIdx]) {
        // Editing existing item
        if (origCatIdx === targetCatIdx) {
          currentData.skills[targetCatIdx].items[itemIdx] = itemPayload;
        } else {
          currentData.skills[origCatIdx].items.splice(itemIdx, 1);
          if (!currentData.skills[targetCatIdx].items) currentData.skills[targetCatIdx].items = [];
          currentData.skills[targetCatIdx].items.push(itemPayload);
        }
      } else {
        // Adding new item
        if (!currentData.skills[targetCatIdx].items) currentData.skills[targetCatIdx].items = [];
        currentData.skills[targetCatIdx].items.push(itemPayload);
      }

      savePortfolioData(currentData);
      renderAdminSkills();
      closeSkillModal();
      showAdminToast('Keahlian berhasil disimpan!');
    });
  }

  // Submit Category Form
  if (formCat) {
    formCat.addEventListener('submit', (e) => {
      e.preventDefault();
      const catIdx = parseInt(document.getElementById('categoryFormIdx').value, 10);
      const catName = document.getElementById('categoryFormName').value.trim();

      if (!catName) return;
      if (!currentData.skills) currentData.skills = [];

      if (catIdx >= 0 && currentData.skills[catIdx]) {
        currentData.skills[catIdx].category = catName;
      } else {
        currentData.skills.push({ category: catName, items: [] });
      }

      savePortfolioData(currentData);
      renderAdminSkills();
      closeCatModal();
      showAdminToast('Kategori keahlian berhasil disimpan!');
    });
  }
}

function renderAdminSkills() {
  const container = document.getElementById('adminSkillsList');
  if (!container) return;

  const skills = currentData.skills || [];

  if (skills.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--admin-text-muted);">
        <p style="font-size: 1.05rem; margin-bottom: 1rem;">Belum ada kategori keahlian.</p>
        <button type="button" class="btn-admin btn-admin-primary" onclick="window.openCategoryModal(-1)">
          + Buat Kategori Pertama
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = skills.map((cat, catIdx) => `
    <div style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--admin-border);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.6rem;">
        <div style="display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
          <h4 style="font-size: 1.15rem; color: var(--admin-accent); font-weight: 600;">${escapeHTML(cat.category)}</h4>
          <span style="font-size: 0.75rem; color: var(--admin-text-dim); background: rgba(255, 255, 255, 0.05); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-family: var(--font-mono);">
            ${(cat.items || []).length} item
          </span>
          <button type="button" class="btn-admin btn-edit-cat" data-cat-idx="${catIdx}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" title="Ubah Nama Kategori">
            ✎ Ganti Nama
          </button>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn-admin btn-add-skill-to-cat" data-cat-idx="${catIdx}" style="padding: 0.3rem 0.75rem; font-size: 0.78rem; background: var(--admin-card-hover);">
            + Tambah Skill di Sini
          </button>
          <button type="button" class="btn-admin btn-admin-danger btn-del-cat" data-cat-idx="${catIdx}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
            Hapus Kategori
          </button>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.6rem;">
        ${(cat.items || []).length === 0 ? `
          <div style="padding: 1.2rem; text-align: center; color: var(--admin-text-dim); font-size: 0.85rem; border: 1px dashed var(--admin-border); border-radius: var(--radius-sm);">
            Belum ada keterampilan di kategori ini. Klik tombol <strong>+ Tambah Skill di Sini</strong> di atas.
          </div>
        ` : (cat.items || []).map((item, itemIdx) => `
          <div style="display: flex; align-items: center; justify-content: space-between; background: var(--admin-bg); padding: 0.75rem 1.1rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-border); gap: 1rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
              <strong style="font-size: 0.92rem; color: var(--admin-text-main);">${escapeHTML(item.name)}</strong>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--admin-accent); background: rgba(212, 163, 115, 0.12); padding: 0.15rem 0.5rem; border-radius: 4px; border: 1px solid rgba(212, 163, 115, 0.25);">[${escapeHTML(item.badge)}]</span>
              <span style="font-size: 0.75rem; color: var(--admin-text-dim);">• Tingkat: ${escapeHTML(item.level)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-left: auto;">
              <button type="button" class="btn-admin btn-edit-skill" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" style="padding: 0.28rem 0.65rem; font-size: 0.75rem; background: var(--admin-surface);">
                ✎ Edit
              </button>
              <button type="button" class="btn-del-skill" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" style="background: transparent; border: 1px solid rgba(239, 68, 68, 0.25); color: var(--admin-danger); cursor: pointer; font-size: 0.78rem; padding: 0.28rem 0.6rem; border-radius: var(--radius-sm); transition: all 0.2s;">
                ✕ Hapus
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Wire Edit Category
  container.querySelectorAll('.btn-edit-cat').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-cat-idx'), 10);
      if (window.openCategoryModal) window.openCategoryModal(idx);
    };
  });

  // Wire Add Skill to Specific Category
  container.querySelectorAll('.btn-add-skill-to-cat').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-cat-idx'), 10);
      if (window.openSkillModal) window.openSkillModal(idx, -1);
    };
  });

  // Wire Edit Skill
  container.querySelectorAll('.btn-edit-skill').forEach(btn => {
    btn.onclick = () => {
      const catIdx = parseInt(btn.getAttribute('data-cat-idx'), 10);
      const itemIdx = parseInt(btn.getAttribute('data-item-idx'), 10);
      if (window.openSkillModal) window.openSkillModal(catIdx, itemIdx);
    };
  });

  // Wire Delete category
  container.querySelectorAll('.btn-del-cat').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-cat-idx'), 10);
      const catName = currentData.skills[idx]?.category || 'kategori ini';
      if (confirm(`Hapus seluruh kategori "${catName}" beserta semua keterampilannya?`)) {
        currentData.skills.splice(idx, 1);
        savePortfolioData(currentData);
        renderAdminSkills();
        showAdminToast('Kategori keahlian berhasil dihapus.');
      }
    };
  });

  // Wire Delete single skill item
  container.querySelectorAll('.btn-del-skill').forEach(btn => {
    btn.onclick = () => {
      const catIdx = parseInt(btn.getAttribute('data-cat-idx'), 10);
      const itemIdx = parseInt(btn.getAttribute('data-item-idx'), 10);
      const itemName = currentData.skills[catIdx]?.items[itemIdx]?.name || 'item ini';
      if (confirm(`Hapus keterampilan "${itemName}"?`)) {
        currentData.skills[catIdx].items.splice(itemIdx, 1);
        savePortfolioData(currentData);
        renderAdminSkills();
        showAdminToast('Item keahlian berhasil dihapus.');
      }
    };
  });
}

/**
 * Services Management
 */
function initServicesTab() {
  renderAdminServicesList();

  const btnAdd = document.getElementById('btnOpenAddServiceModal');
  const modal = document.getElementById('modalServiceBackdrop');
  const btnClose = document.getElementById('btnCloseServiceModal');
  const btnCancel = document.getElementById('btnCancelServiceModal');
  const form = document.getElementById('formServiceModal');
  const modalTitle = document.getElementById('modalServiceTitle');

  const openModal = (srv = null) => {
    form.reset();
    if (srv) {
      modalTitle.textContent = 'Edit Layanan: ' + srv.title;
      document.getElementById('srvFormId').value = srv.id;
      document.getElementById('srvFormNumber').value = srv.number || '01';
      document.getElementById('srvFormTitle').value = srv.title || '';
      document.getElementById('srvFormTagline').value = srv.tagline || '';
      document.getElementById('srvFormDesc').value = srv.description || '';
      document.getElementById('srvFormDeliverables').value = (srv.deliverables || []).join('\n');
    } else {
      modalTitle.textContent = 'Tambah Layanan Baru';
      document.getElementById('srvFormId').value = '';
    }
    modal.classList.add('show');
  };

  const closeModal = () => modal.classList.remove('show');

  if (btnAdd) btnAdd.onclick = () => openModal();
  if (btnClose) btnClose.onclick = closeModal;
  if (btnCancel) btnCancel.onclick = closeModal;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('srvFormId').value;
      const deliverablesRaw = document.getElementById('srvFormDeliverables').value;
      const deliverables = deliverablesRaw.split('\n').map(d => d.trim()).filter(Boolean);

      const srvPayload = {
        id: id || 'srv-' + Date.now(),
        number: document.getElementById('srvFormNumber').value,
        title: document.getElementById('srvFormTitle').value,
        tagline: document.getElementById('srvFormTagline').value,
        description: document.getElementById('srvFormDesc').value,
        deliverables: deliverables
      };

      if (!currentData.services) currentData.services = [];

      if (id) {
        const idx = currentData.services.findIndex(s => s.id === id);
        if (idx !== -1) currentData.services[idx] = srvPayload;
      } else {
        currentData.services.push(srvPayload);
      }

      savePortfolioData(currentData);
      renderAdminServicesList();
      closeModal();
      showAdminToast('Layanan berhasil disimpan!');
    });
  }
}

function renderAdminServicesList() {
  const container = document.getElementById('adminServicesList');
  if (!container) return;

  const services = currentData.services || [];
  container.innerHTML = services.map(s => `
    <div class="item-card" data-id="${s.id}">
      <div class="item-info">
        <div style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--admin-accent); font-weight: bold;">${escapeHTML(s.number || '01')}</div>
        <div class="item-meta">
          <div class="item-title">${escapeHTML(s.title)}</div>
          <div class="item-sub">${escapeHTML(s.tagline || '')}</div>
        </div>
      </div>
      <div class="item-actions">
        <button type="button" class="btn-admin btn-edit-srv" data-id="${s.id}">Edit</button>
        <button type="button" class="btn-admin btn-admin-danger btn-del-srv" data-id="${s.id}">Hapus</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-edit-srv').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const target = currentData.services.find(s => s.id === id);
      if (target) {
        const modal = document.getElementById('modalServiceBackdrop');
        const modalTitle = document.getElementById('modalServiceTitle');
        document.getElementById('srvFormId').value = target.id;
        document.getElementById('srvFormNumber').value = target.number || '01';
        document.getElementById('srvFormTitle').value = target.title || '';
        document.getElementById('srvFormTagline').value = target.tagline || '';
        document.getElementById('srvFormDesc').value = target.description || '';
        document.getElementById('srvFormDeliverables').value = (target.deliverables || []).join('\n');
        modalTitle.textContent = 'Edit Layanan: ' + target.title;
        modal.classList.add('show');
      }
    };
  });

  container.querySelectorAll('.btn-del-srv').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Hapus layanan ini?')) {
        currentData.services = currentData.services.filter(s => s.id !== id);
        savePortfolioData(currentData);
        renderAdminServicesList();
        showAdminToast('Layanan telah dihapus.');
      }
    };
  });
}

/**
 * Experience & Milestones Management
 */
function initExperienceTab() {
  renderAdminExperienceList();

  const btnAdd = document.getElementById('btnOpenAddExpModal');
  const modal = document.getElementById('modalExpBackdrop');
  const btnClose = document.getElementById('btnCloseExpModal');
  const btnCancel = document.getElementById('btnCancelExpModal');
  const form = document.getElementById('formExpModal');
  const modalTitle = document.getElementById('modalExpTitle');

  const openModal = (exp = null) => {
    form.reset();
    if (exp) {
      modalTitle.textContent = 'Edit Karir: ' + exp.role;
      document.getElementById('expFormId').value = exp.id;
      document.getElementById('expFormRole').value = exp.role || '';
      document.getElementById('expFormCompany').value = exp.company || '';
      document.getElementById('expFormPeriod').value = exp.period || '';
      document.getElementById('expFormLocation').value = exp.location || '';
      document.getElementById('expFormDesc').value = exp.description || '';
    } else {
      modalTitle.textContent = 'Tambah Riwayat Karir';
      document.getElementById('expFormId').value = '';
    }
    modal.classList.add('show');
  };

  const closeModal = () => modal.classList.remove('show');

  if (btnAdd) btnAdd.onclick = () => openModal();
  if (btnClose) btnClose.onclick = closeModal;
  if (btnCancel) btnCancel.onclick = closeModal;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('expFormId').value;
      const expPayload = {
        id: id || 'exp-' + Date.now(),
        role: document.getElementById('expFormRole').value,
        company: document.getElementById('expFormCompany').value,
        period: document.getElementById('expFormPeriod').value,
        location: document.getElementById('expFormLocation').value,
        description: document.getElementById('expFormDesc').value
      };

      if (!currentData.experiences) currentData.experiences = [];

      if (id) {
        const idx = currentData.experiences.findIndex(x => x.id === id);
        if (idx !== -1) currentData.experiences[idx] = expPayload;
      } else {
        currentData.experiences.unshift(expPayload);
      }

      savePortfolioData(currentData);
      renderAdminExperienceList();
      closeModal();
      showAdminToast('Riwayat karir berhasil disimpan!');
    });
  }
}

function renderAdminExperienceList() {
  const container = document.getElementById('adminExperienceList');
  if (!container) return;

  const exps = currentData.experiences || [];
  container.innerHTML = exps.map(exp => `
    <div class="item-card" data-id="${exp.id}">
      <div class="item-info">
        <div class="item-meta">
          <div class="item-title">${escapeHTML(exp.role)} @ ${escapeHTML(exp.company)}</div>
          <div class="item-sub">${escapeHTML(exp.period)} • ${escapeHTML(exp.location || 'Indonesia')}</div>
        </div>
      </div>
      <div class="item-actions">
        <button type="button" class="btn-admin btn-edit-exp" data-id="${exp.id}">Edit</button>
        <button type="button" class="btn-admin btn-admin-danger btn-del-exp" data-id="${exp.id}">Hapus</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-edit-exp').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const target = currentData.experiences.find(x => x.id === id);
      if (target) {
        const modal = document.getElementById('modalExpBackdrop');
        const modalTitle = document.getElementById('modalExpTitle');
        document.getElementById('expFormId').value = target.id;
        document.getElementById('expFormRole').value = target.role || '';
        document.getElementById('expFormCompany').value = target.company || '';
        document.getElementById('expFormPeriod').value = target.period || '';
        document.getElementById('expFormLocation').value = target.location || '';
        document.getElementById('expFormDesc').value = target.description || '';
        modalTitle.textContent = 'Edit Karir: ' + target.role;
        modal.classList.add('show');
      }
    };
  });

  container.querySelectorAll('.btn-del-exp').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Hapus riwayat karir ini?')) {
        currentData.experiences = currentData.experiences.filter(x => x.id !== id);
        savePortfolioData(currentData);
        renderAdminExperienceList();
        showAdminToast('Riwayat karir dihapus.');
      }
    };
  });
}

/**
 * Testimonials Management
 */
let testiAvatarUploaderInstance = null;

function openTestimonialModal(testi = null) {
  const form = document.getElementById('formTestiModal');
  const modal = document.getElementById('modalTestiBackdrop');
  const modalTitle = document.getElementById('modalTestiTitle');
  if (!form || !modal) return;

  form.reset();
  if (testi) {
    modalTitle.textContent = 'Edit Ulasan: ' + (testi.author || '');
    document.getElementById('testiFormId').value = testi.id;
    document.getElementById('testiFormAuthor').value = testi.author || '';
    document.getElementById('testiFormRole').value = `${testi.role || ''} — ${testi.company || ''}`;
    document.getElementById('testiFormAvatar').value = testi.avatar || '';
    testiAvatarUploaderInstance?.setValue(testi.avatar || '');
    document.getElementById('testiFormRating').value = testi.rating || 5;
    document.getElementById('testiFormQuote').value = testi.quote || '';
  } else {
    modalTitle.textContent = 'Tambah Ulasan Baru';
    document.getElementById('testiFormId').value = '';
    testiAvatarUploaderInstance?.setValue('');
  }
  modal.classList.add('show');
}

function closeTestimonialModal() {
  const modal = document.getElementById('modalTestiBackdrop');
  if (modal) modal.classList.remove('show');
}

function initTestimonialsTab() {
  // Mount Media Uploader for Testimonial Avatar
  testiAvatarUploaderInstance = mountMediaUploader({
    containerId: 'testiAvatarUploaderContainer',
    hiddenInputId: 'testiFormAvatar',
    maxWidth: 400
  });

  renderAdminTestimonialsList();

  const btnAdd = document.getElementById('btnOpenAddTestiModal');
  const btnClose = document.getElementById('btnCloseTestiModal');
  const btnCancel = document.getElementById('btnCancelTestiModal');
  const form = document.getElementById('formTestiModal');

  if (btnAdd) btnAdd.onclick = () => openTestimonialModal(null);
  if (btnClose) btnClose.onclick = closeTestimonialModal;
  if (btnCancel) btnCancel.onclick = closeTestimonialModal;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('testiFormId').value;
      const roleRaw = document.getElementById('testiFormRole').value;
      const parts = roleRaw.split('—').map(s => s.trim());
      const role = parts[0] || roleRaw;
      const company = parts[1] || '';

      const testiPayload = {
        id: id || 'testi-' + Date.now(),
        author: document.getElementById('testiFormAuthor').value,
        role: role,
        company: company,
        avatar: document.getElementById('testiFormAvatar').value || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: parseInt(document.getElementById('testiFormRating').value, 10) || 5,
        quote: document.getElementById('testiFormQuote').value
      };

      if (!currentData.testimonials) currentData.testimonials = [];

      if (id) {
        const idx = currentData.testimonials.findIndex(t => t.id === id);
        if (idx !== -1) currentData.testimonials[idx] = testiPayload;
      } else {
        currentData.testimonials.push(testiPayload);
      }

      savePortfolioData(currentData);
      renderAdminTestimonialsList();
      closeTestimonialModal();
      showAdminToast('Ulasan klien berhasil disimpan!');
    });
  }
}

function renderAdminTestimonialsList() {
  const container = document.getElementById('adminTestimonialsList');
  if (!container) return;

  const list = currentData.testimonials || [];
  container.innerHTML = list.map(t => `
    <div class="item-card" data-id="${t.id}">
      <div class="item-info">
        <img class="item-thumb" style="width: 44px; height: 44px; border-radius: 50%;" src="${t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" alt="${t.author}">
        <div class="item-meta">
          <div class="item-title">${escapeHTML(t.author)}</div>
          <div class="item-sub">${escapeHTML(t.role)} — ${escapeHTML(t.company)}</div>
        </div>
      </div>
      <div class="item-actions">
        <button type="button" class="btn-admin btn-edit-testi" data-id="${t.id}">Edit</button>
        <button type="button" class="btn-admin btn-admin-danger btn-del-testi" data-id="${t.id}">Hapus</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-edit-testi').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const target = currentData.testimonials.find(t => t.id === id);
      if (target) {
        openTestimonialModal(target);
      }
    };
  });

  container.querySelectorAll('.btn-del-testi').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Hapus ulasan ini?')) {
        currentData.testimonials = currentData.testimonials.filter(t => t.id !== id);
        savePortfolioData(currentData);
        renderAdminTestimonialsList();
        showAdminToast('Ulasan telah dihapus.');
      }
    };
  });
}

/**
 * Social Links & Contact Settings
 */
function initSocialsTab() {
  const formContact = document.getElementById('formContactSettings');
  const cs = currentData.contactSettings || {};

  if (document.getElementById('contactHeadingInput')) {
    document.getElementById('contactHeadingInput').value = cs.heading || '';
  }
  if (document.getElementById('contactSubheadingInput')) {
    document.getElementById('contactSubheadingInput').value = cs.subheading || '';
  }
  if (document.getElementById('contactDirectEmailInput')) {
    document.getElementById('contactDirectEmailInput').value = cs.directEmail || currentData.profile?.email || '';
  }

  if (formContact) {
    formContact.addEventListener('submit', (e) => {
      e.preventDefault();
      currentData.contactSettings = {
        ...currentData.contactSettings,
        heading: document.getElementById('contactHeadingInput').value,
        subheading: document.getElementById('contactSubheadingInput').value,
        directEmail: document.getElementById('contactDirectEmailInput').value
      };
      savePortfolioData(currentData);
      showAdminToast('Pengaturan kontak disimpan!');
    });
  }

  renderAdminSocials();

  const btnAdd = document.getElementById('btnAddSocialLink');
  if (btnAdd) {
    btnAdd.onclick = () => {
      const name = prompt('Nama platform sosial (contoh: Twitter, Behance, YouTube):');
      if (!name) return;
      const url = prompt('URL profil lengkap (contoh: https://twitter.com/username):');
      if (!url) return;

      if (!currentData.socialLinks) currentData.socialLinks = [];
      currentData.socialLinks.push({ name, url, icon: name.toLowerCase(), handle: name });
      savePortfolioData(currentData);
      renderAdminSocials();
      showAdminToast('Tautan sosial ditambahkan!');
    };
  }
}

function renderAdminSocials() {
  const container = document.getElementById('adminSocialsList');
  if (!container) return;

  const socials = currentData.socialLinks || [];
  container.innerHTML = socials.map((s, idx) => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 1rem; border: 1px solid var(--admin-border); border-radius: var(--radius-sm); margin-bottom: 0.6rem; background: var(--admin-bg);">
      <div>
        <strong>${escapeHTML(s.name)}</strong>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--admin-text-dim); margin-left: 0.8rem;">${escapeHTML(s.url)}</span>
      </div>
      <button type="button" class="btn-del-social" data-idx="${idx}" style="background: transparent; border: none; color: var(--admin-danger); cursor: pointer; font-size: 0.8rem;">✕ Hapus</button>
    </div>
  `).join('');

  container.querySelectorAll('.btn-del-social').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      currentData.socialLinks.splice(idx, 1);
      savePortfolioData(currentData);
      renderAdminSocials();
      showAdminToast('Tautan sosial dihapus.');
    };
  });
}

/**
 * Theme & Color Aesthetics
 */
function initThemeTab() {
  const swatches = document.querySelectorAll('.color-swatch-btn[data-color]');
  const picker = document.getElementById('customColorPicker');
  const hexInput = document.getElementById('customAccentColor');
  const btnApplyColor = document.getElementById('btnApplyColor');
  const modeSelect = document.getElementById('defaultThemeMode');
  const btnApplyMode = document.getElementById('btnApplyThemeMode');

  const currentTheme = currentData.theme || {};
  if (hexInput && currentTheme.accentColor) {
    hexInput.value = currentTheme.accentColor;
    if (picker) picker.value = currentTheme.accentColor;
  }
  if (modeSelect && currentTheme.mode) {
    modeSelect.value = currentTheme.mode;
  }

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      if (hexInput) hexInput.value = color;
      if (picker) picker.value = color;
      applyAccentColor(color);
    });
  });

  if (picker && hexInput) {
    picker.addEventListener('input', () => {
      hexInput.value = picker.value;
    });
    hexInput.addEventListener('input', () => {
      picker.value = hexInput.value;
    });
  }

  if (btnApplyColor) {
    btnApplyColor.onclick = () => {
      const color = hexInput.value || '#d4a373';
      applyAccentColor(color);
    };
  }

  function applyAccentColor(color) {
    currentData.theme = {
      ...currentData.theme,
      accentColor: color
    };
    savePortfolioData(currentData);
    showAdminToast(`Warna aksen berhasil diperbarui: ${color}`);
  }

  if (btnApplyMode) {
    btnApplyMode.onclick = () => {
      currentData.theme = {
        ...currentData.theme,
        mode: modeSelect.value
      };
      savePortfolioData(currentData);
      showAdminToast(`Mode tema diperbarui ke ${modeSelect.value === 'dark' ? 'Warm Obsidian Dark' : 'Editorial Cream'}`);
    };
  }
}

/**
 * Backup & Data JSON (Export/Import/Reset)
 */
function initBackupTab() {
  const btnExport = document.getElementById('btnExportFull');
  const btnTriggerImport = document.getElementById('btnTriggerImport');
  const fileInput = document.getElementById('importFileInput');
  const btnReset = document.getElementById('btnResetDefaults');

  if (btnExport) {
    btnExport.onclick = () => {
      exportPortfolioJSON();
      showAdminToast('File backup .json berhasil diunduh!');
    };
  }

  if (btnTriggerImport && fileInput) {
    btnTriggerImport.onclick = () => fileInput.click();

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const imported = await importPortfolioJSON(file);
        currentData = imported;
        showAdminToast('Backup portofolio berhasil dipulihkan!');
        setTimeout(() => location.reload(), 800);
      } catch (err) {
        alert('Gagal mengimpor file: ' + err.message);
      }
    });
  }

  if (btnReset) {
    btnReset.onclick = () => {
      const confirmed = confirm('PERINGATAN: Seluruh penyesuaian kustom Anda akan direset kembali ke data bawaan kurasi Dawnie Pratama. Lanjutkan?');
      if (confirmed) {
        resetPortfolioData();
        showAdminToast('Seluruh data berhasil direset ke bawaan.');
        setTimeout(() => location.reload(), 800);
      }
    };
  }
}

/**
 * Global Topbar Actions
 */
function initGlobalActions() {
  const btnSaveAll = document.getElementById('btnSaveAll');
  const btnExportQuick = document.getElementById('btnExportQuick');

  if (btnSaveAll) {
    btnSaveAll.onclick = () => {
      savePortfolioData(currentData);
      showAdminToast('Seluruh perubahan berhasil disimpan ke memori!');
    };
  }

  if (btnExportQuick) {
    btnExportQuick.onclick = () => {
      exportPortfolioJSON();
      showAdminToast('Cadangan data berhasil diunduh.');
    };
  }
}

/**
 * Toast Notice
 */
function showAdminToast(msg) {
  const toast = document.getElementById('adminToast');
  const toastMsg = document.getElementById('adminToastMsg');
  if (!toast) return;

  if (toastMsg) toastMsg.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
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
