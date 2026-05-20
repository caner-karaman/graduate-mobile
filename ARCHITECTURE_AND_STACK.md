# ARCHITECTURE AND TECH STACK (ARCHITECTURE_AND_STACK.md)

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