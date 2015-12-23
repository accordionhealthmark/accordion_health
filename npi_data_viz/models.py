from django.db import models

class County(models.Model):
    fip_code = models.IntegerField()
    doctor_type = models.CharField(max_length=60)
    state = models.CharField(max_length=2)
    frequency = models.IntegerField()
    population = models.IntegerField()
