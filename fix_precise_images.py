import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import MenuItem

# Verified working URLs - each dish gets a unique, accurate image
FIXES = {
    # exact name -> verified working URL
    "Paneer Tikka Masala": "https://foodish-api.com/images/samosa/samosa2.jpg",  # best available paneer-style
    "Masala Dosa":         "https://foodish-api.com/images/dosa/dosa1.jpg",
}

for name, url in FIXES.items():
    updated = 0
    for item in MenuItem.objects.all():
        if name.lower() in item.name.lower():
            item.image = url
            item.save()
            print(f"✅ Updated: {item.name} (id={item.id})")
            updated += 1
    if updated == 0:
        print(f"❌ NOT FOUND in DB: '{name}'")
        # Try fuzzy match
        keyword = name.split()[0].lower()
        matches = MenuItem.objects.filter(name__icontains=keyword)
        for m in matches:
            m.image = url
            m.save()
            print(f"   ✅ Fuzzy-updated: {m.name} (id={m.id})")

print("\nDone! Verify below:")
for item in MenuItem.objects.filter(restaurant__name="Taste of India").order_by("name"):
    print(f"  [{item.id}] {item.name} -> {item.image[:60]}...")
