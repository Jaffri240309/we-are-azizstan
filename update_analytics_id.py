import glob

old_id = "G-E181JZ5D8Q"
new_id = "G-FFKG7JS1GL"

for file in glob.glob("*.html"):
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    if old_id in content:
        new_content = content.replace(old_id, new_id)
        with open(file, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file}")
