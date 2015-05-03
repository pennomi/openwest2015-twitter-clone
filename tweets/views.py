from django.shortcuts import render
from django.views.generic import ListView

from .models import Message

class MessageList(ListView):
    template_name = "message_list.html"
    model = Message
