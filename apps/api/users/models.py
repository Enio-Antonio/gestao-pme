from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
  ROLE_CHOICES = {
    "admin": "Empresa (Admin)",
    "employee": "Funcionário (Usuário)",
  }

  role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="employee")

  empresa = models.ForeignKey(
    'gestao.Empresa',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='funcionarios'
  )

  def __str__(self):
    return self.email or self.username
