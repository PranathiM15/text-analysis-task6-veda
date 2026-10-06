from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
import json
import re

from text_analysis import analyze_text

ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8000


class TextAnalysisHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path, content_type):
        try:
            data = path.read_bytes()
        except FileNotFoundError:
            self.send_error(404, "File not found")
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        route = urlparse(self.path).path
        if route in ("/", "/index.html"):
            self._send_file(ROOT / "templates" / "index.html", "text/html; charset=utf-8")
        elif route == "/styles.css":
            self._send_file(ROOT / "static" / "styles.css", "text/css; charset=utf-8")
        elif route == "/script.js":
            self._send_file(ROOT / "static" / "script.js", "application/javascript; charset=utf-8")
        elif route == "/health":
            self._send_json({"status": "ok", "app": "TextLab 06"})
        else:
            self.send_error(404, "Route not found")

    def do_POST(self):
        route = urlparse(self.path).path
        if route != "/api/analyze":
            self.send_error(404, "Route not found")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            payload = json.loads(raw.decode("utf-8") or "{}")
            text = payload.get("text", "")
            if not isinstance(text, str):
                raise ValueError("Text must be a string")
            if len(text) > 100_000:
                raise ValueError("Text is too long. Keep it under 100,000 characters.")
            self._send_json(analyze_text(text))
        except (json.JSONDecodeError, ValueError) as exc:
            self._send_json({"error": str(exc)}, status=400)
        except Exception:
            self._send_json({"error": "Unable to analyze the text."}, status=500)

    def log_message(self, format, *args):
        # Keep terminal output clean and useful.
        print(f"[{self.log_date_time_string()}] {format % args}")


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), TextAnalysisHandler)
    print("=" * 60)
    print("TextLab 06 — Text Analysis Web App")
    print(f"Running at: http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop the server.")
    print("=" * 60)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()
