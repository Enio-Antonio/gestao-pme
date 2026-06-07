from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Empresa (Admin)"),
        ("employee", "Funcionário (Usuário)"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="employee")
    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_code = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.email or self.username
