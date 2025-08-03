# Gunicorn configuration file
import multiprocessing

# Server socket
bind = "127.0.0.1:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 50

# Restart workers after this many requests, with up to 50 requests variance
preload_app = True

# Logging
accesslog = "/opt/digitaldipole/logs/gunicorn-access.log"
errorlog = "/opt/digitaldipole/logs/gunicorn-error.log"
loglevel = "info"

# Process naming
proc_name = "digitaldipole"

# Server mechanics
daemon = False
pidfile = "/opt/digitaldipole/run/gunicorn.pid"
user = "digitaldipole"
group = "digitaldipole"
tmp_upload_dir = None

# SSL (if needed)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"