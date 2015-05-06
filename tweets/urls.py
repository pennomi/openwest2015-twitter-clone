from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from .views import MessageList, MyMessageList, FilteredMessageList, CreateMessage


urlpatterns = [
    url(r'^my-messages/$', MyMessageList.as_view(), name="my-messages"),
    url(r'^messages/(?P<username>\w+)/$', FilteredMessageList.as_view()),
    url(r'^$|^messages/$', MessageList.as_view()),
    url(r'^new/$', login_required(CreateMessage.as_view()))
]
