from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault
from tweets import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        read_only_fields = (
            "username", "last_login", "date_joined", "first_name", "last_name",
            "is_active",
        )
        exclude = (
            "password", "is_staff", "is_superuser", "groups",
            "user_permissions",
        )


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Hashtag


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only=True, default=CurrentUserDefault())
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = models.Message

        # Don't let these values be edited directly
        read_only_fields = (
            "user", "username", "stars", "tagged_users", "hashtags", "created_at",
        )


