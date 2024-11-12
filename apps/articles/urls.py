
from django.urls import path
from .views import (
    FetchArticlesAPIView,
    FetchCategoriesAPIView,
    StatsAPIView,
    IsHearted_CreateDeleteHeart_APIView,
    IsPinned_CreateDeletePin_APIView,
    IsSharedAPIView,
    ArticleHeartPinInfo,
    ArticlePinnedView,
    ArticlesTrendingAPIView
)

urlpatterns = [
    path("", FetchArticlesAPIView.as_view(), name="articles_home"),
    path("<str:slug>/detail/", FetchArticlesAPIView.as_view(), name="article_detail"),
    path("categories/", FetchCategoriesAPIView.as_view(),
         name="article_categories"),
    path("categories/<str:slug>/articles/",
         FetchCategoriesAPIView.as_view(), name="categories_articles"),
    path("stats/", StatsAPIView, name="articles_stats"),
    path("utils/ishearted/", IsHearted_CreateDeleteHeart_APIView,
         name="ishearted_articles"),
    path("utils/ispinned/", IsPinned_CreateDeletePin_APIView,
         name="ispinned_articles"),
    path("utils/isshared/", IsSharedAPIView, name="isshared_articles"),
    path("utils/stats-info/", ArticleHeartPinInfo, name="stats-info"),
    path("user_pinned_articles/", ArticlePinnedView, name="user_pinned_articles"),
    path("trending/", ArticlesTrendingAPIView, name="articles_trending")
]
