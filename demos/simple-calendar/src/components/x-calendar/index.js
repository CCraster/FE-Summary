/**
 * web-components - 日历，目前只有月份选择功能
 */

import '@/utils/eventBus.js';
import './style.js';
import { CALENDAR_TYPE, CALENDAR_EVENT_TYPE } from '@/constants.js';
import { formatDate, getDateCHN } from '@/utils/date.js';

class XCalendar extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="top-wrapper"><span></span></div>
      <div class="main-wrapper"></div>
    `;
    this._mode = CALENDAR_TYPE.MONTH;
    this._focusYear = new Date().getFullYear();
    this._topWrapper = document.querySelector('.top-wrapper span');
    this._mainWrapper = document.querySelector('.main-wrapper');
    this._selected = '';
    this._selectMonth(
      formatDate(new Date(new Date().getFullYear(), new Date().getMonth()))
    );
    this._topWrapper.addEventListener('click', (e) => {
      let display = this._mainWrapper.style.display;
      this._mainWrapper.style.display = display === 'none' ? 'flex' : 'none';
    });

    this._init();
  }

  _init() {
    $eventBus.on(CALENDAR_EVENT_TYPE.CALENDAR_MODE_CHANGE, (e) => {
      console.log('change-calendar-mode', e.detail);
      this._changeCalendarMode(e.detail);
    });
    this._getMainPanel(this._focusYear);
  }

  _changeCalendarMode(mode) {
    if (mode === this._mode) return;
    this._mode = mode;
    this._focusYear = new Date().getFullYear();
    if (mode === CALENDAR_TYPE.MONTH) {
      this._selected = '';
    } else {
      this._selected = ['', ''];
    }
    this._mainWrapper.innerHTML = '';
    this._getMainPanel(this._focusYear);
  }

  _changeFocusYear(dy) {
    let newFocusYear = this._focusYear + dy;
    if (newFocusYear < 1970) return;
    this._focusYear = newFocusYear;
    this._mainWrapper.innerHTML = '';
    this._getMainPanel(this._focusYear);
    this._handleCellSelectedStyle();
  }

  _selectMonth(month) {
    if (this._mode === CALENDAR_TYPE.MONTH) {
      this._selected = month;
      this._topWrapper.innerText = getDateCHN(month);
      $eventBus.trigger(
        CALENDAR_EVENT_TYPE.CALENDAR_VALUE_CHANGE,
        getDateCHN(this._selected)
      );
    } else {
      if (this._selected[1]) this._selected = ['', ''];
      if (!this._selected[0]) {
        this._selected[0] = month;
      } else {
        this._selected[1] = month;
        if (this._selected[1] < this._selected[0]) {
          this._selected = [this._selected[1], this._selected[0]];
        }
        $eventBus.trigger(
          CALENDAR_EVENT_TYPE.CALENDAR_VALUE_CHANGE,
          `${getDateCHN(this._selected[0])} - ${getDateCHN(this._selected[1])}`
        );
      }
    }
    this._handleCellSelectedStyle();
  }

  _handleCellSelectedStyle() {
    if (this._mode === CALENDAR_TYPE.MONTH) {
      let cells = this._mainWrapper.querySelectorAll('.cell-wrapper');
      for (let cell of cells) {
        if (cell.month === this._selected) {
          cell.classList.add('cell-selected');
        } else {
          cell.classList.remove('cell-selected');
        }
      }
    } else {
      let cells = this._mainWrapper.querySelectorAll('.cell-wrapper');
      for (let cell of cells) {
        cell.classList.remove('cell-selected');
        cell.classList.remove('cell-inMonthRange');
        if (
          cell.month === this._selected[0] ||
          cell.month === this._selected[1]
        ) {
          cell.classList.add('cell-selected');
        } else if (
          cell.month > this._selected[0] &&
          cell.month < this._selected[1]
        ) {
          cell.classList.add('cell-inMonthRange');
        }
      }
    }
  }

  _getMainPanel(year) {
    if (this._mode === CALENDAR_TYPE.MONTH) {
      let leftPanel = document.createElement('div');
      leftPanel.appendChild(this._getTopToolBar(year));
      leftPanel.appendChild(this._getMonthContainer(year));
      this._mainWrapper.appendChild(leftPanel);
      this._mainWrapper.style.left = '0px';
    } else {
      let leftPanel = document.createElement('div');
      let rightPanel = document.createElement('div');
      leftPanel.appendChild(this._getTopToolBar(year, 'left'));
      leftPanel.appendChild(this._getMonthContainer(year));
      leftPanel.style = `
        margin-right: 20px;
      `;
      rightPanel.appendChild(this._getTopToolBar(year + 1, 'right'));
      rightPanel.appendChild(this._getMonthContainer(year + 1));
      this._mainWrapper.appendChild(leftPanel);
      this._mainWrapper.appendChild(rightPanel);
      this._mainWrapper.style.left = '-100px';
    }
  }

  _getTopToolBar(year, type) {
    let topToolBar = document.createElement('div');
    topToolBar.classList.add('panel-top-bar');
    if (this._mode === CALENDAR_TYPE.MONTH) {
      let leftArrow = document.createElement('span');
      let centerSpan = document.createElement('span');
      let rightArrow = document.createElement('span');
      leftArrow.innerText = '《';
      leftArrow.addEventListener('click', () => {
        this._changeFocusYear(-1);
      });
      centerSpan.innerText = `${year} 年`;
      rightArrow.innerText = '》';
      rightArrow.addEventListener('click', () => {
        this._changeFocusYear(1);
      });
      topToolBar.appendChild(leftArrow);
      topToolBar.appendChild(centerSpan);
      topToolBar.appendChild(rightArrow);
    } else {
      if (type === 'left') {
        let leftArrow = document.createElement('span');
        let centerSpan = document.createElement('span');
        let rightArrow = document.createElement('span');
        leftArrow.innerText = '《';
        leftArrow.addEventListener('click', () => {
          this._changeFocusYear(-1);
        });
        centerSpan.innerText = `${year} 年`;
        topToolBar.appendChild(leftArrow);
        topToolBar.appendChild(centerSpan);
        topToolBar.appendChild(rightArrow);
      } else {
        let leftArrow = document.createElement('span');
        let centerSpan = document.createElement('span');
        let rightArrow = document.createElement('span');
        centerSpan.innerText = `${year} 年`;
        rightArrow.innerText = '》';
        rightArrow.addEventListener('click', () => {
          this._changeFocusYear(1);
        });
        topToolBar.appendChild(leftArrow);
        topToolBar.appendChild(centerSpan);
        topToolBar.appendChild(rightArrow);
      }
    }
    return topToolBar;
  }

  _getMonthContainer(year) {
    const MONTH_MAP = {
      0: '一月',
      1: '二月',
      2: '三月',
      3: '四月',
      4: '五月',
      5: '六月',
      6: '七月',
      7: '八月',
      8: '九月',
      9: '十月',
      10: '十一月',
      11: '十二月',
    };
    let monthContainer = document.createElement('div');
    monthContainer.classList.add('month-wrapper');
    for (let key in MONTH_MAP) {
      let monthWrapper = document.createElement('div');
      let month = document.createElement('span');
      monthWrapper.classList.add('cell-wrapper');
      month.innerText = MONTH_MAP[key];
      monthWrapper.appendChild(month);
      monthContainer.appendChild(monthWrapper);
      monthWrapper.month = formatDate(new Date(year, key));
      if (
        formatDate(new Date(year, key)) ===
        formatDate(new Date(new Date().getFullYear(), new Date().getMonth()))
      ) {
        monthWrapper.classList.add('cell-currentMonth');
      }
      monthWrapper.addEventListener('mouseover', () => {
        monthWrapper.classList.add('cell-hover');
      });
      monthWrapper.addEventListener('mouseout', () => {
        monthWrapper.classList.remove('cell-hover');
      });
      monthWrapper.addEventListener('click', () => {
        this._selectMonth(formatDate(new Date(year, key)));
      });
    }
    return monthContainer;
  }
}
window.customElements.define('x-calendar', XCalendar);
