import fitz, os, json
from PIL import Image

PDF = r"F:\网站尝试\EMI_UI_Design_Reference.pdf"
OUT = r"F:\网站尝试\ai-input-method"

doc = fitz.open(PDF)
print('页数:', doc.page_count)

texts = []
colors_all = []

for i, page in enumerate(doc):
    texts.append('===== 第 %d 页 =====\n%s' % (i + 1, page.get_text()))

    pix = page.get_pixmap(dpi=100)
    png = os.path.join(OUT, '_pdf_p%d.png' % (i + 1))
    pix.save(png)

    im = Image.open(png).convert('RGB')
    w = 200
    small = im.resize((w, max(1, int(w * im.height / im.width))))
    q = small.quantize(colors=8, method=Image.MEDIANCUT).convert('RGB')
    cols = q.getcolors(w * w * 4) or []
    cols.sort(reverse=True)
    top = ['#%02X%02X%02X x%d' % (r, g, b, c) for c, (r, g, b) in cols[:8]]
    colors_all.append({'page': i + 1, 'size': '%dx%d' % (pix.width, pix.height), 'dominant': top})
    print('  第 %d 页 %dx%d 已渲染' % (i + 1, pix.width, pix.height))

with open(os.path.join(OUT, '_pdf.txt'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(texts))

with open(os.path.join(OUT, '_pdf_colors.json'), 'w', encoding='utf-8') as f:
    json.dump(colors_all, f, ensure_ascii=False, indent=2)

print('\n===== 各页主色 =====')
for c in colors_all:
    print('第 %d 页 %s' % (c['page'], c['size']))
    for d in c['dominant']:
        print('    ', d)
