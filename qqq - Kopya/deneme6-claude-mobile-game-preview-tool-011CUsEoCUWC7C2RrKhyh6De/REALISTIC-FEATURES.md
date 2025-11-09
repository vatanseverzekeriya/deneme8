# Gerçekçi Oyun Özellikleri

Bu dosya, oyuna eklenen tüm gerçekçilik özelliklerini açıklar.

## 🎨 Gelişmiş Grafik Sistemleri

### 1. Parçacık Sistemi (particle-system.js)

Gerçekçi parçacık efektleri için tam özellikli sistem:

**Parçacık Türleri:**
- ✨ **Toz Parçacıkları**: Toprak ve çimende yürürken
- 💧 **Su Sıçraması**: Suya girerken veya sudan çıkarken
- 🍃 **Yaprak Parçacıkları**: Ağaçların altında yürürken
- 👣 **Ayak İzleri**: Karakterin geçtiği yerlerde
- ⭐ **Parıltılar**: Sihirli efektler için
- 🌧️ **Yağmur**: Yağmur hava durumu için
- ❄️ **Kar**: Kar yağışı için

**Özellikler:**
- Gerçekçi fizik (yerçekimi, sürtünme, hava direnci)
- Döngüsel hareket (yapraklar sallanır)
- Genişleme efektleri (su dalgaları)
- Solma animasyonları
- Performans optimizasyonu (max 500 parçacık)

**Kullanım Örneği:**
```javascript
const particles = new ParticleSystem();

// Toz efekti ekle
particles.emitDust(playerX, playerY, 'grass');

// Su sıçraması ekle
particles.emitWaterSplash(x, y, 1.5);

// Yaprak efekti ekle
particles.emitLeaves(x, y, 5);
```

---

### 2. Çevre Animasyon Sistemi (environment-system.js)

Dinamik ve canlı bir oyun dünyası:

**Özellikler:**
- ☁️ **Bulutlar**: Farklı hızlarda hareket eden, paralaks efektli bulutlar
- 🌬️ **Rüzgar Sistemi**: Dinamik rüzgar yönü ve şiddeti
- 🌳 **Ağaç Animasyonları**: Rüzgarla sallanan ağaçlar
- 🌞 **Gündüz/Gece Döngüsü**: 24 saatlik gerçek zamanlı ışık değişimi
- 🌫️ **Sis Efekti**: Ayarlanabilir sis yoğunluğu

**Gün Zamanları:**
- Şafak (06:00-08:00): Turuncu ışık
- Sabah (08:00-12:00): Sarımsı aydınlık
- Öğle (12:00-17:00): Tam aydınlık
- Akşam (17:00-19:00): Turuncu/pembe gün batımı
- Gece (19:00-06:00): Mavi-mor karanlık

**Kullanım Örneği:**
```javascript
const environment = new EnvironmentSystem(mapWidth, mapHeight);

// Zamanı ayarla
environment.setTimeOfDay(18); // Akşam 6

// Sis ekle
environment.enableFog(0.3);

// Ağaç animasyonu ekle
environment.addTreeAnimation(treeX, treeY, treeType);
```

---

### 3. Gelişmiş Kamera Sistemi (camera-system.js)

Sinematik ve pürüzsüz kamera hareketi:

**Özellikler:**
- 🎥 **Yumuşak Takip**: Karakteri yumuşakça takip eder
- 👀 **Look-Ahead**: Hareket yönüne bakar
- 🔍 **Zoom**: Dinamik yakınlaştırma/uzaklaştırma
- 💥 **Kamera Sarsıntısı**: Patlama ve vuruş efektleri için
- 🎬 **Geçiş Animasyonları**: Yumuşak konum geçişleri
- 🌌 **Parallax Desteği**: Katmanlı arka planlar için
- 📦 **Culling**: Görünmeyen nesneleri render etmez

**Kamera Modları:**
- Serbest mod (tam kontrol)
- Takip modu (karakter takibi)
- Deadzone modu (merkez bölgede hareket yok)

**Kullanım Örneği:**
```javascript
const camera = new CameraSystem(width, height, mapWidth, mapHeight);

// Hedef belirle
camera.setTarget(playerX, playerY);

// Zoom yap
camera.setZoom(1.5);

// Sarsıntı ekle
camera.shake(10, 500); // şiddet: 10, süre: 500ms

// Geçiş yap
camera.transitionTo(newX, newY, 1000); // 1 saniye
```

---

### 4. Işık ve Gölge Sistemi (lighting-system.js)

Dinamik ışıklandırma ve gerçekçi gölgeler:

**Işık Türleri:**
- 🔥 **Meşale Işığı**: Titreyen sarı-turuncu ışık
- ✨ **Sihirli Işık**: Parıldayan mor/mavi ışık
- 💡 **Nokta Işığı**: Özelleştirilebilir renk ve yoğunluk
- 🌅 **Global Işık**: Ortam aydınlatması

**Gölge Özellikleri:**
- Yumuşak gölge kenarları (blur efekti)
- Işık yönüne göre dinamik gölge konumu
- Ayarlanabilir opaklık
- Performans optimizasyonu

**Kullanım Örneği:**
```javascript
const lighting = new LightingSystem();

// Meşale ekle
const torch = lighting.addTorch(x, y, 150);

// Sihirli ışık ekle
const magic = lighting.addMagicalLight(x, y, 100, {r: 150, g: 100, b: 255});

// Gölge ekle
lighting.updateShadow('player', playerX, playerY, 32, 64);

// Ortam karanlığını ayarla
lighting.setAmbientLight(0.3); // %30 aydınlık (karanlık gece)
```

---

### 5. Hava Durumu Sistemi (weather-system.js)

Gerçek zamanlı hava durumu efektleri:

**Hava Durumu Türleri:**
- ☀️ **Açık**: Temiz hava
- 🌧️ **Yağmurlu**: Yağmur damlaları ve hafif sis
- ❄️ **Karlı**: Kar taneleri ve yoğun sis
- ⛈️ **Fırtınalı**: Şiddetli yağmur, rüzgar ve şimşek
- 🌫️ **Sisli**: Yoğun sis efekti

**Efektler:**
- Gerçekçi yağmur damlaları (rüzgarla eğilir)
- Sallanan kar taneleri
- Şimşek çakması (prosedürel üretim)
- Ekran flaşı efekti
- Sis overlayı
- Rüzgar etkisi

**Kullanım Örneği:**
```javascript
const weather = new WeatherSystem(canvasWidth, canvasHeight);

// Hava durumu ayarla
weather.setWeather('rain', 0.7); // %70 yoğunlukta yağmur

// Fırtına başlat
weather.setWeather('storm', 1.0); // Tam şiddet

// Gök gürültüsü kontrolü
if (weather.checkThunder()) {
    playThunderSound();
}
```

---

## 🎮 Entegrasyon

Tüm sistemler modüler yapıda ve birlikte çalışacak şekilde tasarlanmıştır:

```javascript
// Sistemleri oluştur
const particles = new ParticleSystem();
const environment = new EnvironmentSystem(mapWidth, mapHeight);
const camera = new CameraSystem(width, height, mapWidth, mapHeight);
const lighting = new LightingSystem();
const weather = new WeatherSystem(width, height);

// Update döngüsü
function update(deltaTime) {
    camera.setTarget(player.x, player.y);
    camera.update(deltaTime);

    environment.update(deltaTime);
    lighting.update(deltaTime);
    weather.update(deltaTime, camera.getX(), camera.getY());
    particles.update(deltaTime);
}

// Render döngüsü
function render(ctx) {
    // 1. Arka plan (bulutlar)
    environment.draw(ctx, camera.getX(), camera.getY());

    // 2. Gölgeler
    lighting.drawShadows(ctx, camera.getX(), camera.getY());

    // 3. Oyun dünyası (harita, karakterler vb.)
    drawGameWorld(ctx, camera);

    // 4. Parçacıklar
    particles.draw(ctx, camera.getX(), camera.getY());

    // 5. Işıklar
    lighting.drawLights(ctx, camera.getX(), camera.getY());

    // 6. Hava durumu
    weather.draw(ctx, camera.getX(), camera.getY());

    // 7. Post-processing
    environment.drawPostEffects(ctx, width, height);
    lighting.drawAmbientDarkness(ctx, width, height);
    weather.drawLightningFlash(ctx);
}
```

---

## ⚡ Performans Optimizasyonları

- **Parçacık Limiti**: Max 500 aktif parçacık
- **Culling**: Ekran dışı objeler render edilmez
- **Object Pooling**: Parçacıklar yeniden kullanılır
- **Lazy Updates**: Görünmeyen sistemler güncellenmez
- **Batch Rendering**: Aynı türdeki objeler birlikte render edilir

---

## 🎨 Görsel Kalite Ayarları

Sistemler performansa göre ayarlanabilir:

```javascript
// Düşük performans (mobil)
particles.maxParticles = 200;
lighting.setShadowBlur(5);
weather.setWeather('rain', 0.3);

// Yüksek performans (masaüstü)
particles.maxParticles = 500;
lighting.setShadowBlur(15);
weather.setWeather('rain', 1.0);
```

---

## 📋 Sistem Gereksinimleri

**Minimum:**
- HTML5 Canvas desteği
- JavaScript ES6+
- 30 FPS hedef

**Önerilen:**
- Modern tarayıcı (Chrome, Firefox, Safari, Edge)
- 60 FPS hedef
- GPU hızlandırma

---

## 🔧 Geliştirici Notları

Tüm sistemler bağımsız modüller olarak tasarlanmıştır ve kolayca etkinleştirilebilir/devre dışı bırakılabilir:

```javascript
// Sistemleri devre dışı bırak
lighting.setShadowsEnabled(false);
environment.disableFog();
weather.clear();
particles.clear();
```

Her sistem `update()` ve `draw()` metodlarını implement eder ve oyun döngüsüne kolayca entegre edilebilir.

---

## 📝 Lisans

Bu sistemler oyunun bir parçasıdır ve aynı lisans altındadır.
