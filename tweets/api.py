from rest_framework import viewsets, permissions, authentication
from tweets import models
from tweets import serializers


class HashtagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Hashtag.objects.all()
    serializer_class = serializers.HashtagSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
    authentication_classes = [authentication.BasicAuthentication,
                              authentication.SessionAuthentication]


class MessageViewSet(viewsets.ModelViewSet):
    queryset = models.Message.objects.all()
    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    authentication_classes = [authentication.BasicAuthentication,
                              authentication.SessionAuthentication]
