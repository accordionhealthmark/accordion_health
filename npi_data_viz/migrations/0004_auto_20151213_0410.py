# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('npi_data_viz', '0003_auto_20151213_0356'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='activate',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='provider',
            name='credential_type',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='provider',
            name='deactivate',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='provider',
            name='gender',
            field=models.IntegerField(null=True, choices=[(b'1', b'M'), (b'2', b'F')]),
        ),
        migrations.AddField(
            model_name='provider',
            name='is_sole',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='provider',
            name='prefix',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='provider',
            name='state',
            field=models.CharField(max_length=5, null=True),
        ),
        migrations.AddField(
            model_name='provider',
            name='zipcode',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='provider',
            name='entity_type',
            field=models.CharField(max_length=10),
        ),
    ]
