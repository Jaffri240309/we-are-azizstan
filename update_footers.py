import re
import os
import glob

footer_content = """  <footer class="footer">
    <div class="container">
      <div class="footer-contact-section">
        <h3>ติดต่อ</h3>
        <p><i class="ph-fill ph-map-pin" style="color: #f59e0b;"></i> 119 ม.7 ต.นาประดู่ อ.โคกโพธิ์ จ.ปัตตานี 94180</p>
        <p><i class="ph-fill ph-phone" style="color: #f59e0b;"></i> 08-1599-2978</p>
        <p><i class="ph-fill ph-envelope" style="color: #f59e0b;"></i> e-office@azizstan.ac.th</p>
      </div>
      <div class="footer-bottom">
        <div>© <span id="year"></span> We Are Azizstan • โรงเรียนมูลนิธิอาซิซสถาน</div>
        <div class="footer-links">
          <a id="socialFb" href="https://www.facebook.com/profile.php?id=100022088562742" target="_blank" rel="noopener"><i class="ph ph-facebook-logo"></i> Facebook</a>
          <a id="socialIg" href="https://www.instagram.com/mppa_aziz?igsi=MXNidWpneTV5MHN0cw==" target="_blank" rel="noopener"><i class="ph ph-instagram-logo"></i> Instagram</a>
        </div>
      </div>
    </div>
  </footer>"""

for file in glob.glob("*.html"):
    if file == "tmp_index.html":
        continue
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the footer block using regex
    new_content = re.sub(r'  <footer class="footer">.*?</footer>', footer_content, content, flags=re.DOTALL)
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Updated {file}")
