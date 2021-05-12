const main = document.getElementById('main');
main.innerText = 'This is initial page.';

const buttons = document.getElementsByTagName('span');
// 1）document.write
buttons[0].addEventListener(
  'click',
  () => {
    document.write('<script src="./src/1.document.write.js"></script>');
  },
  false
);

// 2）改变已有script的src
buttons[1].addEventListener(
  'click',
  () => {
    const indexScript = document.getElementById('empty');
    // indexScript.removeAttribute('src');
    // indexScript.src = './src/2.change_current_script_src.js';
    indexScript.setAttribute('src', './src/2.change_current_script_src.js');
  },
  false
);

// 3）借助XMLHTTP
buttons[2].addEventListener(
  'click',
  () => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', './src/3.use_xmlhttp.js', true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = xhr.responseText;
          document.body.appendChild(script);
        }
      }
    };
    xhr.send(null);
  },
  false
);

// 4）动态创建script元素
buttons[3].addEventListener(
  'click',
  () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = './src/4.append_script.js';
    document.head.append(script);
  },
  false
);
