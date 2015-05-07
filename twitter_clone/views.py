from django.views.generic import FormView

from .forms import RegistrationForm


class RegistrationView(FormView):
    template_name = "registration/registration.html"
    form_class = RegistrationForm
    success_url = '/'

    def form_valid(self, form):
        user = form.save()
        # Make sure password is hashed and saved.
        user.set_password(form.cleaned_data['password'])
        user.save()

        return super().form_valid(form)
