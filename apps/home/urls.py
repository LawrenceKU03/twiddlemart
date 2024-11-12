
from django.urls import path
from .views import (
    HomeInfoAPIVIew,
    UserPinHeartStatsAPIView,
    SignupAPIView,
    SearchAPIView,
    CategoriesAPIView,
    AuthenticateUserAPIView,
    UpdateUserAPIView, deleteAccountAPIView,
    HomeArticlesProductsAPIView,
    RequestUserAccountPasswordResetAPIView,
    ResetAccountPasswordAPIView,
    VerifyUserAPIView,
    resendVerificationEmailAPIView,
    AffliatePartnersAPIView
)

urlpatterns = [
    path("<int:pk>/", HomeInfoAPIVIew.as_view()),
    path("user_hearts_pins_stats/", UserPinHeartStatsAPIView,
         name="user_hearts_pins_stats"),
    path("signup/", SignupAPIView, name="signup"),
    path("search/", SearchAPIView.as_view(), name="search"),
    path("categories/", CategoriesAPIView, name="categories"),
    path("auth_user/", AuthenticateUserAPIView, name="auth_user"),
    path("update_user/", UpdateUserAPIView, name="update_user"),
    path("delete_user/", deleteAccountAPIView, name="delete_user"),
    path("products_articles/", HomeArticlesProductsAPIView,
         name="homepage_articles_products"),
    path("reset_user_password/",
         RequestUserAccountPasswordResetAPIView, name="reset_password"),
    path("reset_account_password/", ResetAccountPasswordAPIView,
         name="reset_account_password"),
    path("verify_user/", VerifyUserAPIView, name="verify_user"),
    path("resend_verification_email/",
         resendVerificationEmailAPIView, name="resend_verification_email"),
    path("affliate_partners/", AffliatePartnersAPIView, name="affliate_partners")
]
