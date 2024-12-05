from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
User = get_user_model()
class Task(models.Model):
  user = models.ForeignKey(User, on_delete = models.CASCADE)
  title = models.CharField(max_length=200)
  completed = models.BooleanField(default=False, blank=True, null=True)
      
  def __str__(self):
    return self.title