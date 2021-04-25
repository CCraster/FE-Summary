{
  const body = document.getElementsByTagName('body')[0];
  body.innerHTML = `
<div id="content-container">
  <div class="page">initial page</div>
</div>
<div id="footer">
  <button>page1</button>
  <button>page2</button>
</div>
`;
  const button1 = document.getElementsByTagName('button')[0];
  const button2 = document.getElementsByTagName('button')[1];
  button1.addEventListener('click', toPage1);
  button2.addEventListener('click', toPage2);
}

/**
 * without dynamic loading
 */

function toPage1() {
  const { render } = require('./pages/page-1');
  render();
}
function toPage2() {
  const { render } = require('./pages/page-2');
  render();
}

/**
 * import()
 */

// function toPage1() {
//   import('./pages/page-1').then(({ render }) => {
//     render();
//   });
// }
// function toPage2() {
//   import('./pages/page-2').then(({ render }) => {
//     render();
//   });
// }

/**
 * require.ensure
 */

// function toPage1() {
//   require.ensure([], (require) => {
//     const { render } = require('./pages/page-1');
//     render();
//   });
// }
// function toPage2() {
//   require.ensure([], (require) => {
//     const { render } = require('./pages/page-2');
//     render();
//   });
// }
