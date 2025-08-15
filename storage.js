export const KEYS = { profile:'dt_profile_v3', ex:'dt_exercises_v5', wo:'dt_workouts_v3' };
export const LS = { get:(k,fb)=>{try{return JSON.parse(localStorage.getItem(k))??fb}catch{return fb}}, set:(k,v)=>localStorage.setItem(k, JSON.stringify(v)) };
export const MUSCLE_GROUPS = {
  "Грудь": [
    "Верх",
    "Верх груди",
    "Грудные",
    "Низ",
    "Передняя дельта",
    "Середина",
    "Трицепс",
    "Широчайшие"
  ],
  "Плечи": [
    "Бицепс",
    "Верх",
    "Верх груди",
    "Дельты",
    "Задняя дельта",
    "Низ",
    "Передняя дельта",
    "Середина",
    "Средняя дельта",
    "Трапеции",
    "Трицепс"
  ],
  "Руки": [
    "Бедра",
    "Бицепс",
    "Брахиалис",
    "Верх",
    "Верх груди",
    "Грудные",
    "Дельты",
    "Низ",
    "Передняя дельта",
    "Предплечья",
    "Разгибатели спины",
    "Середина",
    "Средняя дельта",
    "Трапеции",
    "Трицепс",
    "Широчайшие"
  ],
  "Спина": [
    "Бедра",
    "Бицепс",
    "Грудные",
    "Дельты",
    "Задняя дельта",
    "Предплечья",
    "Разгибатели спины",
    "Трапеции",
    "Широчайшие",
    "Ягодицы"
  ],
  "Ноги": [
    "Бедра",
    "Икры",
    "Квадрицепсы",
    "Передняя дельта",
    "Предплечья",
    "Разгибатели спины",
    "Средняя дельта",
    "Трицепс",
    "Ягодицы"
  ],
  "Пресс": [
    "Верхняя и нижняя часть пресса",
    "Верхняя часть пресса",
    "Косые мышцы",
    "Косые мышцы живота",
    "Нижняя часть пресса",
    "Поперечная мышца живота",
    "Прямые мышцы"
  ],
  "Корпус": [
    "Верхняя и нижняя часть пресса",
    "Верхняя часть пресса",
    "Косые мышцы",
    "Косые мышцы живота",
    "Поперечная мышца живота",
    "Прямые мышцы",
    "Разгибатели спины",
    "Стабилизаторы",
    "Ягодицы"
  ],
  "Всё тело": [
    "Бицепс бедра",
    "Грудь",
    "Кардио",
    "Координация",
    "Корпус",
    "Ноги",
    "Плечи",
    "Пресс",
    "Руки",
    "Спина",
    "Трицепс",
    "Ягодицы"
  ]
};
export const DB = {
  get profile(){ return LS.get(KEYS.profile,{name:'',age:'',gender:'',height:'',weight:'',avatar:'',level:'',goal:'',notes:''}) },
  set profile(v){ LS.set(KEYS.profile,v) },
  get exercises(){ return LS.get(KEYS.ex, defaultExercises()) },
  set exercises(v){ LS.set(KEYS.ex,v) },
  get workouts(){ return LS.get(KEYS.wo,[]) },
  set workouts(v){ LS.set(KEYS.wo,v) }
};
export const toast = (m)=>{ const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1600); };
export const uid = ()=>Math.random().toString(36).slice(2,9);
export const today = ()=>new Date().toISOString().slice(0,10);
export const totalVolume = (w)=>w.items.reduce((acc,i)=>acc+i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0),0);

// Curated default exercises (120+ unique)
export function defaultExercises() {
  return [
  {
    "id": "ex0001",
    "name": "Жим штанги лёжа",
    "name_en": "Barbell Bench Press",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Barbell%20Bench%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0002",
    "name": "Жим гантелей лёжа",
    "name_en": "Dumbbell Bench Press",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Bench%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0003",
    "name": "Жим штанги на наклонной скамье",
    "name_en": "Incline Barbell Press",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Базовое",
    "equipment": "Штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Barbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0004",
    "name": "Жим гантелей на наклонной",
    "name_en": "Incline Dumbbell Press",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Базовое",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Dumbbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0005",
    "name": "Жим штанги на отрицательной скамье",
    "name_en": "Decline Barbell Bench Press",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Базовое",
    "equipment": "Штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Barbell%20Bench%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0006",
    "name": "Жим гантелей на отрицательной скамье",
    "name_en": "Decline Dumbbell Press",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Базовое",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Dumbbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0007",
    "name": "Разведение гантелей лёжа",
    "name_en": "Dumbbell Fly",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Изолирующее",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0008",
    "name": "Разведение гантелей на наклонной",
    "name_en": "Incline Dumbbell Fly",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Изолирующее",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Dumbbell%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0009",
    "name": "Разведение гантелей на отрицательной",
    "name_en": "Decline Dumbbell Fly",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Изолирующее",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Dumbbell%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0010",
    "name": "Сведение на кроссовере",
    "name_en": "Cable Fly",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Cable%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0011",
    "name": "Сведение на кроссовере вверх",
    "name_en": "High Cable Fly",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/High%20Cable%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0012",
    "name": "Сведение на кроссовере вниз",
    "name_en": "Low Cable Fly",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Low%20Cable%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0013",
    "name": "Отжимания от пола",
    "name_en": "Push-Ups",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0014",
    "name": "Отжимания узким хватом",
    "name_en": "Close-Grip Push-Ups",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Close-Grip%20Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0015",
    "name": "Отжимания с широким хватом",
    "name_en": "Wide-Grip Push-Ups",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Wide-Grip%20Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0016",
    "name": "Отжимания на брусьях",
    "name_en": "Dips",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Базовое",
    "equipment": "Брусья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dips.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0017",
    "name": "Отжимания на кольцах",
    "name_en": "Ring Dips",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Базовое",
    "equipment": "Гимнастические кольца",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Ring%20Dips.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0018",
    "name": "Отжимания с хлопком",
    "name_en": "Clap Push-Ups",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Взрывное",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Clap%20Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0019",
    "name": "Жим в тренажёре",
    "name_en": "Chest Press Machine",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Chest%20Press%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0020",
    "name": "Жим в тренажёре под углом",
    "name_en": "Incline Chest Press Machine",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Chest%20Press%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0021",
    "name": "nan",
    "name_en": "nan",
    "group": "",
    "target_zone": "",
    "type": "",
    "equipment": "",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0022",
    "name": "Название (RU)",
    "name_en": "Название (EN)",
    "group": "Основная группа",
    "target_zone": "",
    "type": "Тип",
    "equipment": "Оборудование",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0023",
    "name": "Подтягивания широким хватом",
    "name_en": "Wide-Grip Pull-Ups",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Турник",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Wide-Grip%20Pull-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0024",
    "name": "Подтягивания обратным хватом",
    "name_en": "Chin-Ups",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Турник",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Chin-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0025",
    "name": "Подтягивания нейтральным хватом",
    "name_en": "Neutral-Grip Pull-Ups",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Турник",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Neutral-Grip%20Pull-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0026",
    "name": "Подтягивания с дополнительным весом",
    "name_en": "Weighted Pull-Ups",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Турник / Пояс с отягощением",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Weighted%20Pull-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0027",
    "name": "Тяга верхнего блока",
    "name_en": "Lat Pulldown",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lat%20Pulldown.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0028",
    "name": "Тяга верхнего блока обратным хватом",
    "name_en": "Reverse-Grip Lat Pulldown",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse-Grip%20Lat%20Pulldown.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0029",
    "name": "Тяга верхнего блока узким хватом",
    "name_en": "Close-Grip Lat Pulldown",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Close-Grip%20Lat%20Pulldown.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0030",
    "name": "Тяга штанги в наклоне",
    "name_en": "Bent-Over Barbell Row",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Bent-Over%20Barbell%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0031",
    "name": "Тяга гантели в наклоне",
    "name_en": "One-Arm Dumbbell Row",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Гантель / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/One-Arm%20Dumbbell%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0032",
    "name": "Тяга Т-грифа",
    "name_en": "T-Bar Row",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Т-гриф",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/T-Bar%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0033",
    "name": "Тяга горизонтального блока",
    "name_en": "Seated Cable Row",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Seated%20Cable%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0034",
    "name": "Тяга к поясу в наклоне с гирей",
    "name_en": "Kettlebell Row",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0035",
    "name": "Тяга штанги к подбородку",
    "name_en": "Upright Barbell Row",
    "group": "Плечи",
    "target_zone": "Трапеции",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Upright%20Barbell%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0036",
    "name": "Тяга гантелей к подбородку",
    "name_en": "Upright Dumbbell Row",
    "group": "Плечи",
    "target_zone": "Трапеции",
    "type": "Базовое",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Upright%20Dumbbell%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0037",
    "name": "Пулловер с гантелей",
    "name_en": "Dumbbell Pullover",
    "group": "Грудь",
    "target_zone": "Широчайшие",
    "type": "Изолирующее",
    "equipment": "Гантель / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Pullover.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0038",
    "name": "Пулловер в тренажёре",
    "name_en": "Pullover Machine",
    "group": "Грудь",
    "target_zone": "Широчайшие",
    "type": "Изолирующее",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Pullover%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0039",
    "name": "Тяга нижнего блока к лицу",
    "name_en": "Face Pull",
    "group": "Спина",
    "target_zone": "Задняя дельта",
    "type": "Изолирующее",
    "equipment": "Тросовый тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Face%20Pull.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0040",
    "name": "Тяга каната к груди",
    "name_en": "Close-Grip Cable Row",
    "group": "Спина",
    "target_zone": "Широчайшие",
    "type": "Базовое",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Close-Grip%20Cable%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0041",
    "name": "Становая тяга",
    "name_en": "Deadlift",
    "group": "Спина",
    "target_zone": "Разгибатели спины",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Deadlift.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0042",
    "name": "Становая тяга с гантелями",
    "name_en": "Dumbbell Deadlift",
    "group": "Спина",
    "target_zone": "Разгибатели спины",
    "type": "Базовое",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Deadlift.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0043",
    "name": "Становая тяга сумо",
    "name_en": "Sumo Deadlift",
    "group": "Спина",
    "target_zone": "Разгибатели спины",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Sumo%20Deadlift.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0044",
    "name": "Становая тяга на прямых ногах",
    "name_en": "Stiff-Leg Deadlift",
    "group": "Спина",
    "target_zone": "Разгибатели спины",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Stiff-Leg%20Deadlift.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0045",
    "name": "Становая тяга с гирями",
    "name_en": "Kettlebell Deadlift",
    "group": "Спина",
    "target_zone": "Разгибатели спины",
    "type": "Базовое",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Deadlift.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0046",
    "name": "Гиперэкстензия",
    "name_en": "Back Extension",
    "group": "Спина",
    "target_zone": "Разгибатели спины",
    "type": "Изолирующее",
    "equipment": "Гиперэкстензия",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Back%20Extension.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0047",
    "name": "Гиперэкстензия с весом",
    "name_en": "Weighted Back Extension",
    "group": "Спина",
    "target_zone": "Разгибатели спины",
    "type": "Изолирующее",
    "equipment": "Гиперэкстензия / Блин",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Weighted%20Back%20Extension.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0048",
    "name": "nan",
    "name_en": "nan",
    "group": "",
    "target_zone": "",
    "type": "",
    "equipment": "",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0049",
    "name": "Название (RU)",
    "name_en": "Название (EN)",
    "group": "Основная группа",
    "target_zone": "",
    "type": "Тип",
    "equipment": "Оборудование",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0050",
    "name": "Жим штанги стоя",
    "name_en": "Overhead Barbell Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Overhead%20Barbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0051",
    "name": "Жим гантелей сидя",
    "name_en": "Seated Dumbbell Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Seated%20Dumbbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0052",
    "name": "Жим гантелей стоя",
    "name_en": "Standing Dumbbell Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Standing%20Dumbbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0053",
    "name": "Жим Арнольда",
    "name_en": "Arnold Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Arnold%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0054",
    "name": "Жим штанги из-за головы",
    "name_en": "Behind-the-Neck Press",
    "group": "Плечи",
    "target_zone": "Средняя дельта",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Behind-the-Neck%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0055",
    "name": "Жим в тренажёре для плеч",
    "name_en": "Shoulder Press Machine",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Shoulder%20Press%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0056",
    "name": "Подъём гантелей через стороны",
    "name_en": "Lateral Raise",
    "group": "Плечи",
    "target_zone": "Средняя дельта",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lateral%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0057",
    "name": "Подъём гантелей перед собой",
    "name_en": "Front Raise",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Front%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0058",
    "name": "Подъём гантелей в наклоне",
    "name_en": "Bent-Over Lateral Raise",
    "group": "Плечи",
    "target_zone": "Задняя дельта",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Bent-Over%20Lateral%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0059",
    "name": "Подъём гантелей в стороны в тренажёре",
    "name_en": "Lateral Raise Machine",
    "group": "Плечи",
    "target_zone": "Средняя дельта",
    "type": "Изолирующее",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lateral%20Raise%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0060",
    "name": "Подъём гантелей перед собой в тренажёре",
    "name_en": "Front Raise Machine",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Изолирующее",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Front%20Raise%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0061",
    "name": "Подъём гантелей в наклоне в тренажёре",
    "name_en": "Reverse Pec Deck",
    "group": "Плечи",
    "target_zone": "Задняя дельта",
    "type": "Изолирующее",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse%20Pec%20Deck.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0062",
    "name": "Жим штанги на наклонной скамье под углом 80°",
    "name_en": "High Incline Barbell Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/High%20Incline%20Barbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0063",
    "name": "Жим гантелей на наклонной скамье под углом 80°",
    "name_en": "High Incline Dumbbell Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/High%20Incline%20Dumbbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0064",
    "name": "Тяга штанги к подбородку",
    "name_en": "Upright Barbell Row",
    "group": "Плечи",
    "target_zone": "Трапеции",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Upright%20Barbell%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0065",
    "name": "Тяга гантелей к подбородку",
    "name_en": "Upright Dumbbell Row",
    "group": "Плечи",
    "target_zone": "Трапеции",
    "type": "Базовое",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Upright%20Dumbbell%20Row.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0066",
    "name": "Подъём гирь через стороны",
    "name_en": "Kettlebell Lateral Raise",
    "group": "Плечи",
    "target_zone": "Средняя дельта",
    "type": "Изолирующее",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Lateral%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0067",
    "name": "Подъём гирь перед собой",
    "name_en": "Kettlebell Front Raise",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Изолирующее",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Front%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0068",
    "name": "Жим гирь стоя",
    "name_en": "Kettlebell Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0069",
    "name": "Жим гирь сидя",
    "name_en": "Seated Kettlebell Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Гиря / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Seated%20Kettlebell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0070",
    "name": "Подъём штанги на грудь и толчок",
    "name_en": "Push Press",
    "group": "Плечи",
    "target_zone": "Передняя дельта",
    "type": "Базовое",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Push%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0071",
    "name": "nan",
    "name_en": "nan",
    "group": "",
    "target_zone": "",
    "type": "",
    "equipment": "",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0072",
    "name": "Название (RU)",
    "name_en": "Название (EN)",
    "group": "Основная группа",
    "target_zone": "",
    "type": "Тип",
    "equipment": "Оборудование",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0073",
    "name": "Подъём штанги на бицепс",
    "name_en": "Barbell Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Barbell%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0074",
    "name": "Подъём гантелей на бицепс",
    "name_en": "Dumbbell Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0075",
    "name": "Подъём гантелей на бицепс поочерёдно",
    "name_en": "Alternating Dumbbell Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Alternating%20Dumbbell%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0076",
    "name": "Подъём гантелей молотковым хватом",
    "name_en": "Hammer Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Hammer%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0077",
    "name": "Подъём штанги на скамье Скотта",
    "name_en": "Preacher Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Штанга / Скамья Скотта",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Preacher%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0078",
    "name": "Подъём гантелей на скамье Скотта",
    "name_en": "Preacher Dumbbell Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Гантели / Скамья Скотта",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Preacher%20Dumbbell%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0079",
    "name": "Концентрированный подъём на бицепс",
    "name_en": "Concentration Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Гантель",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Concentration%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0080",
    "name": "Подъём EZ-штанги на бицепс",
    "name_en": "EZ Bar Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "EZ-штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/EZ%20Bar%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0081",
    "name": "Подъём на бицепс в тренажёре",
    "name_en": "Biceps Curl Machine",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Biceps%20Curl%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0082",
    "name": "Подъём на бицепс на блоке",
    "name_en": "Cable Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Cable%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0083",
    "name": "Подъём каната на бицепс",
    "name_en": "Rope Cable Curl",
    "group": "Руки",
    "target_zone": "Бицепс",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Rope%20Cable%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0084",
    "name": "Разгибания штанги лёжа",
    "name_en": "Lying Barbell Triceps Extension",
    "group": "Руки",
    "target_zone": "Трицепс",
    "type": "Изолирующее",
    "equipment": "Штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lying%20Barbell%20Triceps%20Extension.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0085",
    "name": "Разгибания EZ-штанги лёжа",
    "name_en": "Lying EZ Bar Triceps Extension",
    "group": "Руки",
    "target_zone": "Трицепс",
    "type": "Изолирующее",
    "equipment": "EZ-штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lying%20EZ%20Bar%20Triceps%20Extension.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0086",
    "name": "Разгибания гантелей лёжа",
    "name_en": "Lying Dumbbell Triceps Extension",
    "group": "Руки",
    "target_zone": "Трицепс",
    "type": "Изолирующее",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lying%20Dumbbell%20Triceps%20Extension.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0087",
    "name": "Разгибания рук с гантелей из-за головы",
    "name_en": "Overhead Dumbbell Extension",
    "group": "Руки",
    "target_zone": "Трицепс",
    "type": "Изолирующее",
    "equipment": "Гантель",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Overhead%20Dumbbell%20Extension.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0088",
    "name": "Разгибания рук с штангой из-за головы",
    "name_en": "Overhead Barbell Extension",
    "group": "Руки",
    "target_zone": "Трицепс",
    "type": "Изолирующее",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Overhead%20Barbell%20Extension.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0089",
    "name": "Разгибания рук на блоке",
    "name_en": "Triceps Pushdown",
    "group": "Руки",
    "target_zone": "Трицепс",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Triceps%20Pushdown.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0090",
    "name": "Разгибания рук с канатом на блоке",
    "name_en": "Rope Triceps Pushdown",
    "group": "Руки",
    "target_zone": "Трицепс",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Rope%20Triceps%20Pushdown.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0091",
    "name": "Разгибания рук на верхнем блоке одной рукой",
    "name_en": "One-Arm Cable Triceps Extension",
    "group": "Руки",
    "target_zone": "Трицепс",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/One-Arm%20Cable%20Triceps%20Extension.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0092",
    "name": "Алмазные отжимания",
    "name_en": "Diamond Push-Ups",
    "group": "Грудь",
    "target_zone": "Трицепс",
    "type": "Базовое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Diamond%20Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0093",
    "name": "Отжимания на брусьях",
    "name_en": "Dips",
    "group": "Грудь",
    "target_zone": "Трицепс",
    "type": "Базовое",
    "equipment": "Брусья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dips.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0094",
    "name": "Отжимания на брусьях с весом",
    "name_en": "Weighted Dips",
    "group": "Грудь",
    "target_zone": "Трицепс",
    "type": "Базовое",
    "equipment": "Брусья / Пояс с отягощением",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Weighted%20Dips.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0095",
    "name": "Сгибания запястий с штангой",
    "name_en": "Wrist Curl",
    "group": "Руки",
    "target_zone": "Предплечья",
    "type": "Изолирующее",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Wrist%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0096",
    "name": "Сгибания запястий с гантелями",
    "name_en": "Dumbbell Wrist Curl",
    "group": "Руки",
    "target_zone": "Предплечья",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Wrist%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0097",
    "name": "Разгибания запястий с штангой",
    "name_en": "Reverse Wrist Curl",
    "group": "Руки",
    "target_zone": "Предплечья",
    "type": "Изолирующее",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse%20Wrist%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0098",
    "name": "Разгибания запястий с гантелями",
    "name_en": "Reverse Dumbbell Wrist Curl",
    "group": "Руки",
    "target_zone": "Предплечья",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse%20Dumbbell%20Wrist%20Curl.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0099",
    "name": "Пронация/супинация предплечья",
    "name_en": "Pronation/Supination",
    "group": "Руки",
    "target_zone": "Предплечья",
    "type": "Изолирующее",
    "equipment": "Гантели",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Pronation%2FSupination.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0100",
    "name": "nan",
    "name_en": "nan",
    "group": "",
    "target_zone": "",
    "type": "",
    "equipment": "",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0101",
    "name": "Название (RU)",
    "name_en": "Название (EN)",
    "group": "Основная группа",
    "target_zone": "",
    "type": "Тип",
    "equipment": "Оборудование",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0102",
    "name": "Жим штанги лёжа",
    "name_en": "Barbell Bench Press",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Barbell%20Bench%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0103",
    "name": "Жим гантелей лёжа",
    "name_en": "Dumbbell Bench Press",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Bench%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0104",
    "name": "Жим штанги на наклонной скамье",
    "name_en": "Incline Barbell Press",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Базовое",
    "equipment": "Штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Barbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0105",
    "name": "Жим гантелей на наклонной",
    "name_en": "Incline Dumbbell Press",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Базовое",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Dumbbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0106",
    "name": "Жим штанги на отрицательной скамье",
    "name_en": "Decline Barbell Bench Press",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Базовое",
    "equipment": "Штанга / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Barbell%20Bench%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0107",
    "name": "Жим гантелей на отрицательной скамье",
    "name_en": "Decline Dumbbell Press",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Базовое",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Dumbbell%20Press.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0108",
    "name": "Разведение гантелей лёжа",
    "name_en": "Dumbbell Fly",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Изолирующее",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0109",
    "name": "Разведение гантелей на наклонной",
    "name_en": "Incline Dumbbell Fly",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Изолирующее",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Dumbbell%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0110",
    "name": "Разведение гантелей на отрицательной",
    "name_en": "Decline Dumbbell Fly",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Изолирующее",
    "equipment": "Гантели / Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Dumbbell%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0111",
    "name": "Сведение на кроссовере",
    "name_en": "Cable Fly",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Cable%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0112",
    "name": "Сведение на кроссовере вверх",
    "name_en": "High Cable Fly",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/High%20Cable%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0113",
    "name": "Сведение на кроссовере вниз",
    "name_en": "Low Cable Fly",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Изолирующее",
    "equipment": "Кроссовер",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Low%20Cable%20Fly.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0114",
    "name": "Отжимания от пола",
    "name_en": "Push-Ups",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0115",
    "name": "Отжимания узким хватом",
    "name_en": "Close-Grip Push-Ups",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Close-Grip%20Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0116",
    "name": "Отжимания с широким хватом",
    "name_en": "Wide-Grip Push-Ups",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Wide-Grip%20Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0117",
    "name": "Отжимания на брусьях",
    "name_en": "Dips",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Базовое",
    "equipment": "Брусья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dips.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0118",
    "name": "Отжимания на кольцах",
    "name_en": "Ring Dips",
    "group": "Грудь",
    "target_zone": "Низ",
    "type": "Базовое",
    "equipment": "Гимнастические кольца",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Ring%20Dips.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0119",
    "name": "Отжимания с хлопком",
    "name_en": "Clap Push-Ups",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Взрывное",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Clap%20Push-Ups.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0120",
    "name": "Жим в тренажёре",
    "name_en": "Chest Press Machine",
    "group": "Грудь",
    "target_zone": "Середина",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Chest%20Press%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0121",
    "name": "Жим в тренажёре под углом",
    "name_en": "Incline Chest Press Machine",
    "group": "Грудь",
    "target_zone": "Верх",
    "type": "Базовое",
    "equipment": "Тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Chest%20Press%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0122",
    "name": "nan",
    "name_en": "nan",
    "group": "",
    "target_zone": "",
    "type": "",
    "equipment": "",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0123",
    "name": "Название (RU)",
    "name_en": "Название (EN)",
    "group": "Основная группа",
    "target_zone": "",
    "type": "Тип",
    "equipment": "Оборудование",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0124",
    "name": "Скручивания на полу",
    "name_en": "Crunch",
    "group": "Пресс",
    "target_zone": "Верхняя часть пресса",
    "type": "Изолирующее",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Crunch.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0125",
    "name": "Обратные скручивания",
    "name_en": "Reverse Crunch",
    "group": "Пресс",
    "target_zone": "Нижняя часть пресса",
    "type": "Изолирующее",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse%20Crunch.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0126",
    "name": "Подъём ног лёжа",
    "name_en": "Leg Raise",
    "group": "Пресс",
    "target_zone": "Нижняя часть пресса",
    "type": "Изолирующее",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Leg%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0127",
    "name": "Подъём ног в висе",
    "name_en": "Hanging Leg Raise",
    "group": "Пресс",
    "target_zone": "Нижняя часть пресса",
    "type": "Изолирующее",
    "equipment": "Турник",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Hanging%20Leg%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0128",
    "name": "Подъём коленей в висе",
    "name_en": "Hanging Knee Raise",
    "group": "Пресс",
    "target_zone": "Нижняя часть пресса",
    "type": "Изолирующее",
    "equipment": "Турник",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Hanging%20Knee%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0129",
    "name": "Скручивания на скамье с наклоном",
    "name_en": "Decline Bench Crunch",
    "group": "Пресс",
    "target_zone": "Верхняя часть пресса",
    "type": "Изолирующее",
    "equipment": "Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Bench%20Crunch.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0130",
    "name": "Русский твист",
    "name_en": "Russian Twist",
    "group": "Корпус",
    "target_zone": "Косые мышцы живота",
    "type": "Изолирующее",
    "equipment": "Медицинский мяч / Гантеля / Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Russian%20Twist.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0131",
    "name": "Планка",
    "name_en": "Plank",
    "group": "Корпус",
    "target_zone": "Поперечная мышца живота",
    "type": "Изометрическое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Plank.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0132",
    "name": "Боковая планка",
    "name_en": "Side Plank",
    "group": "Корпус",
    "target_zone": "Косые мышцы живота",
    "type": "Изометрическое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Side%20Plank.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0133",
    "name": "Планка с подъёмом ноги",
    "name_en": "Plank with Leg Raise",
    "group": "Корпус",
    "target_zone": "Поперечная мышца живота",
    "type": "Изометрическое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Plank%20with%20Leg%20Raise.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0134",
    "name": "Велосипед",
    "name_en": "Bicycle Crunch",
    "group": "Пресс",
    "target_zone": "Верхняя часть пресса",
    "type": "Изолирующее",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Bicycle%20Crunch.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0135",
    "name": "Косые скручивания",
    "name_en": "Oblique Crunch",
    "group": "Пресс",
    "target_zone": "Косые мышцы живота",
    "type": "Изолирующее",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Oblique%20Crunch.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0136",
    "name": "Дракон флаг",
    "name_en": "Dragon Flag",
    "group": "Пресс",
    "target_zone": "Верхняя и нижняя часть пресса",
    "type": "Базовое",
    "equipment": "Скамья",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dragon%20Flag.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0137",
    "name": "Колесо для пресса",
    "name_en": "Ab Wheel Rollout",
    "group": "Пресс",
    "target_zone": "Прямые мышцы",
    "type": "Базовое",
    "equipment": "Колесо для пресса",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Ab%20Wheel%20Rollout.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0138",
    "name": "Подъём туловища на римском стуле",
    "name_en": "Back Extension Roman Chair",
    "group": "Спина",
    "target_zone": "Разгибатели спины",
    "type": "Базовое",
    "equipment": "Римский стул",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Back%20Extension%20Roman%20Chair.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0139",
    "name": "V-скручивания",
    "name_en": "V-Up",
    "group": "Пресс",
    "target_zone": "Верхняя и нижняя часть пресса",
    "type": "Базовое",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/V-Up.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0140",
    "name": "Касания пяток",
    "name_en": "Heel Touch",
    "group": "Пресс",
    "target_zone": "Косые мышцы живота",
    "type": "Изолирующее",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Heel%20Touch.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0141",
    "name": "Повороты корпуса с грифом",
    "name_en": "Bar Twist",
    "group": "Корпус",
    "target_zone": "Косые мышцы живота",
    "type": "Изолирующее",
    "equipment": "Гриф",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Bar%20Twist.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0142",
    "name": "nan",
    "name_en": "nan",
    "group": "",
    "target_zone": "",
    "type": "",
    "equipment": "",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0143",
    "name": "Название (RU)",
    "name_en": "Название (EN)",
    "group": "Основная группа",
    "target_zone": "",
    "type": "Тип",
    "equipment": "Оборудование",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0144",
    "name": "Берпи",
    "name_en": "Burpee",
    "group": "Всё тело",
    "target_zone": "Ноги",
    "type": "Функциональное",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Burpee.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0145",
    "name": "Берпи с прыжком на тумбу",
    "name_en": "Burpee Box Jump",
    "group": "Всё тело",
    "target_zone": "Ноги",
    "type": "Функциональное",
    "equipment": "Плиометрическая тумба",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Burpee%20Box%20Jump.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0146",
    "name": "Прыжки на тумбу",
    "name_en": "Box Jump",
    "group": "Ноги",
    "target_zone": "Квадрицепсы",
    "type": "Функциональное",
    "equipment": "Плиометрическая тумба",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Box%20Jump.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0147",
    "name": "Прыжки через скакалку",
    "name_en": "Jump Rope",
    "group": "Всё тело",
    "target_zone": "Кардио",
    "type": "Кардио",
    "equipment": "Скакалка",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Jump%20Rope.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0148",
    "name": "Альпинист",
    "name_en": "Mountain Climber",
    "group": "Всё тело",
    "target_zone": "Пресс",
    "type": "Функциональное",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Mountain%20Climber.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0149",
    "name": "Тяга гири к подбородку",
    "name_en": "Kettlebell High Pull",
    "group": "Всё тело",
    "target_zone": "Плечи",
    "type": "Функциональное",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20High%20Pull.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0150",
    "name": "Свинг гирей",
    "name_en": "Kettlebell Swing",
    "group": "Всё тело",
    "target_zone": "Ягодицы",
    "type": "Функциональное",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Swing.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0151",
    "name": "Турецкий подъём",
    "name_en": "TGU (Turkish Get-Up)",
    "group": "Всё тело",
    "target_zone": "Плечи",
    "type": "Функциональное",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/TGU%20%28Turkish%20Get-Up%29.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0152",
    "name": "Толчок штанги",
    "name_en": "Push Jerk",
    "group": "Всё тело",
    "target_zone": "Плечи",
    "type": "Функциональное",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Push%20Jerk.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0153",
    "name": "Рывок штанги",
    "name_en": "Snatch",
    "group": "Всё тело",
    "target_zone": "Плечи",
    "type": "Функциональное",
    "equipment": "Штанга",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Snatch.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0154",
    "name": "Рывок гири",
    "name_en": "Kettlebell Snatch",
    "group": "Всё тело",
    "target_zone": "Плечи",
    "type": "Функциональное",
    "equipment": "Гиря",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Snatch.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0155",
    "name": "Гребля на тренажёре",
    "name_en": "Rowing Machine",
    "group": "Всё тело",
    "target_zone": "Спина",
    "type": "Кардио",
    "equipment": "Гребной тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Rowing%20Machine.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0156",
    "name": "Атакующая велотренировка",
    "name_en": "Assault Bike",
    "group": "Всё тело",
    "target_zone": "Кардио",
    "type": "Кардио",
    "equipment": "Велотренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Assault%20Bike.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0157",
    "name": "Спринт",
    "name_en": "Sprint",
    "group": "Всё тело",
    "target_zone": "Кардио",
    "type": "Кардио",
    "equipment": "Беговая дорожка / Стадион",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Sprint.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0158",
    "name": "Бег на месте",
    "name_en": "Running in Place",
    "group": "Всё тело",
    "target_zone": "Кардио",
    "type": "Кардио",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Running%20in%20Place.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0159",
    "name": "Подтягивания с хлопком",
    "name_en": "Clap Pull-Up",
    "group": "Всё тело",
    "target_zone": "Спина",
    "type": "Функциональное",
    "equipment": "Турник",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Clap%20Pull-Up.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0160",
    "name": "Отжимания с хлопком",
    "name_en": "Clap Push-Up",
    "group": "Всё тело",
    "target_zone": "Грудь",
    "type": "Функциональное",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Clap%20Push-Up.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0161",
    "name": "Чередующиеся выпрыгивания",
    "name_en": "Alternating Jump Lunge",
    "group": "Ноги",
    "target_zone": "Квадрицепсы",
    "type": "Функциональное",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Alternating%20Jump%20Lunge.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0162",
    "name": "Скейт-джамп",
    "name_en": "Skater Jump",
    "group": "Ноги",
    "target_zone": "Ягодицы",
    "type": "Функциональное",
    "equipment": "Собственный вес",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Skater%20Jump.gif?raw=true",
    "description": ""
  },
  {
    "id": "ex0163",
    "name": "Гребной бурпи",
    "name_en": "Rowing Burpee",
    "group": "Всё тело",
    "target_zone": "Спина",
    "type": "Функциональное",
    "equipment": "Собственный вес / Гребной тренажёр",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Rowing%20Burpee.gif?raw=true",
    "description": ""
  }
];
}
,
  {
    "name": "Жим гантелей на наклонной", 
    "group": "Грудь",
    "subgroup": "Верх",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/bench_press.gif?raw=true",
    "description": "Жим гантелей на наклонной. Рабочая группа: Грудь — Верх. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Отжимания на брусьях вперёд",
    "group": "Грудь",
    "subgroup": "Верх",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Отжимания на брусьях вперёд. Рабочая группа: Грудь — Верх. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Сведение на кроссовере вверх",
    "group": "Грудь",
    "subgroup": "Верх",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Сведение на кроссовере вверх. Рабочая группа: Грудь — Верх. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим штанги лёжа",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/bench_press.gif?raw=true",
    "description": "Жим штанги лёжа. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим гантелей лёжа",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Жим гантелей лёжа. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Разведение гантелей лёжа",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Разведение гантелей лёжа. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Сведение рук в кроссовере",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Сведение рук в кроссовере. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Отжимания широким хватом",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Отжимания широким хватом. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим штанги на отрицательной скамье",
    "group": "Грудь",
    "subgroup": "Низ",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Жим штанги на отрицательной скамье. Рабочая группа: Грудь — Низ. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим гантелей на отрицательной",
    "group": "Грудь",
    "subgroup": "Низ",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Жим гантелей на отрицательной. Рабочая группа: Грудь — Низ. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Отжимания с отягощением",
    "group": "Грудь",
    "subgroup": "Низ",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Отжимания с отягощением. Рабочая группа: Грудь — Низ. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Кроссовер вниз",
    "group": "Грудь",
    "subgroup": "Низ",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Кроссовер вниз. Рабочая группа: Грудь — Низ. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подтягивания широким хватом",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Подтягивания широким хватом. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга верхнего блока к груди",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif",
    "description": "Тяга верхнего блока к груди. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга горизонтального блока",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Тяга горизонтального блока. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга штанги в наклоне",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Тяга штанги в наклоне. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга гантели к поясу",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Тяга гантели к поясу. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга Т-грифа",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Тяга Т-грифа. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Пуловер на блоке",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Пуловер на блоке. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Шраги со штангой",
    "group": "Спина",
    "subgroup": "Трапеции",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Шраги со штангой. Рабочая группа: Спина — Трапеции. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Шраги с гантелями",
    "group": "Спина",
    "subgroup": "Трапеции",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Шраги с гантелями. Рабочая группа: Спина — Трапеции. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга к подбородку узким хватом",
    "group": "Спина",
    "subgroup": "Трапеции",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Тяга к подбородку узким хватом. Рабочая группа: Спина — Трапеции. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Становая тяга классическая",
    "group": "Спина",
    "subgroup": "Разгибатели",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Становая тяга классическая. Рабочая группа: Спина — Разгибатели. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Становая на прямых ногах",
    "group": "Спина",
    "subgroup": "Разгибатели",
    "gif": "https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif",
    "description": "Становая на прямых ногах. Рабочая группа: Спина — Разгибатели. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Гиперэкстензия",
    "group": "Спина",
    "subgroup": "Разгибатели",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Гиперэкстензия. Рабочая группа: Спина — Разгибатели. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Приседания со штангой",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Приседания со штангой. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Фронтальные приседания",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Фронтальные приседания. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим ногами в тренажёре",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Жим ногами в тренажёре. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Выпады вперёд",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Выпады вперёд. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Болгарские сплит-приседания",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Болгарские сплит-приседания. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Разгибания ног в тренажёре",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Разгибания ног в тренажёре. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Становая тяга сумо",
    "group": "Ноги",
    "subgroup": "Бицепс бедра",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Становая тяга сумо. Рабочая группа: Ноги — Бицепс бедра. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Сгибания ног лёжа",
    "group": "Ноги",
    "subgroup": "Бицепс бедра",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Сгибания ног лёжа. Рабочая группа: Ноги — Бицепс бедра. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Сгибания ног сидя",
    "group": "Ноги",
    "subgroup": "Бицепс бедра",
    "gif": "https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif",
    "description": "Сгибания ног сидя. Рабочая группа: Ноги — Бицепс бедра. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Гуд монинги",
    "group": "Ноги",
    "subgroup": "Бицепс бедра",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Гуд монинги. Рабочая группа: Ноги — Бицепс бедра. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Ягодичный мост со штангой",
    "group": "Ноги",
    "subgroup": "Ягодичные",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Ягодичный мост со штангой. Рабочая группа: Ноги — Ягодичные. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга штанги на прямых ногах",
    "group": "Ноги",
    "subgroup": "Ягодичные",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Тяга штанги на прямых ногах. Рабочая группа: Ноги — Ягодичные. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Махи ногой назад в кроссовере",
    "group": "Ноги",
    "subgroup": "Ягодичные",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Махи ногой назад в кроссовере. Рабочая группа: Ноги — Ягодичные. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъёмы на носки стоя",
    "group": "Ноги",
    "subgroup": "Икры",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Подъёмы на носки стоя. Рабочая группа: Ноги — Икры. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъёмы на носки сидя",
    "group": "Ноги",
    "subgroup": "Икры",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Подъёмы на носки сидя. Рабочая группа: Ноги — Икры. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим штанги стоя",
    "group": "Плечи",
    "subgroup": "Передняя дельта",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Жим штанги стоя. Рабочая группа: Плечи — Передняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим гантелей сидя",
    "group": "Плечи",
    "subgroup": "Передняя дельта",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Жим гантелей сидя. Рабочая группа: Плечи — Передняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъём штанги перед собой",
    "group": "Плечи",
    "subgroup": "Передняя дельта",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Подъём штанги перед собой. Рабочая группа: Плечи — Передняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъём гантелей перед собой",
    "group": "Плечи",
    "subgroup": "Передняя дельта",
    "gif": "https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif",
    "description": "Подъём гантелей перед собой. Рабочая группа: Плечи — Передняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Махи в стороны стоя",
    "group": "Плечи",
    "subgroup": "Средняя дельта",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Махи в стороны стоя. Рабочая группа: Плечи — Средняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Махи в стороны в наклоне",
    "group": "Плечи",
    "subgroup": "Средняя дельта",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Махи в стороны в наклоне. Рабочая группа: Плечи — Средняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим Арнольда",
    "group": "Плечи",
    "subgroup": "Средняя дельта",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Жим Арнольда. Рабочая группа: Плечи — Средняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга на заднюю дельту в кроссовере",
    "group": "Плечи",
    "subgroup": "Задняя дельта",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Тяга на заднюю дельту в кроссовере. Рабочая группа: Плечи — Задняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Обратные разведения на тренажёре",
    "group": "Плечи",
    "subgroup": "Задняя дельта",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Обратные разведения на тренажёре. Рабочая группа: Плечи — Задняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга гантелей в наклоне",
    "group": "Плечи",
    "subgroup": "Задняя дельта",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Тяга гантелей в наклоне. Рабочая группа: Плечи — Задняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъём штанги на бицепс стоя",
    "group": "Руки",
    "subgroup": "Бицепс",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Подъём штанги на бицепс стоя. Рабочая группа: Руки — Бицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъём EZ-штанги",
    "group": "Руки",
    "subgroup": "Бицепс",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Подъём EZ-штанги. Рабочая группа: Руки — Бицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Сгибание гантелей сидя",
    "group": "Руки",
    "subgroup": "Бицепс",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Сгибание гантелей сидя. Рабочая группа: Руки — Бицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Концентрированный подъём",
    "group": "Руки",
    "subgroup": "Бицепс",
    "gif": "https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif",
    "description": "Концентрированный подъём. Рабочая группа: Руки — Бицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъём на скамье Скотта",
    "group": "Руки",
    "subgroup": "Бицепс",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Подъём на скамье Скотта. Рабочая группа: Руки — Бицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Молотки",
    "group": "Руки",
    "subgroup": "Бицепс",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Молотки. Рабочая группа: Руки — Бицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Французский жим лёжа",
    "group": "Руки",
    "subgroup": "Трицепс",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Французский жим лёжа. Рабочая группа: Руки — Трицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим узким хватом",
    "group": "Руки",
    "subgroup": "Трицепс",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Жим узким хватом. Рабочая группа: Руки — Трицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Разгибания на верхнем блоке",
    "group": "Руки",
    "subgroup": "Трицепс",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Разгибания на верхнем блоке. Рабочая группа: Руки — Трицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Разгибания из-за головы с канатами",
    "group": "Руки",
    "subgroup": "Трицепс",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Разгибания из-за головы с канатами. Рабочая группа: Руки — Трицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Отжимания на брусьях узко",
    "group": "Руки",
    "subgroup": "Трицепс",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Отжимания на брусьях узко. Рабочая группа: Руки — Трицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Сгибания запястий со штангой",
    "group": "Руки",
    "subgroup": "Предплечья",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Сгибания запястий со штангой. Рабочая группа: Руки — Предплечья. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Разгибания запястий",
    "group": "Руки",
    "subgroup": "Предплечья",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Разгибания запястий. Рабочая группа: Руки — Предплечья. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Хват на время",
    "group": "Руки",
    "subgroup": "Предплечья",
    "gif": "https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif",
    "description": "Хват на время. Рабочая группа: Руки — Предплечья. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Скручивания на полу",
    "group": "Пресс",
    "subgroup": "Верх",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Скручивания на полу. Рабочая группа: Пресс — Верх. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Скручивания на блоке",
    "group": "Пресс",
    "subgroup": "Верх",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Скручивания на блоке. Рабочая группа: Пресс — Верх. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Скручивания на фитболе",
    "group": "Пресс",
    "subgroup": "Верх",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Скручивания на фитболе. Рабочая группа: Пресс — Верх. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъёмы ног в висе",
    "group": "Пресс",
    "subgroup": "Низ",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Подъёмы ног в висе. Рабочая группа: Пресс — Низ. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъёмы ног на скамье",
    "group": "Пресс",
    "subgroup": "Низ",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Подъёмы ног на скамье. Рабочая группа: Пресс — Низ. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Обратные скручивания",
    "group": "Пресс",
    "subgroup": "Низ",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Обратные скручивания. Рабочая группа: Пресс — Низ. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Русский твист",
    "group": "Пресс",
    "subgroup": "Косые",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Русский твист. Рабочая группа: Пресс — Косые. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Повороты корпуса на блоке",
    "group": "Пресс",
    "subgroup": "Косые",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Повороты корпуса на блоке. Рабочая группа: Пресс — Косые. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Боковые планки",
    "group": "Пресс",
    "subgroup": "Косые",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Боковые планки. Рабочая группа: Пресс — Косые. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Планка",
    "group": "Пресс",
    "subgroup": "Кор",
    "gif": "https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif",
    "description": "Планка. Рабочая группа: Пресс — Кор. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Планка на локтях",
    "group": "Пресс",
    "subgroup": "Кор",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Планка на локтях. Рабочая группа: Пресс — Кор. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Планка с подъёмом ноги",
    "group": "Пресс",
    "subgroup": "Кор",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Планка с подъёмом ноги. Рабочая группа: Пресс — Кор. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим в машине Смита",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Жим в машине Смита. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим в тренажёре Хаммер",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Жим в тренажёре Хаммер. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Алмазные отжимания",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Алмазные отжимания. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Отжимания с паузой",
    "group": "Грудь",
    "subgroup": "Середина",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Отжимания с паузой. Рабочая группа: Грудь — Середина. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подтягивания обратным хватом",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Подтягивания обратным хватом. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга нейтральным хватом на блоке",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Тяга нейтральным хватом на блоке. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Тяга нижнего блока к животу",
    "group": "Спина",
    "subgroup": "Широчайшие",
    "gif": "https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif",
    "description": "Тяга нижнего блока к животу. Рабочая группа: Спина — Широчайшие. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Приседания Хаккен-штангой",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif",
    "description": "Приседания Хаккен-штангой. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим одной ногой",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif",
    "description": "Жим одной ногой. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Пистолетик к скамье",
    "group": "Ноги",
    "subgroup": "Квадрицепс",
    "gif": "https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif",
    "description": "Пистолетик к скамье. Рабочая группа: Ноги — Квадрицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Махи в тренажёре",
    "group": "Плечи",
    "subgroup": "Средняя дельта",
    "gif": "https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif",
    "description": "Махи в тренажёре. Рабочая группа: Плечи — Средняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим в машине Смита сидя",
    "group": "Плечи",
    "subgroup": "Средняя дельта",
    "gif": "https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif",
    "description": "Жим в машине Смита сидя. Рабочая группа: Плечи — Средняя дельта. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Отжимания узким хватом",
    "group": "Руки",
    "subgroup": "Трицепс",
    "gif": "https://media.tenor.com/4sRkQ3g1j3YAAAAC/deadlift.gif",
    "description": "Отжимания узким хватом. Рабочая группа: Руки — Трицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Жим гантели из-за головы сидя",
    "group": "Руки",
    "subgroup": "Трицепс",
    "gif": "https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif",
    "description": "Жим гантели из-за головы сидя. Рабочая группа: Руки — Трицепс. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Дровосек на кроссовере",
    "group": "Пресс",
    "subgroup": "Косые",
    "gif": "https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif",
    "description": "Дровосек на кроссовере. Рабочая группа: Пресс — Косые. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  {
    "name": "Подъём колен к локтям в висе",
    "group": "Пресс",
    "subgroup": "Косые",
    "gif": "https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif",
    "description": "Подъём колен к локтям в висе. Рабочая группа: Пресс — Косые. Разминка 1–2 подхода. Держите корпус стабильно, контролируйте амплитуду, работайте без рывков. Выдох на усилии, вдох в негативной фазе."
  },
  
];
  return data.map(e=>({...e, id: uid()}));
}


const exercises = [
    {
        "name_ru": "Жим штанги лёжа",
        "name_en": "Barbell Bench Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Barbell%20Bench%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей лёжа",
        "name_en": "Dumbbell Bench Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Bench%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим штанги на наклонной скамье",
        "name_en": "Incline Barbell Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Верх / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Barbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей на наклонной",
        "name_en": "Incline Dumbbell Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Верх / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Dumbbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим штанги на отрицательной скамье",
        "name_en": "Decline Barbell Bench Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Низ / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Barbell%20Bench%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей на отрицательной скамье",
        "name_en": "Decline Dumbbell Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Низ / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Dumbbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Разведение гантелей лёжа",
        "name_en": "Dumbbell Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Середина / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Разведение гантелей на наклонной",
        "name_en": "Incline Dumbbell Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Верх / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Dumbbell%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Разведение гантелей на отрицательной",
        "name_en": "Decline Dumbbell Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Низ / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Dumbbell%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Сведение на кроссовере",
        "name_en": "Cable Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Середина / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Cable%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Сведение на кроссовере вверх",
        "name_en": "High Cable Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Верх / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/High%20Cable%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Сведение на кроссовере вниз",
        "name_en": "Low Cable Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Низ / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Low%20Cable%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Отжимания от пола",
        "name_en": "Push-Ups",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Отжимания узким хватом",
        "name_en": "Close-Grip Push-Ups",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Трицепс / Передняя дельта",
        "type": "Базовое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Close-Grip%20Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Отжимания с широким хватом",
        "name_en": "Wide-Grip Push-Ups",
        "group": "Грудь / Плечи",
        "target_zone": "Середина / Передняя дельта",
        "type": "Базовое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Wide-Grip%20Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Отжимания на брусьях",
        "name_en": "Dips",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Низ / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Брусья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dips.gif?raw=true"
    },
    {
        "name_ru": "Отжимания на кольцах",
        "name_en": "Ring Dips",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Низ / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гимнастические кольца",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Ring%20Dips.gif?raw=true"
    },
    {
        "name_ru": "Отжимания с хлопком",
        "name_en": "Clap Push-Ups",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Взрывное",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Clap%20Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Жим в тренажёре",
        "name_en": "Chest Press Machine",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Chest%20Press%20Machine.gif?raw=true"
    },
    {
        "name_ru": "Жим в тренажёре под углом",
        "name_en": "Incline Chest Press Machine",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Верх / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Chest%20Press%20Machine.gif?raw=true"
    },
    {
        "name_ru": "nan",
        "name_en": "nan",
        "group": "nan",
        "target_zone": "nan",
        "type": "nan",
        "equipment": "nan",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true"
    },
    {
        "name_ru": "Название (RU)",
        "name_en": "Название (EN)",
        "group": "Основная группа",
        "target_zone": "Подгруппа",
        "type": "Тип",
        "equipment": "Оборудование",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true"
    },
    {
        "name_ru": "Подтягивания широким хватом",
        "name_en": "Wide-Grip Pull-Ups",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Бицепс / Предплечья",
        "type": "Базовое",
        "equipment": "Турник",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Wide-Grip%20Pull-Ups.gif?raw=true"
    },
    {
        "name_ru": "Подтягивания обратным хватом",
        "name_en": "Chin-Ups",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Бицепс / Предплечья",
        "type": "Базовое",
        "equipment": "Турник",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Chin-Ups.gif?raw=true"
    },
    {
        "name_ru": "Подтягивания нейтральным хватом",
        "name_en": "Neutral-Grip Pull-Ups",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Бицепс / Предплечья",
        "type": "Базовое",
        "equipment": "Турник",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Neutral-Grip%20Pull-Ups.gif?raw=true"
    },
    {
        "name_ru": "Подтягивания с дополнительным весом",
        "name_en": "Weighted Pull-Ups",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Бицепс / Предплечья",
        "type": "Базовое",
        "equipment": "Турник / Пояс с отягощением",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Weighted%20Pull-Ups.gif?raw=true"
    },
    {
        "name_ru": "Тяга верхнего блока",
        "name_en": "Lat Pulldown",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Бицепс / Предплечья",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lat%20Pulldown.gif?raw=true"
    },
    {
        "name_ru": "Тяга верхнего блока обратным хватом",
        "name_en": "Reverse-Grip Lat Pulldown",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Бицепс / Предплечья",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse-Grip%20Lat%20Pulldown.gif?raw=true"
    },
    {
        "name_ru": "Тяга верхнего блока узким хватом",
        "name_en": "Close-Grip Lat Pulldown",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Бицепс / Предплечья",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Close-Grip%20Lat%20Pulldown.gif?raw=true"
    },
    {
        "name_ru": "Тяга штанги в наклоне",
        "name_en": "Bent-Over Barbell Row",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Трапеции / Бицепс",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Bent-Over%20Barbell%20Row.gif?raw=true"
    },
    {
        "name_ru": "Тяга гантели в наклоне",
        "name_en": "One-Arm Dumbbell Row",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Трапеции / Бицепс",
        "type": "Базовое",
        "equipment": "Гантель / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/One-Arm%20Dumbbell%20Row.gif?raw=true"
    },
    {
        "name_ru": "Тяга Т-грифа",
        "name_en": "T-Bar Row",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Трапеции / Бицепс",
        "type": "Базовое",
        "equipment": "Т-гриф",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/T-Bar%20Row.gif?raw=true"
    },
    {
        "name_ru": "Тяга горизонтального блока",
        "name_en": "Seated Cable Row",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Трапеции / Бицепс",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Seated%20Cable%20Row.gif?raw=true"
    },
    {
        "name_ru": "Тяга к поясу в наклоне с гирей",
        "name_en": "Kettlebell Row",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Трапеции / Бицепс",
        "type": "Базовое",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Row.gif?raw=true"
    },
    {
        "name_ru": "Тяга штанги к подбородку",
        "name_en": "Upright Barbell Row",
        "group": "Плечи / Спина / Руки",
        "target_zone": "Трапеции / Дельты / Бицепс",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Upright%20Barbell%20Row.gif?raw=true"
    },
    {
        "name_ru": "Тяга гантелей к подбородку",
        "name_en": "Upright Dumbbell Row",
        "group": "Плечи / Спина / Руки",
        "target_zone": "Трапеции / Дельты / Бицепс",
        "type": "Базовое",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Upright%20Dumbbell%20Row.gif?raw=true"
    },
    {
        "name_ru": "Пулловер с гантелей",
        "name_en": "Dumbbell Pullover",
        "group": "Грудь / Спина",
        "target_zone": "Широчайшие / Грудные",
        "type": "Изолирующее",
        "equipment": "Гантель / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Pullover.gif?raw=true"
    },
    {
        "name_ru": "Пулловер в тренажёре",
        "name_en": "Pullover Machine",
        "group": "Грудь / Спина",
        "target_zone": "Широчайшие / Грудные",
        "type": "Изолирующее",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Pullover%20Machine.gif?raw=true"
    },
    {
        "name_ru": "Тяга нижнего блока к лицу",
        "name_en": "Face Pull",
        "group": "Спина / Плечи",
        "target_zone": "Задняя дельта / Трапеции",
        "type": "Изолирующее",
        "equipment": "Тросовый тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Face%20Pull.gif?raw=true"
    },
    {
        "name_ru": "Тяга каната к груди",
        "name_en": "Close-Grip Cable Row",
        "group": "Спина / Руки",
        "target_zone": "Широчайшие / Бицепс / Предплечья",
        "type": "Базовое",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Close-Grip%20Cable%20Row.gif?raw=true"
    },
    {
        "name_ru": "Становая тяга",
        "name_en": "Deadlift",
        "group": "Спина / Ноги / Руки",
        "target_zone": "Разгибатели спины / Бедра / Предплечья",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Deadlift.gif?raw=true"
    },
    {
        "name_ru": "Становая тяга с гантелями",
        "name_en": "Dumbbell Deadlift",
        "group": "Спина / Ноги / Руки",
        "target_zone": "Разгибатели спины / Бедра / Предплечья",
        "type": "Базовое",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Deadlift.gif?raw=true"
    },
    {
        "name_ru": "Становая тяга сумо",
        "name_en": "Sumo Deadlift",
        "group": "Спина / Ноги / Руки",
        "target_zone": "Разгибатели спины / Бедра / Предплечья",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Sumo%20Deadlift.gif?raw=true"
    },
    {
        "name_ru": "Становая тяга на прямых ногах",
        "name_en": "Stiff-Leg Deadlift",
        "group": "Спина / Ноги",
        "target_zone": "Разгибатели спины / Бедра",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Stiff-Leg%20Deadlift.gif?raw=true"
    },
    {
        "name_ru": "Становая тяга с гирями",
        "name_en": "Kettlebell Deadlift",
        "group": "Спина / Ноги",
        "target_zone": "Разгибатели спины / Бедра",
        "type": "Базовое",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Deadlift.gif?raw=true"
    },
    {
        "name_ru": "Гиперэкстензия",
        "name_en": "Back Extension",
        "group": "Спина",
        "target_zone": "Разгибатели спины",
        "type": "Изолирующее",
        "equipment": "Гиперэкстензия",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Back%20Extension.gif?raw=true"
    },
    {
        "name_ru": "Гиперэкстензия с весом",
        "name_en": "Weighted Back Extension",
        "group": "Спина",
        "target_zone": "Разгибатели спины",
        "type": "Изолирующее",
        "equipment": "Гиперэкстензия / Блин",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Weighted%20Back%20Extension.gif?raw=true"
    },
    {
        "name_ru": "nan",
        "name_en": "nan",
        "group": "nan",
        "target_zone": "nan",
        "type": "nan",
        "equipment": "nan",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true"
    },
    {
        "name_ru": "Название (RU)",
        "name_en": "Название (EN)",
        "group": "Основная группа",
        "target_zone": "Подгруппа",
        "type": "Тип",
        "equipment": "Оборудование",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true"
    },
    {
        "name_ru": "Жим штанги стоя",
        "name_en": "Overhead Barbell Press",
        "group": "Плечи / Руки",
        "target_zone": "Передняя дельта / Средняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Overhead%20Barbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей сидя",
        "name_en": "Seated Dumbbell Press",
        "group": "Плечи / Руки",
        "target_zone": "Передняя дельта / Средняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Seated%20Dumbbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей стоя",
        "name_en": "Standing Dumbbell Press",
        "group": "Плечи / Руки",
        "target_zone": "Передняя дельта / Средняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Standing%20Dumbbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим Арнольда",
        "name_en": "Arnold Press",
        "group": "Плечи / Руки",
        "target_zone": "Передняя дельта / Средняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Arnold%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим штанги из-за головы",
        "name_en": "Behind-the-Neck Press",
        "group": "Плечи / Руки",
        "target_zone": "Средняя дельта / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Behind-the-Neck%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим в тренажёре для плеч",
        "name_en": "Shoulder Press Machine",
        "group": "Плечи / Руки",
        "target_zone": "Передняя дельта / Средняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Shoulder%20Press%20Machine.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей через стороны",
        "name_en": "Lateral Raise",
        "group": "Плечи",
        "target_zone": "Средняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lateral%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей перед собой",
        "name_en": "Front Raise",
        "group": "Плечи",
        "target_zone": "Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Front%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей в наклоне",
        "name_en": "Bent-Over Lateral Raise",
        "group": "Плечи",
        "target_zone": "Задняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Bent-Over%20Lateral%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей в стороны в тренажёре",
        "name_en": "Lateral Raise Machine",
        "group": "Плечи",
        "target_zone": "Средняя дельта",
        "type": "Изолирующее",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lateral%20Raise%20Machine.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей перед собой в тренажёре",
        "name_en": "Front Raise Machine",
        "group": "Плечи",
        "target_zone": "Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Front%20Raise%20Machine.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей в наклоне в тренажёре",
        "name_en": "Reverse Pec Deck",
        "group": "Плечи",
        "target_zone": "Задняя дельта",
        "type": "Изолирующее",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse%20Pec%20Deck.gif?raw=true"
    },
    {
        "name_ru": "Жим штанги на наклонной скамье под углом 80°",
        "name_en": "High Incline Barbell Press",
        "group": "Плечи / Грудь / Руки",
        "target_zone": "Передняя дельта / Верх груди / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/High%20Incline%20Barbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей на наклонной скамье под углом 80°",
        "name_en": "High Incline Dumbbell Press",
        "group": "Плечи / Грудь / Руки",
        "target_zone": "Передняя дельта / Верх груди / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/High%20Incline%20Dumbbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Тяга штанги к подбородку",
        "name_en": "Upright Barbell Row",
        "group": "Плечи / Спина / Руки",
        "target_zone": "Трапеции / Дельты / Бицепс",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Upright%20Barbell%20Row.gif?raw=true"
    },
    {
        "name_ru": "Тяга гантелей к подбородку",
        "name_en": "Upright Dumbbell Row",
        "group": "Плечи / Спина / Руки",
        "target_zone": "Трапеции / Дельты / Бицепс",
        "type": "Базовое",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Upright%20Dumbbell%20Row.gif?raw=true"
    },
    {
        "name_ru": "Подъём гирь через стороны",
        "name_en": "Kettlebell Lateral Raise",
        "group": "Плечи",
        "target_zone": "Средняя дельта",
        "type": "Изолирующее",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Lateral%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Подъём гирь перед собой",
        "name_en": "Kettlebell Front Raise",
        "group": "Плечи",
        "target_zone": "Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Front%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Жим гирь стоя",
        "name_en": "Kettlebell Press",
        "group": "Плечи / Руки",
        "target_zone": "Передняя дельта / Средняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гирь сидя",
        "name_en": "Seated Kettlebell Press",
        "group": "Плечи / Руки",
        "target_zone": "Передняя дельта / Средняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гиря / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Seated%20Kettlebell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Подъём штанги на грудь и толчок",
        "name_en": "Push Press",
        "group": "Плечи / Руки / Ноги",
        "target_zone": "Передняя дельта / Средняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Push%20Press.gif?raw=true"
    },
    {
        "name_ru": "nan",
        "name_en": "nan",
        "group": "nan",
        "target_zone": "nan",
        "type": "nan",
        "equipment": "nan",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true"
    },
    {
        "name_ru": "Название (RU)",
        "name_en": "Название (EN)",
        "group": "Основная группа",
        "target_zone": "Подгруппа",
        "type": "Тип",
        "equipment": "Оборудование",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true"
    },
    {
        "name_ru": "Подъём штанги на бицепс",
        "name_en": "Barbell Curl",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Barbell%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей на бицепс",
        "name_en": "Dumbbell Curl",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей на бицепс поочерёдно",
        "name_en": "Alternating Dumbbell Curl",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Alternating%20Dumbbell%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей молотковым хватом",
        "name_en": "Hammer Curl",
        "group": "Руки",
        "target_zone": "Бицепс / Брахиалис / Предплечья",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Hammer%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Подъём штанги на скамье Скотта",
        "name_en": "Preacher Curl",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "Штанга / Скамья Скотта",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Preacher%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Подъём гантелей на скамье Скотта",
        "name_en": "Preacher Dumbbell Curl",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "Гантели / Скамья Скотта",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Preacher%20Dumbbell%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Концентрированный подъём на бицепс",
        "name_en": "Concentration Curl",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "Гантель",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Concentration%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Подъём EZ-штанги на бицепс",
        "name_en": "EZ Bar Curl",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "EZ-штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/EZ%20Bar%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Подъём на бицепс в тренажёре",
        "name_en": "Biceps Curl Machine",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Biceps%20Curl%20Machine.gif?raw=true"
    },
    {
        "name_ru": "Подъём на бицепс на блоке",
        "name_en": "Cable Curl",
        "group": "Руки",
        "target_zone": "Бицепс",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Cable%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Подъём каната на бицепс",
        "name_en": "Rope Cable Curl",
        "group": "Руки",
        "target_zone": "Бицепс / Предплечья",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Rope%20Cable%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Разгибания штанги лёжа",
        "name_en": "Lying Barbell Triceps Extension",
        "group": "Руки",
        "target_zone": "Трицепс",
        "type": "Изолирующее",
        "equipment": "Штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lying%20Barbell%20Triceps%20Extension.gif?raw=true"
    },
    {
        "name_ru": "Разгибания EZ-штанги лёжа",
        "name_en": "Lying EZ Bar Triceps Extension",
        "group": "Руки",
        "target_zone": "Трицепс",
        "type": "Изолирующее",
        "equipment": "EZ-штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lying%20EZ%20Bar%20Triceps%20Extension.gif?raw=true"
    },
    {
        "name_ru": "Разгибания гантелей лёжа",
        "name_en": "Lying Dumbbell Triceps Extension",
        "group": "Руки",
        "target_zone": "Трицепс",
        "type": "Изолирующее",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Lying%20Dumbbell%20Triceps%20Extension.gif?raw=true"
    },
    {
        "name_ru": "Разгибания рук с гантелей из-за головы",
        "name_en": "Overhead Dumbbell Extension",
        "group": "Руки",
        "target_zone": "Трицепс",
        "type": "Изолирующее",
        "equipment": "Гантель",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Overhead%20Dumbbell%20Extension.gif?raw=true"
    },
    {
        "name_ru": "Разгибания рук с штангой из-за головы",
        "name_en": "Overhead Barbell Extension",
        "group": "Руки",
        "target_zone": "Трицепс",
        "type": "Изолирующее",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Overhead%20Barbell%20Extension.gif?raw=true"
    },
    {
        "name_ru": "Разгибания рук на блоке",
        "name_en": "Triceps Pushdown",
        "group": "Руки",
        "target_zone": "Трицепс",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Triceps%20Pushdown.gif?raw=true"
    },
    {
        "name_ru": "Разгибания рук с канатом на блоке",
        "name_en": "Rope Triceps Pushdown",
        "group": "Руки",
        "target_zone": "Трицепс",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Rope%20Triceps%20Pushdown.gif?raw=true"
    },
    {
        "name_ru": "Разгибания рук на верхнем блоке одной рукой",
        "name_en": "One-Arm Cable Triceps Extension",
        "group": "Руки",
        "target_zone": "Трицепс",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/One-Arm%20Cable%20Triceps%20Extension.gif?raw=true"
    },
    {
        "name_ru": "Алмазные отжимания",
        "name_en": "Diamond Push-Ups",
        "group": "Грудь / Руки",
        "target_zone": "Трицепс / Грудные",
        "type": "Базовое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Diamond%20Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Отжимания на брусьях",
        "name_en": "Dips",
        "group": "Грудь / Руки",
        "target_zone": "Трицепс / Грудные",
        "type": "Базовое",
        "equipment": "Брусья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dips.gif?raw=true"
    },
    {
        "name_ru": "Отжимания на брусьях с весом",
        "name_en": "Weighted Dips",
        "group": "Грудь / Руки",
        "target_zone": "Трицепс / Грудные",
        "type": "Базовое",
        "equipment": "Брусья / Пояс с отягощением",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Weighted%20Dips.gif?raw=true"
    },
    {
        "name_ru": "Сгибания запястий с штангой",
        "name_en": "Wrist Curl",
        "group": "Руки",
        "target_zone": "Предплечья",
        "type": "Изолирующее",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Wrist%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Сгибания запястий с гантелями",
        "name_en": "Dumbbell Wrist Curl",
        "group": "Руки",
        "target_zone": "Предплечья",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Wrist%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Разгибания запястий с штангой",
        "name_en": "Reverse Wrist Curl",
        "group": "Руки",
        "target_zone": "Предплечья",
        "type": "Изолирующее",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse%20Wrist%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Разгибания запястий с гантелями",
        "name_en": "Reverse Dumbbell Wrist Curl",
        "group": "Руки",
        "target_zone": "Предплечья",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse%20Dumbbell%20Wrist%20Curl.gif?raw=true"
    },
    {
        "name_ru": "Пронация/супинация предплечья",
        "name_en": "Pronation/Supination",
        "group": "Руки",
        "target_zone": "Предплечья",
        "type": "Изолирующее",
        "equipment": "Гантели",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Pronation/Supination.gif?raw=true"
    },
    {
        "name_ru": "nan",
        "name_en": "nan",
        "group": "nan",
        "target_zone": "nan",
        "type": "nan",
        "equipment": "nan",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true"
    },
    {
        "name_ru": "Название (RU)",
        "name_en": "Название (EN)",
        "group": "Основная группа",
        "target_zone": "Подгруппа",
        "type": "Тип",
        "equipment": "Оборудование",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true"
    },
    {
        "name_ru": "Жим штанги лёжа",
        "name_en": "Barbell Bench Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Barbell%20Bench%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей лёжа",
        "name_en": "Dumbbell Bench Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Bench%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим штанги на наклонной скамье",
        "name_en": "Incline Barbell Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Верх / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Barbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей на наклонной",
        "name_en": "Incline Dumbbell Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Верх / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Dumbbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим штанги на отрицательной скамье",
        "name_en": "Decline Barbell Bench Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Низ / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Штанга / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Barbell%20Bench%20Press.gif?raw=true"
    },
    {
        "name_ru": "Жим гантелей на отрицательной скамье",
        "name_en": "Decline Dumbbell Press",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Низ / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Dumbbell%20Press.gif?raw=true"
    },
    {
        "name_ru": "Разведение гантелей лёжа",
        "name_en": "Dumbbell Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Середина / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dumbbell%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Разведение гантелей на наклонной",
        "name_en": "Incline Dumbbell Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Верх / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Dumbbell%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Разведение гантелей на отрицательной",
        "name_en": "Decline Dumbbell Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Низ / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Гантели / Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Dumbbell%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Сведение на кроссовере",
        "name_en": "Cable Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Середина / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Cable%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Сведение на кроссовере вверх",
        "name_en": "High Cable Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Верх / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/High%20Cable%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Сведение на кроссовере вниз",
        "name_en": "Low Cable Fly",
        "group": "Грудь / Плечи",
        "target_zone": "Низ / Передняя дельта",
        "type": "Изолирующее",
        "equipment": "Кроссовер",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Low%20Cable%20Fly.gif?raw=true"
    },
    {
        "name_ru": "Отжимания от пола",
        "name_en": "Push-Ups",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Отжимания узким хватом",
        "name_en": "Close-Grip Push-Ups",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Трицепс / Передняя дельта",
        "type": "Базовое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Close-Grip%20Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Отжимания с широким хватом",
        "name_en": "Wide-Grip Push-Ups",
        "group": "Грудь / Плечи",
        "target_zone": "Середина / Передняя дельта",
        "type": "Базовое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Wide-Grip%20Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Отжимания на брусьях",
        "name_en": "Dips",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Низ / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Брусья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dips.gif?raw=true"
    },
    {
        "name_ru": "Отжимания на кольцах",
        "name_en": "Ring Dips",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Низ / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Гимнастические кольца",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Ring%20Dips.gif?raw=true"
    },
    {
        "name_ru": "Отжимания с хлопком",
        "name_en": "Clap Push-Ups",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Взрывное",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Clap%20Push-Ups.gif?raw=true"
    },
    {
        "name_ru": "Жим в тренажёре",
        "name_en": "Chest Press Machine",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Середина / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Chest%20Press%20Machine.gif?raw=true"
    },
    {
        "name_ru": "Жим в тренажёре под углом",
        "name_en": "Incline Chest Press Machine",
        "group": "Грудь / Плечи / Руки",
        "target_zone": "Верх / Передняя дельта / Трицепс",
        "type": "Базовое",
        "equipment": "Тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Incline%20Chest%20Press%20Machine.gif?raw=true"
    },
    {
        "name_ru": "nan",
        "name_en": "nan",
        "group": "nan",
        "target_zone": "nan",
        "type": "nan",
        "equipment": "nan",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true"
    },
    {
        "name_ru": "Название (RU)",
        "name_en": "Название (EN)",
        "group": "Основная группа",
        "target_zone": "Подгруппа",
        "type": "Тип",
        "equipment": "Оборудование",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true"
    },
    {
        "name_ru": "Скручивания на полу",
        "name_en": "Crunch",
        "group": "Пресс",
        "target_zone": "Верхняя часть пресса",
        "type": "Изолирующее",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Crunch.gif?raw=true"
    },
    {
        "name_ru": "Обратные скручивания",
        "name_en": "Reverse Crunch",
        "group": "Пресс",
        "target_zone": "Нижняя часть пресса",
        "type": "Изолирующее",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Reverse%20Crunch.gif?raw=true"
    },
    {
        "name_ru": "Подъём ног лёжа",
        "name_en": "Leg Raise",
        "group": "Пресс",
        "target_zone": "Нижняя часть пресса",
        "type": "Изолирующее",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Leg%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Подъём ног в висе",
        "name_en": "Hanging Leg Raise",
        "group": "Пресс",
        "target_zone": "Нижняя часть пресса",
        "type": "Изолирующее",
        "equipment": "Турник",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Hanging%20Leg%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Подъём коленей в висе",
        "name_en": "Hanging Knee Raise",
        "group": "Пресс",
        "target_zone": "Нижняя часть пресса",
        "type": "Изолирующее",
        "equipment": "Турник",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Hanging%20Knee%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Скручивания на скамье с наклоном",
        "name_en": "Decline Bench Crunch",
        "group": "Пресс",
        "target_zone": "Верхняя часть пресса",
        "type": "Изолирующее",
        "equipment": "Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Decline%20Bench%20Crunch.gif?raw=true"
    },
    {
        "name_ru": "Русский твист",
        "name_en": "Russian Twist",
        "group": "Корпус",
        "target_zone": "Косые мышцы живота",
        "type": "Изолирующее",
        "equipment": "Медицинский мяч / Гантеля / Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Russian%20Twist.gif?raw=true"
    },
    {
        "name_ru": "Планка",
        "name_en": "Plank",
        "group": "Корпус",
        "target_zone": "Поперечная мышца живота / Стабилизаторы",
        "type": "Изометрическое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Plank.gif?raw=true"
    },
    {
        "name_ru": "Боковая планка",
        "name_en": "Side Plank",
        "group": "Корпус",
        "target_zone": "Косые мышцы живота / Стабилизаторы",
        "type": "Изометрическое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Side%20Plank.gif?raw=true"
    },
    {
        "name_ru": "Планка с подъёмом ноги",
        "name_en": "Plank with Leg Raise",
        "group": "Корпус",
        "target_zone": "Поперечная мышца живота / Стабилизаторы",
        "type": "Изометрическое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Plank%20with%20Leg%20Raise.gif?raw=true"
    },
    {
        "name_ru": "Велосипед",
        "name_en": "Bicycle Crunch",
        "group": "Пресс / Корпус",
        "target_zone": "Верхняя часть пресса / Косые мышцы",
        "type": "Изолирующее",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Bicycle%20Crunch.gif?raw=true"
    },
    {
        "name_ru": "Косые скручивания",
        "name_en": "Oblique Crunch",
        "group": "Пресс / Корпус",
        "target_zone": "Косые мышцы живота",
        "type": "Изолирующее",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Oblique%20Crunch.gif?raw=true"
    },
    {
        "name_ru": "Дракон флаг",
        "name_en": "Dragon Flag",
        "group": "Пресс / Корпус",
        "target_zone": "Верхняя и нижняя часть пресса",
        "type": "Базовое",
        "equipment": "Скамья",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Dragon%20Flag.gif?raw=true"
    },
    {
        "name_ru": "Колесо для пресса",
        "name_en": "Ab Wheel Rollout",
        "group": "Пресс / Корпус",
        "target_zone": "Прямые мышцы / Поперечная мышца живота",
        "type": "Базовое",
        "equipment": "Колесо для пресса",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Ab%20Wheel%20Rollout.gif?raw=true"
    },
    {
        "name_ru": "Подъём туловища на римском стуле",
        "name_en": "Back Extension Roman Chair",
        "group": "Спина / Корпус",
        "target_zone": "Разгибатели спины / Ягодицы",
        "type": "Базовое",
        "equipment": "Римский стул",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Back%20Extension%20Roman%20Chair.gif?raw=true"
    },
    {
        "name_ru": "V-скручивания",
        "name_en": "V-Up",
        "group": "Пресс",
        "target_zone": "Верхняя и нижняя часть пресса",
        "type": "Базовое",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/V-Up.gif?raw=true"
    },
    {
        "name_ru": "Касания пяток",
        "name_en": "Heel Touch",
        "group": "Пресс",
        "target_zone": "Косые мышцы живота",
        "type": "Изолирующее",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Heel%20Touch.gif?raw=true"
    },
    {
        "name_ru": "Повороты корпуса с грифом",
        "name_en": "Bar Twist",
        "group": "Корпус",
        "target_zone": "Косые мышцы живота",
        "type": "Изолирующее",
        "equipment": "Гриф",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Bar%20Twist.gif?raw=true"
    },
    {
        "name_ru": "nan",
        "name_en": "nan",
        "group": "nan",
        "target_zone": "nan",
        "type": "nan",
        "equipment": "nan",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/nan.gif?raw=true"
    },
    {
        "name_ru": "Название (RU)",
        "name_en": "Название (EN)",
        "group": "Основная группа",
        "target_zone": "Подгруппа",
        "type": "Тип",
        "equipment": "Оборудование",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%28EN%29.gif?raw=true"
    },
    {
        "name_ru": "Берпи",
        "name_en": "Burpee",
        "group": "Всё тело",
        "target_zone": "Ноги / Руки / Корпус",
        "type": "Функциональное",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Burpee.gif?raw=true"
    },
    {
        "name_ru": "Берпи с прыжком на тумбу",
        "name_en": "Burpee Box Jump",
        "group": "Всё тело",
        "target_zone": "Ноги / Руки / Корпус",
        "type": "Функциональное",
        "equipment": "Плиометрическая тумба",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Burpee%20Box%20Jump.gif?raw=true"
    },
    {
        "name_ru": "Прыжки на тумбу",
        "name_en": "Box Jump",
        "group": "Ноги",
        "target_zone": "Квадрицепсы / Ягодицы / Икры",
        "type": "Функциональное",
        "equipment": "Плиометрическая тумба",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Box%20Jump.gif?raw=true"
    },
    {
        "name_ru": "Прыжки через скакалку",
        "name_en": "Jump Rope",
        "group": "Всё тело",
        "target_zone": "Кардио / Координация",
        "type": "Кардио",
        "equipment": "Скакалка",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Jump%20Rope.gif?raw=true"
    },
    {
        "name_ru": "Альпинист",
        "name_en": "Mountain Climber",
        "group": "Всё тело",
        "target_zone": "Пресс / Плечи / Ноги",
        "type": "Функциональное",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Mountain%20Climber.gif?raw=true"
    },
    {
        "name_ru": "Тяга гири к подбородку",
        "name_en": "Kettlebell High Pull",
        "group": "Всё тело",
        "target_zone": "Плечи / Спина / Ноги",
        "type": "Функциональное",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20High%20Pull.gif?raw=true"
    },
    {
        "name_ru": "Свинг гирей",
        "name_en": "Kettlebell Swing",
        "group": "Всё тело",
        "target_zone": "Ягодицы / Бицепс бедра / Плечи",
        "type": "Функциональное",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Swing.gif?raw=true"
    },
    {
        "name_ru": "Турецкий подъём",
        "name_en": "TGU (Turkish Get-Up)",
        "group": "Всё тело",
        "target_zone": "Плечи / Пресс / Ноги",
        "type": "Функциональное",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/TGU%20%28Turkish%20Get-Up%29.gif?raw=true"
    },
    {
        "name_ru": "Толчок штанги",
        "name_en": "Push Jerk",
        "group": "Всё тело",
        "target_zone": "Плечи / Трицепс / Ноги",
        "type": "Функциональное",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Push%20Jerk.gif?raw=true"
    },
    {
        "name_ru": "Рывок штанги",
        "name_en": "Snatch",
        "group": "Всё тело",
        "target_zone": "Плечи / Спина / Ноги",
        "type": "Функциональное",
        "equipment": "Штанга",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Snatch.gif?raw=true"
    },
    {
        "name_ru": "Рывок гири",
        "name_en": "Kettlebell Snatch",
        "group": "Всё тело",
        "target_zone": "Плечи / Спина / Ноги",
        "type": "Функциональное",
        "equipment": "Гиря",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Kettlebell%20Snatch.gif?raw=true"
    },
    {
        "name_ru": "Гребля на тренажёре",
        "name_en": "Rowing Machine",
        "group": "Всё тело",
        "target_zone": "Спина / Ноги / Руки",
        "type": "Кардио",
        "equipment": "Гребной тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Rowing%20Machine.gif?raw=true"
    },
    {
        "name_ru": "Атакующая велотренировка",
        "name_en": "Assault Bike",
        "group": "Всё тело",
        "target_zone": "Кардио / Ноги / Руки",
        "type": "Кардио",
        "equipment": "Велотренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Assault%20Bike.gif?raw=true"
    },
    {
        "name_ru": "Спринт",
        "name_en": "Sprint",
        "group": "Всё тело",
        "target_zone": "Кардио / Ноги",
        "type": "Кардио",
        "equipment": "Беговая дорожка / Стадион",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Sprint.gif?raw=true"
    },
    {
        "name_ru": "Бег на месте",
        "name_en": "Running in Place",
        "group": "Всё тело",
        "target_zone": "Кардио / Ноги",
        "type": "Кардио",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Running%20in%20Place.gif?raw=true"
    },
    {
        "name_ru": "Подтягивания с хлопком",
        "name_en": "Clap Pull-Up",
        "group": "Всё тело",
        "target_zone": "Спина / Руки / Корпус",
        "type": "Функциональное",
        "equipment": "Турник",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Clap%20Pull-Up.gif?raw=true"
    },
    {
        "name_ru": "Отжимания с хлопком",
        "name_en": "Clap Push-Up",
        "group": "Всё тело",
        "target_zone": "Грудь / Трицепс / Пресс",
        "type": "Функциональное",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Clap%20Push-Up.gif?raw=true"
    },
    {
        "name_ru": "Чередующиеся выпрыгивания",
        "name_en": "Alternating Jump Lunge",
        "group": "Ноги",
        "target_zone": "Квадрицепсы / Ягодицы / Икры",
        "type": "Функциональное",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Alternating%20Jump%20Lunge.gif?raw=true"
    },
    {
        "name_ru": "Скейт-джамп",
        "name_en": "Skater Jump",
        "group": "Ноги",
        "target_zone": "Ягодицы / Квадрицепсы / Икры",
        "type": "Функциональное",
        "equipment": "Собственный вес",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Skater%20Jump.gif?raw=true"
    },
    {
        "name_ru": "Гребной бурпи",
        "name_en": "Rowing Burpee",
        "group": "Всё тело",
        "target_zone": "Спина / Ноги / Руки",
        "type": "Функциональное",
        "equipment": "Собственный вес / Гребной тренажёр",
        "gif": "https://github.com/kainshel/tnglogbot/blob/f4a372b5015a0b826bd9d3f6a3f7a5d28445ea09/gif_exercises/Rowing%20Burpee.gif?raw=true"
    }
];
