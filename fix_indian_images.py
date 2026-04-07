import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import MenuItem

fixes = {
    # Distinct, verified Unsplash images for these specific dishes
    "Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82bea2dda?w=600&q=80",
    "Paneer Tikka Masala": "https://images.unsplash.com/photo-1565557613262-b8d9605ce781?w=600&q=80",
    "Hyderabadi Biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80"
}

for name, url in fixes.items():
    items = MenuItem.objects.filter(name__icontains=name)
    if items.exists():
        for item in items:
            item.image = url
            item.save()
            print(f"✅ Updated image for: {item.name}")
    else:
        print(f"❌ Could not find items matching: {name}")

print("Done updating specific Indian dishes!")
