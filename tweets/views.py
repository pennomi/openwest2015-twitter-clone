from django.shortcuts import render
from django.views.generic import ListView

from .models import Message

class MessageList(ListView):
    model = Message
