# PROJECT CONTEXT — AUTO-LOADED AGENT RULES

Bu dosya Antigravity tarafından her prompt'ta otomatik olarak yüklenir.
Aşağıdaki üç belge bu projenin **değişmez kurallarını** belirler.
Kod üretirken bu kurallara kesinlikle uy.

---

# AI AGENT DIRECTIVES (AGENT_RULES)

Bu doküman, bu React Native projesinde kod yazan herhangi bir AI ajanı (Cursor, Copilot, vs.) için kesin ve değiştirilemez anayasa kurallarını içerir. Aşağıdaki kuralların dışına çıkılması kesinlikle yasaktır.

## 1. Kütüphane ve Bağımlılık Yönetimi (STRICT RULE)
* **Asla izinsiz paket kurma:** Projede belirlenen teknoloji yığını dışında hiçbir kütüphane/paket kullanamazsın. 
* **Sorma Zorunluluğu:** Bir problemi çözmek için yeni bir npm/yarn paketine ihtiyaç duyarsan, kodu yazmayı durdur ve Geliştirici'ye şu formatta sor: *"Bu işlem için [Kütüphane Adı] kütüphanesini kullanmam gerekiyor. Projeye dahil edebilir miyim?"* Onay almadan yeni bağımlılık ekleyen kodlar üretme.

## 2. Tip Güvenliği ve TypeScript
* **`any` Kullanımı Yasaktır:** Hiçbir durumda `any` tipini kullanamazsın. Veri tipleri tam ve eksiksiz olarak tanımlanmalıdır. API'den gelen veriler için tipler Codegen ile sağlanacaktır.
* **`interface` Tercihi:** Nesne yapıları, Component propları ve state tanımlamaları için standart olarak `interface` kullanılmalıdır. `type` kullanımı yalnızca union (`|`) veya intersection (`&`) gibi spesifik durumlar için geçerlidir.
* **Named Exports:** Bileşenlerde (components), fonksiyonlarda ve sabitlerde `export default` kullanımı yasaktır. Sadece Named Export kullanılacaktır (Örn: `export const MyComponent = () => {}`).

## 3. Styling (NativeWind)
* **NativeWind Standardı:** Projedeki tüm stillendirme işlemleri NativeWind (Tailwind CSS sınıfları) kullanılarak yapılacaktır. 
* Standart `StyleSheet.create` kullanımından, NativeWind'in desteklemediği çok ekstrem animasyon durumları haricinde kaçınılmalıdır. 
* Stil tanımlamalarını inline `className` prop'ları üzerinden yap.

## 4. Performans ve Hook Yönetimi
* **Erken Optimizasyondan (Premature Optimization) Kaçın:** Her fonksiyonu veya değişkeni `useCallback` veya `useMemo` içine alma.
* **Doğru Kullanım:** `useCallback` ve `useMemo` hook'larını yalnızca büyük bileşenlerde, gereksiz re-render riski olan yerlerde (örneğin `FlatList` renderItem fonksiyonları, karmaşık hesaplamalar gerektiren local stateler veya child componentlere prop olarak geçilen fonksiyonlar) kullan.

## 5. Hata Yönetimi ve Loglama
* **Console.log Yasaktır:** Geliştirme aşamasında dahi kod içerisinde `console.log()`, `console.warn()` veya `console.error()` bırakılamaz.
* **Standart Error Wrapper:** Hata yönetimi (try/catch blokları) için projedeki standart Error Wrapper/Logger servisi kullanılacaktır. Kod üretirken hataları standart hata yakalama metodolojisine uygun şekilde wrap et.

## 6. Clean Code ve Açıklamalar
* **Kendini Anlatan Kod:** Karmaşık mantıkları yorum satırlarıyla değil, temiz ve anlaşılır fonksiyon/değişken isimleriyle açıkla.
* Modüler düşün. Bir bileşen 150-200 satırı geçiyorsa, mantıklı alt bileşenlere (sub-components) veya custom hook'lara böl.

---

# ARCHITECTURE AND TECH STACK

Bu doküman, projenin teknoloji yığınını, mimari tasarım felsefesini ve UI/UX standartlarını belirler. AI ajanı, kod üretirken kesinlikle bu kütüphaneleri ve mimari prensipleri temel almalıdır.

## 1. Core Tech Stack (Teknoloji Yığını)
Projede kullanılacak temel araçlar aşağıda listelenmiştir. Bunların alternatifleri (Örn: Redux, Axios hook'ları) kesinlikle kullanılamaz.

* **Framework:** Core React Native
* **Dil:** TypeScript (Strict tip güvenliği, `interface` kullanımı ve named export zorunludur).
* **State Management (Client State):** Zustand. Sadece UI stateleri, tema durumu veya lokal auth durumu gibi istemci tarafı (client-side) veriler için kullanılacaktır.
* **Data Fetching & Server State:** TanStack Query (React Query). Sunucudan gelen tüm asenkron veriler, caching, re-fetching ve mutation işlemleri sadece TanStack Query ile yönetilecektir. API verilerini Zustand içine kaydetmek yasaktır.
* **Yönlendirme (Routing):** React Navigation v7. Sadece güncel v7 API'leri ve Stack Navigation mimarisi kullanılacaktır.

## 2. Tasarım Felsefesi: Atomic Design (Strictly Global)
Uygulamanın bileşen (component) mimarisi kesinlikle **Atomic Design** prensiplerine göre inşa edilecektir. Tüm UI parçaları global olarak `/src/components` altında sınıflandırılmalıdır. Ajan, yeni bir UI elementi yazarken bunu uygun klasöre yerleştirmelidir:

* **Atoms (`/src/components/atoms`):** Tek başına anlam ifade eden en küçük yapı taşları. (Örn: `Button`, `Typography`, `Input`, `Icon`).
* **Molecules (`/src/components/molecules`):** Atomların birleşimiyle oluşan basit yapılar. (Örn: `SearchBar` (Input + Icon), `FormInput` (Label + Input + ErrorText)).
* **Organisms (`/src/components/organisms`):** Moleküllerin ve atomların birleşimiyle oluşan, kendi başına çalışabilen kompleks yapılar. (Örn: `GlassCard`, `Header`, `ProductList`).
* **Templates & Screens (`/src/screens`):** Organizmaların bir araya gelerek oluşturduğu sayfa düzenleri.

## 3. UI/UX ve Styling Standartları
Uygulamanın görsel kimliği yüksek standartlardadır. Liquid Glass, Glassmorphism (buzlu cam) dokuları, yarı saydam (translucent) kartlar ve 3D izometrik elementler ana tasarım dilimizi oluşturur.

* **Styling Motoru:** NativeWind (Tailwind CSS) standart olarak kullanılacaktır.
* **Gelişmiş UI ve Animasyonlar:** NativeWind'in yetersiz kaldığı kompleks animasyonlar, gesture (jest) kontrolleri ve 60fps performans gerektiren 3D/Glass efektleri için kesinlikle `react-native-reanimated` ve `react-native-gesture-handler` kullanılacaktır. Geleneksel `Animated` API'sinden kaçınılmalıdır.

## 4. Mimari Kısıtlamalar
1. UI bileşenleri dışarıdan veri çekmemelidir (Dumb components). Veri çekme (TanStack Query) işlemleri Sayfa/Screen seviyesinde veya Container (Wrapper) bileşenlerde yapılmalı ve alt bileşenlere prop olarak aktarılmalıdır.
2. Servis çağrıları ve iş mantığı (business logic), UI katmanından tamamen izole edilmelidir.

---

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
