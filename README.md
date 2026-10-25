# Noctra

Noctra is a music-streaming project with an Express/MongoDB API and a responsive browser client. Users can register, listen to music, browse albums, and—when registered as an artist—upload audio tracks.

## Requirements

- Node.js 18 or newer
- A MongoDB connection string
- ImageKit credentials for music uploads

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_jwt_secret
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Authentication

The project has one `User` model with two roles:

- `user` — can browse music and albums
- `artist` — can browse music and upload tracks

The frontend lets you choose the role while creating an account. Authentication is stored in an HTTP-only `token` cookie.

## API

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account. Send `username`, `email`, `password`, and optional `role` (`user` or `artist`). |
| POST | `/api/auth/login` | Sign in. Send `username` or `email`, plus `password`. |
| POST | `/api/auth/logout` | Clear the authentication cookie. |

### Music

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/music` | Signed-in user or artist | Fetch music. |
| GET | `/api/music/album` | Signed-in user or artist | Fetch albums. |
| GET | `/api/music/album/:albumId` | Signed-in user or artist | Fetch one album. |
| POST | `/api/music/upload` | Artist only | Upload a track as `multipart/form-data` with `title` and `music`. |
| POST | `/api/music/album` | Artist only | Create an album with `title` and `musicIds`. |

## Frontend

The client is served from `public/` by Express. It includes:

- Listener and artist registration/login
- Music and album loading through the API
- Browser audio controls and queue navigation
- Search, liked songs, and playlist creation UI
- Artist-only music upload dialog

## Scripts

```bash
npm run dev    # Run with nodemon
npm start      # Run with Node.js
```
