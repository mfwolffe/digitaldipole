# Generated by Django 4.2.11 on 2024-04-16 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calculators', '0009_alter_variable_value'),
    ]

    operations = [
        migrations.AddField(
            model_name='variable',
            name='html_symbol',
            field=models.CharField(default='', help_text='The html symbol corresponding to this variable', max_length=64),
        ),
    ]