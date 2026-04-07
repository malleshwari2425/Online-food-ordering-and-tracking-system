import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import Restaurant, MenuItem

# High-quality Unsplash food images
MENU_DATA = {
    "Burger King": [
        {
            "name": "Whopper",
            "description": "Flame-grilled beef patty with fresh vegetables",
            "price": 5.99,
            "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80"
        },
        {
            "name": "Crispy Chicken Sandwich",
            "description": "Golden crispy fried chicken with pickles & mayo",
            "price": 6.49,
            "image": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80"
        },
        {
            "name": "Double Cheeseburger",
            "description": "Two beef patties with double American cheese",
            "price": 7.99,
            "image": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80"
        },
        {
            "name": "Crispy Onion Rings",
            "description": "Golden battered onion rings with dipping sauce",
            "price": 3.49,
            "image": "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80"
        },
        {
            "name": "French Fries (Large)",
            "description": "Perfectly salted golden crispy fries",
            "price": 2.99,
            "image": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80"
        },
        {
            "name": "Chocolate Shake",
            "description": "Thick and creamy classic chocolate milkshake",
            "price": 3.99,
            "image": "https://images.unsplash.com/photo-1572490122747-3a6c5a9fecaa?w=500&q=80"
        },
    ],
    "Pizza Hut": [
        {
            "name": "Pepperoni Pizza",
            "description": "Loaded with pepperoni and melted mozzarella",
            "price": 12.99,
            "image": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80"
        },
        {
            "name": "Margherita Pizza",
            "description": "Classic tomato sauce, fresh basil & mozzarella",
            "price": 10.99,
            "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80"
        },
        {
            "name": "BBQ Chicken Pizza",
            "description": "Smoky BBQ sauce with grilled chicken & onions",
            "price": 13.99,
            "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80"
        },
        {
            "name": "Veggie Supreme",
            "description": "Bell peppers, mushrooms, olives & onions",
            "price": 11.49,
            "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80"
        },
        {
            "name": "Garlic Bread",
            "description": "Toasted garlic butter bread with herbs",
            "price": 4.99,
            "image": "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&q=80"
        },
        {
            "name": "Pasta Arrabbiata",
            "description": "Spicy tomato pasta with fresh herbs",
            "price": 9.99,
            "image": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80"
        },
    ],
    "Sushi World": [
        {
            "name": "California Roll",
            "description": "Crab, avocado and cucumber — 8 pieces",
            "price": 8.99,
            "image": "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500&q=80"
        },
        {
            "name": "Salmon Sashimi",
            "description": "Fresh premium salmon slices — 6 pieces",
            "price": 13.99,
            "image": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&q=80"
        },
        {
            "name": "Spicy Tuna Roll",
            "description": "Tuna with spicy mayo and cucumber — 8 pieces",
            "price": 10.99,
            "image": "https://images.unsplash.com/photo-1617196034099-b65365533679?w=500&q=80"
        },
        {
            "name": "Tonkotsu Ramen",
            "description": "Rich pork broth, chashu, soft egg & nori",
            "price": 14.99,
            "image": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500&q=80"
        },
        {
            "name": "Shrimp Tempura",
            "description": "Crispy battered shrimp with dipping sauce",
            "price": 11.49,
            "image": "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&q=80"
        },
        {
            "name": "Miso Soup",
            "description": "Traditional Japanese miso with tofu & wakame",
            "price": 3.49,
            "image": "https://images.unsplash.com/photo-1607301405752-842f3f59af3e?w=500&q=80"
        },
    ]
}

for restaurant_name, items in MENU_DATA.items():
    try:
        restaurant = Restaurant.objects.get(name=restaurant_name)
        # Clear existing menu items
        restaurant.menu_items.all().delete()
        for item_data in items:
            MenuItem.objects.create(
                restaurant=restaurant,
                name=item_data["name"],
                description=item_data["description"],
                price=item_data["price"],
                image=item_data["image"]
            )
        print(f"✓ Updated {restaurant_name} with {len(items)} items")
    except Restaurant.DoesNotExist:
        print(f"✗ Restaurant '{restaurant_name}' not found")

print("\nDone! All menus updated.")
