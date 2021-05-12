import './index.css';

{
  const body = document.getElementsByTagName('body')[0];
  body.innerHTML = `
<div id="main">
  initial page
</div>
<div id="footer">
  <span>to page1</span>
  <span>to page2</span>
</div>
`;
  const button1 = document.getElementsByTagName('span')[0];
  const button2 = document.getElementsByTagName('span')[1];
  button1.addEventListener('click', toPage1);
  button2.addEventListener('click', toPage2);
}

/**
 * without dynamic loading
 */

// function toPage1() {
//   const { render } = require('./src/pages/page-1');
//   render();
// }
// function toPage2() {
//   const { render } = require('./src/pages/page-2');
//   render();
// }

/**
 * import()
 */
// function toPage1() {
//   import('./src/pages/page-1').then(({ render }) => {
//     render();
//   });
// }
// function toPage2() {
//   import('./src/pages/page-2').then(({ render }) => {
//     render();
//   });
// }

/**
 * require.ensure
 */
function toPage1() {
  require.ensure(['./src/pages/a.js'], (require) => {
    const { render } = require('./src/pages/page-1');
    render();
  });
}
function toPage2() {
  require.ensure([], (require) => {
    const { render } = require('./src/pages/page-2');
    render();
  });
}

/**
 * 触发了code split但是初始化就执行了
 */

// require.ensure([], (require) => {
//   const { render } = require('./src/pages/page-1');
//   render();
// });
// function toPage1() {
//   require.ensure([], (require) => {
//     const { render } = require('./src/pages/page-1');
//     render();
//   });
// }
// function toPage2() {
//   require.ensure([], (require) => {
//     const { render } = require('./src/pages/page-2');
//     render();
//   });
// }

/**
 * 魔法注释webpackChunkName
 */

// function toPage1() {
//   import(/* webpackChunkName: 'page' */ './src/pages/page-1').then(
//     ({ render }) => {
//       render();
//     }
//   );
// }
// function toPage2() {
//   import(/* webpackChunkName: 'page' */ './src/pages/page-2').then(
//     ({ render }) => {
//       render();
//     }
//   );
// }
