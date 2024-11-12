"""twiddlemart URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .AuthTokensHandler import MyTokenObtainPairView
from .views import (
    uni_nextjs_page_view
)

from .sitemaps import ArticlesViewSitemap, StaticViewSitemap
from django.contrib.sitemaps.views import sitemap
from django.views.generic import TemplateView
sitemaps = {"static": StaticViewSitemap, "articles": ArticlesViewSitemap}

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/home/", include("apps.home.urls")),
    path("api/articles/", include("apps.articles.urls")),
    path("api/store/", include("apps.store.urls")),
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("sitemap.xml/", sitemap, {"sitemaps": sitemaps},
         name="django.contrib.sitemaps.views.sitemap"),
    path("robots.txt/",
         TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),

    path("", uni_nextjs_page_view, name="home"),
    path("about-us", uni_nextjs_page_view, name="about-us"),
    path("privacy-policy", uni_nextjs_page_view, name="privacy-policy"),
    path("auth/login", uni_nextjs_page_view, name="login"),
    path("auth/signup", uni_nextjs_page_view, name="signup"),
    path("auth/<str:slug>/reset", uni_nextjs_page_view, name="reset"),
    path("articles", uni_nextjs_page_view, name="articles"),
    path("articles/<str:slug>/detail",
         uni_nextjs_page_view, name="article-detail"),
    path("store", uni_nextjs_page_view, name="store"),
    path("store/<int:id>/detail", uni_nextjs_page_view, name="product_detail"),
    path("dashboard", uni_nextjs_page_view, name="dashboard"),
    path("search", uni_nextjs_page_view, name="search"),
    path("auth/<str:hash>/<int:id>", uni_nextjs_page_view,  name="reset_password"),
    path("", include("django_nextjs.urls")),


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = "apps.views.error_404"
handler500 = "apps.views.error_500"
