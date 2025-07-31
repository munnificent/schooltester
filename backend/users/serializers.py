from rest_framework import serializers
from .models import User, Profile

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'avatar', 'phone', 'school', 'student_class', 'parent_name', 'parent_phone', 'enrolled_courses')

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'last_login', 'profile', 'password')
        read_only_fields = ('last_login',)

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password', None)
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(**validated_data, password=password)
        Profile.objects.get_or_create(user=user, defaults=profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.role = validated_data.get('role', instance.role)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()

        profile.phone = profile_data.get('phone', profile.phone)
        profile.school = profile_data.get('school', profile.school)
        profile.student_class = profile_data.get('student_class', profile.student_class)
        profile.parent_name = profile_data.get('parent_name', profile.parent_name)
        profile.parent_phone = profile_data.get('parent_phone', profile.parent_phone)
        profile.save()

        return instance

class TeacherPublicSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile']