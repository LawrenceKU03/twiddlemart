from django.contrib import admin
from .models import HomeInfo, UserProfile, TerminationNote, AffliatePartner

# Register your models here.

admin.site.register(HomeInfo)
admin.site.register(UserProfile)
admin.site.register(TerminationNote)
admin.site.register(AffliatePartner)
