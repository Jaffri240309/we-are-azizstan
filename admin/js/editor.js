// GitHub Config
const GITHUB_OWNER = 'Jaffri240309';
const GITHUB_REPO = 'we-are-azizstan';
const GITHUB_BRANCH = 'main';

// Editor state
let editor;
let currentHtmlSha = null;
let currentCssSha = null;

// Thai Language Pack
const thaiLang = {
  panels: {
    buttons: {
      titles: {
        preview: 'ดูตัวอย่าง',
        fullscreen: 'เต็มจอ',
        'sw-visibility': 'แสดงเส้นขอบ',
        'export-template': 'ดูโค้ด',
        'open-sm': 'ปรับแต่งดีไซน์ (สี/ขนาด/ขอบ)',
        'open-tm': 'การตั้งค่า (ลิงก์/คลาส)',
        'open-layers': 'เลเยอร์ (โครงสร้างหน้าเว็บ)',
        'open-blocks': 'เพิ่มองค์ประกอบ (ลากวาง)',
      }
    }
  },
  align: {
    'align-left': 'ชิดซ้าย',
    'align-center': 'ตรงกลาง',
    'align-right': 'ชิดขวา',
    'align-justify': 'กระจาย',
  },
  styleManager: {
    empty: 'คลิกเลือกส่วนที่ต้องการบนหน้าเว็บ เพื่อปรับแต่งดีไซน์',
    layer: 'เลเยอร์',
    fileButton: 'เลือกรูปภาพ',
    sectors: {
      general: 'ทั่วไป (General)',
      layout: 'การจัดวาง (Layout)',
      typography: 'ตัวอักษร (Typography)',
      decorations: 'การตกแต่ง (Decorations)',
      extra: 'เพิ่มเติม (Extra)',
      flex: 'การจัดเรียง (Flexbox)',
      dimension: 'ขนาด (Dimension)'
    },
    properties: {
      display: 'รูปแบบการแสดงผล',
      width: 'ความกว้าง',
      height: 'ความสูง',
      'max-width': 'กว้างสูงสุด',
      'min-height': 'สูงต่ำสุด',
      margin: 'ระยะห่างภายนอก',
      padding: 'ระยะห่างภายใน',
      'font-family': 'ฟอนต์',
      'font-size': 'ขนาดตัวอักษร',
      'font-weight': 'ความหนา',
      'letter-spacing': 'ระยะห่างตัวอักษร',
      color: 'สีตัวอักษร',
      'line-height': 'ความสูงบรรทัด',
      'text-align': 'จัดตำแหน่งอักษร',
      'text-decoration': 'เส้นตกแต่ง',
      'text-shadow': 'เงาตัวอักษร',
      'background-color': 'สีพื้นหลัง',
      'background-image': 'รูปภาพพื้นหลัง',
      'border-radius': 'ความโค้งมุม',
      border: 'เส้นขอบ',
      'box-shadow': 'เงากล่อง',
      opacity: 'ความโปร่งแสง',
      transition: 'การเคลื่อนไหว',
      transform: 'การแปลงรูปร่าง'
    }
  },
  traitManager: {
    empty: 'เลือกองค์ประกอบก่อนเพื่อตั้งค่า',
    label: 'การตั้งค่า',
    traits: {
      labels: {
        id: 'ไอดี (ID)',
        title: 'ชื่อ (Title)',
        href: 'ลิงก์ไปที่ (URL)',
        target: 'เปิดหน้าต่างใหม่',
        src: 'ไฟล์รูปภาพ (URL)',
        alt: 'คำอธิบายรูปภาพ',
      }
    }
  },
  blockManager: {
    labels: {
      text: 'ข้อความ',
      link: 'ลิงก์',
      image: 'รูปภาพ',
      video: 'วิดีโอ',
      map: 'แผนที่',
      'link-block': 'กล่องลิงก์',
      quote: 'คำคม',
      'text-section': 'ส่วนข้อความ',
      'image-section': 'ส่วนรูปภาพ',
      column1: '1 คอลัมน์',
      column2: '2 คอลัมน์',
      column3: '3 คอลัมน์',
      'column3-7': 'คอลัมน์ (3/7)',
    }
  }
};

// Initialize Editor
function initEditor() {
  editor = grapesjs.init({
    container: '#gjs',
    height: '100%',
    width: '100%',
    fromElement: false,
    showOffsets: true,
    noticeOnUnload: false,
    storageManager: false, 
    i18n: {
      locale: 'th',
      messages: { th: thaiLang }
    },
    plugins: ['gjs-preset-webpage', 'grapesjs-custom-code'],
    pluginsOpts: {
      'gjs-preset-webpage': {
        blocksBasicOpts: { flexGrid: true },
        navbarOpts: false,
        countdownOpts: false,
        formsOpts: false,
        exportOpts: false,
        blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map']
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
  
  loader.classList.remove('hidden');
  loaderText.innerText = 'กำลังดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์...';
  
  try {
    await fetchShas();
    if(!currentHtmlSha) throw new Error("ไม่พบไฟล์ index.html บน GitHub หรือ Token ไม่มีสิทธิ์");

    const htmlRes = await fetch('../index.html?t=' + Date.now());
    let fullHtml = await htmlRes.text();
    
    const editorHtml = editor.getHtml();
    fullHtml = fullHtml.replace(/(<body[^>]*>)([\s\S]*?)(<\/body>)/i, `$1\n${editorHtml}\n$3`);
    
    const editorCss = editor.getCss();
    
    loaderText.innerText = 'กำลังอัปเดต index.html...';
    await commitFile('index.html', fullHtml, currentHtmlSha, commitMsg, token);
    
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
  const encodedContent = btoa(new TextEncoder().encode(content).reduce((data, byte) => data + String.fromCharCode(byte), ''));

  const body = { message: message, content: encodedContent, branch: GITHUB_BRANCH };
  if (sha) body.sha = sha;

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
    fetchShas();
    alert('บันทึก Token เรียบร้อย');
  } else {
    alert('กรุณากรอก Token');
  }
});

document.getElementById('btn-publish').addEventListener('click', publishToGitHub);

// Init
window.addEventListener('load', initEditor);
