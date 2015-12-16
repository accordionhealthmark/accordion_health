# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('npi_data_viz', '0002_auto_20151213_0132'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='entity_type',
            field=models.CharField(max_length=50),
        ),
    ]
