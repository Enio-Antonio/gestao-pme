from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
  name = serializers.CharField(source="first_name", required=False)

  class Meta:
    model = User
    fields = ["id", "email", "password", "name", "role", "company_name", "company_code"]
    extra_kwargs = {
      "password": {"write_only": True},
      "email": {"required": True}  # Tornamos o email obrigatório
    }

  def create(self, validated_data):
    email = validated_data.get("email")

    first_name = validated_data.pop("first_name", "")

    user = User(
      username=email,  # Preenchendo o username obrigatório com o e-mail
      email=email,
      first_name=first_name,
      role=validated_data.get("role", "employee"),
      company_name=validated_data.get("company_name", ""),
      company_code=validated_data.get("company_code", "")
    )

    user.set_password(validated_data["password"])
    user.save()
    return user
