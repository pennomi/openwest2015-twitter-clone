from django.http import Http404
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from django.utils.translation import ugettext as _
from django.views.generic import ListView, edit

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
        # Check to see if user exists. 404 if not.
        username = self.kwargs.get('username')
        user = get_object_or_404(get_user_model(), username=username)

        # Filter messages by the user as author.
        queryset = super().get_queryset()
        return queryset.filter(user=user)


class CreateMessage(edit.CreateView):
    model = Message
    fields = ['text']
    template_name = "message_form.html"

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.user = self.request.user
        obj.save()

        return super().form_valid(form)
