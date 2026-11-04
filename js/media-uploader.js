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
