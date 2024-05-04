from django.apps import AppConfig


class TrainingAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'training_app'

    def ready(self) -> None:
        import training_app.signals
