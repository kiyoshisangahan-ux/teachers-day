import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support large base64 images (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Ensure public/photos directory exists
  const photosDir = path.resolve(__dirname, 'public/photos');
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
  }

  const manifestPath = path.join(photosDir, 'manifest.json');

  // API to retrieve all permanently stored photos
  app.get('/api/photos', (req, res) => {
    try {
      if (fs.existsSync(manifestPath)) {
        const data = fs.readFileSync(manifestPath, 'utf8');
        return res.json(JSON.parse(data));
      }
      return res.json({});
    } catch (err) {
      console.error('Error reading photos manifest:', err);
      return res.status(500).json({ error: 'Failed to read photos' });
    }
  });

  // API to save a photo permanently on the server disk
  app.post('/api/photos', (req, res) => {
    try {
      const { id, filename, base64 } = req.body;
      if (!id || !base64) {
        return res.status(400).json({ error: 'Missing id or base64 data' });
      }

      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = '.jpg';

      if (matches && matches.length === 3) {
        if (matches[1].includes('png')) ext = '.png';
        if (matches[1].includes('webp')) ext = '.webp';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        // If raw base64 without prefix
        buffer = Buffer.from(base64, 'base64');
      }

      const safeFilename = `${id}${ext}`;
      const filePath = path.join(photosDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      // Update manifest.json
      let manifest: Record<string, string> = {};
      if (fs.existsSync(manifestPath)) {
        try {
          manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        } catch {}
      }

      const publicUrl = `/photos/${safeFilename}?v=${Date.now()}`;
      manifest[id] = publicUrl;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

      return res.json({ success: true, url: publicUrl, manifest });
    } catch (err) {
      console.error('Error saving photo:', err);
      return res.status(500).json({ error: 'Failed to save photo' });
    }
  });

  // Serve static public folder
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Attach Vite middleware in development
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
