const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const chokidar = require('chokidar');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();

// WebSocket connections
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('✅ Yeni bağlantı kuruldu');
    clients.add(ws);

    ws.on('close', () => {
        console.log('❌ Bağlantı kapatıldı');
        clients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket hatası:', error);
        clients.delete(ws);
    });
});

// File watcher for live reload
const watcher = chokidar.watch(['*.html', '*.js', '*.css'], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
});

watcher.on('change', (filePath) => {
    console.log(`📝 Dosya değişti: ${filePath}`);
    console.log(`🔄 ${clients.size} istemciye reload sinyali gönderiliyor...`);

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
});

// Dashboard route
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
    const gameUrl = `http://${localIP}:${PORT}/game.html`;
    const rpgUrl = `http://${localIP}:${PORT}/metin2-style.html`;

    res.send(`
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobil Oyun Önizleme Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            margin-bottom: 30px;
            text-align: center;
        }

        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }

        .subtitle {
            color: #666;
            font-size: 16px;
        }

        .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #4ade80;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            margin-top: 15px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }

        .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .card {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .card h2 {
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #qrcode {
            display: flex;
            justify-content: center;
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 10px;
        }

        .info-item {
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }

        .info-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }

        .info-value {
            color: #333;
            word-break: break-all;
            font-family: 'Courier New', monospace;
        }

        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s;
            width: 100%;
            margin-top: 10px;
        }

        .btn:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .connections {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-top: 15px;
        }

        .connections-count {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }

        .instructions {
            background: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            border-radius: 10px;
            margin-top: 15px;
        }

        .instructions h3 {
            color: #856404;
            margin-bottom: 10px;
        }

        .instructions ol {
            margin-left: 20px;
            color: #856404;
        }

        .instructions li {
            margin: 5px 0;
        }

        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
            }

            h1 {
                font-size: 24px;
            }
        }

        .preview-frame {
            width: 100%;
            height: 600px;
            border: none;
            border-radius: 10px;
            background: white;
        }

        .device-frame {
            background: #333;
            padding: 15px;
            border-radius: 20px;
            margin-top: 20px;
        }

        .game-selector {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .game-option {
            background: rgba(102, 126, 234, 0.1);
            border: 2px solid rgba(102, 126, 234, 0.3);
            border-radius: 10px;
            padding: 20px;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s;
        }

        .game-option:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }

        .game-option.active {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.3);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .game-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }

        .game-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .game-desc {
            font-size: 12px;
            color: #666;
        }

        @media (max-width: 768px) {
            .game-selector {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 Mobil Oyun Önizleme Dashboard</h1>
            <p class="subtitle">Oyununuzu gerçek zamanlı olarak mobil cihazlarda test edin</p>
            <div class="status">
                <span>🔴</span>
                <span>Canlı Yayında</span>
            </div>
            <div class="connections">
                <span>👥 Bağlı Cihazlar:</span>
                <span class="connections-count" id="connectionCount">0</span>
            </div>
        </div>

        <div class="content">
            <div class="card">
                <h2>🎮 Oyun Seç</h2>
                <div class="game-selector">
                    <div class="game-option active" onclick="selectGame('game')">
                        <div class="game-icon">🎯</div>
                        <div class="game-title">Basit Oyun</div>
                        <div class="game-desc">Engellerden kaçma oyunu</div>
                    </div>
                    <div class="game-option" onclick="selectGame('rpg')">
                        <div class="game-icon">⚔️</div>
                        <div class="game-title">RPG Oyunu</div>
                        <div class="game-desc">Metin2-style RPG</div>
                    </div>
                </div>

                <h2>📱 QR Kod ile Bağlan</h2>
                <div id="qrcode"></div>

                <div class="info-item">
                    <div class="info-label">📍 Oyun URL'si:</div>
                    <div class="info-value" id="gameUrlText">${gameUrl}</div>
                </div>

                <button class="btn" onclick="copyUrl()">📋 URL'yi Kopyala</button>

                <div class="instructions">
                    <h3>📖 Nasıl Kullanılır?</h3>
                    <ol>
                        <li>Telefonunuzla yukarıdaki QR kodu okutun</li>
                        <li>Veya URL'yi kopyalayıp mobil tarayıcıda açın</li>
                        <li>Oyun dosyalarını düzenleyin</li>
                        <li>Değişiklikler otomatik olarak cihazınıza yansıyacak!</li>
                    </ol>
                </div>

                <div class="info-item">
                    <div class="info-label">💡 İpucu:</div>
                    <div class="info-value">
                        Bilgisayar ve telefonunuz aynı Wi-Fi ağında olmalıdır.
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>🖥️ PC Önizleme</h2>
                <div class="device-frame">
                    <iframe src="/game.html" class="preview-frame" id="previewFrame"></iframe>
                </div>
                <button class="btn" onclick="openInNewTab()">
                    🚀 Yeni Sekmede Aç
                </button>
            </div>
        </div>
    </div>

    <script>
        // Game URLs
        const games = {
            game: '${gameUrl}',
            rpg: '${rpgUrl}'
        };

        let currentGame = 'game';
        let qrCanvas = null;

        // Initialize with default game
        updateQRCode(games.game);

        function updateQRCode(url) {
            const qrcodeDiv = document.getElementById('qrcode');
            qrcodeDiv.innerHTML = '';

            QRCode.toCanvas(url, { width: 250, margin: 2 }, (error, canvas) => {
                if (error) console.error(error);
                qrcodeDiv.appendChild(canvas);
                qrCanvas = canvas;
            });
        }

        function selectGame(gameType) {
            currentGame = gameType;
            const url = games[gameType];

            // Update active state
            document.querySelectorAll('.game-option').forEach(opt => {
                opt.classList.remove('active');
            });
            event.target.closest('.game-option').classList.add('active');

            // Update URL display
            document.getElementById('gameUrlText').textContent = url;

            // Update QR code
            updateQRCode(url);

            // Update preview
            document.getElementById('previewFrame').src = url.replace('http://${localIP}:${PORT}', '');
        }

        function copyUrl() {
            const url = games[currentGame];
            navigator.clipboard.writeText(url).then(() => {
                alert('✅ URL kopyalandı!');
            });
        }

        function openInNewTab() {
            const url = games[currentGame];
            window.open(url.replace('http://${localIP}:${PORT}', ''), '_blank');
        }

        // WebSocket connection counter
        const ws = new WebSocket('ws://' + window.location.host);

        ws.onopen = () => {
            console.log('Dashboard bağlandı');
        };

        ws.onmessage = (event) => {
            if (event.data === 'reload') {
                location.reload();
            }
        };

        // Update connection count periodically
        setInterval(() => {
            fetch('/api/connections')
                .then(r => r.json())
                .then(data => {
                    document.getElementById('connectionCount').textContent = data.count;
                });
        }, 2000);
    </script>
</body>
</html>
    `);
});

// API endpoint for connection count
app.get('/api/connections', (req, res) => {
    res.json({ count: clients.size });
});

// Start server
server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🎮 MOBİL OYUN ÖNİZLEME SUNUCUSU BAŞLATILDI');
    console.log('='.repeat(60));
    console.log(`\n📱 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🎯 Oyun URL: http://localhost:${PORT}/game.html`);
    console.log(`\n🌐 Ağ Adresi: http://${localIP}:${PORT}`);
    console.log(`📱 Mobil için: http://${localIP}:${PORT}/game.html`);
    console.log('\n💡 Dashboard\'u açmak için tarayıcınızda yukarıdaki adresi kullanın');
    console.log('📝 Dosyalarınızı düzenleyin, değişiklikler otomatik yansıyacak!\n');
    console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('⏹️  Sunucu kapatılıyor...');
    watcher.close();
    server.close(() => {
        console.log('✅ Sunucu kapatıldı');
        process.exit(0);
    });
});
