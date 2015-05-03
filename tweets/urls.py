from django.conf.urls import url

from .views import MessageList, MyMessageList, FilteredMessageList


urlpatterns = [
    url(r'^my-messages/$', MyMessageList.as_view()),
    url(r'^messages/(?P<username>\w+)/$', FilteredMessageList.as_view()),
    url(r'^$|^messages/$', MessageList.as_view()),
]
