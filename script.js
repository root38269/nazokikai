
"use strict;"

const div_tab_wrapper = document.getElementById("div_tab_wrapper");
const div_question_area = document.getElementById("div_question_area");
const div_message_area = document.getElementById("div_message_area");
const div_message_area2 = document.getElementById("div_message_area2");
const div_input_area = document.getElementById("div_input_area");
const div_tab_bar = document.getElementById("div_tab_bar");
const div_clear_back = document.getElementById("div_clear_back");
const div_clear_close_box = document.getElementById("div_clear_close_box");
const span_level_crear = document.getElementById("span_level_crear");
const div_share_normal = document.getElementById("div_share_normal");
const div_share_extra = document.getElementById("div_share_extra");


div_input_area.addEventListener("click", /**@param {MouseEvent} event */function (event) {
  if (event.target.classList.contains("input_button")) {
    input_str(safe_input_text(event.target.innerText));
  }
});
document.addEventListener("keydown", /**@param {KeyboardEvent} event */function (event) {
  if (event.target.tagName === "TEXTAREA") return;
  switch (event.key) {
    case "0": case "1": case "2": case "3": case "4": 
    case "5": case "6": case "7": case "8": case "9":
      document.getElementById("div_btn_" + event.key).click();
      break;
    case "Enter": case "e":
      document.getElementById("div_btn_E").click();
      break;
    case "Backspace": case "Delete": case "c":
      document.getElementById("div_btn_C").click();
      break;
    case "Tab":
      let my_new_tab = current_tab_number + 1;
      if (locked[my_new_tab - 1]) {
        my_new_tab = 1;
      }
      input_str("C");
      switch_tab(my_new_tab);
      event.preventDefault();
  }
});

div_tab_bar.addEventListener("click", /**@param {MouseEvent} event */function (event) {
  if (event.target.classList.contains("tab_tab") || event.target.classList.contains("tab_caption")){
    let new_tab_number = Number(event.target.id.slice(7));
    input_str("C");
    switch_tab(new_tab_number);
  }
})

div_clear_close_box.addEventListener("click", function (event) {
  div_clear_back.classList.remove("show");
});

const digits = 4;
/**@type {[HTMLDivElement]} */
const output_elems = [];
for (let i = 0; i < digits; i++) {
  output_elems.push(document.getElementById("div_output_" + (i+1)));
}

locked = [false, true, true, true, true, true, true];
document.getElementById("div_tab2").style.display = "none";
document.getElementById("div_tab3").style.display = "none";
document.getElementById("div_tab4").style.display = "none";
document.getElementById("div_tab5").style.display = "none";
document.getElementById("div_tab6").style.display = "none";



let current_tab_number = 1;


const switch_tab = function (new_tab_number) {
  div_tab_wrapper.classList.remove("display" + current_tab_number);
  div_tab_wrapper.classList.add("display" + new_tab_number);
  current_tab_number = new_tab_number;
}


/**
 * 数字を提出し、結果を得る
 * @param {Number} num
 * @returns {"ERROR"|"LOSE"|"WIN"|"DRAW"} 
 */
const enter_number = function (num, index) {
  let my_hand = new PokerHand(get_numbers(num));
  let question_hand = new PokerHand(get_numbers(current_question_number(index)));
  if (my_hand.evaluation === 0) return "ERROR";
  if (my_hand.evaluation < question_hand.evaluation) return "LOSE";
  if (my_hand.evaluation === question_hand.evaluation) return "DRAW";
  if (my_hand.evaluation > question_hand.evaluation) return "WIN";
}


let next_reset = false;
/**
 * 文字を入力する
 * @param {"0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"C"|"E"} str 
 */
const input_str = function (str) {
  
  if (str === "" || str === null) return;
  if (!Number.isNaN(Number(str))) {
    if (next_reset) {
      for (let i = 0; i < digits - 1; i++) {
        output_elems[i].innerText = "";
      }
      output_elems[digits - 1].innerText = str;
      next_reset = false;
    }else if (output_elems[0].innerText !== "") {
      return;
    }else{
      if (output_elems[digits - 2].innerText === "" && safe_number_text(output_elems[digits - 1].innerText) === "0") {
        output_elems[digits - 1].innerText = str;
      }else{
        for (let i = 0; i < digits - 1; i++) {
          output_elems[i].innerText = output_elems[i + 1].innerText;
        }
        output_elems[digits - 1].innerText = str;
      }
    }
    div_message_area.innerText = "　";
    div_message_area2.innerText = "　";
  }else if (str === "C") {
    for (let i = 0; i < digits; i++) {
      output_elems[i].innerText = "";
    }
    next_reset = false;
    div_message_area.innerText = "　";
    div_message_area2.innerText = "　";
  }else if (str === "E") {
    if (output_elems[0].innerText === "") return;
    let my_num = "";
    for (let i = 0; i < digits; i++) {
      my_num = my_num + safe_number_text(output_elems[i].innerText);
    }
    let result = enter_number(Number(my_num));
    let result2;
    let level_clear = false;
    //div_message_area.innerText = result;
    if (current_tab_number <= 3) {
      div_message_area.innerHTML = add_result_tag(result);
      write_log(add_result_tag(result, false, my_num + ":" + result));
    }else if (current_tab_number === 4) {
      div_message_area.innerHTML = add_result_tag(result, true);
      write_log(add_result_tag(result, true, my_num + ":" + result));
    }else if (current_tab_number === 5) {
      result2 = enter_number(Number(my_num), 2);
      div_message_area.innerHTML = add_result_tag(result);
      div_message_area2.innerHTML = add_result_tag(result2, true);
      write_log(my_num + ":" + add_result_tag(result, false, result)  + ", " + add_result_tag(result2, true, result2));
    }else if (current_tab_number === 6) {
      if (result === "WIN" || result === "LOSE") {
        div_message_area.innerHTML = add_result_tag("LOSE", false, result);
        write_log(add_result_tag("LOSE", false, my_num + ":" + result));
      }else if (result === "ERROR") {
        div_message_area.innerHTML = add_result_tag(result);
        write_log(add_result_tag(result, false, my_num + ":" + result));
      }else if (result === "DRAW") {
        if (current_question_number() === Number(my_num)) {
          div_message_area.innerHTML = add_result_tag("DRAW", false, `<span class="strike red">DRAW</span> SAME`);
          write_log(add_result_tag("DRAW", false, my_num + ":" + "SAME"));
        }else{
          div_message_area.innerHTML = add_result_tag("WIN", false, "DRAW");
          write_log(add_result_tag("WIN", false, my_num + ":" + "DRAW"));
          level_clear = true;
        }
      }
    }
    next_reset = true;
    if (current_tab_number <= 3) {
      if (result === "WIN") {
        level_clear = true;
      }
    }else if (current_tab_number === 4) {
      if (result === "LOSE") {
        level_clear = true;
      }
    }else if (current_tab_number === 5) {
      if (result === "WIN" && result2 === "LOSE") {
        level_clear = true;
      }
    }
    if (level_clear) {
      if (locked[current_tab_number]) {
        
        if (current_tab_number < 3) {
          document.getElementById("div_tab" + (current_tab_number + 1)).style.display = null;
          write_log("LEVEL." + (current_tab_number + 1) + "が解放されました. ");
        }else if (current_tab_number === 3) {
          document.getElementById("div_tab" + (current_tab_number + 1)).style.display = null;
          write_log("LEVEL.EX" + (current_tab_number - 2) + "が解放されました. ");
        }else if (current_tab_number < 6) {
          document.getElementById("div_tab" + (current_tab_number + 1)).style.display = null;
          write_log("LEVEL.EX" + (current_tab_number - 2) + "が解放されました. ");
        }else if (current_tab_number === 6) {
          write_log("EXTRA LEVEL CLEAR!!");
        }
        locked[current_tab_number] = false;
      }
      if (current_tab_number === 3) {
        span_level_crear.innerText = "LEVEL CLEAR!";
        div_share_extra.classList.remove("show");
        div_share_normal.classList.add("show");
        div_clear_back.classList.add("show");
      }else if (current_tab_number === 6) {
        span_level_crear.innerText = "EXTRA LEVEL CLEAR!!";
        div_share_extra.classList.add("show");
        div_share_normal.classList.remove("show");
        div_clear_back.classList.add("show")
      }
    }
  }

}

const add_result_tag = function (result, reverse = false, str) {
  if (str === undefined) {
    if (result === "ERROR") {
      str = "!!!ERROR!!!";
    }else{
      str = result;
    }
  }
  if (result === "ERROR") {
    return `<span class="black">${str}</span>`;
  }else if (result === "WIN") {
    if (reverse) {
      return `<span class="blue">${str}</span>`;
    }else{
      return `<span class="red">${str}</span>`;
    }
  }else if (result === "LOSE") {
    if (reverse) {
      return `<span class="red">${str}</span>`;
    }else{
      return `<span class="blue">${str}</span>`;
    }
  }else if (result === "DRAW") {
    return `<span class="green">${str}</span>`;
  }
}

/**
 * ログを出力する
 * @param {String} str 
 * @param {Boolean} newline 
 */
const write_log = function (str, newline = true) {
  let my_log_body = current_log_body();
  if (newline) str = str + "<br>";
  my_log_body.innerHTML = str + my_log_body.innerHTML;
}

/**
 * 現在のタブの log_body
 * @returns {HTMLSpanElement} 
 */
const current_log_body = function () {
  return document.getElementById("textarea_log_body" + current_tab_number);
}

const current_question_number = function (index) {
  if (current_tab_number === 5) {
    if (index === 1) return question_numbers[4][0];
    if (index === 2) return question_numbers[4][1];
    return question_numbers[4][0];
  }
  return question_numbers[current_tab_number - 1];
}

const question_numbers = [2639, 3835, 7203, 2639, [9995, 9026], 9705];

const init =function () {
  document.getElementById("question_number1").innerText = question_numbers[0];
  document.getElementById("question_number2").innerText = question_numbers[1];
  document.getElementById("question_number3").innerText = question_numbers[2];
  document.getElementById("question_number4").innerText = question_numbers[3];
  document.getElementById("question_number5").innerText = question_numbers[4][0];
  document.getElementById("question_number5_2").innerText = question_numbers[4][1];
  document.getElementById("question_number6").innerText = question_numbers[5];
}


//=================================================================


/**
 * 素因数分解する
 * @param {Number} number 素因数分解する数 1 以上の整数
 * @returns {[Number]}    素因数の配列を返す 素因数は大きい順 
 */
const factorizationB =function (number) {
  let target = number / 2;
  if (number === 1) return [];
  if (Number.isInteger(target)) {
    let result = factorizationB(target);
    result.push(2);
    return result;
  }
  for (let i = 3; true; i += 2) {
    target = number / i;
    if (Number.isInteger(target)) {
      let result = factorizationB(target);
      result.push(i);
      return result;
    }
    if (target < i) {
      return [number];
    }
  }
}

/**
 * 素因数分解する
 * @param {Number} number 素因数分解する数
 * @returns {[Number]}    素因数の配列を返す 素因数は小さい順 
 */
const factorization = function (number) {
  if (Number.isInteger(number)) {
    if (number < 0) number = -number;
    if (number > 0) {
      let result = factorizationB(number);
      result.reverse();
      return result;
    }
  }
}


const get_numbers = function (number) {
  return factorization(number).join("").split("").map(elem => Number(elem)).sort();
}



/*
  
  five of a kind  9
  straight flush  8
  four of a kind  7
  full house      6
  flush           5
  straight        4
  three of a kind 3
  two pair        2
  one pair        1
  high card       0

*/

/*スートなし flush, straight flush はない ワイルドカード非対応 */
class PokerHand {
  #evaluation = 0; get evaluation () {return this.#evaluation;}
  #numbers = []; get numbers () {return this.#numbers.concat([]);}
  set numbers (numbers) {
    if (Array.isArray(numbers)) {
      numbers = numbers.flat().map(elem => Number(elem)).filter(elem => (Number.isInteger(elem) && 0 <= elem && elem <= 14));
      this.#numbers = numbers;
      this.#evaluate();
    }
  }
  constructor (numbers) {
    this.numbers = numbers; // setter を実行
  }
  
  /**
   * 評価を再計算する
   */
  #evaluate () {
    let numbers = this.#numbers;
    this.#evaluation = 0;
    if (numbers.length === 5) {
      let target_map = new Map();
      numbers.forEach(function (value) {
        if (target_map.has(value)) {
          target_map.set(value, target_map.get(value) + 1);
        }else{
          target_map.set(value, 1);
        }
      });
      let target_entries = Array.from(target_map.entries());
      target_entries.sort(function(a, b) {
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        if (a[1] === b[1]) {
          if (a[0] > b[0]) return -1;
          if (a[0] < b[0]) return 1;
          if (a[0] === b[0]) return 0;
        }
      });
      if (target_map.size === 1) {
        // five of a kind
        this.#evaluation = 9 * (10**10);
        this.#evaluation += target_entries[0][0] * (10**8);
      }else if (target_map.size === 2) {
        // four of a kind, full house
        if (target_entries[0][1] === 4) {
          this.#evaluation = 7 * (10**10);
        }else if (target_entries[0][1] === 3) {
          this.#evaluation = 6 * (10**10);
        }
        this.#evaluation += target_entries[0][0] * (10**8);
        this.#evaluation += target_entries[1][0] * (10**6);
      }else if (target_map.size === 3) {
        // three of a kind, two pair
        if (target_entries[0][1] === 2) {
          // two pair
          this.#evaluation = 2 * (10**10);
        }else if (target_entries[0][1] === 3) {
          // three of a kind
          this.#evaluation = 3 * (10**10);
        }
        this.#evaluation += target_entries[0][0] * (10**8);
        this.#evaluation += target_entries[1][0] * (10**6);
        this.#evaluation += target_entries[2][0] * (10**4);
      }else if (target_map.size === 4) {
        // one pair
        this.#evaluation = 1 * (10**10);
        this.#evaluation += target_entries[0][0] * (10**8);
        this.#evaluation += target_entries[1][0] * (10**6);
        this.#evaluation += target_entries[2][0] * (10**4);
        this.#evaluation += target_entries[3][0] * (10**2);
      }else if (target_map.size === 5) {
        // straight, high card
        if (target_entries[0][0] === 14  && target_entries[1][0] === 5 && target_entries[2][0] === 4 && target_entries[3][0] === 3 && target_entries[4][0] === 2) {
          // straight (wheel) 
          this.#evaluation = 4 * (10**10) + 5 * (10**8);
        }else{
          for (let i = 0; i <= 5; i++) {
            if (i === 5) {
              // straight
              this.#evaluation = 4 * (10**10);
              this.#evaluation += target_entries[0][0] * (10**8);
              break;
            }
            if (target_entries[i][0] !== target_entries[0][0] - i) {
              break;
            }
          }
          if (this.#evaluation === 0) {
            // high card
            this.#evaluation += target_entries[0][0] * (10**8);
            this.#evaluation += target_entries[1][0] * (10**6);
            this.#evaluation += target_entries[2][0] * (10**4);
            this.#evaluation += target_entries[3][0] * (10**2);
            this.#evaluation += target_entries[4][0];
          }
        }
      }
    }
  }
  
  /**
   * 役を文字列で取得する
   * @param {"ja"|"en"} lang 
   * @returns {String}
   */
  asString (lang = "ja") {
    switch (Math.floor(this.#evaluation / (10**10))) {
      case 0:
        if (this.#evaluation === 0) {
          return "";
        }
        if (lang === "en") {
          return "high card";
        }else if (lang === "ja") {
          return "ハイカード";
        }
      case 1:
        if (lang === "en") {
          return "one pair";
        }else if (lang === "ja") {
          return "ワンペア";
        }
      case 2:
        if (lang === "en") {
          return "two pair";
        }else if (lang === "ja") {
          return "ツーペア";
        }
      case 3:
        if (lang === "en") {
          return "three of a kind";
        }else if (lang === "ja") {
          return "スリーカード";
        }
      case 4:
        if (lang === "en") {
          return "straight";
        }else if (lang === "ja") {
          return "ストレート";
        }
      case 5:
        if (lang === "en") {
          return "flush";
        }else if (lang === "ja") {
          return "フラッシュ";
        }
      case 6:
        if (lang === "en") {
          return "full house";
        }else if (lang === "ja") {
          return "フルハウス";
        }
      case 7:
        if (lang === "en") {
          return "four of a kind";
        }else if (lang === "ja") {
          return "フォーカード";
        }
      case 8:
        if (lang === "en") {
          return "straight flush";
        }else if (lang === "ja") {
          return "ストレートフラッシュ";
        }
      case 9:
        if (lang === "en") {
          return "five of a kind";
        }else if (lang === "ja") {
          return "ファイブカード";
        }
    }
  }
}


const info = function (num) {
  /**@type {[[Number, PokerHand]]} */
  let hands = [];
  let message = "";
  for (i = 1000; i <= 9999; i++) {
    hands.push([i, new PokerHand(get_numbers(i))]);
  }
  hands.sort(function (a,b) {
    if (a[1].evaluation > b[1].evaluation) return -1;
    if (a[1].evaluation < b[1].evaluation) return 1;
    if (a[1].evaluation === b[1].evaluation) return 0;
  });
  if (num === undefined) {
    for (let i = 9; i >= 0; i--) {
      let filterd = hands.filter((value) => (value[1].evaluation >= i * (10**10) && value[1].evaluation < (i+1) * (10**10)));
      if (filterd.length > 0) {
        message += filterd[0][1].asString() + "\t:" + filterd.length + "\n";
      }
    }
  }else if (typeof num === "number") {
    let my_hand = new PokerHand(get_numbers(num));
    message += "Information of " + String(num) + "\n";
    message += "factor\t:  " + factorization(num) + "\n";
    message += "hand\t:  " + my_hand.asString("en") + "\n";
    message += "score\t:  " + my_hand.evaluation + "\n";
    let filterd = hands.filter((value) => (value[1].evaluation > my_hand.evaluation));
    message += "WIN\t:  " + filterd.length + "\n";
    filterd = hands.filter((value) => (value[1].evaluation === my_hand.evaluation));
    message += "DRAW\t:  " + filterd.length + "\n";
    filterd = hands.filter((value) => (value[1].evaluation < my_hand.evaluation && value[1].evaluation !== 0));
    message += "LOSE\t:  " + filterd.length;
  }else if (typeof num === "string") {
    let filterd = hands.filter((value) => (value[1].asString("en") === num));
    return filterd;
  }
  console.log(message);
}

function safe_number_text (text) {
  let x = text;
  x = x.replace(/０/g, "0");
  x = x.replace(/１/g, "1");
  x = x.replace(/２/g, "2");
  x = x.replace(/３/g, "3");
  x = x.replace(/４/g, "4");
  x = x.replace(/５/g, "5");
  x = x.replace(/６/g, "6");
  x = x.replace(/７/g, "7");
  x = x.replace(/８/g, "8");
  x = x.replace(/９/g, "9");
  x = x.replace(/[^0-9]/g, "");
  if (x === "") x = "0";
  return x.slice(0, 1);
}

function safe_input_text (text) {
  let x = text;
  x = x.replace(/０/g, "0");
  x = x.replace(/１/g, "1");
  x = x.replace(/２/g, "2");
  x = x.replace(/３/g, "3");
  x = x.replace(/４/g, "4");
  x = x.replace(/５/g, "5");
  x = x.replace(/６/g, "6");
  x = x.replace(/７/g, "7");
  x = x.replace(/８/g, "8");
  x = x.replace(/９/g, "9");
  x = x.replace(/Ｃ/g, "C");
  x = x.replace(/Ｅ/g, "E");
  x = x.replace(/[^0-9CE]/g, "");
  return x.slice(0, 1);
}



init();
