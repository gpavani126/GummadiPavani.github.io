from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('',views.homepage,name="home"),
    path('count/',views.count,name="count"),
]+static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)





