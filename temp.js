
    document.getElementById("year").textContent = new Date().getFullYear();

    // ═══════════════════════════════════
    // DATA — All council members
    // ═══════════════════════════════════
    const members = {
      // ── Male ──
      'm-president': {
        photo: 'assets/president.png',
        role: 'ประธานนักเรียน — President',
        roleLabel: 'President · 2568',
        nameTh: 'ฮูซัยฟี เจาะเลาะ',
        nameEn: 'Husaifee Jehlok',
        position: 'ประธานนักเรียน',
        level: 'ม.6 / Al-Khawarizmi',
        year: '2568',
        org: 'สภานักเรียน',
        motto: 'ซื่อสัตย์อย่างจริงใจ',
        flourish: `<svg class="dm-flourish" viewBox="0 0 280 40" width="280" height="40" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="fl1" x1="0%" x2="100%"><stop offset="0%" stop-color="#e83a75"/><stop offset="60%" stop-color="#9333ea"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs>
          <path d="M4,22 C16,8 32,6 52,16 C72,26 88,28 108,18 C128,8 148,6 168,14 C188,22 210,26 238,14 C248,10 258,6 268,12" stroke="url(#fl1)" stroke-width="2" style="--len:420"/>
          <path d="M130,14 C126,4 118,2 114,10 C112,14 116,18 122,16" stroke="url(#fl1)" stroke-width="1.5" style="--len:80"/>
          <path d="M268,12 C274,16 276,24 270,28 C266,30 262,28 264,24" stroke="url(#fl1)" stroke-width="1.5" style="--len:60"/>
          <path d="M4,22 C-2,28 -4,20 2,18" stroke="url(#fl1)" stroke-width="1.5" style="--len:30"/>
        </svg>`
      },
      'm-vice': {
        photo: 'assets/vice-president-male.png',
        role: 'รองประธานนักเรียน (ชาย) — Vice President',
        roleLabel: 'Vice President · 2568',
        nameTh: 'อาเดล มาตัดสา',
        nameEn: 'Adel Matadsa',
        position: 'รองประธานนักเรียน',
        level: 'ม.6 / Intan',
        year: '2568',
        org: 'สภานักเรียน',
        motto: 'ทำงานอย่างจริงจัง',
        flourish: `<svg class="dm-flourish" viewBox="0 0 260 40" width="260" height="40" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="fl2" x1="0%" x2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#e83a75"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs>
          <path d="M6,20 Q30,4 58,18 Q86,32 114,16 Q142,0 170,18 Q198,34 226,14 L250,10" stroke="url(#fl2)" stroke-width="2" style="--len:400"/>
          <path d="M6,20 C0,26 -6,24 -2,18 C0,14 6,14 8,18" stroke="url(#fl2)" stroke-width="1.5" style="--len:50"/>
          <path d="M250,10 C256,6 260,10 256,16 C254,18 250,16 250,12" stroke="url(#fl2)" stroke-width="1.5" style="--len:50"/>
        </svg>`
      },
      'm-secretary': {
        photo: 'assets/secretary.png',
        role: 'เลขานุการ — Secretary',
        roleLabel: 'Secretary · 2568',
        nameTh: 'ซีรอจณ์ หัจญีซิดดิก',
        nameEn: 'Zerodge Hajjisidik',
        position: 'เลขานุการ',
        level: 'ม.6 / Amber',
        year: '2568',
        org: 'สภานักเรียน',
        motto: 'เรียนให้สนุก ทำสิ่งที่ชอบ',
        flourish: `<svg class="dm-flourish" viewBox="0 0 280 40" width="280" height="40" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="fl3" x1="0%" x2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="50%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs>
          <path d="M10,22 Q50,40 100,20 T190,20 T270,16" stroke="url(#fl3)" stroke-width="2" style="--len:300"/>
          <path d="M10,22 C5,26 5,16 10,12" stroke="url(#fl3)" stroke-width="1.5" style="--len:20"/>
          <path d="M260,8 L275,22" stroke="url(#fl3)" stroke-width="1.5" style="--len:30"/>
          <path d="M260,22 L275,8" stroke="url(#fl3)" stroke-width="1.5" style="--len:30"/>
        </svg>`
      },

      // ── Female ──
      'f-president': {
        photo: 'assets/president-female.png',
        role: 'ประธานนักเรียน (หญิง) — President',
        roleLabel: 'President · 2568',
        nameTh: 'เบนาซี ดาราโจ๊ะ',
        nameEn: 'Baenasee Darajoh',
        position: 'ประธานนักเรียน',
        level: 'ม.6 / Intan',
        year: '2568',
        org: 'สภานักเรียน',
        motto: 'อย่าหยุดฝัน',
        flourish: `<svg class="dm-flourish" viewBox="0 0 200 40" width="200" height="40" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="fl4" x1="0%" x2="100%"><stop offset="0%" stop-color="#f472b6"/><stop offset="50%" stop-color="#e83a75"/><stop offset="100%" stop-color="#a855f7"/></linearGradient></defs>
          <path d="M8,22 C30,6 55,4 80,16 S130,26 160,14 Q180,8 194,18" stroke="url(#fl4)" stroke-width="2" style="--len:350"/>
          <path d="M8,22 C2,14 0,6 8,8 C16,10 14,20 8,22" stroke="url(#fl4)" stroke-width="1.4" style="--len:60"/>
          <path d="M194,18 C200,14 202,20 196,24 C192,26 190,22 194,18" stroke="url(#fl4)" stroke-width="1.4" style="--len:40"/>
        </svg>`
      },
      'f-secretary': {
        photo: 'assets/secretary-female.png',
        role: 'เลขานุการ — Secretary',
        roleLabel: 'Secretary · 2568',
        nameTh: 'นูรฟิสรี เหตุหาก',
        nameEn: 'Nurfisri Headhak',
        position: 'เลขานุการ',
        level: 'ม.6 / Amber',
        year: '2568',
        org: 'สภานักเรียน',
        motto: 'ความพยายามไม่เคยทำร้ายใคร',
        flourish: `<svg class="dm-flourish" viewBox="0 0 300 40" width="300" height="40" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="fl5" x1="0%" x2="100%"><stop offset="0%" stop-color="#f472b6"/><stop offset="40%" stop-color="#c084fc"/><stop offset="100%" stop-color="#818cf8"/></linearGradient></defs>
          <path d="M8,28 C40,28 60,14 90,18 S150,28 190,16 Q240,6 288,10" stroke="url(#fl5)" stroke-width="2" style="--len:400"/>
          <path d="M8,28 C4,34 2,26 6,22 C9,18 12,22 10,26" stroke="url(#fl5)" stroke-width="1.4" style="--len:50"/>
          <path d="M288,10 C292,6 296,4 292,8 C288,12 290,16 294,12" stroke="url(#fl5)" stroke-width="1.4" style="--len:40"/>
          <circle cx="155" cy="10" r="2" fill="url(#fl5)" opacity="0.6"/>
        </svg>`
      }
    };

    // ═══════════════════════════════════
    // VIEW SWITCHING LOGIC
    // ═══════════════════════════════════
    let currentGender = 'male';

    function switchGender(gender) {
      currentGender = gender;
      const male   = document.getElementById('male-section');
      const female = document.getElementById('female-section');
      const btnM   = document.getElementById('btn-male');
      const btnF   = document.getElementById('btn-female');
      const ind    = document.getElementById('gt-indicator');

      if (gender === 'male') {
        female.classList.add('hidden');
        male.classList.remove('hidden');
        if(btnM) btnM.classList.add('active');
        if(btnF) btnF.classList.remove('active');
        if(ind) ind.style.transform = 'translateY(0)';
      } else {
        male.classList.add('hidden');
        female.classList.remove('hidden');
        if(btnF) btnF.classList.add('active');
        if(btnM) btnM.classList.remove('active');
        if(ind) ind.style.transform = 'translateY(72px)';
      }

      // Update tab active state
      document.querySelectorAll('.gender-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.gender === gender);
      });

      const btnL = document.getElementById('btn-list');
      if (btnL && btnL.classList.contains('active')) {
        renderListView();
      } else {
        backToGrid();
      }
    }

    function showDetail(id) {
      const m = members[id];
      if (!m) return;

      const gridView   = document.getElementById('grid-view');
      const detailView = document.getElementById('detail-view');
      const content    = document.getElementById('detail-content');
      const tabs       = document.getElementById('gender-tabs');
      const vtabs      = document.getElementById('view-tabs');

      content.innerHTML = `
        <div class="detail-card">
          <div class="detail-photo">
            <img src="${m.photo}" alt="${m.nameTh}">
            <div class="photo-label">${m.roleLabel}</div>
          </div>
          <div class="detail-info">
            <div class="detail-role">${m.role}</div>
            <h2 class="detail-name-th">${m.nameTh}</h2>
            <div class="detail-name-en">${m.nameEn}</div>

            <div class="detail-grid">
              <div class="dg-item">
                <div class="dg-label">ตำแหน่ง</div>
                <div class="dg-value">${m.position}</div>
              </div>
              <div class="dg-item">
                <div class="dg-label">ระดับชั้น</div>
                <div class="dg-value">${m.level}</div>
              </div>
              <div class="dg-item">
                <div class="dg-label">ปีการศึกษา</div>
                <div class="dg-value">${m.year}</div>
              </div>
              <div class="dg-item">
                <div class="dg-label">สังกัด</div>
                <div class="dg-value">${m.org}</div>
              </div>
            </div>

            <div class="detail-motto">
              <div class="dm-label">คติประจำใจ</div>
              <div class="dm-text">${m.motto}</div>
              ${m.flourish}
            </div>
          </div>
        </div>
      `;

      gridView.style.display = 'none';
      tabs.style.display = 'none';
      if(vtabs) vtabs.style.display = 'none';
      
      const lv = document.getElementById('list-view-container');
      if(lv) lv.style.display = 'none';

      detailView.classList.add('active');

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function backToGrid() {
      const gridView   = document.getElementById('grid-view');
      const detailView = document.getElementById('detail-view');
      const tabs       = document.getElementById('gender-tabs');
      const vtabs      = document.getElementById('view-tabs');

      detailView.classList.remove('active');
      gridView.style.display = '';
      tabs.style.display = '';
      if(vtabs) vtabs.style.display = 'flex';

      // Re-trigger animations by re-adding elements
      document.querySelectorAll('.org-person').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // force reflow
        el.style.animation = '';
      });
    }

    function switchViewMode(mode) {
      const gv = document.getElementById('grid-view');
      const lv = document.getElementById('list-view-container');
      const dv = document.getElementById('detail-view');
      const ind = document.getElementById('vt-indicator');
      const btnC = document.getElementById('btn-chart');
      const btnL = document.getElementById('btn-list');
      
      dv.classList.remove('active');
      
      if (mode === 'list') {
        gv.style.display = 'none';
        lv.style.display = 'flex';
        ind.style.transform = 'translateX(74px)';
        btnC.classList.remove('active');
        btnL.classList.add('active');
        renderListView();
      } else {
        gv.style.display = '';
        lv.style.display = 'none';
        ind.style.transform = 'translateX(0)';
        btnL.classList.remove('active');
        btnC.classList.add('active');
      }
    }

    function renderListView() {
      const lv = document.getElementById('list-view-container');
      if(!lv) return;
      lv.innerHTML = '';
      
      const prefix = currentGender === 'male' ? 'm-' : 'f-';
      const keys = Object.keys(members).filter(k => k.startsWith(prefix));
      
      let html = '';
      keys.forEach(id => {
         const m = members[id];
         html += `
         <div class="detail-card" style="opacity:1; transform:translateY(0); animation:none; margin-bottom: 20px;">
          <div class="detail-photo">
            <img src="${m.photo}" alt="${m.nameTh}">
            <div class="photo-label">${m.roleLabel}</div>
          </div>
          <div class="detail-info">
            <div class="detail-role">${m.role}</div>
            <h2 class="detail-name-th">${m.nameTh}</h2>
            <div class="detail-name-en">${m.nameEn}</div>

            <div class="detail-grid">
              <div class="dg-item"><div class="dg-label">ตำแหน่ง</div><div class="dg-value">${m.position}</div></div>
              <div class="dg-item"><div class="dg-label">ระดับชั้น</div><div class="dg-value">${m.level}</div></div>
              <div class="dg-item"><div class="dg-label">ปีการศึกษา</div><div class="dg-value">${m.year}</div></div>
              <div class="dg-item"><div class="dg-label">สังกัด</div><div class="dg-value">${m.org}</div></div>
            </div>

            <div class="detail-motto">
              <div class="dm-label">คติประจำใจ</div>
              <div class="dm-text">${m.motto}</div>
              ${m.flourish}
            </div>
          </div>
        </div>
         `;
      });
      lv.innerHTML = html;
    }
  