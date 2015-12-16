# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('npi_data_viz', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='entity_type',
            field=models.IntegerField(choices=[(1, b'Sole Individual'), (2, b'Organization'), (3, b'N/A')]),
        ),
    ]
