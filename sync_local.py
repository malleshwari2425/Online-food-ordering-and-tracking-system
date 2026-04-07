import os
import django
import urllib.request
import hashlib

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import Restaurant, MenuItem

def sync_local_images():
    # Ensure directories exist
    public_dir = 'e:\\online-food ordering\\frontend\\public'
    assets_dir = os.path.join(public_dir, 'assets')
    if not os.path.exists(assets_dir): os.makedirs(assets_dir)
    
    # 1. Sync Restaurants
    for r in Restaurant.objects.all():
        if r.image.startswith('http'):
            try:
                filename = f"rest_{r.id}_{hashlib.md5(r.name.encode()).hexdigest()[:8]}.jpg"
                path = os.path.join(assets_dir, filename)
                print(f"Downloading {r.name} banner...")
                req = urllib.request.Request(r.image, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as response, open(path, 'wb') as f:
                    f.write(response.read())
                r.image = f"/assets/{filename}"
                r.save()
            except Exception as e:
                print(f"  Error for restaurant {r.name}: {e}")

    # 2. Sync Menu Items
    for item in MenuItem.objects.all():
        if item.image.startswith('http'):
            try:
                # Use a unique name based on item id and name
                filename = f"item_{item.id}_{hashlib.md5(item.name.encode()).hexdigest()[:8]}.jpg"
                path = os.path.join(assets_dir, filename)
                print(f"Downloading {item.name}...")
                req = urllib.request.Request(item.image, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as response, open(path, 'wb') as f:
                    f.write(response.read())
                item.image = f"/assets/{filename}"
                item.save()
            except Exception as e:
                print(f"  Error for item {item.name}: {e}")

if __name__ == "__main__":
    sync_local_images()
    print("\n--- ALL IMAGES ARE NOW LOCAL ---")
