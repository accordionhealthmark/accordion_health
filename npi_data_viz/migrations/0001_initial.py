# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='County',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fip_code', models.IntegerField()),
                ('doctor_type', models.CharField(max_length=60)),
                ('state', models.CharField(max_length=2)),
                ('frequency', models.IntegerField()),
                ('population', models.IntegerField()),
            ],
        ),
    ]
