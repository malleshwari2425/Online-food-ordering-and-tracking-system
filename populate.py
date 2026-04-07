import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()

from restaurants.models import Restaurant, MenuItem

if not Restaurant.objects.exists():
    r1 = Restaurant.objects.create(name="Burger King", description="Best burgers in town")
    MenuItem.objects.create(restaurant=r1, name="Whopper", price=5.99, description="Classic burger")
    
    r2 = Restaurant.objects.create(name="Pizza Hut", description="Delicious hot pizzas")
    MenuItem.objects.create(restaurant=r2, name="Pepperoni", price=12.99, description="Cheesy pepperoni")
    
    r3 = Restaurant.objects.create(name="Sushi World", description="Fresh sushi daily")
    MenuItem.objects.create(restaurant=r3, name="California Roll", price=8.99, description="8 pieces")

print("Database populated.")
