from django.contrib import admin
from .models import Hashtag, Message


class MessageAdmin(admin.ModelAdmin):
    readonly_fields = ["tagged_users", "hashtags"]


admin.site.register(Hashtag)
admin.site.register(Message, MessageAdmin)
