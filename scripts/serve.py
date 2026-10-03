"""Serve the studio from any working directory. Python 3, no dependencies."""
import argparse
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=8000);p.add_argument('--host',default='127.0.0.1');a=p.parse_args()
root=Path(__file__).resolve().parents[1]
print(f'Studio: http://{a.host}:{a.port}',flush=True)
ThreadingHTTPServer((a.host,a.port),partial(SimpleHTTPRequestHandler,directory=str(root))).serve_forever()
