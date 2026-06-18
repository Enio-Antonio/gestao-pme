from rest_framework import serializers
from .models import Empresa, Transacao, Projeto, AtividadeEstrategica, Lead

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'

class TransacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transacao
        fields = '__all__'
        read_only_fields = ['empresa']

class ProjetoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projeto
        fields = '__all__'
        read_only_fields = ['empresa']

class AtividadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtividadeEstrategica
        fields = '__all__'
        read_only_fields = ['empresa']

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ['empresa']
