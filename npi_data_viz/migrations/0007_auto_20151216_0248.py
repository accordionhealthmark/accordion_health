# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('npi_data_viz', '0006_provider_county_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='state_id',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='provider',
            name='state_name',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
