require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const emailRoutes = require('./routes/email');
const aiRoutes = require('./routes/ai');
const callbackRoutes = require('./routes/callbacks');
const initDatabase = require('./db/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint (for Coolify/Docker health checks)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api', emailRoutes);
app.use('/api', aiRoutes);
app.use('/api', callbackRoutes);

// ============================================
// Multi-Page Application Routes
// ============================================

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Main pages
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/treatments', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments.html'));
});

app.get('/special-offers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'special-offers.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Treatment category pages
app.get('/treatments/general-dentistry', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'general-dentistry.html'));
});

app.get('/treatments/cosmetic-dentistry', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'cosmetic-dentistry.html'));
});

app.get('/treatments/restorative-dentistry', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'restorative-dentistry.html'));
});

app.get('/treatments/preventative-care', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'preventative-care.html'));
});

// Individual General Dentistry treatment pages
app.get('/treatments/tooth-coloured-fillings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'tooth-coloured-fillings.html'));
});

app.get('/treatments/extractions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'extractions.html'));
});

app.get('/treatments/dentures', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'dentures.html'));
});

app.get('/treatments/childrens-dentistry', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'childrens-dentistry.html'));
});

app.get('/treatments/root-canal', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'root-canal.html'));
});

app.get('/treatments/wisdom-teeth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'wisdom-teeth.html'));
});

// Individual Cosmetic Dentistry treatment pages
app.get('/treatments/smile-makeovers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'smile-makeovers.html'));
});

app.get('/treatments/dental-crowns', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'dental-crowns.html'));
});

app.get('/treatments/dental-bridges', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'dental-bridges.html'));
});

app.get('/treatments/teeth-whitening', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'teeth-whitening.html'));
});

app.get('/treatments/porcelain-veneers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'porcelain-veneers.html'));
});

app.get('/treatments/inlays-onlays', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'inlays-onlays.html'));
});

app.get('/treatments/dental-implants', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'dental-implants.html'));
});

// Individual Preventative Care treatment pages
app.get('/treatments/oral-health-assessment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'oral-health-assessment.html'));
});

app.get('/treatments/oral-hygiene', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'oral-hygiene.html'));
});

app.get('/treatments/gum-disease', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'gum-disease.html'));
});

app.get('/treatments/mouthguards', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'mouthguards.html'));
});

app.get('/treatments/night-guards', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'night-guards.html'));
});

app.get('/treatments/periodontics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treatments', 'periodontics.html'));
});

// 404 handler - serve custom 404 page or fallback
app.use((req, res) => {
    // Check if it's an API request
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    // Serve 404 page for other requests
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'), (err) => {
        if (err) {
            res.status(404).send('<h1>Page Not Found</h1><p><a href="/">Return to Home</a></p>');
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
(async () => {
    try {
        await initDatabase();
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
        console.log(`📧 Email API: http://localhost:${PORT}/api/send-email`);
        console.log(`🤖 AI Chat API: http://localhost:${PORT}/api/chat`);
        console.log(`📞 Callbacks API: http://localhost:${PORT}/api/callbacks`);
        console.log(`🔧 Admin Dashboard: http://localhost:${PORT}/admin/callbacks.html`);
        console.log(`❤️ Health check: http://localhost:${PORT}/health`);
    });
})();

module.exports = app;
