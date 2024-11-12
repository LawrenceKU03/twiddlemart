from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

from apps.store.models import Heart as Product_Heart
from apps.articles.models import Heart as Article_Heart

from apps.store.models import Pin as Product_Pin
from apps.articles.models import Pin as Article_Pin


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        interests = user.userprofile.all()[0].interested_categories.split("+")
        interests.pop()
        token["interested_categories"] = [category.lower()
                                          for category in interests]
        hearts_total = len(Product_Heart.objects.filter(
            user=user))+len(Article_Heart.objects.filter(user=user))
        pins_total = len(Product_Pin.objects.filter(user=user)) + \
            len(Article_Pin.objects.filter(user=user))
        token["email_snippet"] = user.email[:7]+"..."
        token['total_user_hearts'] = hearts_total
        token['total_user_pins'] = pins_total
        token["email"] = user.email
        token["is_verified"] = user.userprofile.all()[0].is_verified

        return token

    def validate(self, attrs):
        email = attrs.get("username")
        user_search = User.objects.filter(email=email)
        if user_search.exists():
            attrs["username"] = user_search[0].username
        return super().validate(attrs)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
