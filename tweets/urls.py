from django.conf.urls import url, include
from django.contrib.auth.decorators import login_required
from rest_framework import routers

from .views import MessageList, MyMessageList, FilteredMessageList, CreateMessage
from tweets import api

# Generate the API URLs
router = routers.DefaultRouter()
router.register(r'users', api.UserViewSet)
router.register(r'hashtags', api.HashtagViewSet)
router.register(r'messages', api.MessageViewSet)


urlpatterns = [
    url(r'^my-messages/$', MyMessageList.as_view(), name="my-messages"),
    url(r'^messages/(?P<username>\w+)/$', FilteredMessageList.as_view(), name="user-messages"),
    url(r'^$|^messages/$', MessageList.as_view(), name="index"),
    url(r'^new/$', login_required(CreateMessage.as_view())),
    url(r'^api/', include(router.urls))
]
