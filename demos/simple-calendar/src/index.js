import '@/components/x-calendar';
import XVue from './components/x-vue';
import { CALENDAR_TYPE, CALENDAR_EVENT_TYPE } from '@/constants.js';

// 初始化页面结构
const app = document.getElementById('app');
app.className = 'app';
app.innerHTML = `
<div id="container">
  <div id="calendar-wrapper" class="calendar-wrapper">
    <x-calendar />
  </div>
  <div class="opt-wrapper">
    <div>
      <div>
        <input type="radio" id="calendar-${CALENDAR_TYPE.MONTH}" name="calendar-type" value="${CALENDAR_TYPE.MONTH}" checked />
        <label for="calendar-${CALENDAR_TYPE.MONTH}">${CALENDAR_TYPE.MONTH}</label>
      </div>
      <div>
        <input type="radio" id="calendar-${CALENDAR_TYPE.MONTHRANGE}" name="calendar-type" value="${CALENDAR_TYPE.MONTHRANGE}" />
        <label for="calendar-${CALENDAR_TYPE.MONTHRANGE}">${CALENDAR_TYPE.MONTHRANGE}</label>
      </div>
    </div>
    <span>选项值：</span>
    <span v-bind="month"></span>
  </div>
</div>
`;

// 函数
let xvue = new XVue({
  el: '#app',
  data: {
    month: '2020年7月',
  },
});
$eventBus.on(CALENDAR_EVENT_TYPE.CALENDAR_VALUE_CHANGE, (e) => {
  xvue.$data.month = e.detail;
});
document.querySelectorAll('input[name="calendar-type"]').forEach((node) => {
  node.addEventListener('click', () => {
    let type = node.value || CALENDAR_TYPE.MONTH;
    $eventBus.trigger(CALENDAR_EVENT_TYPE.CALENDAR_MODE_CHANGE, type);
  });
});

// 插入样式
const head = document.head;
let style = document.createElement('style');
head.appendChild(style);
style.innerHTML = `
html, body {
  padding: 0;
  margin: 0;
}
.app {
}
#container {

}
.calendar-wrapper {
  height: 400px;
  display: flex;
  justify-content: center;
}
.opt-wrapper {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
}
.opt-wrapper > div {
  margin-right: 20px;
}
`;
