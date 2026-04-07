import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import Restaurant, MenuItem

def fix_images():
    print("Fixing restaurant images...")
    r_images = {
        "Burger King": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
        "Pizza Hut": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80",
        "Sushi World": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80"
    }
    
    for r in Restaurant.objects.all():
        if r.name in r_images:
            r.image = r_images[r.name]
            r.save()
            
    print("Fixing menu item images...")
    m_images = {
        "Whopper": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
        "Crispy Chicken Sandwich": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&q=80",
        "Double Cheeseburger": "https://images.unsplash.com/photo-1586816001966-79b736744398?w=500&q=80",
        "Crispy Onion Rings": "https://images.unsplash.com/photo-1639024471283-030a10c73e1c?w=500&q=80",
        "French Fries (Large)": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80",
        "Chocolate Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80",
        "Pepperoni Pizza": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
        "Margherita Pizza": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
        "BBQ Chicken Pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
        "Veggie Supreme": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80",
        "Garlic Bread": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80",
        "Pasta Arrabbiata": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",
        "California Roll": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
        "Salmon Sashimi": "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80",
        "Spicy Tuna Roll": "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80",
        "Tonkotsu Ramen": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
        "Shrimp Tempura": "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&q=80",
        "Miso Soup": "https://images.unsplash.com/photo-1623594833246-32ecfb0f545a?w=500&q=80"
    }

    for idx, item in enumerate(MenuItem.objects.all()):
        if item.name in m_images:
            item.image = m_images[item.name]
        else:
            # Fallback random image
            item.image = f"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80&rand={idx}"
        item.save()

    print("Finished updating images!")

if __name__ == "__main__":
    fix_images()
