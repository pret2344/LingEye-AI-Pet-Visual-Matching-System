import os
import zlib

def create_png(width, height, r, g, b):
    # PNG signature
    signature = bytes([137, 80, 78, 71, 13, 10, 26, 10])
    
    # IHDR chunk
    ihdr = bytes([
        0, 0, 0, 13,  # length
        73, 72, 68, 82,  # IHDR
        (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF,
        (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF,
        8,  # bit depth
        2,  # color type (RGB)
        0,  # compression
        0,  # filter
        0   # interlace
    ])
    ihdr += crc32(ihdr[4:]).to_bytes(4, 'big')
    
    # IDAT chunk - simple solid color
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter byte
        for x in range(width):
            raw_data.extend([r, g, b])
    
    compressed = zlib.compress(bytes(raw_data))
    idat = bytes([(len(compressed) >> 24) & 0xFF, (len(compressed) >> 16) & 0xFF, 
                  (len(compressed) >> 8) & 0xFF, len(compressed) & 0xFF])
    idat += b'IDAT'
    idat += compressed
    idat += crc32(idat[4:]).to_bytes(4, 'big')
    
    # IEND chunk
    iend = b'\x00\x00\x00\x00IEND' + crc32(b'IEND').to_bytes(4, 'big')
    
    return signature + ihdr + idat + iend

def crc32(data):
    crc = 0xFFFFFFFF
    table = [0] * 256
    for i in range(256):
        c = i
        for _ in range(8):
            c = (c >> 1) ^ 0xEDB88320 if c & 1 else c >> 1
        table[i] = c
    for byte in data:
        crc = table[(crc ^ byte) & 0xFF] ^ (crc >> 8)
    return (crc ^ 0xFFFFFFFF) & 0xFFFFFFFF

# Create icons directory
os.makedirs('./assets/icons', exist_ok=True)

# Create icons
icons = [
    ('home.png', 153, 153, 153),
    ('home-active.png', 255, 140, 56),
    ('ai.png', 153, 153, 153),
    ('ai-active.png', 255, 140, 56),
    ('map.png', 153, 153, 153),
    ('map-active.png', 255, 140, 56),
    ('profile.png', 153, 153, 153),
    ('profile-active.png', 255, 140, 56)
]

for name, r, g, b in icons:
    png_data = create_png(81, 81, r, g, b)
    with open(f'./assets/icons/{name}', 'wb') as f:
        f.write(png_data)
    print(f'Created: {name}')

print('All icons created successfully!')
