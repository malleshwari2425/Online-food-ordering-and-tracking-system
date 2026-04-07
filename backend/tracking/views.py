from rest_framework import viewsets, permissions
from .models import Delivery
from .serializers import DeliverySerializer

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'delivery_agent':
            return Delivery.objects.filter(agent=user)
        elif user.role == 'customer':
            return Delivery.objects.filter(order__customer=user)
        return Delivery.objects.all()
