from django.apps import AppConfig


class SchoolAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'school_app'

    def ready(self):
        import school_app.signals
