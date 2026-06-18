from django.db import models

class Empresa(models.Model):
    razao_social = models.CharField(max_length=255)
    nome_fachada = models.CharField(max_length=255, blank=True, null=True)
    cnpj = models.CharField(max_length=18, unique=True)
    regime_tributario = models.CharField(max_length=100, blank=True, null=True)
    segmento = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.razao_social

class Transacao(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="transacoes")
    titulo = models.CharField(max_length=255)
    tipo = models.CharField(max_length=15, choices=[("receita", "Receita"), ("despesa", "Despesa")])
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data = models.DateField()

class Projeto(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="projetos")
    nome = models.CharField(max_length=255)
    status = models.CharField(max_length=20, default="planejado")
    progresso = models.IntegerField(default=0)

