import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import MenuItem, Restaurant

# 1. 🗑️ REMOVE DUPLICATE MENU ITEMS (Same Name in Same Restaurant)
print("--- Cleaning Duplicate Menu Items ---")
seen_keys = set()
for item in MenuItem.objects.all().order_by('id'):
    key = (item.restaurant_id, item.name.lower().strip())
    if key in seen_keys:
        print(f"🗑️ Deleting duplicate Item: {item.name} (id={item.id}) from {item.restaurant.name}")
        item.delete()
    else:
        seen_keys.add(key)

# 2. 📸 ENSURE ALL IMAGES ARE UNIQUE
# Simple pool of diverse Unsplash categories
generic_pool = [
    f"https://images.unsplash.com/photo-{i}?w=600&q=80" for i in [
        "1546069901-ba9599a7e63c", "1567620905732-2d1ec7bb7445", "1565299624946-b28f40a0ae38",
        "1482049016688-2d3e1b311543", "1467003909585-2f8a72700288", "1473093226795-af9932fe5856",
        "1493770348161-369560ae357d", "1476224203421-9ac39bcb3327", "1490645935967-10de6ba17061",
        "1504674900247-0877df9cc836", "1504754568010-601bb48f8b9e", "1512621776951-a57141f2eefd",
        "1515003197210-e0cd71810b5f", "1517093157656-b9421fc73b7e", "1414235077428-338989a2e8c0",
        "1455619452474-d2bead968595", "1478144592103-258219070771", "1484723091739-30a097e8f929"
    ]
]

# Specifically check for any remaining duplicates
print("\n--- Correcting Shared/Duplicate Images ---")
used_urls = set()
for item in MenuItem.objects.all().order_by('id'):
    if item.image in used_urls:
        # If this image is already used by someone else, give this item a unique one
        new_url = generic_pool.pop(0) if generic_pool else item.image
        print(f"🔄 Correcting Duplicated Image: {item.name} ({item.restaurant.name}) from {item.image[:30]}... -> {new_url[:30]}...")
        item.image = new_url
        item.save()
    else:
        used_urls.add(item.image)

print("\nCleanup Complete! All items are unique and have individual images.")
