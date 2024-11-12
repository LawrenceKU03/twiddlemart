
from django.urls import path
from .views import ProductAPIView,CategoriesAPIView,StatsAPIView,ProductsPinnedView

urlpatterns=[
    path("",ProductAPIView.as_view(),name="store_home"),
    path("categories/",CategoriesAPIView.as_view(),name="store_category"),
    path("categories/<slug:slug>/products/",CategoriesAPIView.as_view(),name="store_category"), 
    path("stats/",StatsAPIView,name="store_stats"),
    path("<int:pk>/detail/",ProductAPIView.as_view(),name="store_product_detail"),
    path("user_pinned_products/",ProductsPinnedView,name="store_pinned_products"),
]
