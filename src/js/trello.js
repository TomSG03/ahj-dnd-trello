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

    this.dom.addEventListener('mousedown', (e) => {
      e.target.style.cursor = 'grabbing';
      if (e.target.classList.contains('btn-del')) { return; }
      const target = e.target.closest('.list-item');
      if (!target) {
        return;
      }
      this.target = target;

      this.dragItem = this.target.cloneNode(true);
      this.dragItem.style.top = `${e.pageY - e.target.offsetHeight}px`;
      this.dragItem.style.left = `${e.pageX - e.target.offsetWidth}px`;
      this.dragItem.style.width = `${this.target.offsetWidth}px`;
      this.dragItem.style.zIndex = '5000';
      this.dragItem.style.position = 'absolute';
      this.dragItem.style.opacity = '0.8';
      this.dragItem.style.pointerEvents = 'none';
      this.dom.appendChild(this.dragItem);
      this.target.classList.add('selected');
    });

    this.dom.addEventListener('mouseup', (e) => {
      e.target.style.cursor = 'grab';
      if (!this.target) {
        return;
      }
      this.dragItem.style.display = 'none';
      const insertItem = document.elementFromPoint(e.clientX, e.clientY);
      if (insertItem.classList.contains('list-item')) {
        const midlle = insertItem.offsetHeight / 2;
        const currentPos = e.pageY - insertItem.offsetTop;
        if (currentPos > midlle) {
          insertItem.insertAdjacentElement('afterEnd', this.target);
        }
        if (currentPos < midlle) {
          insertItem.insertAdjacentElement('beforeBegin', this.target);
        }
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
      this.dragItem.style.left = `${e.pageX - this.dragItem.offsetWidth}px`;
      this.dragItem.style.top = `${e.pageY - this.dragItem.offsetHeight}px`;
      // const source = document.elementFromPoint(e.clientX, e.clientY);
      // if (source.classList.contains('list-item')) {
      //   const midlle = source.offsetHeight / 2;
      //   const currentPos = e.pageY - source.offsetTop;
      //   console.log(`Width: ${source.offsetHeight} | Y: ${e.pageY - source.offsetTop}`);
      // }
    });

    this.dom.addEventListener('click', (e) => {
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

  // eslint-disable-next-line class-methods-use-this
  formAddRec() {
    const form = document.createElement('form');
    form.className = 'formAddRec';
    form.innerHTML = `
      <textarea placeholder="Новая запись ..."></textarea>
      <input class="form-btn-submit" type="submit" value="Добавить"/>
      <button class="form-btn-cancel">Отмена</button>`;
    return form;
  }
}
