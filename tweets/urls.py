from django.conf.urls import url

from .views import MessageList


urlpatterns = [
    url(r'^messages/$', MessageList.as_view())
]
