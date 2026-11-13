/* Chicken Tinder: swipe on restaurants together; a mutual right-swipe is dinner.
 * Restaurant data: OpenStreetMap via the Overpass API (fetched in the browser).
 * Live sync: PeerJS (WebRTC, peer to peer). Fallback: a shareable link with your likes.
 */
(() => {
  "use strict";

  const AREAS = {
    nrv:            { label: "Radford, Fairlawn & Christiansburg", lat: 37.137, lon: -80.492, radius: 7 },
    radford:        { label: "Radford",        lat: 37.1318, lon: -80.5764, radius: 3 },
    fairlawn:       { label: "Fairlawn",       lat: 37.1450, lon: -80.5830, radius: 3 },
    christiansburg: { label: "Christiansburg", lat: 37.1299, lon: -80.4089, radius: 3 },
  };
  const OVERPASS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  ];
  const PEER_PREFIX = "chicken-tinder-nrv-";
  const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  const $ = (id) => document.getElementById(id);
  const S = {
    mode: null,          // "host" | "guest" | "link" | "linkGuest"
    settings: null,      // { lat, lon, radius, kinds, max, seed, areaLabel }
    deck: [], idx: 0,
    mine: new Set(), theirs: new Set(), matched: new Set(),
    partnerIdx: 0, partnerDone: false,
    peer: null, conn: null, code: null,
    decided: null,
  };

  /* ---------- helpers ---------- */
  function show(name) {
    document.querySelectorAll(".screen").forEach((s) => (s.hidden = s.id !== "screen-" + name));
    window.scrollTo(0, 0);
  }
  let toastTimer;
  function toast(msg, ms = 2600) {
    const t = $("toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), ms);
  }
  function setStatus(text, ok = true) {
    const s = $("status");
    if (!text) { s.hidden = true; return; }
    s.hidden = false; s.textContent = text; s.classList.toggle("off", !ok);
  }
  function esc(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function randCode(n = 5) {
    let s = ""; const a = new Uint32Array(n); crypto.getRandomValues(a);
    for (const v of a) s += CODE_CHARS[v % CODE_CHARS.length];
    return s;
  }
  function hashStr(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return h >>> 0;
  }
  function rng(seed) { // mulberry32
    let a = hashStr(seed);
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function shuffle(arr, seed) {
    const r = rng(seed), a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function miles(lat1, lon1, lat2, lon2) {
    const R = 3958.8, toR = Math.PI / 180;
    const dLat = (lat2 - lat1) * toR, dLon = (lon2 - lon1) * toR;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function b64enc(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64dec(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  }
  function baseUrl() { return location.origin + location.pathname; }
  async function shareLink(url, text) {
    if (navigator.share) {
      try { await navigator.share({ title: "Chicken Tinder", text, url }); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); toast("Link copied. Paste it to your partner."); }
    catch { prompt("Copy this link and send it to your partner:", url); }
  }

  /* ---------- restaurant data ---------- */
  const EMOJI = [
    [/pizza/, "🍕"], [/burger/, "🍔"], [/mexican|tex-mex|taco|burrito/, "🌮"], [/sushi|japanese|ramen/, "🍣"],
    [/chinese|asian/, "🥡"], [/thai|vietnamese|pho|noodle/, "🍜"], [/indian|curry|nepal/, "🍛"], [/korean/, "🍲"],
    [/italian|pasta/, "🍝"], [/chicken|wings/, "🍗"], [/bbq|barbecue/, "🍖"], [/steak/, "🥩"], [/seafood|fish/, "🦞"],
    [/sandwich|sub|deli/, "🥪"], [/bagel/, "🥯"], [/breakfast|pancake|waffle|brunch/, "🥞"], [/donut|doughnut/, "🍩"],
    [/ice_cream|frozen_yogurt|dessert/, "🍦"], [/coffee|tea|cafe/, "☕"], [/greek|mediterranean|kebab|middle_eastern|lebanese/, "🥙"],
    [/salad|vegan|vegetarian|healthy/, "🥗"], [/hot_dog/, "🌭"], [/bakery|crepe/, "🥐"], [/diner|american|regional/, "🍽️"],
  ];
  const KIND_EMOJI = { restaurant: "🍽️", fast_food: "🍟", cafe: "☕", pub: "🍺", bar: "🍸", food_court: "🍱" };
  const KIND_LABEL = { restaurant: "Restaurant", fast_food: "Fast food", cafe: "Café", pub: "Pub", bar: "Bar", food_court: "Food court" };
  function emojiFor(p) {
    const c = (p.cuisine || "").toLowerCase() + " " + p.name.toLowerCase();
    for (const [re, e] of EMOJI) if (re.test(c)) return e;
    return KIND_EMOJI[p.kind] || "🍽️";
  }
  function gradientFor(p) {
    const h = hashStr(p.name) % 360;
    return `linear-gradient(150deg, hsl(${h} 85% 72%), hsl(${(h + 40) % 360} 80% 58%))`;
  }
  function prettyCuisine(c) {
    return (c || "").split(";").map((x) => x.trim().replace(/_/g, " ")).filter(Boolean).slice(0, 3);
  }

  async function fetchPlaces(st) {
    const kinds = st.kinds.slice();
    if (kinds.includes("pub")) kinds.push("bar");
    if (kinds.includes("restaurant")) kinds.push("food_court");
    const meters = Math.round(st.radius * 1609.34);
    const q = `[out:json][timeout:25];nwr["amenity"~"^(${kinds.join("|")})$"]["name"](around:${meters},${st.lat},${st.lon});out center tags;`;
    let lastErr;
    for (const ep of OVERPASS) {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 30000);
      try {
        const res = await fetch(ep, { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "Content-Type": "application/x-www-form-urlencoded" }, signal: ctl.signal });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const json = await res.json();
        clearTimeout(timer);
        return toDeck(json.elements || [], st);
      } catch (e) { lastErr = e; clearTimeout(timer); }
    }
    throw lastErr || new Error("Couldn't reach the map service");
  }

  function toDeck(elements, st) {
    let places = elements.map((el) => {
      const t = el.tags || {};
      const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
      if (lat == null || t.disused || t["disused:amenity"]) return null;
      const street = [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" ");
      return {
        id: el.type[0] + el.id.toString(36),
        name: t.name, kind: t.amenity, cuisine: t.cuisine || "",
        lat, lon, dist: Math.round(miles(st.lat, st.lon, lat, lon) * 10) / 10,
        addr: [street, t["addr:city"]].filter(Boolean).join(", "),
        hours: t.opening_hours || "", website: t.website || t["contact:website"] || "",
        phone: t.phone || t["contact:phone"] || "",
        takeaway: t.takeaway, drive: t.drive_through, delivery: t.delivery,
      };
    }).filter(Boolean);

    // Drop duplicates (same name within ~100 m, e.g. a building and a node for one place)
    places.sort((a, b) => (a.id < b.id ? -1 : 1));
    const kept = [];
    for (const p of places) if (!kept.some((k) => k.name === p.name && miles(k.lat, k.lon, p.lat, p.lon) < 0.06)) kept.push(p);

    // Nearest N, then a shuffle both phones agree on
    kept.sort((a, b) => a.dist - b.dist || (a.id < b.id ? -1 : 1));
    const limited = st.max ? kept.slice(0, st.max) : kept;
    limited.sort((a, b) => (a.id < b.id ? -1 : 1));
    return shuffle(limited, st.seed);
  }

  /* ---------- setup ---------- */
  function readSettingsForm() {
    const area = $("area").value;
    const kinds = [...document.querySelectorAll("#screen-setup .check input:checked")].map((i) => i.value);
    return { area, kinds, radius: +$("radius").value, max: +$("maxCards").value };
  }
  $("area").addEventListener("change", () => {
    const a = AREAS[$("area").value];
    $("radius").value = a ? a.radius : 3;
    $("radiusOut").textContent = $("radius").value;
  });
  $("radius").addEventListener("input", () => ($("radiusOut").textContent = $("radius").value));

  function getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("Location isn't available in this browser."));
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: +p.coords.latitude.toFixed(4), lon: +p.coords.longitude.toFixed(4) }),
        () => reject(new Error("Couldn't get your location. Pick a town instead.")),
        { enableHighAccuracy: false, timeout: 15000 }
      );
    });
  }

  async function onFind() {
    const f = readSettingsForm();
    const err = $("setupError"); err.hidden = true;
    if (!f.kinds.length) { err.textContent = "Pick at least one kind of place."; err.hidden = false; return; }
    let center;
    try {
      show("loading"); $("loadingText").textContent = f.area === "me" ? "Finding you…" : "Finding restaurants…";
      center = f.area === "me" ? { ...(await getLocation()), label: "you" } : { ...AREAS[f.area] };
      $("loadingText").textContent = "Finding restaurants…";
      S.settings = { lat: center.lat, lon: center.lon, radius: f.radius, kinds: f.kinds, max: f.max, seed: randCode(8), areaLabel: center.label };
      S.deck = await fetchPlaces(S.settings);
    } catch (e) {
      show("setup"); err.textContent = (e.message || "Something went wrong") + (e.name === "AbortError" ? " (timed out)" : "") + ". Try again in a moment."; err.hidden = false; return;
    }
    if (!S.deck.length) { show("setup"); err.textContent = "No restaurants found there. Try a bigger radius."; err.hidden = false; return; }
    if (S.mode === "host") openRoom(); else startSwiping();
  }

  /* ---------- live mode (PeerJS) ---------- */
  function peerReady() {
    if (window.Peer) return Promise.resolve();
    return new Promise((res, rej) => {
      let n = 0; const t = setInterval(() => { if (window.Peer) { clearInterval(t); res(); } else if (++n > 50) { clearInterval(t); rej(new Error("Live sync couldn't load")); } }, 100);
    });
  }

  async function openRoom(attempt = 0) {
    show("lobby");
    $("lobbyError").hidden = true;
    $("deckCount").textContent = `(${S.deck.length} places ready)`;
    try { await peerReady(); } catch (e) { return lobbyFail(e.message); }
    S.code = randCode(5);
    $("roomCode").textContent = S.code;
    const peer = new Peer(PEER_PREFIX + S.code);
    S.peer = peer;
    peer.on("error", (e) => {
      if (e.type === "unavailable-id" && attempt < 3) { peer.destroy(); return openRoom(attempt + 1); }
      if (!S.conn) lobbyFail("Live connection problem (" + e.type + ").");
    });
    peer.on("disconnected", () => { if (!peer.destroyed) peer.reconnect(); });
    peer.on("connection", (conn) => {
      if (S.conn && S.conn.open) { conn.on("open", () => { conn.send({ t: "full" }); setTimeout(() => conn.close(), 500); }); return; }
      wireConn(conn);
      conn.on("open", () => {
        conn.send({ t: "hello", deck: S.deck, settings: S.settings, idx: S.idx, likes: [...S.mine] });
        setStatus("Partner connected");
        if (S.idx === 0 && !$("screen-lobby").hidden) startSwiping();
      });
    });
  }
  function lobbyFail(msg) {
    const e = $("lobbyError");
    e.innerHTML = esc(msg) + ` You can still <a href="#" id="fallbackLink">swipe now and send your partner a link</a>.`;
    e.hidden = false;
    $("fallbackLink").onclick = (ev) => { ev.preventDefault(); if (S.peer) S.peer.destroy(); S.mode = "link"; startSwiping(); };
  }

  async function joinRoom(code) {
    code = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length < 4) { toast("Enter the room code from your partner's screen."); return; }
    S.mode = "guest"; S.code = code;
    show("loading"); $("loadingText").textContent = "Joining room " + code + "…";
    try { await peerReady(); } catch (e) { show("home"); toast(e.message); return; }
    const peer = new Peer();
    S.peer = peer;
    let opened = false;
    const fail = (msg) => { if (opened) return; show("home"); toast(msg, 4000); try { peer.destroy(); } catch {} };
    const timer = setTimeout(() => fail("Couldn't find room " + code + ". Check the code and make sure your partner's screen is still open."), 15000);
    peer.on("error", (e) => { clearTimeout(timer); fail(e.type === "peer-unavailable" ? "No room called " + code + ". Double-check the code." : "Live connection problem (" + e.type + ")."); });
    peer.on("open", () => {
      const conn = peer.connect(PEER_PREFIX + code, { reliable: true });
      wireConn(conn);
      conn.on("open", () => { opened = true; clearTimeout(timer); setStatus("Connected to " + code); });
    });
  }

  function wireConn(conn) {
    S.conn = conn;
    conn.on("data", onPeerData);
    conn.on("close", () => { setStatus("Partner disconnected", false); toast("Your partner disconnected."); });
  }
  function send(msg) { if (S.conn && S.conn.open) S.conn.send(msg); }

  function onPeerData(m) {
    if (!m || typeof m !== "object") return;
    switch (m.t) {
      case "full": toast("That room already has two people."); show("home"); break;
      case "hello": // guest receives the deck from the host
        S.deck = m.deck; S.settings = m.settings;
        S.theirs = new Set(m.likes || []); S.partnerIdx = m.idx || 0;
        if ($("screen-swipe").hidden) startSwiping(); else checkAllMatches();
        send({ t: "sync", idx: S.idx, likes: [...S.mine] });
        break;
      case "sync":
        S.partnerIdx = m.idx || 0; (m.likes || []).forEach((id) => S.theirs.add(id));
        checkAllMatches(); updateProgress(); break;
      case "swipe":
        S.partnerIdx = m.idx;
        if (m.like) { S.theirs.add(m.id); if (S.mine.has(m.id)) celebrate(m.id); }
        updateProgress(); break;
      case "done": S.partnerDone = true; S.partnerIdx = S.deck.length; updateProgress(); if (S.idx >= S.deck.length) showEnd(); break;
      case "decided": showDecided(m.id, true); break;
      case "restart": toast("Your partner started over."); break;
    }
  }

  /* ---------- swiping ---------- */
  function startSwiping() {
    S.idx = 0; S.mine = new Set(); S.matched = new Set();
    if (S.mode !== "linkGuest" && S.mode !== "guest") S.theirs = new Set();
    show("swipe");
    $("sendLinkBtn").hidden = S.mode !== "link";
    if (S.mode === "link" || S.mode === "linkGuest") setStatus("");
    renderDeck(); updateProgress();
  }

  function cardHtml(p) {
    const chips = [KIND_LABEL[p.kind] || "Food", ...prettyCuisine(p.cuisine)];
    if (p.drive === "yes") chips.push("drive-thru");
    const site = p.website ? `<p class="meta">🔗 <a href="${esc(p.website)}" target="_blank" rel="noopener">${esc(p.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a></p>` : "";
    return `
      <div class="card-art" style="background:${gradientFor(p)}">${emojiFor(p)}
        <div class="stamp yes">YUM</div><div class="stamp no">NOPE</div>
      </div>
      <div class="card-body">
        <h3>${esc(p.name)}</h3>
        <div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
        <p class="meta">📍 ${p.dist} mi away${p.addr ? " · " + esc(p.addr) : ""}</p>
        ${p.hours ? `<p class="meta">🕒 ${esc(p.hours.length > 70 ? p.hours.slice(0, 70) + "…" : p.hours)}</p>` : ""}
        ${site}
      </div>`;
  }

  function renderDeck() {
    const deck = $("deck"); deck.innerHTML = "";
    if (S.idx >= S.deck.length) return finishDeck();
    for (let i = Math.min(S.idx + 1, S.deck.length - 1); i >= S.idx; i--) {
      const el = document.createElement("div");
      el.className = "card" + (i > S.idx ? " behind" : "");
      el.innerHTML = cardHtml(S.deck[i]);
      deck.appendChild(el);
      if (i === S.idx) enableDrag(el);
    }
  }

  function enableDrag(card) {
    let x0 = 0, y0 = 0, dx = 0, dy = 0, dragging = false;
    const yes = card.querySelector(".stamp.yes"), no = card.querySelector(".stamp.no");
    card.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a")) return;
      dragging = true; x0 = e.clientX; y0 = e.clientY; dx = dy = 0;
      card.setPointerCapture(e.pointerId); card.classList.add("dragging");
    });
    card.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dx = e.clientX - x0; dy = e.clientY - y0;
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 18}deg)`;
      yes.style.opacity = Math.max(0, Math.min(1, dx / 90));
      no.style.opacity = Math.max(0, Math.min(1, -dx / 90));
    });
    const end = () => {
      if (!dragging) return;
      dragging = false; card.classList.remove("dragging");
      if (Math.abs(dx) > 100) swipe(dx > 0, card);
      else { card.style.transform = ""; yes.style.opacity = no.style.opacity = 0; }
    };
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }

  let busy = false;
  function swipe(like, card) {
    if (busy || S.idx >= S.deck.length || $("screen-swipe").hidden || !$("matchOverlay").hidden) return;
    busy = true;
    card = card || $("deck").querySelector(".card:not(.behind)");
    if (card) {
      card.querySelector(like ? ".stamp.yes" : ".stamp.no").style.opacity = 1;
      card.style.transform = `translate(${like ? 150 : -150}vw, 40px) rotate(${like ? 30 : -30}deg)`;
    }
    const p = S.deck[S.idx];
    S.idx++;
    if (like) S.mine.add(p.id);
    send({ t: "swipe", id: p.id, like, idx: S.idx });
    setTimeout(() => {
      busy = false;
      renderDeck(); updateProgress();
      if (like && S.theirs.has(p.id)) celebrate(p.id);
    }, 250);
  }

  function updateProgress() {
    const n = S.deck.length;
    $("myProgress").textContent = n ? `You: ${Math.min(S.idx, n)}/${n}` : "";
    let partner = "";
    if (S.mode === "host" || S.mode === "guest") partner = S.conn && S.conn.open ? `Partner: ${Math.min(S.partnerIdx, n)}/${n}` : "Partner: not connected";
    else if (S.mode === "linkGuest") partner = `Partner liked ${S.theirs.size}`;
    $("partnerProgress").textContent = partner;
  }

  function checkAllMatches() {
    for (const id of S.mine) if (S.theirs.has(id)) { celebrate(id); break; }
  }

  /* ---------- matches ---------- */
  const byId = (id) => S.deck.find((p) => p.id === id);
  let overlayId = null;
  function celebrate(id) {
    if (S.matched.has(id) || S.decided) return;
    S.matched.add(id);
    const p = byId(id); if (!p) return;
    overlayId = id;
    $("matchEmoji").textContent = emojiFor(p);
    $("matchName").textContent = p.name;
    $("matchMeta").textContent = [prettyCuisine(p.cuisine).join(", "), p.dist + " mi away"].filter(Boolean).join(" · ");
    $("matchOverlay").hidden = false;
    if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
  }
  $("pickMatchBtn").onclick = () => { $("matchOverlay").hidden = true; decide(overlayId); };
  $("keepSwipingBtn").onclick = () => { $("matchOverlay").hidden = true; if (S.idx >= S.deck.length) finishDeck(); };

  function decide(id) { send({ t: "decided", id }); showDecided(id, false); }

  function mapsUrl(p) {
    const where = p.addr || `${p.lat},${p.lon}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ", " + where)}`;
  }
  function directionsUrl(p) { return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`; }

  function showDecided(id, fromPartner) {
    const p = byId(id); if (!p) return;
    S.decided = id;
    $("matchOverlay").hidden = true;
    $("decidedName").textContent = emojiFor(p) + " " + p.name;
    $("decidedMeta").textContent = [prettyCuisine(p.cuisine).join(", "), p.addr, p.dist + " mi away"].filter(Boolean).join(" · ");
    const links = [`<a class="btn primary" href="${directionsUrl(p)}" target="_blank" rel="noopener">Directions</a>`,
                   `<a class="btn" href="${mapsUrl(p)}" target="_blank" rel="noopener">Reviews, photos &amp; hours</a>`];
    if (p.phone) links.push(`<a class="btn" href="tel:${esc(p.phone.replace(/[^\d+]/g, ""))}">Call ${esc(p.phone)}</a>`);
    if (p.website) links.push(`<a class="btn" href="${esc(p.website)}" target="_blank" rel="noopener">Website / menu</a>`);
    $("decidedLinks").innerHTML = links.join("");
    show("decided");
    if (fromPartner) toast("Your partner locked it in!");
  }

  /* ---------- end of deck ---------- */
  function finishDeck() {
    send({ t: "done" });
    if (S.mode === "link") return showEnd();
    if ((S.mode === "host" || S.mode === "guest") && !S.partnerDone && S.conn && S.conn.open) {
      $("deck").innerHTML = `<div class="card" style="display:grid;place-items:center;text-align:center;padding:24px"><div><div style="font-size:3rem">⏳</div><h3>You're done!</h3><p class="muted">Waiting for your partner to finish… matches will pop up as they swipe.</p><button class="btn" id="seeNowBtn">See matches so far</button></div></div>`;
      $("seeNowBtn").onclick = showEnd;
      return;
    }
    showEnd();
  }

  function showEnd() {
    if (S.decided) return;
    show("end");
    const list = $("matchList"); list.innerHTML = "";
    $("fateBtn").hidden = true; $("endShareBtn").hidden = true;

    if (S.mode === "link") {
      $("endTitle").textContent = `You liked ${S.mine.size} place${S.mine.size === 1 ? "" : "s"}`;
      $("endText").textContent = "Now send your picks to your partner. When they swipe right on one of yours, it's a match.";
      $("endShareBtn").hidden = !S.mine.size;
      [...S.mine].map(byId).forEach((p) => list.appendChild(matchItem(p, false)));
      return;
    }
    const both = S.deck.filter((p) => S.mine.has(p.id) && S.theirs.has(p.id));
    if (both.length) {
      $("endTitle").textContent = both.length === 1 ? "You have a match!" : `You have ${both.length} matches!`;
      $("endText").textContent = "Pick one, or let fate decide.";
      both.forEach((p) => list.appendChild(matchItem(p, true)));
      $("fateBtn").hidden = both.length < 2;
      $("fateBtn").onclick = () => decide(both[Math.floor(Math.random() * both.length)].id);
    } else {
      const either = S.deck.filter((p) => S.mine.has(p.id) || S.theirs.has(p.id));
      $("endTitle").textContent = "No matches 😬";
      $("endText").textContent = either.length
        ? "Nothing you both liked. Let fate pick from anything either of you liked, or start over with a bigger radius."
        : "Neither of you liked anything! Start over with a bigger radius or more kinds of places.";
      $("fateBtn").hidden = !either.length;
      $("fateBtn").onclick = () => decide(either[Math.floor(Math.random() * either.length)].id);
    }
  }

  function matchItem(p, pickable) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="em">${emojiFor(p)}</span><span class="info"><b>${esc(p.name)}</b><small>${esc([prettyCuisine(p.cuisine)[0], p.dist + " mi"].filter(Boolean).join(" · "))}</small></span>`;
    if (pickable) {
      const b = document.createElement("button"); b.className = "btn primary"; b.textContent = "Pick";
      b.onclick = () => decide(p.id); li.appendChild(b);
    }
    return li;
  }

  /* ---------- link mode ---------- */
  function partnerLink() {
    const st = S.settings;
    return baseUrl() + "?p=" + b64enc({ a: st.lat, o: st.lon, r: st.radius, k: st.kinds, m: st.max, s: st.seed, l: [...S.mine], n: st.areaLabel });
  }
  const sendPicks = () => shareLink(partnerLink(), `I swiped on ${S.deck.length} restaurants. Your turn! If we both like a place, that's dinner 🍗`);
  $("sendLinkBtn").onclick = sendPicks;
  $("endShareBtn").onclick = sendPicks;

  async function openPartnerLink(payload) {
    let d;
    try { d = b64dec(payload); } catch { toast("That link looks broken. Ask your partner to send it again."); return show("home"); }
    S.mode = "linkGuest";
    S.settings = { lat: d.a, lon: d.o, radius: d.r, kinds: d.k, max: d.m, seed: d.s, areaLabel: d.n };
    S.theirs = new Set(d.l || []);
    show("loading"); $("loadingText").textContent = "Loading your partner's restaurants…";
    try { S.deck = await fetchPlaces(S.settings); }
    catch (e) { show("home"); toast("Couldn't load restaurants right now. Try the link again in a minute.", 4000); return; }
    toast("Your partner already swiped. Find a match!");
    startSwiping();
  }

  /* ---------- wiring ---------- */
  function resetAll() {
    if (S.peer) { try { S.peer.destroy(); } catch {} }
    Object.assign(S, { mode: null, settings: null, deck: [], idx: 0, mine: new Set(), theirs: new Set(), matched: new Set(), partnerIdx: 0, partnerDone: false, peer: null, conn: null, code: null, decided: null });
    $("matchOverlay").hidden = true;
    setStatus("");
    history.replaceState(null, "", baseUrl());
    show("home");
  }
  function goSetup(mode) {
    S.mode = mode;
    $("setupTitle").textContent = mode === "host" ? "Set the menu for both of you" : "Set the menu";
    $("setupError").hidden = true;
    show("setup");
  }

  $("homeBtn").onclick = () => { if (S.mode && !confirm("Leave this session?")) return; resetAll(); };
  $("startLiveBtn").onclick = () => goSetup("host");
  $("startLinkBtn").onclick = () => goSetup("link");
  $("findBtn").onclick = onFind;
  $("joinForm").onsubmit = (e) => { e.preventDefault(); joinRoom($("joinCode").value); };
  $("shareRoomBtn").onclick = () => shareLink(baseUrl() + "?join=" + S.code, `Let's pick dinner! Join my Chicken Tinder room: ${S.code}`);
  $("likeBtn").onclick = () => swipe(true);
  $("nopeBtn").onclick = () => swipe(false);
  $("againBtn").onclick = resetAll;
  $("decidedAgainBtn").onclick = resetAll;
  document.addEventListener("keydown", (e) => {
    if ($("screen-swipe").hidden || e.target.matches("input, select")) return;
    if (e.key === "ArrowRight") swipe(true);
    else if (e.key === "ArrowLeft") swipe(false);
  });

  const params = new URLSearchParams(location.search);
  if (params.get("join")) { $("joinCode").value = params.get("join"); joinRoom(params.get("join")); }
  else if (params.get("p")) openPartnerLink(params.get("p"));
})();
