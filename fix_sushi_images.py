import os
import django
import urllib.request
import json
import urllib.parse

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import Restaurant, MenuItem

def themealdb_search(query):
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

print("Fetching images from TheMealDB...")
sushi_img = themealdb_search("sushi")
salmon_img = themealdb_search("salmon")
tuna_img = themealdb_search("tuna")

print(f"  Sushi  : {sushi_img}")
print(f"  Salmon : {salmon_img}")
print(f"  Tuna   : {tuna_img}")

# 1. Update Hero Image for Sushi World
rest = Restaurant.objects.filter(name__icontains="Sushi World").first()
if rest:
    rest.image = sushi_img
    rest.save()
    print(f"✅ Updated hero image for {rest.name}")

# 2. Update Menu Items
IMAGE_MAP = {
    "California Roll": sushi_img,
    "Salmon Sashimi": salmon_img,
    "Spicy Tuna": tuna_img
}

print("\nUpdating menu items...")
for dish_name, img_url in IMAGE_MAP.items():
    if not img_url: continue
    item = MenuItem.objects.filter(restaurant=rest, name__icontains=dish_name).first()
    if item:
        item.image = img_url
        item.save()
        print(f"✅ Updated {item.name}")
    else:
        print(f"❌ Could not find MenuItem matching {dish_name}")
