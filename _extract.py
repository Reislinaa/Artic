import zipfile, re
from xml.etree import ElementTree as ET

path = r"F:\网站尝试\Artic 商业计划书.pptx"
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
z = zipfile.ZipFile(path)
out = []

slides = [n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)]
slides.sort(key=lambda n: int(re.search(r'(\d+)', n).group(1)))

for n in slides:
    idx = int(re.search(r'(\d+)', n).group(1))
    root = ET.fromstring(z.read(n))
    out.append(f"\n########## Slide {idx} ##########")
    for p in root.iter(A + 'p'):
        line = ''.join(t.text or '' for t in p.iter(A + 't')).strip()
        if line:
            out.append(line)

notes = [n for n in z.namelist() if re.match(r'ppt/notesSlides/notesSlide\d+\.xml$', n)]
notes.sort(key=lambda n: int(re.search(r'(\d+)', n).group(1)))
for n in notes:
    idx = int(re.search(r'(\d+)', n).group(1))
    root = ET.fromstring(z.read(n))
    lines = []
    for p in root.iter(A + 'p'):
        line = ''.join(t.text or '' for t in p.iter(A + 't')).strip()
        if line and not line.isdigit():
            lines.append(line)
    if lines:
        out.append(f"\n----- Slide {idx} 备注 -----")
        out.extend(lines)

with open(r"F:\网站尝试\ai-input-method\_plan.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("done, lines:", len(out))
