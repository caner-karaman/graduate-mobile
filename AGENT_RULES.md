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
