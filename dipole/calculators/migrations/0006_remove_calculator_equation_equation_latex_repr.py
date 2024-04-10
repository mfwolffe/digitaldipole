# Generated by Django 4.2.11 on 2024-04-09 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calculators', '0005_alter_calculator_options_alter_equation_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calculator',
            name='equation',
        ),
        migrations.AddField(
            model_name='equation',
            name='LaTeX_repr',
            field=models.TextField(default='', help_text='LaTeX representation of this equation; No variables'),
        ),
    ]
