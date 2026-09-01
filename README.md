# ВРОДЕ РОВНО — enhanced prototype

## Что добавлено
- интерактивная псевдо‑3D футболка на главной: parallax, drag, flip 180°;
- фирменные логотипы из предоставленных PNG;
- тёмная / светлая тема с сохранением выбора;
- intro-анимация монограммы;
- login.html и admin.html;
- frontend demo-авторизация администратора;
- управление каталогом: цена, остаток, категория, тег, публикация, описание;
- экспорт каталога JSON;
- каталог и витрина читают локальные изменения админ‑панели;
- адаптив для мобильных.



ВАЖНО: это статический frontend-прототип. Данные авторизации и изменения каталога хранятся в браузере и не являются безопасной production-реализацией. Для реального магазина нужны backend, база данных, серверная авторизация, API заказов и платежей.

## Запуск
Откройте `index.html` напрямую или через VS Code + Live Server.


## V3 — experimental hero
- полноэкранная интерактивная сцена в духе award-сайтов;
- процедурный Canvas-фон;
- hold-to-distort механика;
- нарастающий monochrome glitch;
- 3D CSS-футболка реагирует на курсор/drag;
- glitch slices поверх футболки;
- reveal при 100% удержания;
- адаптировано под light/dark и prefers-reduced-motion.


## V4 — layered monochrome + site-wide glitch
- Dark theme: black, graphite, ash and charcoal layers instead of one flat black background.
- Light theme: pure white + cool light-gray surfaces (warm beige tint removed).
- Glitch entrance bursts for content blocks.
- Short glitch response on hover for cards, panels and headings.
- Low-frequency ambient signal glitches on visible blocks.
- Product images receive a monochrome signal-tear effect on hover.
- Extra grayscale interference in the interactive hero.
- `prefers-reduced-motion` disables the added effects.

## V5
- добавлена editorial Instagram-галерея на главной;
- горизонтальный drag/scroll feed;
- асимметричная fashion-композиция;
- glitch hover на фото;
- fullscreen lightbox с клавишами ← → / Esc;
- ссылка на @vrode_rovno;
- изображения оптимизированы в WebP.


V6: Instagram gallery updated with 7 user-provided photos from @vrode_rovno.


## V7
- Instagram gallery refined with editorial labels, real scroll progress and deeper hover/glitch treatment.
- Admin product image manager added.
- Product images are validated at exactly 1200×1600 px (3:4).
- Multiple JPG/PNG/WebP files supported.
- Images are stored in IndexedDB in this demo, not localStorage.
- First image is product cover; admin can make another image the cover or remove images.
- Catalog, cart, admin table and product detail automatically use uploaded media.


V8: autonomous hero animation (first cycle ~2.4s, then organic 7.8–12s intervals), user interaction temporarily overrides auto mode, upgraded oversized T-shirt SVG with fabric texture, folds, seams, rib collar, shadows and branded front/back graphics.


## V9 — faster autonomous hero
- First automatic hero distortion starts ~0.9 sec after load.
- Cooldown between autonomous cycles: ~2.8–4.2 sec after each cycle.
- Cycle duration: ~1.55–2.2 sec.
- After user interaction, auto mode resumes after ~1.8 sec of inactivity.


## V10
- hero animation is fully autonomous and smoother; hold-to-distort interaction removed;
- softer glitch envelope with short cooldown;
- hero garment front/back can be changed in Admin via transparent PNG/WEBP stored in IndexedDB.


V11: restored pronounced monochrome glitch while keeping fully automatic smooth hero animation.


V12: fixed horizontal Live Photos scrolling; added arrows + wheel/trackpad/drag support; added real-photo campaign banners; footer simplified to a single BP monogram; VK link set to https://vk.ru/vrovno. VK media itself was not fetched because the public VK page was inaccessible from the build environment.


V13: seamless marquee loop; increased spacing before the “Весь каталог” CTA; disabled decorative glitch/reveal effects inside admin for easier work.


V14: marquee rebuilt as a long duplicated infinite rail; home catalog CTA moved into a true flex stack with explicit gap and card label reserve to prevent overlap.


V15: main-banner T-shirt redesigned with a cleaner oversize silhouette, refined front/back graphics, softer folds, and lighter depth styling.


V16: hero T-shirt replaced with a configurable animated banner object (default: ВР monogram). Admin panel now manages a single banner object and its animation settings instead of front/back T-shirt sides.

V17: hero object updated to use the provided original ВР monogram assets (dark and light variants), with automatic theme-aware switching.

V18: hero monogram replaced with a volumetric matte dark-metal render based on the supplied ВР mark.

V19: admin panel expanded into a mini visual CMS with separate sections for homepage banners and the “Живые фото” carousel. Each banner/carousel image can now be replaced individually from the admin panel.

V20: admin panel reorganized into separate tabs (Hero, Banners, Live Photos, Catalog, Settings) for better usability. Added favicon management in admin with upload/reset and automatic site-wide application on all pages.

V22: restored previous minimal cursor style and improved touch/mobile detection. Custom cursor disabled on touch devices for stable mobile UX.

V23: restored V20-style cursor feel and added full mobile responsive optimization for hero, catalog, navigation, galleries and performance.
