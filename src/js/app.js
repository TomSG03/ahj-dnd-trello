import Trello from "./trello";

const topic = ['Нужно сделать', 'Делаю', 'Результат']

const example = [
  ['Встать пораньше', 'Забить пару гвоздей', 'Забить на все', 'Не опоздать на работу'],
  ['Бегу', 'Пью кофе', 'Еду', 'Делаю что могу'],
  ['Опять опоздал', 'Забил'],
];

const divTrello = document.querySelector('.trello');

const jsTrello = new Trello(divTrello, topic);

if (!jsTrello.init()) {
  jsTrello.fill(example);
} else jsTrello.fill();

jsTrello.display();