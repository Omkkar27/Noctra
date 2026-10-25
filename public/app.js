let tracks = [
  ["Luna", "Bombay Bicycle Club", "3:24", "1514525253161-7a46d19cd819"],
  ["You were right", "RUFUS DU SOL", "4:12", "1493225457124-a3eb161ffa5f"],
  ["The less I know", "Tame Impala", "3:36", "1521337581100-8ca9a73a5f79"],
  ["Clementine", "Halsey", "3:54", "1516280440614-37939bbacd81"],
];
let albums = [
  ["Quietly, together", "A thoughtful blend", "1524368535928-5b5e00ddc76b"],
  ["Soft focus", "Liminal electronic", "1516280440614-37939bbacd81"],
  ["Daylight fading", "Indie reflections", "1506157786151-b8491531f063"],
  ["Velvet room", "Slow dance classics", "1524650359799-842906ca1c06"],
  ["Half awake", "Dream pop for dawn", "1516450360452-9312f5e86fc7"],
];
const sources = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
];
const art = (id) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=80`,
  audio = new Audio();
let current = 0,
  liked = new Set();
audio.preload = "metadata";
audio.volume = 0.65;
const albumsEl = document.querySelector("#albums"),
  tracksEl = document.querySelector("#tracks"),
  nowTitle = document.querySelector("#nowTitle"),
  nowArtist = document.querySelector("#nowArtist"),
  nowArt = document.querySelector("#nowArt"),
  toggle = document.querySelector("#toggle"),
  progress = document.querySelector("#progress"),
  elapsed = document.querySelector("#elapsed"),
  duration = document.querySelector("#duration"),
  like = document.querySelector("#like");
const time = (s) =>
  Number.isFinite(s)
    ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
    : "0:00";
function renderAlbums() {
  albumsEl.innerHTML = albums
    .map(
      (a, i) =>
        `<article><div><img src="${art(a[2])}" alt="${a[0]}"><button class="albumPlay" data-index="${i}" aria-label="Play ${a[0]}">&#9654;</button></div><strong>${a[0]}</strong><small>${a[1]}</small></article>`,
    )
    .join("");
  document
    .querySelectorAll(".albumPlay")
    .forEach(
      (b) =>
        (b.onclick = () => playTrack(Number(b.dataset.index) % tracks.length)),
    );
}
function renderTracks(list = tracks) {
  const entries = list.map((track) => ({
    track,
    index: tracks.indexOf(track),
  }));
  tracksEl.innerHTML = entries
    .map(
      ({ track: t, index }, i) =>
        `<button class="track ${index === current ? "chosen" : ""}" data-index="${index}"><span>${String(i + 1).padStart(2, "0")}</span><img src="${art(t[3])}" alt=""><b>${t[0]}<small>${t[1]}</small></b><em>Noctra selection</em><span>${t[2]}</span><i>${liked.has(index) ? "Liked" : "More"}</i></button>`,
    )
    .join("");
  document
    .querySelectorAll(".track")
    .forEach((b) => (b.onclick = () => playTrack(Number(b.dataset.index))));
}
function selectTrack(i) {
  current = i;
  const t = tracks[i];
  nowTitle.textContent = t[0];
  nowArtist.textContent = t[1];
  nowArt.src = art(t[3]);
  audio.src = t[4] || sources[i % sources.length];
  like.classList.toggle("liked", liked.has(i));
  like.textContent = liked.has(i) ? "Liked" : "Like";
  renderTracks();
}
async function playTrack(i = current) {
  if (i !== current || !audio.src) selectTrack(i);
  try {
    await audio.play();
    toggle.textContent = "Pause";
  } catch (err) {
    nowArtist.textContent = "Press Play again to start audio";
    console.error(err);
  }
}
function showView(view) {
  document
    .querySelectorAll("nav button")
    .forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  const eyebrow = document.querySelector("#heroEyebrow"),
    title = document.querySelector("#heroTitle"),
    copy = document.querySelector("#heroCopy"),
    hero = document.querySelector(".hero");
  hero.hidden = view === "liked";
  if (view === "home") {
    eyebrow.textContent = "A SLOW-BURN SELECTION";
    title.innerHTML = "Music for<br><em>the in-between.</em>";
    copy.textContent =
      "Thoughtful sounds for the hours that don't need a name.";
    renderAlbums();
    renderTracks();
  }
  if (view === "discover") {
    eyebrow.textContent = "BROWSE FREELY";
    title.innerHTML = "Find your next<br><em>favourite sound.</em>";
    copy.textContent = "Fresh collections and a wide-open queue to explore.";
    renderAlbums();
    renderTracks();
  }
  if (view === "library") {
    eyebrow.textContent = "YOUR LIBRARY";
    title.innerHTML = "Everything you<br><em>keep close.</em>";
    copy.textContent =
      "Your recent listening and saved collections in one place.";
    renderAlbums();
    renderTracks();
  }
  if (view === "liked") renderTracks(tracks.filter((_, i) => liked.has(i)));
}
document
  .querySelectorAll("nav button")
  .forEach((b) => (b.onclick = () => showView(b.dataset.view)));
document.querySelector("#likedSongs").onclick = () => showView("liked");
document.querySelector("#newCollection").onclick = () => {
  const name = prompt("Name your new collection");
  if (!name?.trim()) return;
  const b = document.createElement("button");
  b.textContent = name.trim();
  document.querySelector(".lists").prepend(b);
  b.onclick = () => showView("library");
};
document.querySelector(".mix").onclick = () => playTrack(0);
toggle.onclick = () => (audio.paused ? playTrack() : audio.pause());
document.querySelector("#next").onclick = () =>
  playTrack((current + 1) % tracks.length);
document.querySelector("#previous").onclick = () =>
  playTrack((current - 1 + tracks.length) % tracks.length);
like.onclick = () => {
  liked.has(current) ? liked.delete(current) : liked.add(current);
  like.classList.toggle("liked");
  like.textContent = liked.has(current) ? "Liked" : "Like";
  renderTracks();
};
document.querySelector("#volume").oninput = (e) =>
  (audio.volume = e.target.value / 100);
progress.oninput = () => {
  if (audio.duration)
    audio.currentTime = (audio.duration * progress.value) / 100;
};
audio.ontimeupdate = () => {
  progress.value = audio.duration
    ? (audio.currentTime / audio.duration) * 100
    : 0;
  elapsed.textContent = time(audio.currentTime);
};
audio.onloadedmetadata = () => (duration.textContent = time(audio.duration));
audio.onpause = () => (toggle.textContent = "Play");
audio.onplay = () => (toggle.textContent = "Pause");
audio.onended = () => playTrack((current + 1) % tracks.length);
document.querySelector("#search").oninput = (e) => {
  const q = e.target.value.toLowerCase();
  document
    .querySelectorAll("article,.track")
    .forEach((x) => (x.hidden = !x.textContent.toLowerCase().includes(q)));
};
selectTrack(0);
renderAlbums();

const authDialog = document.querySelector("#authDialog");
const authForm = document.querySelector("#authForm");
const authMessage = document.querySelector("#authMessage");
const authTitle = document.querySelector("#authTitle");
const authSubmit = document.querySelector("#authSubmit");
const authSwitch = document.querySelector("#authSwitch");
const emailField = document.querySelector("#emailField");
let authRole = "user";
let authMode = "login";

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  authTitle.textContent = `${registering ? "Create" : "Sign in as"} ${authRole === "artist" ? "an artist" : "a listener"}`;
  authSubmit.textContent = registering ? "Create account" : "Sign in";
  authSwitch.textContent = registering
    ? "Already have an account? Sign in"
    : "New here? Create an account";
  emailField.hidden = !registering;
  document.querySelector("#authEmail").required = registering;
  document.querySelector("#authIdentifier").placeholder = registering
    ? "Choose a username"
    : "Username or email";
  document.querySelector("#authPassword").autocomplete = registering
    ? "new-password"
    : "current-password";
  authMessage.textContent = "";
}

function openAuth() {
  setAuthMode("login");
  authDialog.showModal();
}

function setProfile(user) {
  const signedIn = Boolean(user);
  document.querySelector("#profileName").textContent = signedIn
    ? user.username
    : "Guest listener";
  document.querySelector("#profileRole").textContent = signedIn
    ? `${user.role === "artist" ? "Artist" : "Listener"} account`
    : "Sign in to sync";
  document.querySelector("#profileInitials").textContent = signedIn
    ? user.username.slice(0, 2).toUpperCase()
    : "OM";
  document.querySelector("#authButton").textContent = signedIn
    ? "Log out"
    : "Sign in";
  document.querySelector("#authHeaderButton").textContent = signedIn
    ? "LOG OUT"
    : "SIGN IN";
  document.querySelector("#uploadMusic").hidden = user?.role !== "artist";
  localStorage.setItem("noctraUser", JSON.stringify(user || null));
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : {};
  if (!response.ok)
    throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

async function loadCatalog() {
  try {
    const [musicResponse, albumResponse] = await Promise.all([
      request("/api/music"),
      request("/api/music/album"),
    ]);
    if (Array.isArray(musicResponse.music) && musicResponse.music.length) {
      tracks = musicResponse.music.map((song, index) => [
        song.title,
        song.artist?.username || "Unknown artist",
        "",
        `1514525253161-7a46d19cd819`,
        song.uri || sources[index % sources.length],
      ]);
      current = 0;
      selectTrack(0);
    }
    if (Array.isArray(albumResponse.album) && albumResponse.album.length) {
      albums = albumResponse.album.map((album, index) => [
        album.title,
        album.artist?.username || "Noctra artist",
        `1524368535928-5b5e00ddc76b`,
      ]);
      renderAlbums();
    }
  } catch (error) {
    console.info("Music catalog is available after sign-in:", error.message);
  }
}

document
  .querySelector("#authHeaderButton")
  .addEventListener("click", async () => {
    const saved = JSON.parse(localStorage.getItem("noctraUser") || "null");
    if (!saved) return openAuth();
    await request("/api/auth/logout", { method: "POST" });
    setProfile(null);
  });
document.querySelector("#authButton").addEventListener("click", async () => {
  const saved = JSON.parse(localStorage.getItem("noctraUser") || "null");
  if (!saved) return openAuth();
  await request("/api/auth/logout", { method: "POST" });
  setProfile(null);
});
document
  .querySelector("#closeAuth")
  .addEventListener("click", () => authDialog.close());
document.querySelectorAll(".auth-tabs button").forEach((button) =>
  button.addEventListener("click", () => {
    authRole = button.dataset.role;
    document
      .querySelectorAll(".auth-tabs button")
      .forEach((tab) => tab.classList.toggle("active", tab === button));
    setAuthMode(authMode);
  }),
);
authSwitch.addEventListener("click", () =>
  setAuthMode(authMode === "login" ? "register" : "login"),
);
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "";
  authSubmit.disabled = true;
  authSubmit.textContent = "Please wait...";
  const identifier = document.querySelector("#authIdentifier").value.trim();
  const password = document.querySelector("#authPassword").value;
  const endpoint = `/api/auth/${authMode === "register" ? "register" : "login"}`;
  const payload =
    authMode === "register"
      ? {
          username: identifier,
          email: document.querySelector("#authEmail").value.trim(),
          password,
          role: authRole,
        }
      : {
          username: identifier,
          email: identifier.includes("@") ? identifier : undefined,
          password,
        };
  try {
    const data = await request(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setProfile(data.user);
    authDialog.close();
    authForm.reset();
    await loadCatalog();
  } catch (error) {
    authMessage.textContent = error.message;
  } finally {
    authSubmit.disabled = false;
    authSubmit.textContent =
      authMode === "register" ? "Create account" : "Sign in";
  }
});

const savedUser = JSON.parse(localStorage.getItem("noctraUser") || "null");
if (savedUser) {
  setProfile(savedUser);
  loadCatalog();
}

const uploadDialog = document.querySelector("#uploadDialog");
const uploadForm = document.querySelector("#uploadForm");
const uploadMessage = document.querySelector("#uploadMessage");
const uploadSubmit = document.querySelector("#uploadSubmit");

document.querySelector("#uploadMusic").addEventListener("click", () => {
  uploadMessage.textContent = "";
  uploadDialog.showModal();
});
document
  .querySelector("#closeUpload")
  .addEventListener("click", () => uploadDialog.close());
uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.querySelector("#trackTitle").value.trim();
  const file = document.querySelector("#trackFile").files[0];
  if (!title || !file) return;
  uploadMessage.textContent = "";
  uploadSubmit.disabled = true;
  uploadSubmit.textContent = "Uploading...";
  const formData = new FormData();
  formData.append("title", title);
  formData.append("music", file);
  try {
    const response = await fetch("/api/music/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(data.message || `Upload failed (${response.status})`);
    uploadForm.reset();
    uploadDialog.close();
    await loadCatalog();
  } catch (error) {
    uploadMessage.textContent = error.message;
  } finally {
    uploadSubmit.disabled = false;
    uploadSubmit.textContent = "Upload track";
  }
});
