# noomshot

Static marketing site (Webflow export). No build step. Host the repo root on GitHub Pages, Cloudflare Pages, or any other static host.

## Local

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Application form → HighLevel

`js/ghl-application-form.js` intercepts `#wf-form-Application-Form` and POSTs flattened JSON to the HighLevel inbound webhook (not Webflow form-urlencoded).

| Form field | JSON key |
|---|---|
| Full Name | `fullName` |
| Email | `email` |
| Phone | `phone` |
| Company Website | `website` |
| Revenue (radio value) | `revenue` |
| Budget (radio value) | `budget` |
| Comments | `comments` |

Also sent: `formName`, `pageId`, `elementId`, `domain`, `sourceUrl`, `test`, `dolphin`.

Browser CORS: JSON `application/json` first; on failure, the same JSON body as `text/plain` (`no-cors`) so the POST still leaves the browser.
