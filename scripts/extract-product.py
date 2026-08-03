"""Extract CK61180 product data for template testing."""
import re, json, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

TS = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'borsan-web', 'src', 'lib', 'products.ts')
with open(TS, 'r', encoding='utf-8') as f:
    c = f.read()

slug = "falco-ck61180"
idx = c.find(f'slug: "{slug}"')
# Find next slug
next_slug = c.find('slug: "', idx + 10)
block = c[idx:next_slug] if next_slug > idx else c[idx:idx+6000]

nm = re.search(r'name:\s*\{[^}]*tr:\s*"([^"]+)"', block)
sm = re.search(r'summary:\s*\{[^}]*tr:\s*"([^"]+)"', block)
hl = re.search(r'highlights:\s*\[(.*?)\]', block, re.DOTALL)
hls = re.findall(r'\{\s*tr:\s*"([^"]*)"', hl.group(1))[:6] if hl else []

# Specs
si = block.find('specs: [')
d, j = 1, si+8
while j < len(block) and d > 0:
    if block[j] == '[': d += 1
    elif block[j] == ']': d -= 1
    j += 1
specs = []
for m in re.finditer(r'label:\s*\{\s*tr:\s*"([^"]*)"[^}]*\}[^}]*value:\s*\{\s*tr:\s*"([^"]*)"', block[si:j]):
    specs.append({"label": m.group(1), "value": m.group(2)})

print(f"Name: {nm.group(1)}")
print(f"Summary: {sm.group(1)[:100]}...")
print(f"Highlights: {len(hls)}")
for h in hls:
    print(f"  - {h[:80]}...")
print(f"Specs: {len(specs)}")
for s in specs:
    print(f"  {s['label']}: {s['value'][:50]}")
