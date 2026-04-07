import urllib.request
url = 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=600&q=80'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = response.read()
        with open(r'e:\online-food ordering\frontend\public\margherita_real.jpg', 'wb') as f:
            f.write(data)
    print('Successfully downloaded margherita_real.jpg')
except Exception as e:
    print(f'Error: {e}')
