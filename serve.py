#!/usr/bin/env python3
"""Lokal utvecklingsserver.

Sajten använder adresser utan .html (/priser i stället för /priser.html).
Netlify löser det åt oss i produktion; den här servern gör samma sak lokalt
så att länkarna fungerar likadant på båda ställena.

    python serve.py            startar på http://localhost:5180
    python serve.py 8000       annan port
"""
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5180
ROT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROT, **kw)

    def translate_path(self, path):
        lokal = super().translate_path(path)
        # /priser -> priser.html, om filen inte redan finns
        if not os.path.exists(lokal) and not path.endswith("/"):
            med_html = lokal + ".html"
            if os.path.isfile(med_html):
                return med_html
        return lokal

    def send_error(self, code, message=None, explain=None):
        # samma 404-sida som i produktion
        if code == 404:
            sida = os.path.join(ROT, "404.html")
            if os.path.isfile(sida):
                kropp = open(sida, "rb").read()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(kropp)))
                self.end_headers()
                self.wfile.write(kropp)
                return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):
        if "GET" in (args[0] if args else ""):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("", PORT), Handler) as srv:
        print("Tandläkarhuset: http://localhost:%d  (Ctrl+C avslutar)" % PORT)
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            print("\nstoppad")
