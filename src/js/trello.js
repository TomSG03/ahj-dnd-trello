export default class Trello {
  constructor(dom, topic) {
    this.dom = dom;
    this.topic = topic;
  }

  init() {
    if (localStorage.getItem('trello') !== null) {
      return false;
    }

    this.storage = JSON.parse(localStorage.getItem('trello'));
    return true;
  }

  fill(arrExample = []) {
    if (arrExample.length !== 0) {
      this.storage = arrExample;
    }

    for (let index = 0; index < this.topic.length; index += 1) {


    }
  }
}