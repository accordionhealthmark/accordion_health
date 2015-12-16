# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('npi_data_viz', '0005_auto_20151213_0413'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='county_id',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
