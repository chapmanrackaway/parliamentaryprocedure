# Chicken Tinder 🍗

Tinder for dinner. You and your partner swipe on restaurants around Radford, Fairlawn and Christiansburg, VA. When you both swipe right on the same place, that's where you eat.

## How to use it

**Swiping together (live):**
1. One person taps **Start a session**, picks the area, radius and kinds of places, and taps **Find restaurants**.
2. A 5-letter room code appears. The other person enters it (or opens the invite link).
3. You both swipe through the same cards on your own phones. As soon as you both like the same place, both phones show **It's a Match!**

**Not at the same time:** tap *"Swipe first and text them a link"*. When you're done, send the link. Your partner swipes the same cards, and they get a match when they like a place you liked.

At the end you see all your matches. You can pick one, or tap **Let fate decide**.

## How it works

- Restaurants come live from **OpenStreetMap** (Overpass API), so the list stays current and there are no API keys. If a place is missing or wrong, anyone can fix it at openstreetmap.org.
- The two phones sync directly (peer to peer, WebRTC via PeerJS). There's no server and no accounts.
- It's three static files (`index.html`, `style.css`, `app.js`), so it runs on GitHub Pages.
