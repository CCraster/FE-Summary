export const render = () => {
  const container = document.getElementById('content-container');
  const page = document.createElement('div');
  page.setAttribute('class', 'page page2');
  page.innerText = `This is page 2.`;
  container.innerHTML = '';
  container.append(page);
};
