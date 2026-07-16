import urllib.request
import json

repos = [
    'mishra-shreya/Sanket',
    'ayeshatasnim-h/Indian-Sign-Language-dataset',
    'khandir/isl-hand-landmarks-dataset'
]

for repo in repos:
    for branch in ['main', 'master']:
        url = f'https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.loads(r.read())
            files = [f for f in data.get('tree', []) if f['path'].endswith(('.csv', '.pkl', '.h5', '.npy', '.zip'))]
            print(f'Repo {repo} ({branch}):')
            for f in files:
                size = f.get('size', '?')
                print(f'  {f["path"]} ({size} bytes)')
            break
        except Exception as e:
            print(f'Repo {repo} ({branch}) error: {e}')
