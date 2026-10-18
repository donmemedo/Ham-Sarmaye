"""Generate every app icon / splash from one design (gradient squircle + sparkle).
Run after `npx cap add android|ios`:  python3 icons.py"""
import os
import re

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(HERE, "..", "frontend")
STOPS = [(0, (0, 113, 227)), (0.55, (124, 58, 237)), (1, (232, 71, 155))]  # --accent, --accent-2, --accent-3
STAR = [(12, 2), (14.4, 9.6), (22, 12), (14.4, 14.4), (12, 22), (9.6, 14.4), (2, 12), (9.6, 9.6)]  # Icon "spark"
SS = 4  # supersampling


def mix(t):
    for (a, ca), (b, cb) in zip(STOPS, STOPS[1:]):
        if t <= b:
            k = (t - a) / (b - a)
            return tuple(round(x + (y - x) * k) for x, y in zip(ca, cb))
    return STOPS[-1][1]


def gradient(n):
    line = [mix(i / (2 * n - 2)) for i in range(2 * n - 1)]
    img = Image.new("RGB", (n, n))
    img.putdata([line[x + y] for y in range(n) for x in range(n)])
    return img


def star(img, frac, box=None):
    x0, y0, w, h = box or (0, 0, *img.size)
    s = min(w, h) * frac / 20
    cx, cy = x0 + w / 2, y0 + h / 2
    ImageDraw.Draw(img).polygon([(cx + (x - 12) * s, cy + (y - 12) * s) for x, y in STAR], fill="white")


def icon(n, frac=0.5, shape="square"):
    big = n * SS
    img = gradient(big).convert("RGBA")
    star(img, frac)
    if shape != "square":
        mask = Image.new("L", (big, big))
        d = ImageDraw.Draw(mask)
        d.ellipse((0, 0, big, big), fill=255) if shape == "circle" else d.rounded_rectangle((0, 0, big, big), big * 0.225, fill=255)
        img.putalpha(mask)
    return img.resize((n, n), Image.LANCZOS)


def splash(w, h):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    n = min(w, h) // 4
    img.alpha_composite(icon(n, shape="rounded"), ((w - n) // 2, (h - n) // 2))
    return img


def save(img, *parts):
    path = os.path.join(*parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path)
    print("wrote", os.path.relpath(path, HERE))


# web / PWA
save(icon(192, shape="rounded"), WEB, "public/icons/icon-192.png")
save(icon(512, shape="rounded"), WEB, "public/icons/icon-512.png")
save(icon(512, frac=0.38), WEB, "public/icons/maskable-512.png")
save(icon(180), WEB, "app/apple-icon.png")
save(icon(64, shape="rounded"), WEB, "app/icon.png")

# native: overwrite Capacitor's placeholder images in place, keeping their sizes
for root, _, files in os.walk(HERE):
    if "node_modules" in root or not re.search(r"/(android/app/src/main/res|ios/App/App/Assets.xcassets)", root):
        continue
    for f in files:
        p = os.path.join(root, f)
        if not f.endswith(".png"):
            continue
        w, h = Image.open(p).size
        if f.startswith("splash") or "Splash" in root:
            save(splash(w, h), p)
        elif f == "ic_launcher_foreground.png":  # adaptive: system masks to the inner 66/108
            save(icon(w, frac=0.3), p)
        elif f == "ic_launcher_round.png":
            save(icon(w, shape="circle"), p)
        elif f == "ic_launcher.png":
            save(icon(w, shape="rounded"), p)
        elif "AppIcon" in root:  # iOS masks it itself; must be opaque
            save(icon(w).convert("RGB"), p)
