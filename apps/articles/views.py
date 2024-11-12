from collections import Counter

from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Case, When
from django.contrib.auth.models import User
from django.conf import settings

import redis
import json

from rest_framework import generics, mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Article, Tag, Category, Heart, Pin
from .serializers import ArticleSerializer, CategoriesSerializer

from .interlinkHandler import TextMatch

# Create your views here.

# quick sort filter for sorting articles


def FilterArticlesPartition(ArticlesArr, start, end):
    pivot = ArticlesArr[start].rank_score
    low = start+1
    high = end

    while True:
        while low <= high and pivot <= ArticlesArr[high].rank_score:
            high = high-1
        while low <= high and pivot >= ArticlesArr[low].rank_score:
            low = low+1
        if low <= high:
            ArticlesArr[low], ArticlesArr[high] = ArticlesArr[high], ArticlesArr[low]
        else:
            break
    ArticlesArr[start], ArticlesArr[high] = ArticlesArr[high], ArticlesArr[start]
    return high


# zip unique categories function
def zip_str_array(arr_1, arr_2):
    new_arr = arr_1
    for category in arr_2:
        if category not in new_arr:
            new_arr.append(category)
    return new_arr

# main quick sort function


def FilterArticles(ArticlesArr, start, end):
    if start >= end:
        return
    pi = FilterArticlesPartition(ArticlesArr, start, end)
    FilterArticles(ArticlesArr, start, pi-1)
    FilterArticles(ArticlesArr, pi+1, end)


class FetchArticlesAPIView(mixins.RetrieveModelMixin, generics.GenericAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "slug"

    # overriden get method
    def get(self, request, *args, **kwargs):
        redis_store=redis.Redis(host="localhost",port=settings.REDIS_SERVER_PORT,decode_responses=True)
        _slug = kwargs.get("slug")
        if _slug:
            if redis_store.exists(_slug):
                print("pinged article cache")
                data=json.loads(redis_store.get(_slug))
                return Response(data)
            redis_store.set(_slug,json.dumps(self.serializer_class(Article.objects.get(slug=_slug)).data),ex=settings.REDIS_TTL)
            return self.retrieve(request, *args, **kwargs)

    # overriden list method
    def post(self, request, *args, **kwargs):
        # declare and get variables
        user_id = request.GET.get("uid")

        # check if page_num is set if not set to 1
        page_num = request.GET.get("page_num")
        page_num = int(page_num) if page_num else 1

        # user activity data
        user_activity_data = request.data["userInterests"]["data"]
        user_clicked_articles = request.data["userClickedArticles"]["data"]
        user_activity_arr = []

        for key in Counter(user_activity_data).most_common():
            if len(user_activity_arr) < 3:
                if key[0]:
                    user_activity_arr.append(
                        key[0].capitalize().replace("-", " "))

        total_pages = 1
        print(user_activity_arr)

        # connect to redis cache store
        redis_store = redis.Redis(
                host="localhost", port=settings.REDIS_SERVER_PORT, decode_responses=True)

        print(user_id)
        # if a user is logged in create customized queryset
        if user_id:
            # get user object
            user=User.objects.get(id=user_id)
           
            if redis_store.exists("uid-{}".format(user.id)):
                orderedArticles = json.loads(
                redis_store.get("uid-{}".format(user.id)))

                # get queryset sizey
                query_size = len(orderedArticles)

                # check if queryset can be split evenly else split and add 1
                if ((query_size/settings.PAGE_SIZE) % 2) == 0:
                    total_pages = int(query_size/settings.PAGE_SIZE)
                    total_pages = 1 if total_pages == 0 else total_pages
                else:
                    total_pages = int(query_size/settings.PAGE_SIZE)
                    total_pages = 1 if total_pages == 0 else total_pages
                    total_pages += 1

                   # return json response
                return Response({
                     "current_page": page_num,
                     "total_pages": int(total_pages),
                     "result": 
                        orderedArticles[((page_num-1)*settings.PAGE_SIZE):(page_num*settings.PAGE_SIZE)]
                   })

           #safety check for user profile else return default
            if len(user.userprofile.all())==0:
                return self.Response(self.serializer_class(self.queryset.all(),many=True).data)
            #get categories of user interest
            categories=user.userprofile.all()[0].interested_categories.split("+")
            #remove plus string of at the end of array
            categories.pop()
            #saftey check for text format in categories and swap catehories array with new array
            categories=[category.capitalize() for category in categories]
        
            #get category objects of user interest
            tags_queryset=[]
            for category in Category.objects.filter(title__in=categories):
                  tags_queryset+=list(category.tags.all())
            
            #check if the tag has not being added if so add 
            #while looping through tags gotten from user activity
            for tag in Tag.objects.filter(title__in=user_activity_arr):
                if tag not in tags_queryset:
                    tags_queryset.append(tag)
            #array to hold user interest categories
            serializable_tags_articles=[]

            for tag in tags_queryset:
                serializable_tags_articles+=[article for article in tag.tag_articles.all() if article not in serializable_tags_articles]

            # serializable_tags_articles.append(article)
            #filter/rearrabge based on rank score
            FilterArticles(serializable_tags_articles,0,len(serializable_tags_articles)-1)
            #reverse so highest is at the top
            serializable_tags_articles.reverse()

            new_content_bubble_array=[]
            for article in serializable_tags_articles:
                if article.slug in user_clicked_articles:
                    new_content_bubble_array.append(article)
                else:
                    new_content_bubble_array.insert(0,article)
            
            #loop through categories
            #check if title not.in categories 
            #add to serializable_tags_articles        

            for category in Category.objects.all().exclude(title__in=categories):
               for article in category.articles.all():
                    if article.slug not in user_clicked_articles and article not in serializable_tags_articles:
                        new_content_bubble_array.insert(0,article)
                    else:
                        new_content_bubble_array.append(article)

            #create id[primary key] array
            pk_order=[article.pk for article in new_content_bubble_array]
            #create Case and When for queryset to use and preserved order
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(pk_order)])
            orderedArticles=self.queryset.filter(pk__in=pk_order).order_by(preserved).all()

            #get queryset size
            query_size=len(orderedArticles.all())

            #check if queryset can be split evenly else split and add 1
            if ((query_size/settings.PAGE_SIZE)%2) == 0:
                total_pages=int(query_size/settings.PAGE_SIZE)
                total_pages=1 if total_pages==0 else total_pages
            else:
                total_pages=int(query_size/settings.PAGE_SIZE)
                total_pages=1 if total_pages==0 else total_pages
                total_pages+=1

            redis_store.set("uid-{}".format(user_id),json.dumps(self.serializer_class(orderedArticles.all(),many=True).data),ex=settings.REDIS_TTL)
            
            #return json response
            return Response({
            "current_page":page_num,
            "total_pages":int(total_pages),
            "result":self.serializer_class(
                orderedArticles.all()[((page_num-1)*settings.PAGE_SIZE):(page_num*settings.PAGE_SIZE)],many=True).data                                                                      })

        if redis_store.exists(str(user_activity_arr)):
            print("pinged general cache")
            orderedArticles=json.loads(redis_store.get(str(user_activity_arr)))
          
            # get queryset sizey
            query_size = len(orderedArticles)

            #check if queryset can be split evenly else split and add 1
            if ((query_size/settings.PAGE_SIZE) % 2) == 0:
                total_pages = int(query_size/settings.PAGE_SIZE)
                total_pages = 1 if total_pages == 0 else total_pages
            else:
                total_pages = int(query_size/settings.PAGE_SIZE)
                total_pages = 1 if total_pages == 0 else total_pages
                total_pages += 1


            #return json response
            return Response({
            "current_page":page_num,
            "total_pages":int(total_pages),
            "result":
                orderedArticles[((page_num-1)*settings.PAGE_SIZE):(page_num*settings.PAGE_SIZE)]                                                                  })


        #get category objexts of user interest
        tags_queryset=Tag.objects.filter(title__in=user_activity_arr)
        #array to hold user interest categories
        serializable_tags_articles=[]
        #loop through categories in categories_queryset
        for tag in tags_queryset:
            #loop through articles in category
            for article in tag.tag_articles.all(): 
                #add to user interest categories array
                serializable_tags_articles.append(article)
        
        print(tags_queryset ,"GENERAL")

            #filter/rearrabge based on rank score
        FilterArticles(serializable_tags_articles,0,len(serializable_tags_articles)-1)
        #reverse so highest is at the top
        serializable_tags_articles.reverse()


        #loop through categories
        for category in Category.objects.all():
            #check if title not.in categories 
            for tag in category.tags.all():
                if tag not in user_activity_arr:
                   #if category not in  title loop through category articles
                   for article in tag.tag_articles.all():
                       #add at the bottom of user interest categories
                       serializable_tags_articles.append(article)

        new_content_bubble_array=[]
        for article in serializable_tags_articles:
            if article.slug in user_clicked_articles:
                new_content_bubble_array.append(article)
            else:
                new_content_bubble_array.insert(0,article)
            
        #create id[primary key] array
        pk_order=[article.pk for article in new_content_bubble_array]
        #create Case and When for queryset to use and preserved order
        preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(pk_order)])
        orderedArticles=self.queryset.filter(pk__in=pk_order).order_by(preserved).all()

        #get queryset size
        query_size=len(orderedArticles.all())

        #check if queryset can be split evenly else split and add 1
        if((query_size/settings.PAGE_SIZE)%2) == 0:
            total_pages=int(query_size/settings.PAGE_SIZE)
            total_pages=1 if total_pages==0 else total_pages
        else:
            total_pages=int(query_size/settings.PAGE_SIZE)
            total_pages=1 if total_pages==0 else total_pages
            total_pages+=1

         
        redis_store.set(str(user_activity_arr),json.dumps(self.serializer_class(orderedArticles.all(),many=True).data),settings.REDIS_TTL)
       
        #return json response
        return Response({
            "current_page":page_num,
            "total_pages":int(total_pages),
            "result":self.serializer_class(
                orderedArticles.all()[((page_num-1)*settings.PAGE_SIZE):(page_num*settings.PAGE_SIZE)],many=True).data                                                                     })

class FetchCategoriesAPIView(mixins.ListModelMixin,generics.GenericAPIView,mixins.RetrieveModelMixin):
    #set variables
    queryset=Category.objects.all()
    serializer_class=CategoriesSerializer
    lookup_fields=["slug"]

    #overriden get method
    def get(self,request,*args,**kwargs):
        #declare variables
        #check if page num exist else drfault to 1
        page_num=request.GET.get("page_num")
        page_num=int(page_num) if page_num else 1
        slug=kwargs.get("slug")

        if slug:
            return self.retrieve(request,page_num,*args,**kwargs)
        return self.list(request,*args,**kwargs)

    #overridden list method
    def list(self,request,*args,**kwargs):
        return Response(self.serializer_class(self.queryset.all(),many=True).data)

    #overridden retriev method
    def retrieve(self,request,page_num,*args,**kwargs):
        detail_data=self.serializer_class(self.queryset.get(slug=kwargs.get("slug")))
        detail_data.set_page_num(page_num)
        return Response(detail_data.data)

@api_view(["GET"])
def StatsAPIView(request):
    articles_num=len(Article.objects.all())
    hearts_num=len(Heart.objects.all())
    pins_num=len(Pin.objects.all())

    return Response({"stats_info":{"articles_stats":articles_num,"articles_hearts":hearts_num,"articles_pins":pins_num}})

@api_view(["POST"])
def IsHearted_CreateDeleteHeart_APIView(request):
    data=request.data
    user=User.objects.filter(id=data["user_id"])
    article=Article.objects.filter(id=data["article_id"])

    if(data["isChecking"]):
        if user.exists() and article.exists():
            if user[0].hearted_articles.filter(article=article[0]).exists():
                return Response({"ishearted":True})
        return Response({ "ishearted":False})
    else:
        heart_query=Heart.objects.filter(user=user[0],article=article[0])
        if heart_query.exists():
            heart_query[0].delete()
            article_obj=article[0]
            article_obj.rank_score-=0.25
            article_obj.save()
            return Response({"heart_deleted":True})
        else:
            Heart.objects.create(user=user[0],article=article[0])
            article_obj=article[0]
            article_obj.rank_score+=0.25
            article_obj.save()
            return Response({"heart_created":True})


@api_view(["POST"])
def IsPinned_CreateDeletePin_APIView(request):
    data=request.data
    user=User.objects.filter(id=data["user_id"])
    article=Article.objects.filter(id=data["article_id"])

    if(data["isChecking"]):
        if user.exists() and article.exists():
            if user[0].pinned_articles.filter(article=article[0]).exists():
                return Response({"ispinned":True})
        return Response({ "ispinned":False})
    else:
        pin_query=Pin.objects.filter(user=user[0],article=article[0])
        if pin_query.exists():
            pin_query[0].delete()
            article_obj=article[0]
            article_obj.rank_score-=0.35
            article_obj.save()
            return Response({"pin_deleted":True})
        else:
            Pin.objects.create(user=user[0],article=article[0])
            article_obj=article[0]
            article_obj.rank_score+=0.35
            article_obj.save()
            return Response({"pin_created":True})

@api_view(["POST"])
def IsSharedAPIView(request,*args,**kwargs):
    data=request.data
    article=Article.objects.get(id=data["article_id"])
    if article:
        if data["prevShared"]:
            article.rank_score-=0.15
            article.save()
        else:
            article.rank_score+=0.15
            article.save()
    return Response({ "processed":True})

@api_view(["POST"])
def ArticleHeartPinInfo(request,*args,**kwargs):
    data=request.data
    article=Article.objects.get(pk=data["article_id"])
    return Response({ "hearts":len(Heart.objects.filter(article=article)),"pins":len(Pin.objects.filter(article=article)) })


@api_view(["POST"])
def ArticlePinnedView(request,*args,**kwargs):
    data=request.data
    page_num=request.GET.get("page_num") 
    page_num=int(page_num) if page_num else 1
    user=User.objects.get(id=data["user_id"])

    articles=[pin.article for pin in user.pinned_articles.all()]

    #get queryset size
    query_size=len(articles)

    articles=articles[((page_num-1)*settings.PAGE_SIZE):(page_num*settings.PAGE_SIZE)]

    #check if queryset can be split evenly else split and add 1
    if((query_size/settings.PAGE_SIZE)%2) == 0:
        total_pages=int(query_size/settings.PAGE_SIZE)
        total_pages=1 if total_pages==0 else total_pages
    else:
        total_pages=int(query_size/settings.PAGE_SIZE)
        total_pages=1 if total_pages==0 else total_pages
        total_pages+=1
    print(total_pages,page_num)
    return Response({"current_page":page_num,"total_pages":total_pages,"result":ArticleSerializer(articles,many=True).data })


@api_view(["GET"])
def ArticlesTrendingAPIView(request,*args,**kwargs):
    articles=Article.objects.all()[:5]
    return Response({"articles":ArticleSerializer(articles,many=True).data})
