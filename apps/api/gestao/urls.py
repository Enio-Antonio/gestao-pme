from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransacaoViewSet, ProjetoViewSet, AtividadeViewSet, LeadViewSet

router = DefaultRouter()
# Cria automaticamente as rotas: /transacoes/ (GET/POST) e /transacoes/<id>/ (GET/PUT/DELETE)
router.register(r'transacoes', TransacaoViewSet, basename='transacao')
router.register(r'projetos', ProjetoViewSet, basename='projeto')
router.register(r'atividades', AtividadeViewSet, basename='atividade')
router.register(r'leads', LeadViewSet, basename='lead')

urlpatterns = [
    path('', include(router.urls)),
]
