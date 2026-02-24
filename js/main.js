document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('[data-js-burger-btn]');
  const burgerOverlay = document.querySelector('[data-js-burger-overlay]');
  const burgerMenu = document.querySelector('[data-js-burger-menu]');
  
  function burgerToggle() {
    burgerBtn.classList.toggle('_active');
    burgerMenu.classList.toggle('_active');
    burgerOverlay.classList.toggle('_active');
    document.body.classList.toggle('no-scroll');
  }
  function burgerOpen() {
    burgerBtn.classList.add('_active');
    burgerMenu.classList.add('_active');
    burgerOverlay.classList.add('_active');
    document.body.classList.add('no-scroll');
  }
  function burgerClose() {
    burgerBtn.classList.remove('_active');
    burgerMenu.classList.remove('_active');
    burgerOverlay.classList.remove('_active');
    document.body.classList.remove('no-scroll');
  }
  
  burgerBtn.addEventListener('click', () => {
    burgerToggle();
  });
  burgerOverlay.addEventListener('click', () => {
    burgerClose();
  });
  window.addEventListener('resize', () => {
    // не забыть поменять значение в стилях
    if (window.innerWidth > 768) {
      burgerClose();
    }
  });
  
  if (document.querySelector('[data-js-notification-popup]')) {
    const notificationPopup = document.querySelector('[data-js-notification-popup]');
    const notificationBtn = document.querySelector('[data-js-notification-btn]');
    const notificationPopupClose = document.querySelector('[data-js-notification-popup-close]');
  
    notificationBtn.addEventListener('click', () => {
      notificationBtn.classList.toggle('is-active');
    });
  
    notificationPopupClose.addEventListener('click', () => {
      notificationBtn.classList.remove('is-active');
    });
  
    document.addEventListener('click', (e) => {
      if (!notificationPopup.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationBtn.classList.remove('is-active');
      }
    });
  }
  
  if (document.querySelector('textarea')) {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      textarea.addEventListener('input', () => autoGrow(textarea));
    });
    function autoGrow(element) {
      element.style.height = '24px'; // Сброс для корректного расчета
      element.style.height = element.scrollHeight + 'px'; // Установка новой высоты [1]
    }
  }
  
  if (document.querySelector('.dropdown-multiple')) {
    class MultiSelect {
      constructor(element) {
        this.element = element;
        this.trigger = element.querySelector('.dropdown-multiple__trigger');
        this.list = element.querySelector('.dropdown-multiple__list');
        this.items = element.querySelectorAll('.dropdown-multiple__list-item');
        this.tagsContainer = element.querySelector('.dropdown-multiple__tags');
        this.placeholderText = element.querySelector('.dropdown-multiple__placeholder');
        this.iconWrapper = element.querySelector('.dropdown-multiple__trigger-icon');
        this.isOpen = false;
        this.selectedValues = [];
        this.hiddenInput = element.querySelector('.dropdown-multiple__input-hidden');
        this.focusedIndex = -1;
        this.dropdownName = element.getAttribute('data-name') || 'dropdown-multiple';
        this.resizeObserverAdded = false;
  
        this.init();
      }
  
      init() {
        this.attachEventListeners();
        this.initSelectedItems();
        this.updateDisplay();
      }
  
      initSelectedItems() {
        // Ищем все элементы с атрибутом data-selected
        const selectedItems = Array.from(this.items).filter((item) => item.hasAttribute('data-selected'));
  
        selectedItems.forEach((item) => {
          if (!item.hasAttribute('disabled')) {
            const value = item.dataset.value;
            const label = item.querySelector('.dropdown-multiple__label')?.textContent || value;
            const checkbox = item.querySelector('.dropdown-multiple__checkbox');
  
            // Добавляем в selectedValues только если еще нет
            if (!this.selectedValues.find((v) => v.value === value)) {
              this.selectedValues.push({ value, label });
            }
  
            // Обновляем UI элемента
            checkbox.classList.add('dropdown-multiple__checkbox--checked');
            item.classList.add('dropdown-multiple__list-item--selected');
          }
        });
      }
  
      attachEventListeners() {
        // Открытие/закрытие списка
        this.trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleList();
        });
  
        // Клавиатурная навигация на триггере
        this.trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!this.isOpen) {
              this.openList();
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!this.isOpen) {
              this.openList();
            }
            this.focusNextItem(this.focusedIndex);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!this.isOpen) {
              this.openList();
            }
            this.focusPrevItem(this.focusedIndex);
          }
        });
  
        // Клики по элементам списка
        this.items.forEach((item, index) => {
          const checkbox = item.querySelector('.dropdown-multiple__checkbox');
          const label = item.querySelector('.dropdown-multiple__label');
  
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!item.hasAttribute('disabled')) {
              this.toggleItem(item, checkbox);
            }
          });
  
          checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!item.hasAttribute('disabled')) {
              this.toggleItem(item, checkbox);
            }
          });
  
          label.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!item.hasAttribute('disabled')) {
              this.toggleItem(item, checkbox);
            }
          });
  
          // Навигация внутри списка
          item.addEventListener('keydown', (e) => {
            if (item.hasAttribute('disabled')) return;
  
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const checkbox = item.querySelector('.dropdown-multiple__checkbox');
              this.toggleItem(item, checkbox);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              this.focusNextItem(index);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              this.focusPrevItem(index);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              this.closeList();
              this.trigger.focus();
            } else if (e.key === 'Tab') {
              e.preventDefault();
              if (e.shiftKey) {
                this.focusPrevItem(index);
              } else {
                this.focusNextItem(index);
              }
            }
          });
  
          item.addEventListener('mouseenter', () => {
            if (!item.hasAttribute('disabled')) {
              this.focusedIndex = index;
              this.updateFocusStyle();
            }
          });
        });
  
        // Закрытие при клике снаружи
        document.addEventListener('click', (e) => {
          if (!this.element.contains(e.target)) {
            this.closeList();
          }
        });
  
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            if (this.isOpen) {
              e.stopPropagation();
              this.closeList();
              this.trigger.focus();
            }
          }
        });
      }
  
      toggleList() {
        if (this.isOpen) {
          this.closeList();
        } else {
          this.openList();
          this.focusedIndex = -1;
        }
      }
  
      openList() {
        this.isOpen = true;
        this.focusedIndex = -1;
        this.list.classList.add('dropdown-multiple__list--visible');
        this.trigger.classList.add('dropdown-multiple__trigger--active');
        this.iconWrapper?.classList.add('dropdown-multiple__trigger-icon--open');
  
        // Ищем первый доступный элемент (не disabled)
        let firstAvailableIndex = this.selected
          ? Array.from(this.items).findIndex((i) => i.dataset.value === this.selected.value)
          : 0;
        // Если выбранный элемент disabled, ищем первый доступный
        if (firstAvailableIndex >= 0 && this.items[firstAvailableIndex]?.hasAttribute('disabled')) {
          firstAvailableIndex = Array.from(this.items).findIndex((item) => !item.hasAttribute('disabled'));
        }
  
        // Если стартовый индекс все еще не найден, ищем первый доступный
        if (firstAvailableIndex < 0) {
          firstAvailableIndex = Array.from(this.items).findIndex((item) => !item.hasAttribute('disabled'));
        }
  
        if (firstAvailableIndex >= 0) {
          this.focusedIndex = firstAvailableIndex;
          this.updateFocusStyle();
        }
      }
  
      closeList() {
        this.isOpen = false;
        this.focusedIndex = -1;
        this.list.classList.remove('dropdown-multiple__list--visible');
        this.trigger.classList.remove('dropdown-multiple__trigger--active');
        this.iconWrapper?.classList.remove('dropdown-multiple__trigger-icon--open');
        this.updateFocusStyle();
      }
  
      focusItem(index) {
        // Циклическая навигация
        if (index < 0) {
          this.focusedIndex = this.items.length - 1;
        } else if (index >= this.items.length) {
          this.focusedIndex = 0;
        } else {
          this.focusedIndex = index;
        }
  
        // Пропускаем disabled элементы
        let attempts = 0;
        while (this.items[this.focusedIndex]?.hasAttribute('disabled') && attempts < this.items.length) {
          this.focusedIndex++;
          if (this.focusedIndex >= this.items.length) {
            this.focusedIndex = 0;
          }
          attempts++;
        }
  
        this.updateFocusStyle();
      }
  
      focusNextItem(currentIndex) {
        let nextIndex = currentIndex + 1;
        let attempts = 0;
  
        while (attempts < this.items.length) {
          if (nextIndex >= this.items.length) {
            nextIndex = 0;
          }
          if (!this.items[nextIndex].hasAttribute('disabled')) {
            this.focusedIndex = nextIndex;
            this.updateFocusStyle();
            return;
          }
          nextIndex++;
          attempts++;
        }
      }
  
      focusPrevItem(currentIndex) {
        let prevIndex = currentIndex - 1;
        let attempts = 0;
  
        while (attempts < this.items.length) {
          if (prevIndex < 0) {
            prevIndex = this.items.length - 1;
          }
          if (!this.items[prevIndex].hasAttribute('disabled')) {
            this.focusedIndex = prevIndex;
            this.updateFocusStyle();
            return;
          }
          prevIndex--;
          attempts++;
        }
      }
  
      updateFocusStyle() {
        this.items.forEach((item, index) => {
          if (index === this.focusedIndex) {
            item.focus();
            item.setAttribute('tabindex', '0');
          } else {
            item.setAttribute('tabindex', '-1');
          }
        });
      }
  
      toggleItem(item, checkbox) {
        // Не позволяем выбирать disabled элементы
        if (item.hasAttribute('disabled')) {
          return;
        }
  
        const value = item.dataset.value;
        const label = item.querySelector('.dropdown-multiple__label')?.textContent || value;
  
        checkbox.classList.toggle('dropdown-multiple__checkbox--checked');
        item.classList.toggle('dropdown-multiple__list-item--selected');
  
        if (checkbox.classList.contains('dropdown-multiple__checkbox--checked')) {
          if (!this.selectedValues.find((v) => v.value === value)) {
            this.selectedValues.push({ value, label });
          }
        } else {
          this.selectedValues = this.selectedValues.filter((v) => v.value !== value);
        }
  
        this.updateDisplay();
        this.logSelectedValues();
      }
  
      removeTag(value) {
        const item = Array.from(this.items).find((i) => i.dataset.value === value);
        const checkbox = item?.querySelector('.dropdown-multiple__checkbox');
  
        if (checkbox) {
          checkbox.classList.remove('dropdown-multiple__checkbox--checked');
          item.classList.remove('dropdown-multiple__list-item--selected');
        }
  
        this.selectedValues = this.selectedValues.filter((v) => v.value !== value);
        this.updateDisplay();
        this.logSelectedValues();
      }
  
      logSelectedValues() {
        const logData = {
          dropdown: this.dropdownName,
          values: this.selectedValues.map((v) => v.value),
        };
  
        console.log(logData);
      }
  
      updateDisplay() {
        // Очищаем контейнер тегов
        this.tagsContainer.innerHTML = '';
  
        if (this.selectedValues.length === 0) {
          // Показываем плейсхолдер
          this.placeholderText.style.display = 'inline';
        } else {
          // Скрываем плейсхолдер
          this.placeholderText.style.display = 'none';
  
          // Добавляем теги
          this.selectedValues.forEach((item) => {
            const tag = document.createElement('div');
            tag.className = 'dropdown-multiple__tag';
            tag.innerHTML = `
              <span>${item.label}</span>
              <button class="dropdown-multiple__tag-close" type="button">
                <svg class="icon icon--close">
                  <use xlink:href="./images/sprite.svg#close"></use>
                </svg>
              </button>
            `;
  
            tag.addEventListener('click', (e) => {
              e.stopPropagation();
              this.removeTag(item.value);
            });
  
            this.tagsContainer.appendChild(tag);
          });
        }
  
        // Обновляем скрытый input
        if (this.hiddenInput) {
          this.hiddenInput.value = this.selectedValues.map((v) => v.value).join(',');
        }
  
        // Проверяем переполнение тегов
        this.handleTagsOverflow();
      }
  
      handleTagsOverflow() {
        const tags = Array.from(this.tagsContainer.querySelectorAll('.dropdown-multiple__tag'));
  
        if (tags.length === 0) return;
  
        // Показываем все теги сначала
        tags.forEach((tag) => {
          tag.style.display = '';
          tag.removeAttribute('data-hidden');
        });
  
        // Проверяем наличие счетчика
        let counter = this.tagsContainer.querySelector('.dropdown-multiple__counter');
        if (counter) counter.remove();
  
        const firstTagTop = tags[0].getBoundingClientRect().top;
        let hiddenCount = 0;
        let lastVisibleIndex = -1;
  
        // Определяем теги со второй строки и скрываем их
        tags.forEach((tag, index) => {
          const tagTop = tag.getBoundingClientRect().top;
  
          // Если тег на другой строке (ниже), скрываем его
          if (Math.abs(tagTop - firstTagTop) > 2) {
            tag.style.display = 'none';
            tag.setAttribute('data-hidden', 'true');
            hiddenCount++;
          } else {
            lastVisibleIndex = index;
          }
        });
  
        // Если есть скрытые теги, добавляем счетчик
        if (hiddenCount > 0) {
          const counterEl = document.createElement('div');
          counterEl.className = 'dropdown-multiple__counter';
          counterEl.textContent = `+${hiddenCount}`;
  
          // Вставляем счетчик после последнего видимого тега
          if (lastVisibleIndex >= 0) {
            tags[lastVisibleIndex].insertAdjacentElement('afterend', counterEl);
          } else {
            this.tagsContainer.appendChild(counterEl);
          }
  
          // Проверяем, что счетчик остался на первой строке
          // Если нет, убираем последний видимый тег и добавляем счетчик вместо него
          const counterTop = counterEl.getBoundingClientRect().top;
          if (Math.abs(counterTop - firstTagTop) > 2 && lastVisibleIndex >= 0) {
            // Счетчик перешел на вторую строку, скрываем последний видимый тег
            tags[lastVisibleIndex].style.display = 'none';
            tags[lastVisibleIndex].setAttribute('data-hidden', 'true');
            hiddenCount++;
            counterEl.textContent = `+${hiddenCount}`;
  
            // Перемещаем счетчик после нового последнего видимого тега
            counterEl.remove();
            if (lastVisibleIndex > 0) {
              tags[lastVisibleIndex - 1].insertAdjacentElement('afterend', counterEl);
            } else {
              this.tagsContainer.insertBefore(counterEl, this.tagsContainer.firstChild);
            }
          }
        }
  
        // Добавляем слушатель на resize
        if (!this.resizeObserverAdded) {
          this.resizeObserverAdded = true;
          const resizeObserver = new ResizeObserver(() => {
            this.handleTagsOverflow();
          });
          resizeObserver.observe(this.trigger);
        }
      }
    }
  
    // Инициализация всех dropdown-multiple на странице
    document.querySelectorAll('.dropdown-multiple').forEach((element) => {
      new MultiSelect(element);
    });
  }
  
  // Single-select custom dropdown (based on dropdown2 multi-select)
  if (document.querySelector('.dropdown-single')) {
    class SingleSelect {
      constructor(element) {
        this.element = element;
        this.trigger = element.querySelector('.dropdown-single__trigger');
        this.list = element.querySelector('.dropdown-single__list');
        this.items = element.querySelectorAll('.dropdown-single__list-item');
        this.valueDisplay = element.querySelector('.dropdown-single__value');
        this.placeholderDisplay = element.querySelector('.dropdown-single__placeholder');
        this.iconWrapper = element.querySelector('.dropdown-single__trigger-icon');
        this.isOpen = false;
        this.hiddenInput = element.querySelector('.dropdown-single__input-hidden');
        this.focusedIndex = -1;
        this.selected = null;
        this.dropdownName = element.getAttribute('data-name') || 'dropdown-single';
  
        this.init();
      }
  
      init() {
        this.attachEventListeners();
        this.initSelectedItem();
        this.updateDisplay();
      }
  
      initSelectedItem() {
        // Ищем элемент с атрибутом data-selected
        const selectedItem = Array.from(this.items).find((item) => item.hasAttribute('data-selected'));
  
        if (selectedItem && !selectedItem.hasAttribute('disabled')) {
          const value = selectedItem.dataset.value;
          const labelElement = selectedItem.querySelector('.dropdown-single__label');
          const label = labelElement?.textContent || value;
          const html = labelElement?.innerHTML || value;
  
          this.selected = { value, label, html };
          selectedItem.classList.add('dropdown-single__list-item--selected');
        }
      }
  
      attachEventListeners() {
        // Открытие/закрытие списка
        this.trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleList();
        });
  
        // Клавиатурная навигация на триггере
        this.trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!this.isOpen) {
              this.openList();
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!this.isOpen) {
              this.openList();
            }
            this.focusNextItem(this.focusedIndex);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!this.isOpen) {
              this.openList();
            }
            this.focusPrevItem(this.focusedIndex);
          }
        });
  
        // Клики по элементам списка
        this.items.forEach((item, index) => {
          const label = item.querySelector('.dropdown-single__label');
  
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!item.hasAttribute('disabled')) {
              this.selectItem(item);
            }
          });
  
          label?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!item.hasAttribute('disabled')) {
              this.selectItem(item);
            }
          });
  
          // Навигация внутри списка
          item.addEventListener('keydown', (e) => {
            if (item.hasAttribute('disabled')) return;
  
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.selectItem(item);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              this.focusNextItem(index);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              this.focusPrevItem(index);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              this.closeList();
              this.trigger.focus();
            } else if (e.key === 'Tab') {
              e.preventDefault();
              if (e.shiftKey) {
                this.focusPrevItem(index);
              } else {
                this.focusNextItem(index);
              }
            }
          });
  
          item.addEventListener('mouseenter', () => {
            if (!item.hasAttribute('disabled')) {
              this.focusedIndex = index;
              this.updateFocusStyle();
            }
          });
        });
  
        // Закрытие при клике снаружи
        document.addEventListener('click', (e) => {
          if (!this.element.contains(e.target)) {
            this.closeList();
          }
        });
  
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            if (this.isOpen) {
              e.stopPropagation();
              this.closeList();
              this.trigger.focus();
            }
          }
        });
      }
  
      toggleList() {
        if (this.isOpen) {
          this.closeList();
        } else {
          this.openList();
        }
      }
  
      openList() {
        this.isOpen = true;
        this.list.classList.add('dropdown-single__list--visible');
        this.trigger.classList.add('dropdown-single__trigger--active');
        this.iconWrapper?.classList.add('dropdown-single__trigger-icon--open');
  
        // установка фокуса на выбранный элемент или первый доступный
        let startIndex = this.selected ? Array.from(this.items).findIndex((i) => i.dataset.value === this.selected.value) : 0;
  
        // Если выбранный элемент disabled, ищем первый доступный
        if (startIndex >= 0 && this.items[startIndex]?.hasAttribute('disabled')) {
          startIndex = Array.from(this.items).findIndex((item) => !item.hasAttribute('disabled'));
        }
  
        // Если стартовый индекс все еще не найден, ищем первый доступный
        if (startIndex < 0) {
          startIndex = Array.from(this.items).findIndex((item) => !item.hasAttribute('disabled'));
        }
  
        if (startIndex >= 0) {
          this.focusedIndex = startIndex;
          this.updateFocusStyle();
        }
      }
  
      closeList() {
        this.isOpen = false;
        this.focusedIndex = -1;
        this.list.classList.remove('dropdown-single__list--visible');
        this.trigger.classList.remove('dropdown-single__trigger--active');
        this.iconWrapper?.classList.remove('dropdown-single__trigger-icon--open');
        this.updateFocusStyle();
      }
  
      focusItem(index) {
        // Циклическая навигация
        if (index < 0) {
          this.focusedIndex = this.items.length - 1;
        } else if (index >= this.items.length) {
          this.focusedIndex = 0;
        } else {
          this.focusedIndex = index;
        }
  
        // Пропускаем disabled элементы
        let attempts = 0;
        while (this.items[this.focusedIndex]?.hasAttribute('disabled') && attempts < this.items.length) {
          this.focusedIndex++;
          if (this.focusedIndex >= this.items.length) {
            this.focusedIndex = 0;
          }
          attempts++;
        }
  
        this.updateFocusStyle();
      }
  
      focusNextItem(currentIndex) {
        let nextIndex = currentIndex + 1;
        let attempts = 0;
  
        while (attempts < this.items.length) {
          if (nextIndex >= this.items.length) {
            nextIndex = 0;
          }
          if (!this.items[nextIndex].hasAttribute('disabled')) {
            this.focusedIndex = nextIndex;
            this.updateFocusStyle();
            return;
          }
          nextIndex++;
          attempts++;
        }
      }
  
      focusPrevItem(currentIndex) {
        let prevIndex = currentIndex - 1;
        let attempts = 0;
  
        while (attempts < this.items.length) {
          if (prevIndex < 0) {
            prevIndex = this.items.length - 1;
          }
          if (!this.items[prevIndex].hasAttribute('disabled')) {
            this.focusedIndex = prevIndex;
            this.updateFocusStyle();
            return;
          }
          prevIndex--;
          attempts++;
        }
      }
  
      updateFocusStyle() {
        this.items.forEach((item, index) => {
          if (index === this.focusedIndex) {
            item.focus();
            item.setAttribute('tabindex', '0');
          } else {
            item.setAttribute('tabindex', '-1');
          }
        });
      }
  
      selectItem(item) {
        // Не позволяем выбирать disabled элементы
        if (item.hasAttribute('disabled')) {
          return;
        }
  
        const value = item.dataset.value;
        const labelElement = item.querySelector('.dropdown-single__label');
        const label = labelElement?.textContent || value;
        const html = labelElement?.innerHTML || value;
  
        // очищаем предыдущее выделение
        this.items.forEach((it) => it.classList.remove('dropdown-single__list-item--selected'));
        item.classList.add('dropdown-single__list-item--selected');
  
        this.selected = { value, label, html };
  
        // Обновляем отображение
        this.updateDisplay();
        this.logSelectedValue();
        this.closeList();
        this.trigger.focus();
      }
  
      updateDisplay() {
        if (this.selected) {
          // Показываем выбранное значение, скрываем placeholder
          this.placeholderDisplay.style.display = 'none';
          this.valueDisplay.style.display = 'inline-flex';
          this.valueDisplay.innerHTML = this.selected.html;
        } else {
          // Показываем placeholder, скрываем значение
          this.placeholderDisplay.style.display = 'inline';
          this.valueDisplay.style.display = 'none';
        }
  
        if (this.hiddenInput) {
          this.hiddenInput.value = this.selected ? this.selected.value : '';
        }
      }
  
      logSelectedValue() {
        const logData = {
          dropdown: this.dropdownName,
          selected: this.selected,
        };
  
        console.log(logData);
      }
    }
  
    // Инициализация всех dropdown-single на странице
    document.querySelectorAll('.dropdown-single').forEach((element) => {
      new SingleSelect(element);
    });
  }
  
  class InputFromTo {
    constructor(container) {
      this.container = container;
      this.name = container.dataset.name || 'unknown';
  
      this.fields = container.querySelectorAll('.input-fromto__field');
      this.inputs = container.querySelectorAll('.input-fromto__input');
      this.minusBtns = container.querySelectorAll('.input-fromto__btn--minus');
      this.plusBtns = container.querySelectorAll('.input-fromto__btn--plus');
  
      this.init();
    }
  
    init() {
      this.attachMinusButtonListeners();
      this.attachPlusButtonListeners();
      this.attachInputListeners();
      this.attachKeydownListeners();
      this.attachVisibilityListeners();
    }
  
    getValues() {
      const fromValue = this.inputs[0].value.trim();
      const toValue = this.inputs[1].value.trim();
  
      return {
        [this.name]: {
          from: fromValue ? parseInt(fromValue) : null,
          to: toValue ? parseInt(toValue) : null,
        },
      };
    }
  
    logValues() {
      const data = this.getValues();
      console.log(data);
    }
  
    validateRange() {
      const fromValue = parseInt(this.inputs[0].value) || 0;
      const toValue = parseInt(this.inputs[1].value) || 0;
  
      // Если оба поля заполнены и "до" меньше "от", корректируем "до"
      if (this.inputs[0].value.trim() && this.inputs[1].value.trim() && toValue < fromValue) {
        this.inputs[1].value = fromValue;
      }
    }
  
    attachMinusButtonListeners() {
      this.minusBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const input = this.inputs[index];
          const currentValue = parseInt(input.value) || 0;
          const min = parseInt(input.min) || 0;
  
          let actualMin = min;
          if (index === 1) {
            const fromValue = parseInt(this.inputs[0].value) || 0;
            actualMin = Math.max(min, fromValue);
          }
  
          if (currentValue > actualMin) {
            input.value = currentValue - 1;
            this.validateRange();
            this.logValues();
          }
        });
      });
    }
  
    attachPlusButtonListeners() {
      this.plusBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const input = this.inputs[index];
          const currentValue = parseInt(input.value) || 0;
          const max = parseInt(input.max) || 100;
  
          if (currentValue < max) {
            input.value = currentValue + 1;
            this.validateRange();
            this.logValues();
          }
        });
      });
    }
  
    attachInputListeners() {
      this.inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
          let value = parseInt(input.value);
          const min = parseInt(input.min) || 0;
          const max = parseInt(input.max) || 100;
  
          if (isNaN(value)) {
            input.value = '';
            this.validateRange();
            this.logValues();
            return;
          }
  
          let actualMin = min;
          if (index === 1) {
            const fromValue = parseInt(this.inputs[0].value) || 0;
            actualMin = Math.max(min, fromValue);
          }
  
          if (value > max) {
            input.value = max;
          } else if (value < actualMin) {
            input.value = actualMin;
          }
  
          this.validateRange();
          this.logValues();
        });
      });
    }
  
    attachKeydownListeners() {
      this.inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            const currentValue = parseInt(input.value) || 0;
            const max = parseInt(input.max) || 100;
  
            if (currentValue < max) {
              input.value = currentValue + 1;
              this.validateRange();
              this.logValues();
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const currentValue = parseInt(input.value) || 0;
            const min = parseInt(input.min) || 0;
  
            let actualMin = min;
            if (index === 1) {
              const fromValue = parseInt(this.inputs[0].value) || 0;
              actualMin = Math.max(min, fromValue);
            }
  
            if (currentValue > actualMin) {
              input.value = currentValue - 1;
              this.validateRange();
              this.logValues();
            }
          }
        });
      });
    }
  
    attachVisibilityListeners() {
      this.fields.forEach((field) => {
        const input = field.querySelector('.input-fromto__input');
  
        field.addEventListener('mouseenter', () => {
          field.classList.add('input-fromto__field--active');
        });
  
        field.addEventListener('mouseleave', () => {
          if (input !== document.activeElement) {
            field.classList.remove('input-fromto__field--active');
          }
        });
  
        input.addEventListener('focus', () => {
          field.classList.add('input-fromto__field--active');
        });
  
        input.addEventListener('blur', () => {
          if (!field.matches(':hover')) {
            field.classList.remove('input-fromto__field--active');
          }
        });
      });
    }
  }
  
  // Инициализация
  if (document.querySelector('.input-fromto')) {
    document.querySelectorAll('.input-fromto').forEach((container) => {
      new InputFromTo(container);
    });
  }
  
  if (document.querySelector('[data-js-filter-more-actions]')) {
    const filterMoreShow = document.querySelector('[data-js-filter-more-show]');
    const filterMoreActions = document.querySelector('[data-js-filter-more-actions]');
    const filterMoreHide = document.querySelector('[data-js-filter-more-hide]');
    const filterMoreClear = document.querySelector('[data-js-filter-clear]');
    const filterMoreContainer = document.querySelector('[data-js-filter-more-container]');
  
    filterMoreShow.addEventListener('click', () => {
      filterMoreShow.classList.add('_hide');
      filterMoreActions.classList.add('_show');
      filterMoreContainer.classList.add('_show');
    });
    filterMoreHide.addEventListener('click', () => {
      filterMoreShow.classList.remove('_hide');
      filterMoreActions.classList.remove('_show');
      filterMoreContainer.classList.remove('_show');
    });
  }
  
  if (document.querySelector('[data-js-tab]')) {
    const tabs = document.querySelectorAll('[data-js-tab]');
  
    tabs.forEach((tab) => {
      const tabBtns = tab.querySelectorAll('[data-js-tab-btn]');
      const tabItems = tab.querySelectorAll('[data-js-tab-item]');
      tabBtns.forEach((btn) => {
        tabClick(btn, tabBtns, tabItems);
      });
    });
  
    function tabClick(item, btns, items) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        let currentBtn = item;
        let tabId = currentBtn.getAttribute('data-js-tab-path');
        let currentTabs = document.querySelectorAll(`[data-js-tab-path="${tabId}"]`);
  
        if (!currentBtn.hasAttribute('data-js-tab-active')) {
          btns.forEach((item) => item.removeAttribute('data-js-tab-active'));
          currentBtn.setAttribute('data-js-tab-active', '');
          items.forEach((item) => item.removeAttribute('data-js-tab-active'));
  
          currentTabs.forEach((item) => item.setAttribute('data-js-tab-active', ''));
        }
      });
    }
  }
  
  // Класс для управления модальным окном
  class Modal {
    constructor() {
      this.modal = document.querySelector('[data-js-modal]');
      if (!this.modal) return;
  
      this.overlay = this.modal.querySelector('[data-js-modal-overlay]');
      this.openButtons = document.querySelectorAll('[data-js-modal-open]');
      this.closeButtons = this.modal.querySelectorAll('[data-js-modal-close]');
      this.currentModal = null;
  
      this.init();
    }
  
    /**
     * Инициализация обработчиков событий
     */
    init() {
      this.attachOpenButtonListeners();
      this.attachCloseButtonListeners();
      this.attachOverlayListener();
      this.attachKeyboardListener();
    }
  
    /**
     * Открыть модальное окно по пути
     */
    open(path) {
      // Закрываем текущее модальное окно если оно открыто
      if (this.currentModal) {
        this.close();
      }
  
      // Находим модальное окно по пути
      const targetModal = this.modal.querySelector(`[data-js-modal-item][data-js-modal-path="${path}"]`);
  
      if (!targetModal) {
        console.warn(`Modal with path "${path}" not found`);
        return;
      }
  
      // Открываем модальное окно
      this.currentModal = targetModal;
      this.modal.classList.add('modal--open');
      targetModal.classList.add('modal__content--active');
  
      // Предотвращаем прокрутку страницы
      document.body.classList.add('no-scroll');
    }
  
    /**
     * Закрыть текущее модальное окно
     */
    close() {
      if (!this.currentModal) return;
  
      this.modal.classList.remove('modal--open');
      this.currentModal.classList.remove('modal__content--active');
      this.currentModal = null;
  
      // Восстанавливаем прокрутку страницы
      document.body.classList.remove('no-scroll');
    }
  
    /**
     * Присоединить обработчики для кнопок открытия
     */
    attachOpenButtonListeners() {
      this.openButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const path = button.getAttribute('data-js-modal-path');
          if (path) {
            this.open(path);
          }
        });
      });
    }
  
    /**
     * Присоединить обработчики для кнопок закрытия
     */
    attachCloseButtonListeners() {
      this.closeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
        });
      });
    }
  
    /**
     * Присоединить обработчик клика на оверлей
     */
    attachOverlayListener() {
      this.overlay?.addEventListener('click', () => {
        this.close();
      });
    }
  
    /**
     * Присоединить обработчик нажатия Escape
     */
    attachKeyboardListener() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.currentModal) {
          this.close();
        }
      });
    }
  }
  
  // Инициализация при загрузке страницы
  if (document.querySelector('[data-js-modal]')) {
    new Modal();
  }
  
  class InputEdit {
    constructor() {
      this.init();
    }
  
    init() {
      this.attachEventListeners();
    }
  
    attachEventListeners() {
      // Обработчик для кнопок
      document.addEventListener('click', (e) => {
        // Обработчик для кнопки "редактировать"
        if (e.target.closest('[data-js-edit-start]')) {
          const button = e.target.closest('[data-js-edit-start]');
          const groupName = button.dataset.jsEditStart;
          this.enableEditMode(groupName);
  
          document.querySelectorAll(`[data-js-edit-start-btns="${groupName}"]`).forEach((element) => {
            element.classList.add('hide');
          });
          document.querySelectorAll(`[data-js-edit-end-btns="${groupName}"]`).forEach((element) => {
            element.classList.remove('hide');
          });
        }
  
        // Обработчик для кнопки "сохранить"
        if (e.target.closest('[data-js-edit-end]')) {
          const button = e.target.closest('[data-js-edit-end]');
          const groupName = button.dataset.jsEditEnd;
          this.disableEditMode(groupName);
  
          document.querySelectorAll(`[data-js-edit-start-btns="${groupName}"]`).forEach((element) => {
            element.classList.remove('hide');
          });
          document.querySelectorAll(`[data-js-edit-end-btns="${groupName}"]`).forEach((element) => {
            element.classList.add('hide');
          });
        }
      });
    }
  
    enableEditMode(groupName) {
      const inputs = document.querySelectorAll(`[data-js-edit-input="${groupName}"]`);
      inputs.forEach((input) => {
        input.classList.remove('_no-active');
        input.removeAttribute('readonly');
      });
    }
  
    disableEditMode(groupName) {
      const inputs = document.querySelectorAll(`[data-js-edit-input="${groupName}"]`);
      inputs.forEach((input) => {
        input.classList.add('_no-active');
        input.setAttribute('readonly', '');
      });
    }
  }
  
  // Инициализация при готовности DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new InputEdit();
    });
  } else {
    new InputEdit();
  }
  
  if (document.querySelector('[data-js-toggler]')) {
    document.querySelectorAll('[data-js-toggler]').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const path = button.getAttribute('data-js-toggler');
        if (path && !e.target.closest('[data-js-toggler]').classList.contains('_active')) {
          const items = document.querySelectorAll(`[data-js-toggler="${path}"]`);
          items.forEach((item) => {
            item.classList.remove('_active');
          });
          e.target.closest('[data-js-toggler]').classList.add('_active');
          console.log('changed');
        }
      });
    });
  }
  
  if (document.querySelector('.accardion')) {
    const accBodys = document.querySelectorAll('.accardion-body');
  
    document.querySelectorAll('.accardion-head').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (!e.target.closest('.btn')) {
          let content = el.nextElementSibling;
  
          if (content.style.maxHeight) {
            accBodys.forEach((el) => (el.style.maxHeight = null));
            accBodys.forEach((el) => el.closest('.accardion-item').classList.remove('accardion-show'));
          } else {
            accBodys.forEach((el) => (el.style.maxHeight = null));
            accBodys.forEach((el) => el.closest('.accardion-item').classList.remove('accardion-show'));
            content.style.maxHeight = `${content.scrollHeight}px`;
            el.closest('.accardion-item').classList.add('accardion-show');
          }
        }
      });
    });
  }
  
  const chartGraph = document.getElementById('myChartGraph');
  const chartDonut = document.getElementById('myChartDonut');
  
  if (chartGraph) {
    new Chart(chartGraph, {
      type: 'line',
      data: {
        labels: ['1 неделя', '2 неделя', '3 неделя', '4 неделя'],
        datasets: [
          {
            label: 'Обработано фильмов',
            data: [45, 52, 37, 50],
            borderColor: '#005bff',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.3,
            pointRadius: 6,
            pointBackgroundColor: '#005bff',
            pointBorderColor: '#005bff',
            pointBorderWidth: 0,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            titleColor: '#3A3F45',
            bodyColor: '#005bff',
            borderColor: '#C8CDD2',
            borderWidth: 1,
            padding: 8,
            titleFontSize: 12,
            titleFont: { weight: 'regular' },
            bodyFontSize: 14,
            bodyFont: { weight: 'bold' },
            displayColors: false,
            caretSize: 0,
            caretPadding: 12,
            yAlign: 'top',
            callbacks: {
              title: function (context) {
                return context[0].label;
              },
              label: function (context) {
                const index = context.dataIndex;
                const processedValues = [45, 52, 37, 50];
                return 'обработано: ' + processedValues[index];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 60,
            grid: {
              color: '#C8CDD2',
            },
            border: {
              dash: [8, 8],
            },
            ticks: {
              stepSize: 15,
            },
          },
          x: {
            grid: {
              color: '#C8CDD2',
            },
            border: {
              dash: [8, 8],
            },
          },
        },
      },
    });
  }
  
  if (chartDonut) {
    const donutData = [23, 12, 15, 56, 8];
    const total = donutData.reduce((a, b) => a + b, 0);
    const legendsContainer = document.querySelector('.chart-donut__legends');
  
    const donutChart = new Chart(chartDonut, {
      type: 'doughnut',
      data: {
        labels: ['В работе', 'На проверке', 'На доработке', 'Готовы к публикации', 'Отклоненные'],
        datasets: [
          {
            data: donutData,
            backgroundColor: ['#005BFF', '#00A2FF', '#FFA800', '#10C44C', '#F53C14'],
            borderWidth: 0,
            // spacing: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            titleColor: '#3A3F45',
            bodyColor: '#3A3F45',
            borderColor: '#C8CDD2',
            borderWidth: 1,
            padding: 10,
            titleFont: { weight: 'bold', size: 12 },
            bodyFont: { size: 12 },
            displayColors: false,
            caretPadding: 12,
            yAlign: 'top',
            callbacks: {
              title: function (context) {
                return context[0].label;
              },
              label: function (context) {
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  
    // Создание кастомной легенды
    if (legendsContainer) {
      legendsContainer.innerHTML = '';
      const labels = donutChart.data.labels;
      const colors = donutChart.data.datasets[0].backgroundColor;
  
      labels.forEach((label, index) => {
        const value = donutData[index];
        const percentage = ((value / total) * 100).toFixed(0);
  
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
  
        const colorDot = document.createElement('span');
        colorDot.className = 'legend-dot';
        colorDot.style.backgroundColor = colors[index];
  
        const labelText = document.createElement('span');
        labelText.textContent = `${label} (${value})`;
  
        const percentageText = document.createElement('span');
        percentageText.textContent = `${percentage}%`;
  
        legendItem.appendChild(colorDot);
        legendItem.appendChild(labelText);
        // legendItem.appendChild(percentageText);
  
        legendsContainer.appendChild(legendItem);
      });
    }
  }
  
  if (document.querySelector('.field__btn-toggle-password')) {
    const toggleButtons = document.querySelectorAll('.field__btn-toggle-password');
  
    toggleButtons.forEach((button) => {
      const passwordInput = button.closest('.field__input-password')?.querySelector('input[type="password"]');
  
      if (!passwordInput) return;
  
      const updateButtonIcon = () => {
        const icon = button.querySelector('.icon');
        const use = icon?.querySelector('use');
  
        if (passwordInput.type === 'password') {
          use?.setAttribute('xlink:href', './images/sprite.svg#view-off');
          button.setAttribute('aria-label', 'Показать пароль');
        } else {
          use?.setAttribute('xlink:href', './images/sprite.svg#view');
          button.setAttribute('aria-label', 'Скрыть пароль');
        }
      };
  
      button.addEventListener('click', (e) => {
        e.preventDefault();
  
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
        } else {
          passwordInput.type = 'password';
        }
  
        updateButtonIcon();
        passwordInput.focus();
      });
  
      // applyPasswordStyling();
      updateButtonIcon();
    });
  }
  
});
