export const render = () => {
  const container = document.getElementById('content-container');
  const page = document.createElement('div');
  page.setAttribute('class', 'page page1');
  page.innerText = 'This is page 1.';
  container.innerHTML = '';
  container.append(page);
};
