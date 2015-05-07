from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError


class RegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = get_user_model()
        fields = ["username", "password"]

    def clean_username(self):
        User = get_user_model()
        wanted = self.cleaned_data['username']
        if User.objects.filter(username=wanted).exists():
            raise ValidationError('Username is already taken', code='invalid')

        return wanted
