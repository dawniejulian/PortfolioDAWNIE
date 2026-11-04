/**
 * Media Uploader Utility
 * Supports Device File Upload (with automatic canvas compression to Base64)
 * and Google Drive Share Link conversion without raw URL hassles.
 */

/**
 * Convert various Google Drive link formats to direct high-res image URL
 */
export function parseGoogleDriveLink(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // Match standard file/d/{id} or id={id}
  const match = trimmed.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{20,})/);
  if (match && match[1]) {
    const fileId = match[1];
    // High-res direct preview link via Google CDN
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // If already a direct link or unrecognized format, return as is
  return trimmed;
}

/**
 * Compress an image file using HTML5 canvas and return Base64 Data URL
 */
export function compressImageFile(file, maxWidth = 1400, quality = 0.84) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar yang valid.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG Base64
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl: compressedDataUrl,
          width,
          height,
          originalSize: file.size,
          compressedSize: Math.round(compressedDataUrl.length * 0.75)
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Mount an interactive Media Uploader widget into a container
 *
 * @param {Object} config
 * @param {string} config.containerId - ID of DOM element to render widget into
 * @param {string} config.hiddenInputId - ID of hidden input storing the final image value
 * @param {number} [config.maxWidth=1400] - Max dimension for compression
 * @param {string} [config.initialValue=''] - Initial image source (Base64 or URL)
 * @param {Function} [config.onChange] - Callback when image changes
 */
export function mountMediaUploader({ containerId, hiddenInputId, maxWidth = 1400, initialValue = '', onChange = null }) {
  const container = document.getElementById(containerId);
  const hiddenInput = document.getElementById(hiddenInputId);
  if (!container || !hiddenInput) return;

  // Set initial value in hidden input if exists
  if (initialValue) {
    hiddenInput.value = initialValue;
  }

  const widgetId = 'mu_' + Math.random().toString(36).substring(2, 9);

  container.innerHTML = `
    <div class="media-uploader-widget" id="${widgetId}">
      <div class="uploader-tabs-nav">
        <button type="button" class="uploader-tab-btn active" data-target="device">
          <span>📁</span> <span>Unggah dari Perangkat</span>
        </button>
        <button type="button" class="uploader-tab-btn" data-target="gdrive">
          <span>☁️</span> <span>Google Drive</span>
        </button>
      </div>

      <!-- Tab 1: Perangkat (File Upload / Drag & Drop) -->
      <div class="uploader-panel active" data-panel="device">
        <div class="uploader-dropzone">
          <input type="file" accept="image/*" class="file-picker-input" style="display: none;">
          <span class="dropzone-icon">🖼️</span>
          <div class="dropzone-title">Klik untuk memilih gambar atau seret file ke sini</div>
          <div class="dropzone-desc">Format JPG, PNG, WEBP • Otomatis dioptimasi tanpa batas kuota</div>
        </div>
      </div>

      <!-- Tab 2: Google Drive -->
      <div class="uploader-panel" data-panel="gdrive">
        <div class="gdrive-input-box">
          <div class="gdrive-row">
            <input type="text" class="gdrive-url-input" placeholder="Tempel tautan berbagi Google Drive (contoh: https://drive.google.com/file/d/.../view)" style="flex-grow: 1;">
            <button type="button" class="btn-admin btn-admin-primary btn-apply-gdrive" style="flex-shrink: 0;">
              <span>Terapkan</span>
            </button>
          </div>
          <div class="gdrive-hint">
            💡 <strong>Panduan GDrive:</strong> Buka file di Google Drive &gt; Klik <strong>Bagikan (Share)</strong> &gt; Pastikan Akses Umum diatur ke <em>"Siapa saja yang memiliki link"</em> &gt; Salin link dan tempel di sini.
          </div>
        </div>
      </div>

      <!-- Preview Box -->
      <div class="uploader-preview-card" style="display: ${hiddenInput.value ? 'flex' : 'none'};">
        <div class="preview-thumb-wrap">
          <img class="preview-thumb-img" src="${hiddenInput.value || ''}" alt="Pratinjau Gambar">
        </div>
        <div class="preview-info">
          <div class="preview-status">✓ Gambar Terpasang</div>
          <div class="preview-src-badge">${getBadgeLabel(hiddenInput.value)}</div>
        </div>
        <button type="button" class="btn-remove-media">Ganti / Hapus</button>
      </div>
    </div>
  `;

  const widget = document.getElementById(widgetId);
  const tabBtns = widget.querySelectorAll('.uploader-tab-btn');
  const panels = widget.querySelectorAll('.uploader-panel');
  const dropzone = widget.querySelector('.uploader-dropzone');
  const fileInput = widget.querySelector('.file-picker-input');
  const gdriveInput = widget.querySelector('.gdrive-url-input');
  const btnApplyGdrive = widget.querySelector('.btn-apply-gdrive');
  const previewCard = widget.querySelector('.uploader-preview-card');
  const previewImg = widget.querySelector('.preview-thumb-img');
  const previewBadge = widget.querySelector('.preview-src-badge');
  const btnRemove = widget.querySelector('.btn-remove-media');

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = widget.querySelector(`.uploader-panel[data-panel="${target}"]`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Handle local file selection
  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await processAndSetLocalFile(file);
    fileInput.value = '';
  });

  // Drag and Drop
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', async (e) => {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file && file.type.startsWith('image/')) {
      await processAndSetLocalFile(file);
    }
  });

  async function processAndSetLocalFile(file) {
    try {
      dropzone.querySelector('.dropzone-title').textContent = 'Mengompresi & memproses gambar...';
      const result = await compressImageFile(file, maxWidth);
      setValue(result.dataUrl, `File Perangkat (${file.name})`);
      dropzone.querySelector('.dropzone-title').textContent = 'Klik untuk memilih gambar atau seret file ke sini';
    } catch (err) {
      alert('Gagal memproses gambar: ' + err.message);
      dropzone.querySelector('.dropzone-title').textContent = 'Klik untuk memilih gambar atau seret file ke sini';
    }
  }

  // Handle Google Drive link apply
  btnApplyGdrive.addEventListener('click', () => {
    const rawUrl = gdriveInput.value.trim();
    if (!rawUrl) {
      alert('Silakan tempel tautan Google Drive terlebih dahulu.');
      return;
    }

    const converted = parseGoogleDriveLink(rawUrl);
    if (!converted) {
      alert('Tautan Google Drive tidak valid. Pastikan format link seperti: https://drive.google.com/file/d/.../view');
      return;
    }

    setValue(converted, 'Google Drive Cloud Image');
  });

  // Remove / change image
  btnRemove.addEventListener('click', () => {
    setValue('', '');
  });

  function setValue(val, label) {
    hiddenInput.value = val;
    if (val) {
      previewImg.src = val;
      previewBadge.textContent = label || getBadgeLabel(val);
      previewCard.style.display = 'flex';
    } else {
      previewImg.src = '';
      previewBadge.textContent = '';
      previewCard.style.display = 'none';
      if (gdriveInput) gdriveInput.value = '';
    }
    if (typeof onChange === 'function') {
      onChange(val);
    }
  }

  function getBadgeLabel(val) {
    if (!val) return '';
    if (val.startsWith('data:image')) return 'File Lokal Perangkat (Base64)';
    if (val.includes('googleusercontent.com') || val.includes('drive.google.com')) return 'Google Drive CDN Link';
    return 'Gambar Kustom';
  }

  // Return API to set value programmatically (e.g. when editing item)
  return {
    setValue: (val) => setValue(val, getBadgeLabel(val)),
    getValue: () => hiddenInput.value
  };
}

/**
 * Mount a Multi-Media Uploader widget for uploading multiple screenshots/images
 *
 * @param {Object} config
 * @param {string} config.containerId - ID of container element
 * @param {string} config.coverInputId - ID of hidden input for primary cover image
 * @param {string} config.galleryInputId - ID of hidden input for JSON gallery array
 * @param {number} [config.maxWidth=1400] - Max dimension for compression
 * @param {Function} [config.onChange] - Callback when images change
 */
export function mountMultiMediaUploader({ containerId, coverInputId, galleryInputId, maxWidth = 1400, onChange = null }) {
  const container = document.getElementById(containerId);
  const coverInput = document.getElementById(coverInputId);
  const galleryInput = document.getElementById(galleryInputId);
  if (!container || !coverInput || !galleryInput) return null;

  let imagesList = [];
  const widgetId = 'multi_mu_' + Math.random().toString(36).substring(2, 9);

  container.innerHTML = `
    <div class="media-uploader-widget" id="${widgetId}">
      <div class="uploader-tabs-nav">
        <button type="button" class="uploader-tab-btn active" data-target="multi-device">
          <span>📁</span> <span>Unggah dari Perangkat (Bisa Banyak File)</span>
        </button>
        <button type="button" class="uploader-tab-btn" data-target="multi-gdrive">
          <span>☁️</span> <span>Google Drive</span>
        </button>
      </div>

      <!-- Tab 1: Multi File Picker / Drag & Drop -->
      <div class="uploader-panel active" data-panel="multi-device">
        <div class="uploader-dropzone multi-dropzone">
          <input type="file" multiple accept="image/*" class="multi-file-picker" style="display: none;">
          <span class="dropzone-icon">📸</span>
          <div class="dropzone-title">Klik untuk memilih gambar atau seret file ke sini</div>
          <div class="dropzone-desc">Dapat memilih lebih dari 1 gambar sekaligus • Format JPG, PNG, WEBP (Otomatis dikompresi)</div>
        </div>
      </div>

      <!-- Tab 2: Google Drive -->
      <div class="uploader-panel" data-panel="multi-gdrive">
        <div class="gdrive-input-box">
          <div class="gdrive-row">
            <input type="text" class="multi-gdrive-input" placeholder="Tempel tautan Google Drive gambar..." style="flex-grow: 1;">
            <button type="button" class="btn-admin btn-admin-primary btn-add-gdrive-img" style="flex-shrink: 0;">
              <span>+ Tambahkan Gambar</span>
            </button>
          </div>
          <div class="gdrive-hint">
            💡 <strong>Panduan GDrive:</strong> Pastikan opsi berbagi Google Drive diset ke <em>"Siapa saja yang memiliki link"</em>, lalu klik "+ Tambahkan Gambar". Anda bisa menambahkan beberapa link GDrive satu per satu.
          </div>
        </div>
      </div>

      <!-- Multi-Image Gallery List -->
      <div class="multi-gallery-header" style="display: none; margin-top: 1.5rem; justify-content: space-between; align-items: center;">
        <div class="multi-gallery-count" style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--admin-accent); font-weight: 600;">
          Daftar Gambar Terpasang (0)
        </div>
        <button type="button" class="btn-admin btn-admin-danger btn-clear-all-gallery" style="padding: 0.25rem 0.6rem; font-size: 0.72rem;">
          Hapus Semua
        </button>
      </div>

      <div class="multi-gallery-grid" style="display: none; margin-top: 0.8rem;"></div>
    </div>
  `;

  const widget = document.getElementById(widgetId);
  const tabBtns = widget.querySelectorAll('.uploader-tab-btn');
  const panels = widget.querySelectorAll('.uploader-panel');
  const dropzone = widget.querySelector('.multi-dropzone');
  const fileInput = widget.querySelector('.multi-file-picker');
  const gdriveInput = widget.querySelector('.multi-gdrive-input');
  const btnAddGdrive = widget.querySelector('.btn-add-gdrive-img');
  const galleryHeader = widget.querySelector('.multi-gallery-header');
  const galleryCount = widget.querySelector('.multi-gallery-count');
  const galleryGrid = widget.querySelector('.multi-gallery-grid');
  const btnClearAll = widget.querySelector('.btn-clear-all-gallery');

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPanel = widget.querySelector(`.uploader-panel[data-panel="${target}"]`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Local file picker
  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    await processMultipleFiles(files);
    fileInput.value = '';
  });

  // Drag and drop
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', async (e) => {
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      await processMultipleFiles(files);
    }
  });

  async function processMultipleFiles(files) {
    const titleEl = dropzone.querySelector('.dropzone-title');
    titleEl.textContent = `Memproses & mengompresi ${files.length} gambar...`;

    for (const file of files) {
      try {
        const compressed = await compressImageFile(file, maxWidth);
        imagesList.push(compressed.dataUrl);
      } catch (err) {
        console.error('Gagal memproses file:', file.name, err);
      }
    }

    titleEl.textContent = 'Klik untuk memilih gambar atau seret file ke sini';
    syncAndRenderGallery();
  }

  // Google drive add
  btnAddGdrive.addEventListener('click', () => {
    const rawUrl = gdriveInput.value.trim();
    if (!rawUrl) {
      alert('Silakan masukkan link Google Drive terlebih dahulu.');
      return;
    }
    const converted = parseGoogleDriveLink(rawUrl);
    if (!converted) {
      alert('Tautan Google Drive tidak valid.');
      return;
    }
    imagesList.push(converted);
    gdriveInput.value = '';
    syncAndRenderGallery();
  });

  // Clear all
  btnClearAll.addEventListener('click', () => {
    if (confirm('Hapus seluruh gambar dari proyek ini?')) {
      imagesList = [];
      syncAndRenderGallery();
    }
  });

  function syncAndRenderGallery() {
    // Sync to hidden inputs
    coverInput.value = imagesList[0] || '';
    galleryInput.value = JSON.stringify(imagesList);

    if (imagesList.length === 0) {
      galleryHeader.style.display = 'none';
      galleryGrid.style.display = 'none';
      galleryGrid.innerHTML = '';
      if (typeof onChange === 'function') onChange(imagesList);
      return;
    }

    galleryHeader.style.display = 'flex';
    galleryCount.textContent = `Daftar Gambar Terpasang (${imagesList.length} Gambar)`;
    galleryGrid.style.display = 'grid';

    galleryGrid.innerHTML = imagesList.map((imgUrl, idx) => `
      <div class="gallery-card-item ${idx === 0 ? 'is-cover' : ''}">
        <div class="gallery-card-thumb-wrap">
          <img src="${imgUrl}" alt="Gambar ${idx + 1}" class="gallery-card-thumb">
          <span class="gallery-card-badge">${idx === 0 ? '★ Sampul Utama' : '#' + (idx + 1)}</span>
        </div>
        <div class="gallery-card-actions">
          ${idx > 0 ? `<button type="button" class="gallery-btn-action btn-set-cover" data-idx="${idx}" title="Jadikan gambar ini sebagai sampul utama">Jadikan Sampul</button>` : `<span class="gallery-cover-label">Sampul Aktif</span>`}
          <button type="button" class="gallery-btn-action btn-del-gallery-img" data-idx="${idx}" title="Hapus gambar ini">✕ Hapus</button>
        </div>
      </div>
    `).join('');

    // Attach actions
    galleryGrid.querySelectorAll('.btn-set-cover').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        // Move clicked item to index 0
        const chosen = imagesList.splice(idx, 1)[0];
        imagesList.unshift(chosen);
        syncAndRenderGallery();
      };
    });

    galleryGrid.querySelectorAll('.btn-del-gallery-img').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        imagesList.splice(idx, 1);
        syncAndRenderGallery();
      };
    });

    if (typeof onChange === 'function') onChange(imagesList);
  }

  return {
    setImages: (galleryArray, coverImg) => {
      if (Array.isArray(galleryArray) && galleryArray.length > 0) {
        imagesList = [...galleryArray];
        // Ensure cover is first if provided
        if (coverImg && imagesList.includes(coverImg)) {
          imagesList = [coverImg, ...imagesList.filter(x => x !== coverImg)];
        } else if (coverImg && !imagesList.includes(coverImg)) {
          imagesList.unshift(coverImg);
        }
      } else if (coverImg) {
        imagesList = [coverImg];
      } else {
        imagesList = [];
      }
      syncAndRenderGallery();
    },
    getImages: () => imagesList,
    getCover: () => imagesList[0] || ''
  };
}

