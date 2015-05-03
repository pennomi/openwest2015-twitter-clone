from django.http import Http404
from django.shortcuts import render
from django.utils.translation import ugettext as _
from django.views.generic import ListView

from .models import Message

class MessageList(ListView):
    template_name = "message_list.html"
    model = Message


class MyMessageList(MessageList):

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user=self.request.user)


class FilteredMessageList(MessageList):

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(user__username=self.kwargs.get('username'))
        if not queryset:
            raise Http404(_('Username not found.'))

        return queryset
