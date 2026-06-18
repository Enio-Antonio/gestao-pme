from rest_framework import viewsets, permissions
from .models import Transacao, Projeto, AtividadeEstrategica, Lead
from .serializers import (TransacaoSerializer, ProjetoSerializer,
                          AtividadeSerializer, LeadSerializer)

class BaseGestaoViewSet(viewsets.ModelViewSet):
    """
    Classe base inteligente: Todas as outras views vão herdar desta.
    Ela garante que o usuário precisa estar logado, e automaticamente
    filtra e salva os dados amarrados à empresa dele.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # SEGURANÇA: Só retorna os dados da empresa do usuário logado
        if self.request.user.empresa:
            return self.queryset.filter(empresa=self.request.user.empresa)
        return self.queryset.none() # Se não tiver empresa, não retorna nada

    def perform_create(self, serializer):
        # SEGURANÇA: Ao criar algo, força o salvamento na empresa do usuário
        serializer.save(empresa=self.request.user.empresa)

# Agora as views reais ficam extremamente curtas e limpas!

class TransacaoViewSet(BaseGestaoViewSet):
    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer

class ProjetoViewSet(BaseGestaoViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer

class AtividadeViewSet(BaseGestaoViewSet):
    queryset = AtividadeEstrategica.objects.all()
    serializer_class = AtividadeSerializer

class LeadViewSet(BaseGestaoViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
