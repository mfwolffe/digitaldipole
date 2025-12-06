# Generated manually - Add registry_id to Calculator, refactor FavoriteEquation

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('calculators', '0013_add_favorite_equation'),
    ]

    operations = [
        # Step 1: Drop the old FavoriteEquation (has FK to Equation, not useful)
        migrations.RemoveConstraint(
            model_name='favoriteequation',
            name='unique_user_equation_favorite',
        ),
        migrations.DeleteModel(
            name='FavoriteEquation',
        ),

        # Step 2: Add new fields to Calculator
        migrations.AddField(
            model_name='calculator',
            name='registry_id',
            field=models.CharField(
                default='unknown',
                help_text="Unique ID matching frontend registry (e.g., 'avogadro', 'ideal')",
                max_length=64,
                unique=True,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='calculator',
            name='latex_equation',
            field=models.TextField(
                default='',
                help_text='LaTeX representation for display',
            ),
        ),

        # Step 3: Make existing fields optional/update defaults
        migrations.AlterField(
            model_name='calculator',
            name='information',
            field=models.TextField(
                blank=True,
                default='',
                help_text='Educational reference content',
            ),
        ),
        migrations.AlterField(
            model_name='calculator',
            name='equation',
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to='calculators.equation',
            ),
        ),

        # Step 4: Remove old constraint on Calculator name
        migrations.RemoveConstraint(
            model_name='calculator',
            name='calc_name_case_insensitive_unique',
        ),

        # Step 5: Recreate FavoriteEquation with FK to Calculator
        migrations.CreateModel(
            name='FavoriteEquation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('calculator', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='favorited_by',
                    to='calculators.calculator',
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='favorite_equations',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'verbose_name': 'Favorite Equation',
                'verbose_name_plural': 'Favorite Equations',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddConstraint(
            model_name='favoriteequation',
            constraint=models.UniqueConstraint(
                fields=('user', 'calculator'),
                name='unique_user_calculator_favorite',
            ),
        ),
    ]
