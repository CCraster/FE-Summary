/**
 * calendar组件样式
 */
const head = document.head;
let style = document.createElement('style');
head.appendChild(style);

const HIGHLIGHT_COLOR = 'red';

const topWrapper = `
x-calendar .top-wrapper {
  display: flex;
  justify-content: center;
}
x-calendar .top-wrapper > span {
  padding: 5px 10px;
  border: 1px solid red;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}
x-calendar .top-wrapper > span:hover {
  background: red;
  color: white;
}
`;

const mainWrapper = `
x-calendar .main-wrapper {
  position: absolute;
  top: 50px;
  display: flex;
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  transition: all 0.3s;
}

x-calendar .panel-top-bar {
  // height: 40px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #ddd;
}
x-calendar .panel-top-bar span:not(:nth-child(2)) {
  cursor: pointer;
}
x-calendar .panel-top-bar span:not(:nth-child(2)):hover {
  color: ${HIGHLIGHT_COLOR};
  font-weight: bold;
}

x-calendar .month-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 200px;
}
/* 单个cell */
x-calendar .cell-wrapper {
  height: 40px;
  width: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
x-calendar .cell-wrapper:hover {
  // background: red;
}
x-calendar .cell-wrapper > span {

}
x-calendar .cell-hover {
  border: 1px solid red;
}
x-calendar .cell-currentMonth {
  color: red;
}
x-calendar .cell-selected {
  background: red;
  color: white;
}
x-calendar .cell-inMonthRange {
  background: #FF9999;
  color: white;
}
`;

style.innerHTML = `
x-calendar {
  width: 200px;
  height: 36px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
  margin: 10px 0;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  transition: all 0.3s;
}
${topWrapper}
${mainWrapper}
`;
