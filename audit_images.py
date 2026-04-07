import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import MenuItem
from collections import defaultdict

url_map = defaultdict(list)
for item in MenuItem.objects.all():
    url_map[item.image].append(item)

print("\n--- Duplicated Images across Menu ---")
for url, items in url_map.items():
    if len(items) > 1:
        print(f"\nURL: {url[:60]}...")
        for item in items:
            print(f"  - {item.restaurant.name}: {item.name}")
