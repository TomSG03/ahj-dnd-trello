export default class Trello {
  constructor(dom, topic) {
    this.dom = dom;
    this.topic = topic;
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
    // this.dom.addEventListener('mouseover', (e) => {
    //   if (e.target.classList.contains('list-item') || e.target.classList.contains('btn-del')) {
    //     const del = document.createElement('div');
    //     del.className = 'btn-del';
    //     e.target.append(del);
    //   }
    // });
    // this.dom.addEventListener('mouseout', (e) => {
    //   if (e.target.classList.contains('list-item')) {
    //     e.target.querySelector('.btn-del').remove();
    //   }
    // });
    this.dom.addEventListener('click', (e) => {
      console.log(e.target.className);
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
      if (e.target.className === 'btn-del') {
        console.log('ok');
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
