import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import MenuItem

# 1. FIXED IMAGE POOLS
SUSHI_POOL = [
    f"https://foodish-api.com/images/sushi/sushi{i}.jpg" for i in range(1, 11)
]
BURGER_POOL = [
    f"https://foodish-api.com/images/burger/burger{i}.jpg" for i in range(1, 11)
]
PIZZA_POOL = [
    f"https://foodish-api.com/images/pizza/pizza{i}.jpg" for i in range(1, 11)
]

def update_restaurant_uniqueness(restaurant_name, image_pool):
    items = MenuItem.objects.filter(restaurant__name__icontains=restaurant_name)
    for i, item in enumerate(items):
        if i < len(image_pool):
            item.image = image_pool[i]
            item.save()
            print(f"Set {item.name} -> {item.image}")
        else:
            print(f"Warning: Out of pool for {item.name}")

# Apply to problem restaurants
update_restaurant_uniqueness("Sushi World", SUSHI_POOL)
update_restaurant_uniqueness("Burger King", BURGER_POOL)
update_restaurant_uniqueness("Pizza Hut", PIZZA_POOL)

# We already manually corrected Taste of India and Mumbai Spice House.
# Let's check them for any final duplicates just in case.
print("\n--- Duplicate Check ---")
all_items = MenuItem.objects.all()
images_seen = {}
for item in all_items:
    if item.image in images_seen:
        other = images_seen[item.image]
        print(f"Duplicate found: {item.name} ({item.restaurant.name}) matches {other.name} ({other.restaurant.name})")
    else:
        images_seen[item.image] = item

print("\nDone!")
