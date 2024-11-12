from collections import Counter

import redis
import json

from django.shortcuts import render
from django.contrib.auth.models import User
from django.conf import settings

from rest_framework import generics, mixins
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Product, Category, Heart, Pin
from .serializers import ProductSerializer, CategorySerizializer

# Create your views here.

#quicksort utility function
def quickSortFilterPartition(product_arr, start, end):
    pivot = product_arr[end].rank_score
    ixd = start-1

    for j in range(start, ixd):
           if (product_arr[j].rank_score > pivot):
            ixd += 1
            temp = product_arr[ixd]
            product_arr[ixd] = product_arr[j]
            product_arr[j] = temp
    ixd += 1
    temp = product_arr[ixd]
    product_arr[ixd] = product_arr[end]
    product_arr[end] = temp
    return ixd

#quicksort function
def quickSortFilterItems(product_arr, start, end):
    if end <= start:
        return
    pi = quickSortFilterPartition(product_arr, start, end)
    quickSortFilterPartition(product_arr, start, pi-1)
    quickSortFilterPartition(product_arr, pi+1, end)


#zip unique categories function
def zip_str_array(arr_1,arr_2):
    new_arr=arr_1
    for category in arr_2:
        if category not in new_arr:
            new_arr.append(category)
    return new_arr


class ProductAPIView(generics.GenericAPIView, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = "pk"

     # overridden get method
    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        redis_store=redis.Redis(host="localhost",port=settings.REDIS_SERVER_PORT,decode_responses=True)
        if pk:
            if redis_store.exists("product-{}".format(pk)):
                print("pinged product cache")
                data=json.loads(redis_store.get("product-{}".format(pk)))
                return Response(data)
            redis_store.set("product-{}".format(pk),json.dumps(self.serializer_class(Product.objects.get(pk=pk)).data),ex=settings.REDIS_TTL)
            return self.retrieve(request, *args, **kwargs)

    # overridden post method
    def post(self, request, *args, **kwargs):
        #variables
        data=request.data

        #check if type is absent to send products data json
        if data.get("type") == None:
            # get declare and get variables
            user_id = request.GET.get("user_id")

            # check if page_num is set is default to 1
            page_num = request.GET.get("page_num")
            page_num = int(page_num) if page_num else 1

            #user activity data
            user_activity_data=request.data
            user_activity_arr=[]

            for key in Counter(user_activity_data["data"]).most_common():
                if len(user_activity_arr) < 3:
                    if key[0]:
                        user_activity_arr.append(key[0].capitalize().replace("-"," "))
 
            total_pages = 1

            # if user id exits return custom queryset
            if user_id:
                # security check for user profiles
                if len(User.objects.get(id=user_id).userprofile.all()) == 0:
                    return Response(self.serializer_class(self.queryset.all(), many=True).data)

                # get user intermst categories array
                interested_categories = User.objects.get(id=user_id).userprofile.all()[
                                                         0].interested_categories.split("+")
                interested_categories.pop()
                interested_categories = [
                    category.capitalize() for category in interested_categories]
                categories = Category.objects.filter(
                    title__in=zip_str_array(interested_categories,user_activity_arr))
                serializable_categories_products = []

                for category in categories:
                    for product in category.products.all():
                        serializable_categories_products.append(product)
                
                quickSortFilterItems(serializable_categories_products, 0, len(
                    serializable_categories_products)-1)
                for category in Category.objects.all():
                    if category.title.lower() not in [categori.title.lower() for categori in categories]:
                        for product in category.products.all():
                            serializable_categories_products.append(product)

                query_size = len(self.queryset.all())
                if ((query_size/settings.PAGE_SIZE) % 2) == 0:
                    total_pages = int(query_size/settings.PAGE_SIZE)
                    total_pages = 1 if total_pages == 0 else total_pages
                else:
                    total_pages = int(query_size/settings.PAGE_SIZE)
                    total_pages = 1 if total_pages == 0 else total_pages
                    total_pages += 1

                data = self.serializer_class(serializable_categories_products[(
                    (page_num-1)*settings.PAGE_SIZE):(page_num*settings.PAGE_SIZE)], many=True).data

                return Response({
                    "current_page": page_num,
                    "total_pages": total_pages,
                    "result": data
                    })

            categories = Category.objects.filter(title__in=user_activity_arr)
            serializable_categories_products = []

            for category in categories:
                for product in category.products.all():
                    serializable_categories_products.append(product)
            quickSortFilterItems(serializable_categories_products, 0, len(
                    serializable_categories_products)-1)
            for category in Category.objects.all():
                if category.title.lower() not in [categori.title.lower() for categori in categories]:
                    for product in category.products.all():
                        serializable_categories_products.append(product)

            query_size = len(self.queryset.all())
            if ((query_size/settings.PAGE_SIZE) % 2) == 0:
                total_pages = int(query_size/settings.PAGE_SIZE)
                total_pages = 1 if total_pages == 0 else total_pages
            else:
                total_pages = int(query_size/settings.PAGE_SIZE)
                total_pages = 1 if total_pages == 0 else total_pages
                total_pages += 1

            data = self.serializer_class(serializable_categories_products[(
                    (page_num-1)*settings.PAGE_SIZE):(page_num*settings.PAGE_SIZE)], many=True).data

           
            return Response({
              "current_page":page_num,
               "total_pages":total_pages,
               "result":data
               })
 
    
        product=self.queryset.get(id=data["pk"])

        #check type of post request recieved [code blockk.for share request]
        if data["type"]=="share+":
            product.rank_score+=0.10
            product.save()
            return Response({ "shared":True })

        if data["type"]=="share-":
            product.rank_score-=0.10
            product.save()
            return Response({ "shared":True })
        user=User.objects.get(id=data["user_id"])

       
        #check type of post request recieved [code block for heart requets]
        if data["type"]=="heart":
            isHearted=Heart.objects.filter(user=user,product=product).exists()
            #if checking to see if user hearted product 
            if data["checking"]:
                return Response({ "hearted":isHearted });
            else:
                #if user performed a heart action
                if isHearted==False:
                    product.rank_score+=0.25
                    product.save() 
                    Heart.objects.create(user=user,product=product)
                else:
                    product.rank_score-=0.25
                    product.save()
                    Heart.objects.filter(user=user,product=product)[0].delete()

        #check type of post request recieved [code block for pin requets]
        if data["type"]=="pin":
            isPinned=Pin.objects.filter(user=user,product=product).exists()
            #if checking to see if user pinned product 
            if data["checking"]:
                return Response({ "pinned":isPinned });
           
            if isPinned==False:
                product.rank_score+=0.35
                product.save() 
                Pin.objects.create(user=user,product=product)
            else:
                product.rank_score-=0.35
                product.save()
                Pin.objects.filter(user=user,product=product)[0].delete()
        #default message
        return Response({ "message":"data recieved" });

    

class CategoriesAPIView(generics.GenericAPIView,mixins.ListModelMixin,mixins.RetrieveModelMixin):
    queryset=Category.objects.all()
    serializer_class=CategorySerizializer
    lookup_field="slug"

    #overidden get method
    def get(self,request,*args,**kwargs):
        slug=kwargs.get("slug")
        page_num=request.GET.get("page_num")
        page_num=int(page_num) if page_num else 1

        if slug:
            return self.retrieve(request,page_num,*args,**kwargs)
        return self.list(request,*args,**kwargs)

    #overidden list method
    def list(self,request,*args,**kwargs):
        return Response(self.serializer_class(self.queryset.all(),many=True).data)

    def retrieve(self,request,page_num,*args,**kwargs):
        data_detail=self.serializer_class(self.queryset.get(slug=kwargs.get("slug")))
        data_detail.set_page_num(page_num)
        return Response(data_detail.data) 


@api_view(["GET"])
def StatsAPIView(request,*args,**kwargs):
    hearts=len(Heart.objects.all())
    pins=len(Pin.objects.all())
    products=len(Product.objects.all())
    return Response({ "hearts":hearts,"pins":pins,"products":products})

@api_view(["POST"])
def ProductsPinnedView(request,*args,**kwargs):
    data=request.data
    user=User.objects.get(id=data["user_id"])
    page_num=request.GET.get("page_num") 
    page_num=int(page_num) if page_num else 1
    
    products_og=[pin.product for pin in user.pinned_products.all()]
    products=products_og[((page_num-1)*settings.PAGE_SIZE):(page_num*settings.PAGE_SIZE)]

    #get queryset size
    query_size=len(products_og)

     #check if queryset can be split evenly else split and add 1
    if((query_size/settings.PAGE_SIZE)%2) == 0 or ((query_size/settings.PAGE_SIZE)%2) == 1:
        total_pages=int(query_size/settings.PAGE_SIZE)
        print("true")
        total_pages=1 if total_pages==0 else total_pages
    else:
        total_pages=int(query_size/settings.PAGE_SIZE)
        print("false",(query_size/settings.PAGE_SIZE)%2)
        total_pages=1 if total_pages==0 else total_pages
        total_pages+=1

    return Response({"current_page":page_num,"total_pages":total_pages,"result":ProductSerializer(products,many=True).data })
