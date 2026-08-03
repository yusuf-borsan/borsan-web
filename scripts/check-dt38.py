import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('C:/Users/Yusuf/Desktop/borsan-web/src/lib/products.ts','r',encoding='utf-8') as f:
    c = f.read()
idx = c.find('slug: "dt38-6s"')
blk = c[idx:idx+4000]
si = blk.find('specs: [')
d,j=1,si+8
while j<len(blk) and d>0:
    if blk[j]=='[': d+=1
    elif blk[j]==']': d-=1
    j+=1
raw = blk[si+8:j-1]
pat = r'label:\s*\{\s*tr:\s*"([^"]*)"\s*[^}]*\}\s*[^}]*value:\s*\{\s*tr:\s*"([^"]*)"'
specs = list(re.finditer(pat, raw))
print(f'Source specs: {len(specs)}')
for i,m in enumerate(specs):
    print(f'  {i+1}. {m.group(1)} = {m.group(2)[:60]}')

# Now check HTML
with open('C:/Users/Yusuf/Desktop/borsan-web/public/datasheets/dt38-6s.html','r',encoding='utf-8') as f:
    html = f.read()
lbl_count = html.count('class="lbl"')
print(f'\nPDF spec rows: {lbl_count}')
