import zipfile, re
from xml.etree import ElementTree as ET

path = r"F:\网站尝试\Artic 商业计划书.pptx"
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
z = zipfile.ZipFile(path)

out = []
themes = [n for n in z.namelist() if re.match(r'ppt/theme/theme\d+\.xml$', n)]
for n in themes:
    out.append(f"\n===== {n} =====")
    root = ET.fromstring(z.read(n))
    scheme = root.find('.//' + A + 'clrScheme')
    if scheme is None:
        continue
    for child in scheme:
        tag = child.tag.replace(A, '')
        for c in child:
            ctag = c.tag.replace(A, '')
            val = c.get('val') or c.get('lastClr') or ''
            out.append(f"{tag:8s} {ctag:6s} {val}")

# 字体
for n in themes:
    root = ET.fromstring(z.read(n))
    fs = root.find('.//' + A + 'fontScheme')
    if fs is not None:
        out.append("\n--- fonts ---")
        for f in fs:
            tag = f.tag.replace(A, '')
            for t in f:
                out.append(f"{tag} {t.tag.replace(A,'')} {t.get('typeface')}")

with open(r"F:\网站尝试\ai-input-method\_theme.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("done")
