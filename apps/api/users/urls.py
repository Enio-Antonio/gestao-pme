from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .views import UserDetail, UserList

urlpatterns = [
    # Esta é a rota que atende o cadastro (POST para /users/)
    path("", UserList.as_view(), name="users_list"),
    path("<int:pk>/", UserDetail.as_view(), name="users_detail"),
    # Esta é a rota que atende o login (POST para /users/login/)
    path("login/", obtain_auth_token, name="api_token_auth"),
]
