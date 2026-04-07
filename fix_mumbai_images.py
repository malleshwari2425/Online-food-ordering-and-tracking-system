import shutil, os, django

files = {
    'Vada Pav': ('vada_pav_1775203500817.png', 'vada_pav.png'),
    'Pav Bhaji': ('pav_bhaji_1775203533692.png', 'pav_bhaji.png'),
    'Chole Bhature': ('chole_bhature_1775203664961.png', 'chole_bhature.png'),
    'Pani Puri': ('pani_puri_1775203770577.png', 'pani_puri.png'),
    'Samosa Chaat': ('samosa_chaat_1775203864045.png', 'samosa_chaat.png')
}

base_src = r'C:\Users\Hp\.gemini\antigravity\brain\dbe127b6-a6cd-4ffa-af55-e88bb71d807b'
base_dst = r'e:\online-food ordering\frontend\public'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickdine_backend.settings')
django.setup()
from restaurants.models import MenuItem

for name, (src_name, dst_name) in files.items():
    s = os.path.join(base_src, src_name)
    d = os.path.join(base_dst, dst_name)
    shutil.copy(s, d)
    
    item = MenuItem.objects.filter(restaurant__name='Mumbai Spice House', name__icontains=name.split()[0]).first()
    if item:
        item.image = f'/{dst_name}'
        item.save()
        print(f"Updated {item.name} to /{dst_name}")
    else:
        print(f"Could not find {name}")
