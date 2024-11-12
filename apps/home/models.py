from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class HomeInfo(models.Model):
    catch_phrase = models.CharField(max_length=255)
    desc = models.TextField()
    image = models.ImageField(upload_to="images/home/")
    is_store_visible = models.BooleanField(default=False)


class UserProfile(models.Model):
    user = models.ForeignKey(
        User, related_name="userprofile", on_delete=models.CASCADE)
    interested_categories = models.CharField(max_length=255)
    articles_viewed = models.IntegerField(default=0)
    products_viewed = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class TerminationNote(models.Model):
    desc = models.TextField()


class AffliatePartner(models.Model):
    title = models.CharField(max_length=255, default="Amazon")
    logo = models.ImageField(null=True, blank=True,
                             upload_to="affliate_partner_logos/")
    desc = models.TextField()

    def __str__(self):
        return self.title
