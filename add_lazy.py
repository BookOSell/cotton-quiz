import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

original_count = html.count('<img ')

def add_lazy(m):
    tag = m.group(0)
    if 'loading=' in tag:
        return tag
    # Insert loading="lazy" before the closing > or />
    return re.sub(r'(\s*/?>\s*)$', ' loading="lazy"\\1', tag)

fixed = re.sub(r'<img\b[^>]*/?>', add_lazy, html)

added = fixed.count('loading=')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(fixed)

print(f'Total img tags: {original_count}, loading=lazy added: {added}')
