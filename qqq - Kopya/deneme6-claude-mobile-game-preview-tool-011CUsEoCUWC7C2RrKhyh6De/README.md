# 🎮 Mobil Oyun Önizleme Aracı

PC oyunlarını mobil cihazlarda gerçek zamanlı olarak test etmek için geliştirilmiş profesyonel önizleme aracı.

## ✨ Özellikler

- 🔴 **Canlı Yayın**: Dosyalarınızı düzenleyin, değişiklikler anında tüm cihazlara yansır
- 📱 **QR Kod Desteği**: Mobil cihazınızla QR kod okutarak hızlıca bağlanın
- 🎯 **Responsive Tasarım**: Oyununuz tüm ekran boyutlarına otomatik uyum sağlar
- 🎮 **Mobil Kontroller**: Touch kontroller ile mobilde mükemmel oyun deneyimi
- 📊 **Dashboard**: Bağlı cihazları takip edin ve önizleme yapın
- ⚡ **WebSocket**: Gerçek zamanlı iletişim ve hızlı güncelleme

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Sunucuyu Başlatın

```bash
npm start
```

### 3. Dashboard'u Açın

Tarayıcınızda şu adresi açın:
```
http://localhost:3000/dashboard
```

## 📱 Mobil Cihazda Test Etme

### Yöntem 1: QR Kod ile
1. Dashboard'daki QR kodu mobil cihazınızla okutun
2. Oyun otomatik olarak açılacaktır

### Yöntem 2: Manuel URL
1. Dashboard'dan URL'yi kopyalayın
2. Mobil tarayıcınızda açın

**ÖNEMLİ:** Bilgisayar ve mobil cihazınız aynı Wi-Fi ağında olmalıdır!

## 🎮 Oyun Özellikleri

### Kontroller

**PC'de:**
- ⬅️ Sol Ok / A tuşu: Sola hareket
- ➡️ Sağ Ok / D tuşu: Sağa hareket
- Fare: Duraklatma ve yeni oyun butonları

**Mobilde:**
- 👆 Dokunmatik: Ekrana dokunup kaydırarak hareket edin
- 🔘 Alt kısımdaki ok butonları ile kontrol
- Butonlar: Duraklatma ve yeni oyun

### Oyun Mekaniği

- Düşen engellerden kaçın
- Her kaçırdığınız engel için +10 puan kazanın
- Engele çarparsanız oyun biter
- Skorunuzu yükseltin!

## 🛠️ Geliştirme

### Oyunu Özelleştirme

`game.html` dosyasını düzenleyerek oyunu özelleştirebilirsiniz:

```javascript
// Oyuncu ayarları (satır ~92)
this.player = {
    x: this.canvas.width / 2,
    y: this.canvas.height - 50,
    width: 50,
    height: 50,
    color: '#00ff88',  // Oyuncu rengi
    speed: 5           // Hareket hızı
};
```

### Canlı Yenileme

Herhangi bir `.html`, `.js` veya `.css` dosyasını değiştirdiğinizde:
1. Sunucu değişikliği otomatik algılar
2. Tüm bağlı cihazlara sinyal gönderir
3. Sayfalar otomatik yenilenir

### Yeni Özellik Ekleme

1. `game.html` dosyasını düzenleyin
2. Kaydedin
3. Değişiklik anında tüm cihazlara yansır!

## 📂 Proje Yapısı

```
deneme6/
├── server.js           # Express sunucu ve WebSocket yönetimi
├── game.html           # Ana oyun dosyası (HTML5 Canvas)
├── package.json        # Proje bağımlılıkları
└── README.md          # Dokümantasyon
```

## 🔧 Yapılandırma

### Port Değiştirme

Farklı bir port kullanmak için:

```bash
PORT=8080 npm start
```

### Ağ Ayarları

Sunucu otomatik olarak yerel IP adresinizi algılar. Manuel olarak değiştirmek isterseniz `server.js` dosyasındaki `getLocalIP()` fonksiyonunu düzenleyin.

## 📊 Dashboard Özellikleri

Dashboard şunları sağlar:

- 📱 **QR Kod**: Hızlı mobil erişim
- 🖥️ **PC Önizleme**: Tarayıcıda doğrudan test
- 👥 **Bağlantı Sayacı**: Kaç cihaz bağlı görün
- 📋 **URL Kopyalama**: Tek tıkla URL paylaşımı
- 📖 **Kullanım Talimatları**: Adım adım rehber

## 🐛 Sorun Giderme

### Mobil Cihazdan Bağlanamıyorum

1. ✅ Her iki cihaz da aynı Wi-Fi ağında mı?
2. ✅ Güvenlik duvarı bağlantıyı engelliyor mu?
3. ✅ Doğru IP adresini mi kullanıyorsunuz?

### Değişiklikler Yansımıyor

1. ✅ Sunucu çalışıyor mu?
2. ✅ Dosya doğru konumda mı?
3. ✅ Konsolu kontrol edin, hata var mı?

### WebSocket Bağlantı Hatası

1. ✅ Port 3000 başka bir uygulama tarafından kullanılıyor mu?
2. ✅ Tarayıcı WebSocket'i destekliyor mu?

## 🚀 İleri Seviye

### Farklı Oyun Ekleme

Yeni bir oyun dosyası oluşturup `server.js`'de route ekleyebilirsiniz:

```javascript
app.get('/mygame', (req, res) => {
    res.sendFile(path.join(__dirname, 'mygame.html'));
});
```

### CSS Stilleri Özelleştirme

`game.html` içindeki `<style>` bölümünü düzenleyerek görünümü değiştirebilirsiniz.

### Performans İyileştirme

- Canvas boyutunu optimize edin
- Oyun döngüsünü optimize edin
- Gereksiz render'ları önleyin

## 📝 Lisans

MIT License - İstediğiniz gibi kullanabilirsiniz!

## 🤝 Katkıda Bulunma

Her türlü katkı ve öneri için pull request açabilirsiniz.

## 💡 İpuçları

1. **Performans**: Mobilde 60 FPS için canvas boyutunu optimize edin
2. **Battery**: Oyun döngüsünde gereksiz hesaplamalardan kaçının
3. **UX**: Touch kontrollerini büyük ve kolay erişilebilir yapın
4. **Test**: Farklı ekran boyutlarında test edin

## 📞 Destek

Sorun yaşıyorsanız:
1. README'yi tekrar okuyun
2. Konsol hatalarını kontrol edin
3. Issue açın veya soru sorun

---

**Keyifli oyunlar! 🎮**
