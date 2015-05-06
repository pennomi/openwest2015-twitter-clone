from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.core.urlresolvers import reverse
from .tools import UsertagParser, HashtagParser


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

    def save(self):
        # Must already exist in DB to be used in m2m relations below
        super().save()

        # Look up users and create FKs to them if they exist
        User = get_user_model()
        usertags = UsertagParser().get_matches(self.text)

        # Update our tagged_users
        self.tagged_users.clear()
        tagged_users = User.objects.filter(username__in=usertags)
        self.tagged_users.add(*list(tagged_users))

        # Update our hashtags
        self.hashtags.clear()
        hashtags = HashtagParser().get_matches(self.text)
        # get_or_create returns a 2-tuple with (object, was_created?)
        hashtags = [Hashtag.objects.get_or_create(text=tag)[0] for tag in hashtags]
        self.hashtags.add(*hashtags)
