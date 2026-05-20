# FOLDER STRUCTURE AND NETWORK ARCHITECTURE

Bu doküman, projenin fiziksel klasör dizinini, ağ (network) katmanı kurallarını ve dosya izolasyon prensiplerini belirler. AI ajanı, yeni bir dosya veya bileşen oluştururken bu haritanın dışına kesinlikle çıkamaz.

## 1. Fiziksel Klasör Ağacı (Folder Tree)
Proje dizini aşağıdaki hiyerarşiye sıkı sıkıya bağlı kalacaktır:

```text
/src
  /api
    /client.ts          # Axios instance ve Interceptor konfigürasyonları (Token, 401 yönetimi)
    /generated          # [READ-ONLY] Backend'den (Spring Boot) Codegen ile üretilen servisler ve DTO'lar
    /hooks              # TanStack (React) Query hook'larının bulunduğu klasör (Örn: useGetUser.ts)
  /assets               # İkonlar, fontlar ve Lottie/resim dosyaları
  /components           # [GLOBAL ATOMIC DESIGN]
    /atoms              # Temel UI elementleri (Button, Text, Input, Icon)
    /molecules          # Atomların birleşimi (SearchBar, FormField)
    /organisms          # Kendi başına çalışan kompleks UI blokları (GlassCard, Header, Navbar)
  /navigation           # React Navigation v7 Stack, Tab ve Router ayarları
  /screens              # Uygulamanın tam sayfa (Screen) bileşenleri
  /store                # Zustand ile oluşturulmuş global client-state dosyaları
  /utils
    errorHandler.ts     # Merkezi hata yakalama ve loglama servisi
    constants.ts        # Uygulama içi sabitler
```

## 2. Ağ Katmanı ve API Kuralları
Backend ile iletişim sadece `/src/api` altından sağlanacaktır. Ajan, sayfaların içine manuel `axios.get` yazamaz, sadece `/src/api/client.ts` kullanılacaktır.

## 3. Codegen İzolasyonu (STRICT READ-ONLY)
`/src/api/generated` klasöründeki dosyalar Codegen tarafından otomatik üretilmiştir. Ajan, bu klasördeki kodları **kesinlikle değiştiremez, silemez veya güncelleyemez**.

## 4. TanStack Query Kullanım Standartları
Sayfalar veya UI bileşenleri, `/src/api/generated` altındaki ham servis fonksiyonlarını doğrudan **çağıramaz**. Her servis çağrısı, `/src/api/hooks` altında bir TanStack Query hook'u yazılarak sarmalanmalıdır.

## 5. Merkezi Hata Yönetimi
Tüm `try/catch` hataları ekrana basılmadan önce `/src/utils/errorHandler.ts` içindeki merkezi fonksiyona gönderilmelidir.