from django.conf import settings
from django.db import models
from django.core.urlresolvers import reverse


class Hashtag(models.Model):
    # The hash tag length can't be more than the body length minus the `#`
    text = models.CharField(max_length=139)

    def __str__(self):
        return self.text


class Message(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="messages")
    text = models.CharField(max_length=140)
    created_at = models.DateTimeField(auto_now_add=True)
    stars = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="starred_messages", blank=True)
    tagged_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="messages_tagged_in", blank=True)
    hashtags = models.ManyToManyField(Hashtag, blank=True)

    class Meta:
        ordering = ['-pk']

    def get_absolute_url(self):
        return reverse('my-messages')

    def __str__(self):
        return self.text
