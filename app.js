// Конфигурация приложения
const APP_CONFIG = {
  STORAGE_KEY: 'gymkeeper_data_v3',
// Замените APP_CONFIG.DEFAULT_EXERCISES на:
DEFAULT_EXERCISES: [
  {
    id: 'squats',
    name: 'Приседания',
    gif: 'https://example.com/squat.gif',
    muscleGroup: 'ноги',
    description: 'Базовое упражнение для развития мышц ног',
    created: Date.now()
  },
  {
    id: 'bench-press',
    name: 'Жим лёжа',
    gif: 'https://example.com/benchpress.gif',
    muscleGroup: 'грудь',
    description: 'Развивает грудные мышцы и трицепсы',
    created: Date.now()
  },
  // Добавьте другие упражнения
]
  MUSCLE_GROUPS: ['ноги', 'руки', 'спина', 'грудь', 'плечи', 'пресс', 'кардио']
};

// Утилиты
const dom = {
  qs: (selector, parent = document) => parent.querySelector(selector),
  qsa: (selector, parent = document) => [...parent.querySelectorAll(selector)],
  on: (element, event, handler, options) => element.addEventListener(event, handler, options),
  create: (tag, attributes = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
    children.forEach(child => el.appendChild(child));
    return el;
  }
};

// State management
class GymStore {
  constructor() {
    this._state = this._loadInitialState();
    this._listeners = [];
  }

  get state() {
    return this._state;
  }

  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  _notify() {
    this._listeners.forEach(listener => listener(this._state));
  }

  _loadInitialState() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      
      return {
        version: 3,
        profiles: {},
        exercises: APP_CONFIG.DEFAULT_EXERCISES,
        workouts: [],
        settings: {
          theme: 'system',
          units: 'kg',
          language: 'ru'
        },
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Failed to load state:', error);
      return this._createDefaultState();
    }
  }

  _createDefaultState() {
    return {
      version: 3,
      profiles: {},
      exercises: APP_CONFIG.DEFAULT_EXERCISES,
      workouts: [],
      settings: {
        theme: 'system',
        units: 'kg',
        language: 'ru'
      },
      lastUpdated: Date.now()
    };
  }

  saveState(newState) {
    this._state = {
      ...newState,
      lastUpdated: Date.now()
    };
    localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(this._state));
    this._notify();
  }

  // CRUD operations
  addExercise(exercise) {
    const newExercise = {
      ...exercise,
      id: crypto.randomUUID(),
      created: Date.now()
    };
    const newState = {
      ...this._state,
      exercises: [...this._state.exercises, newExercise]
    };
    this.saveState(newState);
    return newExercise;
  }

  updateExercise(id, updates) {
    const newState = {
      ...this._state,
      exercises: this._state.exercises.map(ex => 
        ex.id === id ? { ...ex, ...updates, updated: Date.now() } : ex
      )
    };
    this.saveState(newState);
  }

  deleteExercise(id) {
    const newState = {
      ...this._state,
      exercises: this._state.exercises.filter(ex => ex.id !== id)
    };
    this.saveState(newState);
  }
}

// UI Components
class ExerciseList {
  constructor(store) {
    this.store = store;
    this.container = dom.qs('#exercise-list');
    this.searchInput = dom.qs('#exercise-search');
    this.filterSelect = dom.qs('#exercise-filter');
    this._setupEventListeners();
    this._renderFilters();
    this.unsubscribe = store.subscribe(() => this.render());
    this.render();
  }

  _setupEventListeners() {
    dom.on(this.searchInput, 'input', () => this.render());
    dom.on(this.filterSelect, 'change', () => this.render());
    dom.on(this.container, 'click', (e) => {
      const card = e.target.closest('.exercise-card');
      if (card) {
        const id = card.dataset.id;
        this._openExerciseModal(id);
      }
    });
  }

  _renderFilters() {
    APP_CONFIG.MUSCLE_GROUPS.forEach(group => {
      const option = dom.create('option', { value: group }, [document.createTextNode(group)]);
      this.filterSelect.appendChild(option);
    });
  }

  _openExerciseModal(id) {
    const exercise = this.store.state.exercises.find(ex => ex.id === id);
    if (!exercise) return;
    
    const modal = new ExerciseModal(exercise, this.store);
    modal.open();
  }

  render() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const filterValue = this.filterSelect.value;
    
    const exercises = this.store.state.exercises
      .filter(ex => 
        ex.name.toLowerCase().includes(searchTerm) &&
        (filterValue === '' || ex.muscleGroup === filterValue)
      )
      .sort((a, b) => b.created - a.created);

    this.container.innerHTML = '';
    
    if (exercises.length === 0) {
      this.container.appendChild(this._createEmptyState());
      return;
    }

    exercises.forEach(exercise => {
      this.container.appendChild(this._createExerciseCard(exercise));
    });
  }

  _createExerciseCard(exercise) {
    const card = dom.create('div', { 
      class: 'exercise-card', 
      'data-id': exercise.id 
    });
    
    const thumb = dom.create('div', { class: 'exercise-thumb' }, [
      dom.create('img', { 
        src: exercise.gif || 'placeholder.svg', 
        alt: exercise.name,
        loading: 'lazy'
      })
    ]);
    
    const name = dom.create('div', { class: 'exercise-name' }, [
      document.createTextNode(exercise.name)
    ]);
    
    const muscleGroup = dom.create('div', { class: 'exercise-muscle-group' }, [
      document.createTextNode(exercise.muscleGroup || '—')
    ]);
    
    card.append(thumb, name, muscleGroup);
    return card;
  }

  _createEmptyState() {
    return dom.create('div', { class: 'empty-state' }, [
      dom.create('img', { src: 'empty.svg', alt: '' }),
      dom.create('h3', {}, [document.createTextNode('Упражнения не найдены')]),
      dom.create('p', {}, [document.createTextNode('Попробуйте изменить параметры поиска')])
    ]);
  }
}

class ExerciseModal {
  constructor(exercise, store) {
    this.exercise = exercise;
    this.store = store;
    this.modalElement = this._createModal();
    this._setupEventListeners();
  }

  open() {
    document.body.appendChild(this.modalElement);
    document.body.classList.add('modal-open');
  }

  close() {
    document.body.removeChild(this.modalElement);
    document.body.classList.remove('modal-open');
  }

  _createModal() {
    const modal = dom.create('div', { class: 'modal' });
    const overlay = dom.create('div', { class: 'modal-overlay' });
    const content = dom.create('div', { class: 'modal-content' });
    
    const header = dom.create('div', { class: 'modal-header' }, [
      dom.create('h2', {}, [document.createTextNode(this.exercise.name)]),
      dom.create('button', { class: 'close-btn', 'aria-label': 'Закрыть' }, [
        dom.create('span', {}, [document.createTextNode('×')])
      ])
    ]);
    
    const body = dom.create('div', { class: 'modal-body' }, [
      dom.create('div', { class: 'exercise-detail' }, [
        dom.create('img', { 
          src: this.exercise.gif || 'placeholder.svg', 
          alt: this.exercise.name,
          class: 'exercise-gif'
        }),
        dom.create('div', { class: 'exercise-info' }, [
          dom.create('p', {}, [
            dom.create('strong', {}, [document.createTextNode('Группа мышц: ')]),
            document.createTextNode(this.exercise.muscleGroup || '—')
          ]),
          dom.create('p', {}, [
            dom.create('strong', {}, [document.createTextNode('Описание: ')]),
            document.createTextNode(this.exercise.description || 'Нет описания')
          ])
        ])
      ]),
      dom.create('div', { class: 'modal-actions' }, [
        dom.create('button', { 
          class: 'btn btn-edit',
          'data-action': 'edit'
        }, [document.createTextNode('Редактировать')]),
        dom.create('button', { 
          class: 'btn btn-delete',
          'data-action': 'delete'
        }, [document.createTextNode('Удалить')])
      ])
    ]);
    
    content.append(header, body);
    modal.append(overlay, content);
    return modal;
  }

  _setupEventListeners() {
    dom.on(this.modalElement.querySelector('.modal-overlay'), 'click', () => this.close());
    dom.on(this.modalElement.querySelector('.close-btn'), 'click', () => this.close());
    dom.on(this.modalElement.querySelector('[data-action="edit"]'), 'click', () => this._editExercise());
    dom.on(this.modalElement.querySelector('[data-action="delete"]'), 'click', () => this._deleteExercise());
  }

  _editExercise() {
    this.close();
    const form = new ExerciseForm(this.exercise, this.store);
    form.open();
  }

  _deleteExercise() {
    if (confirm(`Удалить упражнение "${this.exercise.name}"?`)) {
      this.store.deleteExercise(this.exercise.id);
      this.close();
    }
  }
}

class ExerciseForm {
  constructor(exercise = null, store) {
    this.isEdit = !!exercise;
    this.exercise = exercise || {};
    this.store = store;
    this.formElement = this._createForm();
    this._setupEventListeners();
  }

  open() {
    document.body.appendChild(this.formElement);
    document.body.classList.add('modal-open');
  }

  close() {
    document.body.removeChild(this.formElement);
    document.body.classList.remove('modal-open');
  }

  _createForm() {
    const modal = dom.create('div', { class: 'modal' });
    const overlay = dom.create('div', { class: 'modal-overlay' });
    const content = dom.create('div', { class: 'modal-content' });
    
    const header = dom.create('div', { class: 'modal-header' }, [
      dom.create('h2', {}, [
        document.createTextNode(this.isEdit ? 'Редактировать упражнение' : 'Новое упражнение')
      ]),
      dom.create('button', { class: 'close-btn', 'aria-label': 'Закрыть' }, [
        dom.create('span', {}, [document.createTextNode('×')])
      ])
    ]);
    
    const form = dom.create('form', { class: 'exercise-form' });
    
    const nameField = this._createFormField('name', 'text', 'Название', this.exercise.name || '', true);
    const gifField = this._createFormField('gif', 'url', 'Ссылка на GIF', this.exercise.gif || '');
    const muscleGroupField = this._createSelectField('muscleGroup', 'Группа мышц', this.exercise.muscleGroup || '');
    const descriptionField = this._createTextareaField('description', 'Описание', this.exercise.description || '');
    
    const actions = dom.create('div', { class: 'form-actions' }, [
      dom.create('button', { 
        type: 'submit', 
        class: 'btn btn-primary'
      }, [document.createTextNode('Сохранить')]),
      dom.create('button', { 
        type: 'button',
        class: 'btn btn-secondary',
        'data-action': 'cancel'
      }, [document.createTextNode('Отмена')])
    ]);
    
    form.append(nameField, gifField, muscleGroupField, descriptionField, actions);
    content.append(header, form);
    modal.append(overlay, content);
    return modal;
  }

  _createFormField(name, type, label, value, required = false) {
    const field = dom.create('div', { class: 'form-field' });
    const labelEl = dom.create('label', { for: name }, [document.createTextNode(label)]);
    const input = dom.create('input', { 
      type,
      id: name,
      name,
      value,
      required
    });
    
    field.append(labelEl, input);
    return field;
  }

  _createSelectField(name, label, selectedValue) {
    const field = dom.create('div', { class: 'form-field' });
    const labelEl = dom.create('label', { for: name }, [document.createTextNode(label)]);
    const select = dom.create('select', { id: name, name });
    
    const emptyOption = dom.create('option', { value: '' }, [document.createTextNode('— Выберите группу —')]);
    select.appendChild(emptyOption);
    
    APP_CONFIG.MUSCLE_GROUPS.forEach(group => {
      const option = dom.create('option', { 
        value: group,
        selected: group === selectedValue
      }, [document.createTextNode(group)]);
      select.appendChild(option);
    });
    
    field.append(labelEl, select);
    return field;
  }

  _createTextareaField(name, label, value) {
    const field = dom.create('div', { class: 'form-field' });
    const labelEl = dom.create('label', { for: name }, [document.createTextNode(label)]);
    const textarea = dom.create('textarea', { 
      id: name,
      name,
      rows: 3
    }, [document.createTextNode(value)]);
    
    field.append(labelEl, textarea);
    return field;
  }

  _setupEventListeners() {
    dom.on(this.formElement.querySelector('.modal-overlay'), 'click', () => this.close());
    dom.on(this.formElement.querySelector('.close-btn'), 'click', () => this.close());
    dom.on(this.formElement.querySelector('[data-action="cancel"]'), 'click', () => this.close());
    dom.on(this.formElement.querySelector('form'), 'submit', (e) => {
      e.preventDefault();
      this._submitForm();
    });
  }

  _submitForm() {
    const formData = new FormData(this.formElement.querySelector('form'));
    const exerciseData = {
      name: formData.get('name'),
      gif: formData.get('gif'),
      muscleGroup: formData.get('muscleGroup'),
      description: formData.get('description')
    };
    
    if (this.isEdit) {
      this.store.updateExercise(this.exercise.id, exerciseData);
    } else {
      this.store.addExercise(exerciseData);
    }
    
    this.close();
  }
}

// Инициализация приложения
class GymApp {
  constructor() {
    this.store = new GymStore();
    this._initUI();
    this._setupNavigation();
    this._setupServiceWorker();
  }

  _initUI() {
    // Инициализация компонентов для разных страниц
    if (dom.qs('#exercise-list')) {
      this.exerciseList = new ExerciseList(this.store);
    }
    
    // Инициализация темы
    this._applyTheme();
    
    // Кнопка добавления упражнения
    dom.on(dom.qs('#add-exercise-btn'), 'click', () => {
      const form = new ExerciseForm(null, this.store);
      form.open();
    });
  }

  _setupNavigation() {
    dom.qsa('.nav-item').forEach(btn => {
      dom.on(btn, 'click', () => {
        dom.qsa('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._showView(btn.dataset.view);
      });
    });
    
    // Боковое меню
    dom.on(dom.qs('#openSidebar'), 'click', () => this._toggleSidebar(true));
    dom.on(dom.qs('#closeSidebar'), 'click', () => this._toggleSidebar(false));
    dom.on(dom.qs('#closeSidebarDim'), 'click', () => this._toggleSidebar(false));
  }

  _showView(name) {
    dom.qsa('.view').forEach(v => v.classList.add('hidden'));
    const el = dom.qs(`#view-${name}`);
    if (el) el.classList.remove('hidden');
    this._toggleSidebar(false);
  }

  _toggleSidebar(open) {
    dom.qs('#sidebar').classList.toggle('open', open);
    dom.qs('#closeSidebarDim').classList.toggle('open', open);
  }

  _applyTheme() {
    const theme = this.store.state.settings.theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark-theme', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    }
  }

  _setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(
          registration => console.log('ServiceWorker registration successful'),
          err => console.log('ServiceWorker registration failed: ', err)
        );
      });
    }
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  const app = new GymApp();
  window.gymApp = app; // Для доступа из консоли при необходимости
});

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Создаем экземпляр хранилища
  const store = new GymStore();
  
  // Инициализируем компоненты
  new ExerciseList(store);
  
  
  
  // Настройка навигации
  const navItems = dom.qsa('.nav-item');
  navItems.forEach(item => {
    dom.on(item, 'click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const view = item.dataset.view;
      dom.qs('#view-title').textContent = item.querySelector('span').textContent;
      dom.qsa('.view').forEach(v => v.classList.add('hidden'));
      dom.qs(`#view-${view}`).classList.remove('hidden');
    });
  });
  
  // Боковое меню
  dom.on(dom.qs('#openSidebar'), 'click', () => {
    dom.qs('#sidebar').setAttribute('aria-hidden', 'false');
  });
  
  dom.on(dom.qs('#closeSidebar'), 'click', () => {
    dom.qs('#sidebar').setAttribute('aria-hidden', 'true');
  });
  
  dom.on(dom.qs('#closeSidebarDim'), 'click', () => {
    dom.qs('#sidebar').setAttribute('aria-hidden', 'true');
  });
  
  // Переключение темы
  dom.on(dom.qs('#themeToggle'), 'click', () => {
    const currentTheme = store.state.settings.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    store.saveState({
      ...store.state,
      settings: {
        ...store.state.settings,
        theme: newTheme
      }
    });
    document.documentElement.classList.toggle('dark-theme', newTheme === 'dark');
  });
});