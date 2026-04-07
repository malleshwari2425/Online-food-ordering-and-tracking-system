from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'customer':
            return Order.objects.filter(customer=user)
        elif user.role == 'restaurant_owner':
            return Order.objects.filter(restaurant__owner=user)
        elif user.role == 'delivery_agent':
            # This is a bit simplified, but agents could see out_for_delivery orders
            return Order.objects.all()
        return Order.objects.all()

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
