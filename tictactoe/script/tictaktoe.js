"use strict";

/**
 * Класс отрисовывает игровую доску 3 х 3
 *
 * @class Table
 */
class Table {
  constructor() {
    document.querySelector("body").innerHTML = `<table class="game"></table>`; // создаю таблицу
    this.board = document.querySelector(".game"); // присваиваю таблице класс game
    this.createTableBody();
  }

  /**
   * Метод заполняет таблицу ячейками 3 х 3. Каждой ячейке присваивается ее номер в ряду и в столбце
   *
   * @memberof Table
   */
  createTableBody() {
    for (let i = 0; i < 3; i++) {
      let tableRow = this.board.insertRow();
      for (let j = 0; j < 3; j++) {
        let tableColumn = tableRow.insertCell();
        tableColumn.dataset.row = i; // номер в ряду
        tableColumn.dataset.col = j; // номер в столбце
      }
    }
  }
}


/**
 * Класс игры
 *
 * @class Game
 */
class Game {
  constructor() {
    this.cells = document.querySelectorAll("td");
    this.addListenersToTDs();
    this.letter = "X";
  }

  /**
   * Метод вешает обработчики на каждую ячейку таблицы.
   * При клике вызывается метод @method clickedTD()
   *
   * @memberof Game
   */
  addListenersToTDs() {
    this.cells.forEach(td => td.addEventListener("click", this.clickedTD.bind(this)));
  }

  /**
   * Метод проверяет содержимое ячейки, по которой произошел клик. Если ячейка пустая
   * в нее записывается одна из игровых букв - Х или О. Затем вызывается @method letterChange()
   *
   * @memberof Game
   */
  clickedTD() {
    this.cellClicked = event.target;

    if (!this.cellClicked.innerText) {
      this.cellClicked.innerText = this.letter;
      this.letterChange();
    }
  }

  /**
   * Метод заменяет букву в переменой letter: если там Х, ставится О и наоборот
   *
   * @memberof Game
   */
  letterChange() {
    this.letter = this.letter === 'X' ? 'O' : 'X';
  }
}

/**
 * Класс проверяет, есть ли победитель и кто именно выиграл
 *
 * @class WinnerOrLoser
 */
class WinnerOrLoser {
  constructor() {
    document.querySelector(".game").addEventListener("click", this.fillBoard.bind(this));
    // обработчик на всю таблицу, который при каждом клике вызывает метод fillBoard

    this.boardArray = [
      /* массив для записи значений ячеек. в каждой ячейке записана цифра, чтобы избежать ложного
      срабатывания метода checkWinner, сравнивающего содержимое ячеек между собой */
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ]
  }


  /**
   * Метод читает содержимое, записанное в ячейку и сохраняет его в массив boardArray
   *
   * @memberof WinnerOrLoser
   */
  fillBoard() {
    this.rowNum = event.target.dataset.row; // номер ряда кликнутой ячейки
    this.rowCol = event.target.dataset.col; // номер колонки кликнутой ячейки
    this.boardArray[this.rowNum][this.rowCol] = event.target.innerText;
    // пишу содержимое ячейки в соответствующую ячейку массива
    this.checkWinner();
  }

  /**
   * Метод проверяет выигрышные комбинации
   *
   * @memberof WinnerOrLoser
   */
  checkWinner() {
    this.board7 = this.boardArray[0][0] + this.boardArray[1][1] + this.boardArray[2][2]; // диагональ справа налево
    this.board8 = this.boardArray[0][2] + this.boardArray[1][1] + this.boardArray[2][0]; //диагональ слева направо

      this.everyCell = ""; // строка для подсчета символов на игровом поле (для определения ничьей)
      for (let i = 0; i < this.boardArray.length; i++) {
        this["board" + i] = ""; // переменные для строк
        this["board" + (3 + i)] = ""; // переменные для столбцов
        for (let j = 0; j < this.boardArray.length; j++) {
          this["board" + i] += this.boardArray[i][j]; // записываю строки в переменные
          this["board" + (3 + i)] += this.boardArray[j][i]; // записываю столбцы в переменные
          this.everyCell += this.boardArray[i][j]; // записываю символы на игровом поле
        }
      }

      for (let i = 0; i < 8; i++) {
        if (this["board" + i] == "XXX") { // если в одной из переменных три крестика, выиграли крестики
          alert("Выиграли крестики!");
          this.noPointerEvents();
          this.playAgain();
        } else if (this["board" + i] == "OOO") { // если в одной из переменных три нолика, выиграли нолики
          alert("Выиграли нолики!");
          this.noPointerEvents();
          this.playAgain();
        }
      }

      if (this.everyCell.length == 9) { // если все поле занято и один if выше не сработал
        alert("Ничья!");
        this.noPointerEvents();
        this.playAgain();
      }
  }

  /**
   * Метод перезагружает страницу, чтобы заново начать игру
   *
   * @memberof WinnerOrLoser
   */
  playAgain() {
    if (confirm("Сыграем еще раз?")) {
      document.location.reload();
    }
  }

  /**
   * Метод запрещает события таблицы, чтобы игру нельзя было продолжить после выигрыша
   *
   * @memberof WinnerOrLoser
   */
  noPointerEvents() {
    document.querySelector(".game").style.pointerEvents = "none";
  }
}

window.addEventListener("load", () => {
  let boardGame = new Table();
  let listeners = new Game();
  let winser = new WinnerOrLoser();
});