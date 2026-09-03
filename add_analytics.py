import os
import glob

tracking_code = """
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-E181JZ5D8Q"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-E181JZ5D8Q');
  </script>
"""

# We want to insert it right before the closing </head> tag.
for file in glob.glob("*.html"):
    if file == "tmp_index.html":
        continue
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if already installed
    if "G-E181JZ5D8Q" in content:
        print(f"Skipping {file}, already installed.")
        continue
        
    # Replace </head> with the tracking code + </head>
    new_content = content.replace("</head>", tracking_code + "</head>")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Updated {file}")
