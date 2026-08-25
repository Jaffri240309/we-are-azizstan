// GitHub Config
const GITHUB_OWNER = 'Jaffri240309';
const GITHUB_REPO = 'we-are-azizstan';
const GITHUB_BRANCH = 'main';

// Editor state
let editor;
let currentHtmlSha = null;
let currentCssSha = null;

// Initialize Editor
function initEditor() {
  editor = grapesjs.init({
    container: '#gjs',
    height: '100%',
    width: '100%',
    fromElement: false,
    showOffsets: true,
    noticeOnUnload: false,
    storageManager: false, // We handle storage manually via GitHub API
    plugins: ['gjs-preset-webpage', 'grapesjs-custom-code'],
    pluginsOpts: {
      'gjs-preset-webpage': {
        blocksBasicOpts: { flexGrid: true },
        navbarOpts: false,
        countdownOpts: false,
        formsOpts: false,
        exportOpts: false,
        blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video']
      }
    },
    canvas: {
      styles: [
        '../style.css', 
        'https://cdn.lazywasabi.net/fonts/Anakotmai/Anakotmai.css'
      ]
    }
  });

  // Load content from local files first (for editing)
  loadContent();
}

async function loadContent() {
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  
  try {
    loaderText.innerText = 'กำลังโหลดหน้าเว็บเพื่อแก้ไข...';
    // Load HTML
    const htmlRes = await fetch('../index.html?t=' + Date.now());
    if(!htmlRes.ok) throw new Error('Cannot load index.html');
    const htmlText = await htmlRes.text();
    
    // Extract body content (GrapesJS prefers body content, not full HTML document)
    const bodyMatch = htmlText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : htmlText;
    
    // Load CSS
    const cssRes = await fetch('../style.css?t=' + Date.now());
    const cssText = cssRes.ok ? await cssRes.text() : '';

    editor.setComponents(bodyContent);
    editor.setStyle(cssText);
    
    // Attempt to fetch SHA for later saving (if token exists)
    if(localStorage.getItem('gh_token')) {
      await fetchShas();
    }
    
    loader.classList.add('hidden');
  } catch(err) {
    console.error(err);
    alert('เกิดข้อผิดพลาดในการโหลดหน้าเว็บ');
    loader.classList.add('hidden');
  }
}

// ── GitHub API Functions ──

async function fetchShas() {
  const token = localStorage.getItem('gh_token');
  if(!token) return;

  const headers = { 'Authorization': `Bearer ${token}` };
  
  try {
    // Get HTML SHA
    let res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/index.html?ref=${GITHUB_BRANCH}`, { headers });
    if(res.ok) {
      let data = await res.json();
      currentHtmlSha = data.sha;
    }
    
    // Get CSS SHA
    res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/style.css?ref=${GITHUB_BRANCH}`, { headers });
    if(res.ok) {
      let data = await res.json();
      currentCssSha = data.sha;
    }
  } catch(e) {
    console.error('Error fetching SHAs:', e);
  }
}

async function publishToGitHub() {
  const token = localStorage.getItem('gh_token');
  if(!token) {
    showModal();
    return;
  }

  const commitMsg = document.getElementById('commit-msg').value || 'Update via Visual Editor';
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  
  // Reconstruct full HTML Document
  // GrapesJS `getHtml()` only returns the inner body. We need to reconstruct the full file.
  // We'll fetch the original index.html and replace its body content.
  loader.classList.remove('hidden');
  loaderText.innerText = 'กำลังดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์...';
  
  try {
    // 1. Refresh SHAs to avoid conflict
    await fetchShas();
    if(!currentHtmlSha) throw new Error("ไม่พบไฟล์ index.html บน GitHub หรือ Token ไม่มีสิทธิ์");

    // 2. Fetch original HTML to preserve <head>
    const htmlRes = await fetch('../index.html?t=' + Date.now());
    let fullHtml = await htmlRes.text();
    
    // Replace body content with editor content
    const editorHtml = editor.getHtml();
    fullHtml = fullHtml.replace(/(<body[^>]*>)([\s\S]*?)(<\/body>)/i, `$1\n${editorHtml}\n$3`);
    
    // 3. Get Editor CSS
    const editorCss = editor.getCss();

    // 4. Base64 Encode (UTF-8 safe)
    const encodeBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
    
    // 5. Commit HTML
    loaderText.innerText = 'กำลังอัปเดต index.html...';
    await commitFile('index.html', fullHtml, currentHtmlSha, commitMsg, token);
    
    // 6. Commit CSS
    loaderText.innerText = 'กำลังอัปเดต style.css...';
    await commitFile('style.css', editorCss, currentCssSha, commitMsg, token);
    
    loader.classList.add('hidden');
    alert('✅ เผยแพร่เว็บเรียบร้อยแล้ว! อาจใช้เวลา 1-2 นาทีในการที่เว็บหลักจะแสดงผลใหม่');
    
  } catch (err) {
    console.error(err);
    alert('❌ เกิดข้อผิดพลาด: ' + err.message);
    loader.classList.add('hidden');
  }
}

async function commitFile(path, content, sha, message, token) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  
  // Encode string safely for Base64 (handles Thai chars)
  const encodedContent = btoa(new TextEncoder().encode(content).reduce((data, byte) => data + String.fromCharCode(byte), ''));

  const body = {
    message: message,
    content: encodedContent,
    branch: GITHUB_BRANCH
  };
  
  if (sha) body.sha = sha; // Need SHA to update an existing file

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Failed to update ${path}: ${errorData.message}`);
  }
  
  const data = await res.json();
  // Update local SHA with the new commit's SHA
  if(path === 'index.html') currentHtmlSha = data.content.sha;
  if(path === 'style.css') currentCssSha = data.content.sha;
  
  return data;
}

// ── UI Events ──

const modal = document.getElementById('token-modal');

function showModal() {
  document.getElementById('github-token').value = localStorage.getItem('gh_token') || '';
  modal.classList.add('active');
}

function hideModal() {
  modal.classList.remove('active');
}

document.getElementById('btn-settings').addEventListener('click', showModal);
document.getElementById('btn-modal-cancel').addEventListener('click', hideModal);

document.getElementById('btn-modal-save').addEventListener('click', () => {
  const token = document.getElementById('github-token').value.trim();
  if(token) {
    localStorage.setItem('gh_token', token);
    hideModal();
    // Re-fetch SHAs now that we have a token
    fetchShas();
    alert('บันทึก Token เรียบร้อย');
  } else {
    alert('กรุณากรอก Token');
  }
});

document.getElementById('btn-publish').addEventListener('click', publishToGitHub);

// Init
window.addEventListener('load', initEditor);
