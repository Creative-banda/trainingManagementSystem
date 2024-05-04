from celery import shared_task
import time


@shared_task()
def testing():
    time.sleep(5)
    print("hello")