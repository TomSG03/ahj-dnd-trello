export default class Trello {
  constructor(dom, topic) {
    this.dom = dom;
    this.topic = topic;
    this.dragItem = null;
    this.target = null;
  }

  init(arrExample) {
    if (localStorage.getItem('trello') === null) {
      this.storage = arrExample;
    } else {
      this.storage = JSON.parse(localStorage.getItem('trello'));
    }
  }

  colsFill() {
    for (let i = 0; i < this.topic.length; i += 1) {
      const list = document.createElement('div');
      list.className = 'list-block';
      list.innerHTML = `<h4>${this.topic[i]}</h3>`;
      list.append(this.colFill(this.topic[i], i));
      list.append(this.addRec());
      this.dom.append(list);
    }
  }

  colFill(arrBlock, col) {
    const ul = document.createElement('ul');
    for (let i = 0; i < this.storage[col].length; i += 1) {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.textContent = this.storage[col][i];
      const del = document.createElement('div');
      del.className = 'btn-del';
      del.textContent = '✖';
      li.append(del);
      ul.append(li);
    }
    return ul;
  }

  // eslint-disable-next-line class-methods-use-this
  addRec() {
    const ftr = document.createElement('div');
    ftr.textContent = '+ Новая запись';
    ftr.className = 'addRec';
    return ftr;
  }

  display() {
    this.colsFill();
    this.createCap();

    this.dom.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('btn-del')) { return; }
      const target = e.target.closest('.list-item');
      if (!target) {
        return;
      }

      if (e.target.classList.contains('list-item')) {
        this.target = target;
        e.target.style.cursor = 'grabbing';
        // const source = document.elementFromPoint(e.clientX, e.clientY);
        // console.log(`H: ${source.offsetHeight} | W: ${source.offsetWidth} | Y: ${e.pageY - source.offsetTop} | X: ${e.pageX - source.offsetLeft}`);

        this.dragItem = this.target.cloneNode(true);
        this.dom.appendChild(this.dragItem);
        this.dragItem.style.top = `${e.pageY - this.target.offsetHeight / 2}px`;
        this.dragItem.style.left = `${e.pageX - this.target.offsetWidth / 2}px`;
        this.dragItem.style.width = `${this.target.offsetWidth}px`;
        this.dragItem.style.zIndex = '5000';
        this.dragItem.style.position = 'absolute';
        this.dragItem.style.opacity = '0.8';
        this.dragItem.style.pointerEvents = 'none';

        this.target.classList.add('selected');
      }
    });

    this.dom.addEventListener('mouseup', (e) => {
      if (!this.target) {
        return;
      }
      this.dom.style.cursor = 'default';
      this.dom.querySelector('.list-block').style.cursor = 'default';
      const insertItem = document.elementFromPoint(e.clientX, e.clientY);
      if (insertItem.classList.contains('list-item-cap')) {
        this.target.visibility = 'visible';
        this.cap.replaceWith(this.target);
      }

      if (this.cap) {
        this.cap.remove();
      }

      this.dragItem.remove();
      this.target.classList.remove('selected');
      this.dragItem = null;
      this.target = null;
    });

    this.dom.addEventListener('mouseout', (e) => {
      if (e.target.classList.contains('list-item')) {
        e.target.style.cursor = 'grab';
      }
    });

    this.dom.addEventListener('mousemove', (e) => {
      if (!this.target) {
        return;
      }
      e.target.style.cursor = 'grabbing';
      this.dragItem.style.left = `${e.pageX - this.dragItem.offsetWidth / 2}px`;
      this.dragItem.style.top = `${e.pageY - this.dragItem.offsetHeight / 2}px`;
      const insertItem = document.elementFromPoint(e.clientX, e.clientY);
      if (insertItem.classList.contains('list-item') && insertItem !== this.target && insertItem.previousSibling !== this.target && insertItem.nextSibling !== this.target) {
        const midlle = insertItem.offsetHeight / 2;
        const currentPos = e.pageY - insertItem.offsetTop;
        this.cap.style.height = `${this.dragItem.offsetHeight}px`;
        if (currentPos > midlle) {
          insertItem.insertAdjacentElement('afterEnd', this.cap);
        }
        if (currentPos < midlle) {
          insertItem.insertAdjacentElement('beforeBegin', this.cap);
        }
      }
      if (insertItem.classList.contains('addRec')) {
        insertItem.closest('.list-block').querySelector('ul').append(this.cap);
      }
    });

    this.dom.addEventListener('click', (e) => {
      // e.target.style.cursor = 'default';
      if (e.target.classList.contains('addRec')) {
        e.target.closest('.list-block').append(this.formAddRec());
        e.target.remove();
      }
      if (e.target.classList.contains('form-btn-cancel')) {
        e.target.closest('.list-block').append(this.addRec());
        e.target.closest('.formAddRec').remove();
      }
      if (e.target.classList.contains('form-btn-submit')) {
        e.preventDefault();
        const text = e.target.form.querySelector('textarea').value;
        if (text !== '') {
          const li = document.createElement('li');
          li.className = 'list-item';
          const del = document.createElement('div');
          del.className = 'btn-del';
          del.textContent = '✖';
          li.textContent = text;
          li.append(del);
          e.target.closest('.list-block').querySelector('ul').append(li);
          e.target.closest('.list-block').append(this.addRec());
          e.target.closest('.formAddRec').remove();
        }
      }
      if (e.target.classList.contains('btn-del')) {
        e.target.closest('.list-item').remove();
      }
    });
  }

  createCap() {
    this.cap = document.createElement('li');
    this.cap.className = 'list-item-cap';
  }

  // eslint-disable-next-line class-methods-use-this
  formAddRec() {
    const form = document.createElement('form');
    form.className = 'formAddRec';
    form.innerHTML = `
      <textarea placeholder="Новая запись..."></textarea>
      <input class="form-btn-submit" type="submit" value="Добавить"/>
      <div class="form-btn-cancel">✖</div>`;
    return form;
  }
}
