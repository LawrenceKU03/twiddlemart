
#third-party packages imports
import hashlib
from datetime import datetime
from django_nextjs.render import render_nextjs_page_sync
import redis
import json

#custom email handler import
from .EmailHandler import EmailHandler

#django rest framework imports
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics

#django imports
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import send_mail,EmailMultiAlternatives
from django.contrib.auth import authenticate
from django.conf import settings
from django.shortcuts import render

#internal app imports
from .models import UserProfile,TerminationNote
from .serializers import AffliatePartnerSerializer, HomeInfoSerializer
from .models import HomeInfo,AffliatePartner


#external app imports
#* product app imports
from apps.store.models import Product
from apps.store.models import Heart as Product_Heart
from apps.store.models import Pin as Product_Pin
from apps.store.models import Category as Product_Category
from apps.store.serializers import ProductSerializer

#* articles app imports
from apps.articles.models import Article
from apps.articles.models import Heart as Article_Heart
from apps.articles.models import Pin as Article_Pin
from apps.articles.serializers import ArticleSerializer
from apps.articles.interlinkHandler import TextMatch
from apps.articles.models import Category as Article_Category

# Create your views here.

#home page api view
class HomeInfoAPIVIew(generics.RetrieveAPIView):
    #override class variables
    queryset=HomeInfo.objects.all()
    serializer_class=HomeInfoSerializer
    lookup_field="pk"

    def get(self,request,*args,**kwargs):
        print("sent")
        redis_store=redis.Redis(host="localhost",port=settings.REDIS_SERVER_PORT,decode_responses=True)
        if redis_store.exists("home_data"):
            print("pinged cache")
            return Response(json.loads(redis_store.get("home_data")))
        data=self.serializer_class(self.queryset[0]).data
        redis_store.set("home_data",json.dumps(data),ex=settings.REDIS_TTL)
        return Response(data)

#user hearts/pin stats api view
@api_view(["GET"])
def  UserPinHeartStatsAPIView(request,*args,**kwargs):
    data=request.GET.get("uid")
    user=User.objects.get(id=data)
    pins=len(Product_Pin.objects.filter(user=user))+len(Article_Pin.objects.filter(user=user))
    hearts=len(Product_Heart.objects.filter(user=user))+len(Article_Heart.objects.filter(user=user))
    return Response({"hearts_n":hearts,"pins_n":pins})

#signup api view
@api_view(["POST"])
def SignupAPIView(request,*args,**kwargs):
    #get data senr from request
    data=request.data
    username=data["email"].split("@")[0]
    #create params dictionary
    user_data={
        "username":username,
        "email":data["email"],
        "password":data["password"]
    }

    #check if the email is not already used
    #if True send verification email 
    if(User.objects.filter(email=data["email"]).exists()==False):
        user=User.objects.create_user(**user_data)
        interested_categories=""
        for category in data["categories_of_interest"]:
            interested_categories+=category+"+"
        UserProfile.objects.create(user=user,interested_categories=interested_categories)
        send_Email(user)
        return Response({"success":True}) 
    #default to send error response
    return Response({ "message":"email already used","success":False})

#send verification email custom method
def send_Email(user):
    header="ACCOUNT VERIFICATION"
    encrypted_username=hashlib.sha256((settings.SALT_STRING+user.username).encode()).hexdigest()
    timestamp=str(datetime.now())[10:]
    timestamp=timestamp.replace(":","")[:7].replace(" ","")+str(datetime.now())[:10].split("-")[1]
    
    html_content=render_to_string("verify.html",{"user":user,"user_hash":str(encrypted_username),"domain_name":settings.MAIN_WEBSITE_EMAIL_URL,"user_id":f"{user.id}{timestamp}"})
    to=[settings.EMAIL_HOST_USER,user.email]
    string_content=""
    EmailHandler(to,header,string_content,html_content).send_mail()

#api view to resend verification email
@api_view(["POST"])
def resendVerificationEmailAPIView(request,*args,**kwargs):
    data=request.data
    user=User.objects.get(id=data["id"])
    send_Email(user)
    return Response({ "success":True })

#quicksort main method
def quickSortFilterPartition(arr,start,end):
  pivot=arr[end].rank_score
  lsi=start-1
  for j in range(start,end):
      if(arr[j].rank_score > pivot):
          lsi+=1
          temp=arr[lsi]
          arr[lsi]=arr[j]
          arr[j]=temp
  lsi+=1
  temp=arr[lsi]
  arr[lsi]=arr[end]
  arr[end]=temp

  return lsi

#quicksort auxiliary method
def quickSort(arr,start,end):
	if end <= start:
		return
	pivot=quickSortFilterPartition(arr,start,end)
	quickSort(arr,start,pivot-1)
	quickSort(arr,pivot+1,end)

#search api view
class SearchAPIView(generics.ListAPIView):
        #declare and override class/custom variables
        queryset=Product.objects.all()
        queryset_articles=Article.objects.all()

        #overridden get method
        def get(self,request,*args,**kwargs):
            return self.list(request,args,kwargs)
        
        #overridden list method
        def list(self,request,*args,**kwargs):
            #get query[q] and page number[page_num] from GET request
            search_term=request.GET.get("q")
            page_num=request.GET.get("page_num")
            page_num=int(page_num) if page_num else 1

            #filter queryset for products/articles of query
            products=[ obj for obj in Product.objects.filter(title__icontains=search_term) ]
            articles=[ obj for obj in Article.objects.filter(title__icontains=search_term) ]
            
            #create main search result array
            searchResults=[ obj for obj in products+articles ]
            quickSort(searchResults,0,len(searchResults)-1)

            #create serialized JSON objects for products/articles
            data=[ ProductSerializer(obj).data if hasattr(obj,"price") else ArticleSerializer(obj).data for obj in searchResults ]

            #sum array of hearts for articles and products 
            hearts_1=[len(Product_Heart.objects.filter(product=obj)) for obj in products]
            hearts_2=[len(Article_Heart.objects.filter(article=obj)) for obj in articles]

            #sum array of pins for products and articles
            pins_1=[len(Product_Pin.objects.filter(product=obj)) for obj in products]
            pins_2=[len(Article_Pin.objects.filter(article=obj)) for obj in articles]

            #create variables for pagination
            total_pages=1
            query_size=len(data)

            #calculate total pages that exist from total objects available
            if int((query_size/settings.PAGE_SIZE))==1:
                total_pages=1 
            elif(int(query_size/settings.PAGE_SIZE)%2)==0:
                total_pages=int(query_size/settings.PAGE_SIZE)
                total_pages=1 if total_pages==0 else total_pages 
            else:
                total_pages=int(query_size/settings.PAGE_SIZE)
                total_pages=1 if total_pages==0 else total_pages
                total_pages+=1

            #cap page_num to not exceed total_pages
            total_pages=round(query_size/settings.PAGE_SIZE)
            total_pages=total_pages+1  if total_pages <= 0 else total_pages
            page_num=page_num-1 if page_num > total_pages else page_num
           
            #return json response
            return Response({"search_result":{
                #paginate data
                "result":data[(page_num-1)*settings.PAGE_SIZE:(page_num*settings.PAGE_SIZE)],
                "total_pages":total_pages,
                "current_page":page_num
            },"products":len(products),"articles":len(articles),"hearts":sum(hearts_1+hearts_2),"pins":sum(pins_1+pins_2)})


#categories api view
@api_view([ "GET" ])
def CategoriesAPIView(request,*args,**kwargs):
    #declare vairbales
    products_categories=Product_Category.objects.all()
    article_categories=Article_Category.objects.all()

    #create categories array
    categories=[{ "title":category.title.lower(),"app":"products"} for category in products_categories]
    #create categories titles array
    categories_titles=[category["title"].lower() for category in categories]

    #for loop through article categorires
    for category in article_categories:
        #if category not in categories titles array add it
        if not category.title.lower() in categories_titles:
            categories.append({ "title":category.title.lower(),"app":"article" })

    #return JSON response
    return Response(categories)

#authenticate user utility api view
@api_view(["POST"])
def AuthenticateUserAPIView(request,*args,**kwargs):
    data=request.data
    if authenticate(username=data["email"].split("@")[0],password=data["password"]):
        return Response({ "Authenticated":True })
    return Response({ "Authenticated":False })

#update user api view
@api_view(["POST"])
def UpdateUserAPIView(request,*args,**kwargs):
    data=request.data
    #check if user exist
    user=User.objects.filter(username=data["username"])

    #if user exists update user info
    if len(user) >= 1:
        username=data["email"].split("@")[0]
        user[0].email=data["email"]
        user[0].username=username
        user[0].save()
        userprofile=user[0].userprofile.all()[0]
        userprofile.interested_categories="".join(category+"+" for category in data["interested_categories"])

        userprofile.save()
        return Response({ "updated":True })
    return Response({ "updated":False })

#delete account 
@api_view(["POST"])
def deleteAccountAPIView(request,*args,**kwargs):
    data=request.data
    #get user objects
    user=User.objects.get(id=data["user_id"])
    
    #if user exists and the user is authenticated delete account
    if user and authenticate(username=user.username,password=data["password"]):
        TerminationNote.objects.create(desc=data["desc"])
        user.delete()
        return Response({ "account_deleted":True });
    return Response({ "account_deleted":False })


#products and articles home display api view
@api_view(["GET"])
def HomeArticlesProductsAPIView(request,*args,**kwargs):
    products=ProductSerializer(Product.objects.all()[:3],many=True).data
    articles=ArticleSerializer(Article.objects.all()[:3],many=True).data
    return Response({ "products":products,"articles":articles })

#request user password reset
@api_view(["POST"])
def RequestUserAccountPasswordResetAPIView(request,*args,**kwargs):
    data=request.data
    send_reset_Email(data["email"])
    return Response({ "msg":"email sent" })

#custom reset link email method
def send_reset_Email(email):
    user=email.split("@")[0]
    timestamp=str(datetime.now())[10:]
    timestamp=timestamp.replace(":","")[:7].replace(" ","")+str(datetime.now())[:10].split("-")[1]
    header="PASSWORD RESET REQUEST"
    encrypted_username=hashlib.sha256((settings.SALT_STRING+email).encode()).hexdigest()
    domain_name=settings.MAIN_WEBSITE_URL
    html_content=render_to_string("reset_password.html",{"email":user,"user_hash":str(encrypted_username),"domain_name":settings.DOMAIN_URL,"user_id":f"{User.objects.filter(email=email)[0].id}{timestamp}" })
    to=[settings.EMAIL_HOST_USER,email]
    string_content=""
    EmailHandler(to,header,string_content,html_content).send_mail()

#reset password api view
@api_view(["POST"])
def ResetAccountPasswordAPIView(request,*args,**kwargs):
    data=request.data
    id_data=getUserIdTimeEmailSent(data["id"])
    user_id=id_data["userId"]
    timesent=id_data["timeSent"]
    sentdate=id_data["date"]
     
    user=User.objects.filter(id=int(user_id))
    timestamp=str(datetime.now())[10:]
    timestamp=timestamp.replace(":","")[:7].replace(" ","")
    timestamp_date=str(datetime.now())[:10].split("-")[1]
    if user:
        if '{}'.format(hashlib.sha256((settings.SALT_STRING+user[0].email).encode()).hexdigest()) == data["hash"]:
            if(abs(int(timestamp)-int(timesent)) < 1000 and timestamp_date==sentdate):
                user[0].set_password(data["password"])
                user[0].save()
                return Response({ "success":True })
            else:
                return Response({ "success":False})
    return Response({ "success":False })

#function to get user id and time reset email sent
def getUserIdTimeEmailSent(id_str):
	#list id_str
	str_arr=list(id_str)
	str_arr.reverse()
	
	#get user id
	id=str_arr[8:]
	id.reverse()

	#reverse array to normal
	str_arr.reverse()
	#return data
	return { 
	"userId":"".join(i for i in id),
	"timeSent":"".join(j for j in str_arr[len(id):8]),
	"date":id_str[8:]
	}

#function to verify user
@api_view(["POST"])
def VerifyUserAPIView(request,*args,**kwargs):
    data=request.data
    
    id_data=getUserIdTimeEmailSent(data["id"])
    print(id_data,data)
    user_id=id_data["userId"]
    timesent=id_data["timeSent"]
    sentdate=id_data["date"]

    user=User.objects.filter(id=int(user_id))
    timestamp=str(datetime.now())[10:]
    timestamp=timestamp.replace(":","")[:7].replace(" ","")
    timestamp_date=str(datetime.now())[:10].split("-")[1]

    if user:
        if '{}'.format(hashlib.sha256((settings.SALT_STRING+user[0].username).encode()).hexdigest()) == data["hash"]:
            print("prefect match",int(timestamp)-int(timesent))
            if((abs(int(timestamp)-int(timesent)) < 3000) and (timestamp_date==sentdate)):
                print("right on time")
                profile=user[0].userprofile.all()[0]
                profile.is_verified=True
                profile.save()
                return Response({ "success":True })
            else:
                print("too late.")
                return Response({ "success":False})
    return Response({ "success":False })

@api_view(["GET"])
def AffliatePartnersAPIView(request,*args,**kwargs):
    partners=AffliatePartner.objects.all()
    return Response({
        "partners":AffliatePartnerSerializer(partners,many=True).data
        })


