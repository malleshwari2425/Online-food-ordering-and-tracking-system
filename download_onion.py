import urllib.request
url = 'https://images.unsplash.com/photo-1750680230010-7b2f15ff7a59?q=80&w=1000&auto=format&fit=crop'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = response.read()
        with open(r'e:\online-food ordering\frontend\public\onion_rings_real.jpg', 'wb') as f:
            f.write(data)
    print('Successfully downloaded onion_rings_real.jpg')
except Exception as e:
    print(f'Error: {e}')
