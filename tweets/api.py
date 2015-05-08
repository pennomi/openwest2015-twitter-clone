from rest_framework import viewsets, authentication
from tweets import models
from tweets import serializers
from tweets.permissions import MessagePermission, ProfilePermissions
from django.contrib.auth import get_user_model


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [ProfilePermissions]
    authentication_classes = [authentication.BasicAuthentication,
                              authentication.SessionAuthentication]


class HashtagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Hashtag.objects.all()
    serializer_class = serializers.HashtagSerializer
    permission_classes = []
    authentication_classes = []


class MessageViewSet(viewsets.ModelViewSet):
    queryset = models.Message.objects.all()
    serializer_class = serializers.MessageSerializer
    permission_classes = [MessagePermission]
    authentication_classes = [authentication.BasicAuthentication,
                              authentication.SessionAuthentication]

    def get_queryset(self):
        hashtag = self.request.QUERY_PARAMS.get('hashtag')
        user = self.request.QUERY_PARAMS.get('username')
        queryset = self.queryset
        if hashtag:
            queryset = queryset.filter(hashtags__text=hashtag)
        if user:
            queryset = queryset.filter(tagged_users__username=user)
        return queryset

