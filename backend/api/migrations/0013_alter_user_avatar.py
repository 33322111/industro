# Generated by Django 5.1.4 on 2025-04-22 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_resume_documents_delete_resumedocument'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, default='avatars/default-avatar.png', null=True, upload_to='avatars/'),
        ),
    ]
