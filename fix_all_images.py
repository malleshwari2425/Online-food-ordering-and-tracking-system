import os
import django
import urllib.request
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import Restaurant, MenuItem

def themealddb_search(query):
    """Fetch best matching image from TheMealDB"""
    encoded = urllib.parse.quote(query)
    url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + encoded
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = json.loads(urllib.request.urlopen(req, timeout=6).read())
        meals = data.get('meals') or []
        if meals:
            return meals[0]['strMealThumb']
    except Exception as e:
        print(f"  TheMealDB error for '{query}': {e}")
    return None

import urllib.parse

# ─── STEP 1: Fix Restaurant Hero Images ───────────────────────────────────────
# Foodish API confirmed working 200 OK in earlier test
RESTAURANT_IMAGES = {
    "Taste of India":      "https://foodish-api.com/images/butter-chicken/butter-chicken2.jpg",
    "Mumbai Spice House":  "https://foodish-api.com/images/samosa/samosa1.jpg",
}

for rname, rimg in RESTAURANT_IMAGES.items():
    r = Restaurant.objects.filter(name=rname).first()
    if r:
        r.image = rimg
        r.save()
        print(f"[Restaurant] {r.name} hero image updated")

# ─── STEP 2: Search TheMealDB for Dal Makhani and Gulab Jamun ─────────────────
print("\nSearching TheMealDB for dish images...")
dal_img   = themealddb_search("dal")
gulab_img = themealddb_search("gulab jamun")
print(f"  Dal      : {dal_img}")
print(f"  Gulab    : {gulab_img}")

# ─── STEP 3: Apply ALL Correct Images for Taste of India ──────────────────────
# Verified working foodish and TheMealDB images mapped to exact dish names
MENU_IMAGE_MAP = {
    "Butter Chicken":      "https://foodish-api.com/images/butter-chicken/butter-chicken1.jpg",
    "Paneer Tikka Masala": "https://foodish-api.com/images/butter-chicken/butter-chicken3.jpg",
    "Masala Dosa":         "https://foodish-api.com/images/dosa/dosa2.jpg",
    "Dal Makhani":         dal_img or "https://www.themealdb.com/images/media/meals/qrqywr1503066605.jpg",
    "Hyderabadi Biryani":  "https://foodish-api.com/images/biryani/biryani1.jpg",
    "Gulab Jamun":         gulab_img or "https://www.themealdb.com/images/media/meals/wtqrqw1511450031.jpg",
}

print("\nUpdating menu items...")
for dish_name, image_url in MENU_IMAGE_MAP.items():
    updated = 0
    for item in MenuItem.objects.all():
        if dish_name.lower() in item.name.lower():
            item.image = image_url
            item.save()
            url_short = image_url.split('/')[-1]
            print(f"  OK  {item.name:30s} -> {url_short}")
            updated += 1
    if not updated:
        print(f"  !!  NOT FOUND: {dish_name}")

# ─── STEP 4: Verify Final State ────────────────────────────────────────────────
print("\n=== FINAL STATE: Taste of India ===")
restaurant = Restaurant.objects.get(name="Taste of India")
print(f"  Hero image: {restaurant.image.split('/')[-1]}")
for item in MenuItem.objects.filter(restaurant=restaurant).order_by('name'):
    print(f"  {item.name:30s} -> {item.image.split('/')[-1]}")
