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
            name='HashTag',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('text', models.CharField(max_length=139)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('text', models.CharField(max_length=140)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hash_tags', models.ManyToManyField(to='tweets.HashTag')),
                ('stars', models.ManyToManyField(related_name='starred_messages', to=settings.AUTH_USER_MODEL)),
                ('tagged_users', models.ManyToManyField(related_name='messages_tagged_in', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='messages')),
            ],
        ),
    ]
