# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('npi_data_viz', '0004_auto_20151213_0410'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='gender',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
