import importlib

for m in ['fitz', 'pypdf', 'PyPDF2', 'pdfplumber', 'pdfminer', 'PIL']:
    try:
        mod = importlib.import_module(m)
        print('OK   %-12s %s' % (m, getattr(mod, '__version__', '')))
    except Exception as e:
        print('--   %-12s %s' % (m, type(e).__name__))
