# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Hashtag',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('text', models.CharField(max_length=139)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('text', models.CharField(max_length=140)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hashtags', models.ManyToManyField(blank=True, to='tweets.Hashtag')),
                ('stars', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL, related_name='starred_messages')),
                ('tagged_users', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL, related_name='messages_tagged_in')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='messages')),
            ],
            options={
                'ordering': ['-pk'],
            },
        ),
    ]
