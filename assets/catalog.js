window.VR_DEFAULT_PRODUCTS = [
  {
    "id": "vr-001",
    "name": "ФУТБОЛКА «НЕ ШУМ»",
    "price": 1890,
    "category": "Футболки",
    "tag": "NEW",
    "stock": 24,
    "visible": true,
    "desc": "Плотная хлопковая футболка свободного силуэта. Чёрный цвет, минималистичный принт."
  },
  {
    "id": "vr-002",
    "name": "ФУТБОЛКА «РОВНО»",
    "price": 1790,
    "category": "Футболки",
    "tag": "",
    "stock": 18,
    "visible": true,
    "desc": "Базовая футболка оверсайз с лаконичной типографикой ВРОДЕ РОВНО."
  },
  {
    "id": "vr-003",
    "name": "ЛОНГСЛИВ «AFTER»",
    "price": 2390,
    "category": "Лонгсливы",
    "tag": "DROP",
    "stock": 11,
    "visible": true,
    "desc": "Свободный лонгслив из плотного хлопка, графика на спине и микро-принт на груди."
  },
  {
    "id": "vr-004",
    "name": "ХУДИ «NO SIGNAL»",
    "price": 4290,
    "category": "Худи",
    "tag": "",
    "stock": 8,
    "visible": true,
    "desc": "Объёмное худи с минималистичным принтом и плотным капюшоном."
  },
  {
    "id": "vr-005",
    "name": "ФУТБОЛКА «67»",
    "price": 1990,
    "category": "Футболки",
    "tag": "NEW",
    "stock": 31,
    "visible": true,
    "desc": "Оверсайз футболка с крупной номерной композицией и distressed-эффектом."
  },
  {
    "id": "vr-006",
    "name": "СВИТШОТ «MONO»",
    "price": 3490,
    "category": "Свитшоты",
    "tag": "",
    "stock": 7,
    "visible": true,
    "desc": "Чистая форма, плотный футер, монохромная вышивка на груди."
  },
  {
    "id": "vr-007",
    "name": "ФУТБОЛКА «LINE 01»",
    "price": 1890,
    "category": "Футболки",
    "tag": "",
    "stock": 16,
    "visible": true,
    "desc": "Минималистичный линейный арт, напечатанный на плотном хлопке."
  },
  {
    "id": "vr-008",
    "name": "ЛОНГСЛИВ «STATIC»",
    "price": 2490,
    "category": "Лонгсливы",
    "tag": "LIMITED",
    "stock": 5,
    "visible": true,
    "desc": "Лонгслив свободного кроя с графикой в эстетике аналогового шума."
  }
];
try {
  const saved = JSON.parse(localStorage.getItem('vr_products_override') || 'null');
  window.VR_PRODUCTS = Array.isArray(saved) ? saved : window.VR_DEFAULT_PRODUCTS;
} catch(e) { window.VR_PRODUCTS = window.VR_DEFAULT_PRODUCTS; }
