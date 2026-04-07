from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'restaurant', 'status', 'total_amount', 'created_at', 'delivery_address', 'items']
        read_only_fields = ['customer', 'total_amount', 'status']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total amount
        total = sum([item['price'] * item['quantity'] for item in items_data])
        
        order = Order.objects.create(total_amount=total, **validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            
        return order
