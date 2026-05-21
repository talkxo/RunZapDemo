import re

css_path = "styles.css"
with open(css_path, "r") as f:
    css = f.read()

# 1. Update :root variables
css = re.sub(r'--bg: #[0-9a-fA-F]+;', '--bg: #0d0f12;', css)
css = re.sub(r'--bg-soft: #[0-9a-fA-F]+;', '--bg-soft: #14171c;', css)
css = re.sub(r'--surface: rgba\([^)]+\);', '--surface: rgba(26, 30, 35, 0.86);', css)
css = re.sub(r'--surface-strong: #[0-9a-fA-F]+;', '--surface-strong: #1e2229;', css)
css = re.sub(r'--surface-warm: linear-gradient\([^)]+\);', '--surface-warm: linear-gradient(180deg, rgba(26, 30, 35, 0.96), rgba(20, 23, 27, 0.92));', css)
css = re.sub(r'--border: rgba\([^)]+\);', '--border: rgba(255, 87, 34, 0.2);', css)
css = re.sub(r'--border-strong: rgba\([^)]+\);', '--border-strong: rgba(255, 87, 34, 0.4);', css)
css = re.sub(r'--text: #[0-9a-fA-F]+;', '--text: #f0f2f5;', css)
css = re.sub(r'--text-soft: #[0-9a-fA-F]+;', '--text-soft: #a0a8b5;', css)
css = re.sub(r'--text-faint: #[0-9a-fA-F]+;', '--text-faint: #6e7682;', css)
css = re.sub(r'--orange: #[0-9a-fA-F]+;', '--orange: #ff5722;', css)
css = re.sub(r'--orange-deep: #[0-9a-fA-F]+;', '--orange-deep: #e64a19;', css)
css = re.sub(r'--gold: #[0-9a-fA-F]+;', '--gold: #ffb300;', css)
css = re.sub(r'--sun: #[0-9a-fA-F]+;', '--sun: #ffca28;', css)

# 2. Update Font
css = css.replace('"Manrope"', '"Inter"')
css = css.replace('"Sora"', '"Oswald"')

# 3. Mass replace explicit light mode colors and gradients
# Backgrounds
css = css.replace('#fff8ef', '#0d0f12')
css = css.replace('#fff3e1', '#14171c')
css = css.replace('#ffffff', '#1e2229')
css = css.replace('#fffdf8', '#0d0f12')
css = css.replace('#fff6ea', '#101216')
css = css.replace('#ffefdc', '#14171c')
css = css.replace('#fffaf2', '#14171c')
css = css.replace('#fff5de', '#20242a')
css = css.replace('#ffcb76', '#ffb300')
css = css.replace('#f47c2f', '#ff5722')
css = css.replace('#fff4d9', '#1e2229')
css = css.replace('#fff3ec', '#2a1a15')
css = css.replace('#ab5834', '#ff8a65')
# Typical hardcoded #fff with exact boundaries
css = re.sub(r'#fff\b', '#1e2229', css)

# Fix absolute white where text color might be #fff (which is now #1e2229, bad)
# Let's fix text: white -> #f0f2f5
css = re.sub(r'color: #1e2229;', 'color: #f0f2f5;', css)
css = re.sub(r'color: white;', 'color: #f0f2f5;', css)

# rgba whites to dark overlays
css = re.sub(r'rgba\(255, 255, 255, (0\.\d+)\)', r'rgba(255, 255, 255, 0.05)', css) # make light overlays very subtle
css = re.sub(r'rgba\(255, 252, 246, 0\.7\)', 'rgba(30, 34, 41, 0.7)', css)

# Specific gradient fixes for dark mode
css = re.sub(r'rgba\(255, 196, 110, 0\.52\)', 'rgba(255, 87, 34, 0.15)', css)
css = re.sub(r'rgba\(255, 156, 89, 0\.28\)', 'rgba(255, 179, 0, 0.1)', css)
css = re.sub(r'rgba\(255, 255, 255, 0\.2\)', 'rgba(255, 255, 255, 0.03)', css)
css = re.sub(r'rgba\(255, 238, 205, 0\.95\)', 'rgba(20, 23, 27, 0.95)', css)
css = re.sub(r'rgba\(255, 206, 132, (0\.\d+)\)', r'rgba(255, 87, 34, \1)', css)
css = re.sub(r'rgba\(255, 154, 102, (0\.\d+)\)', r'rgba(255, 179, 0, \1)', css)
css = re.sub(r'rgba\(255, 231, 192, 0\.95\)', 'rgba(255, 87, 34, 0.1)', css)
css = re.sub(r'rgba\(117, 76, 34, 0\.6\)', 'rgba(255, 255, 255, 0.05)', css)
css = re.sub(r'rgba\(244, 124, 47, (0\.\d+)\)', r'rgba(255, 87, 34, \1)', css)
css = re.sub(r'rgba\(255, 191, 105, (0\.\d+)\)', r'rgba(255, 179, 0, \1)', css)
css = re.sub(r'rgba\(255, 208, 130, (0\.\d+)\)', r'rgba(255, 87, 34, \1)', css)
css = re.sub(r'rgba\(255, 204, 125, (0\.\d+)\)', r'rgba(255, 87, 34, \1)', css)
css = re.sub(r'rgba\(255, 222, 171, (0\.\d+)\)', r'rgba(255, 179, 0, \1)', css)
css = re.sub(r'rgba\(202, 89, 21, (0\.\d+)\)', r'rgba(230, 74, 25, \1)', css)
css = re.sub(r'rgba\(255, 205, 134, 0\)', 'rgba(255, 87, 34, 0)', css)
css = re.sub(r'rgba\(255, 241, 219, (0\.\d+)\)', r'rgba(255, 255, 255, 0.02)', css)
css = re.sub(r'rgba\(255, 177, 103, (0\.\d+)\)', r'rgba(255, 87, 34, \1)', css)
css = re.sub(r'rgba\(255, 254, 250, 0\.88\)', 'rgba(20, 23, 27, 0.88)', css)
css = re.sub(r'rgba\(255, 245, 229, 0\.9\)', 'rgba(26, 30, 35, 0.9)', css)
css = re.sub(r'rgba\(213, 130, 53, 0\.16\)', 'rgba(0, 0, 0, 0.4)', css)
css = re.sub(r'rgba\(196, 108, 25, (0\.\d+)\)', r'rgba(255, 87, 34, \1)', css)
css = re.sub(r'rgba\(204, 87, 19, (0\.\d+)\)', r'rgba(255, 87, 34, \1)', css)

with open(css_path, "w") as f:
    f.write(css)
print("CSS updated successfully")
