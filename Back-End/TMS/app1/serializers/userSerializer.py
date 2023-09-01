from ..models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ['name','email','roles', 'address', 'contact','password']
    
    def create(self, validate_data):
        password = validate_data.pop('password')
        roles = validate_data.pop('roles', [])
        user = User(**validate_data)
        user.set_password(password)
        user.save()
    
        # I need to get all the role's and set it to user.roles
        for role in roles:
            user.roles.add(role)

        return user




