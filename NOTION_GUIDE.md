# Notion Veri Yönetimi ve Editör Kılavuzu

Bu kılavuz, Yardım Merkezi (Help Center) uygulamasındaki içeriklerin Notion üzerinden nasıl yönetileceğini açıklar. Uygulama dört ana veritabanı (Database) üzerine kuruludur: **Apps**, **Modules**, **Topics** ve **Articles**.

---

## 🚀 Genel Kurallar
- **Status (Durum):** Kayıtların görünmesi için "Active" (veya Articles için "Published") seçilmelidir.
- **Key/Slug:** Boşluk içermemeli, küçük harf ve tire (`-`) kullanılmalıdır (Örn: `hesap-ayarlari`).
- **Sıralama (Order):** Sayılardan oluşur (1, 2, 3...). Küçük sayılar her zaman en üstte görünür.

---

## 1. Help Center Apps (Uygulamalar)
Ana sayfadaki büyük kartları temsil eder.

| Özellik | Tip | Açıklama |
| :--- | :--- | :--- |
| **Title / Name** | Başlık | Uygulamanın adı (Örn: Eva Operation). |
| **Key** | Metin | URL'de görünecek kimlik (Örn: `eva-operation`). |
| **Description** | Metin | İngilizce kısa açıklama. |
| **TR Description** | Metin | Türkçe kısa açıklama. |
| **ZH Description** | Metin | Çince kısa açıklama. |
| **Icon** | Dosya | Kartın üzerinde görünecek görsel (URL veya Upload). |
| **Order** | Sayı | Ana sayfadaki dizilim sırası. |
| **Status** | Select | "Active" olmalı. |

---

## 2. Help Center Modules (Modüller)
Bir uygulamaya tıklandığında sol menüde veya aşağıda listelenen ana bölümlerdir.

| Özellik | Tip | Açıklama |
| :--- | :--- | :--- |
| **Name** | Başlık | Modülün İngilizce adı (Örn: Settings). |
| **TR Name** | Metin | Modülün Türkçe adı (Örn: Ayarlar). |
| **ZH Name** | Metin | Modülün Çince adı. |
| **Description** | Metin | İngilizce modül açıklaması. |
| **TR Description** | Metin | Türkçe modül açıklaması. |
| **ZH Description** | Metin | Çince modül açıklaması. |
| **Key** | Metin | URL kimliği (Örn: `settings`). |
| **Help Center Apps** | Relation | Bu modül hangi uygulamaya/uygulamalara aitse o seçilmeli. |
| **Order** | Sayı | Modüller arasındaki sıralama. |
| **Status** | Select | "Active" olmalı. |

---

## 3. Help Center Topics (Konular)
Modüllerin altındaki klasörleme yapısıdır.

| Özellik | Tip | Açıklama |
| :--- | :--- | :--- |
| **Name** | Başlık | Konunun adı. |
| **TR Name** | Metin | Konunun Türkçe adı. |
| **ZH Name** | Metin | Konunun Çince adı. |
| **Description** | Metin | İngilizce konu açıklaması. |
| **TR Description** | Metin | Türkçe konu açıklaması. |
| **ZH Description** | Metin | Çince konu açıklaması. |
| **Help Center Apps** | Relation | İlgili Uygulama (Gerekli). |
| **Help Center Modules**| Relation | İlgili Modül (Gerekli). |
| **Order** | Sayı | Konular arasındaki sıralama. |
| **Status** | Select | "Active" olmalı. |

---

## 4. Help Center Articles (Makaleler)
Gerçek içeriklerin bulunduğu, okuma sayfalarını temsil eden veritabanıdır.

| Özellik | Tip | Açıklama |
| :--- | :--- | :--- |
| **Title** | Başlık | Makale başlığı. |
| **Slug** | Metin | Benzersiz URL uzantısı (Örn: `sifre-sifirlama-nasil-yapilir`). |
| **Excerpt** | Metin | Makale başında görünen kısa özet. **Renklendirme ve kalınlaştırma desteklenir.** |
| **Language** | Select | "en", "tr" veya "zh" seçilmeli. |
| **Status** | Select | Makale yayına hazırsa **"Published"** seçilmeli. |
| **Visibility** | Select | **"Public"** seçilmeli. |
| **Order** | Sayı | Liste içindeki öncelik sırası. |
| **Help Center Apps** | Relation | Bağlı olduğu uygulama(lar). |
| **Help Center Modules**| Relation | Bağlı olduğu modül(ler). |
| **Help Center Topics** | Relation | Bağlı olduğu konu (Topic). |
| **Related Articles** | Relation | Sayfanın altında "İlgili Makaleler" olarak görünecek diğer makaleler. |

### 📝 Makale İçeriği Hazırlama İpuçları:
- **Callout:** Önemli notlar için Notion Callout bloğunu kullanabilirsiniz. Renkleri desteklenir.
- **Tablolar:** Satır içi renklendirmeler ve satır sonları desteklenir.
- **Başlıklar:** Heading 1, 2 ve 3 kullanarak hiyerarşi oluşturun. Bunlar otomatik olarak sol taraftaki "İçindekiler" bölümüne eklenecektir.
- **Görseller:** Notion'a eklediğiniz görseller otomatik olarak optimize edilerek gösterilir.

---

## 💡 Editörler İçin İpucu
Yeni bir dil eklediğinizde (Örn: Bir makalenin Türkçesini yazarken) mutlaka **Language** alanını seçin ve ilgili **Topics** ve **Modules** bağlantılarını doğru kurduğunuzdan emin olun. Uygulama otomatik olarak dile göre filtreleme yapacaktır.
