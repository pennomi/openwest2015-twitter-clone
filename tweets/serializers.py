from rest_framework import serializers
from tweets import models


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Hashtag


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Message