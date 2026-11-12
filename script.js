// Общие действия для всех страниц сайта.

document.addEventListener('DOMContentLoaded', () => {
  // Показываем страницу после загрузки HTML.
  document.body.classList.add('loaded');

  // Подсвечиваем пункт меню, который ведёт на открытую страницу.
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // Плавный переход работает только для внутренних HTML-страниц.
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const destination = link.getAttribute('href');
      if (!destination || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      document.body.classList.add('fade-out');
      window.setTimeout(() => {
        window.location.href = destination;
      }, 180);
    });
  });

  // Блок отзывов есть только на главной странице.
  const messageForm = document.getElementById('messageForm');
  if (messageForm) {
    setupMessages(messageForm);
  }
});

// Настройка формы отзывов: загрузка списка и отправка нового сообщения.
function setupMessages(form) {
  const input = document.getElementById('userMessage');
  const list = document.getElementById('messagesList');
  const status = document.getElementById('status');
  const sendButton = document.getElementById('sendBtn');

  async function loadMessages() {
    list.replaceChildren();

    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Не удалось получить отзывы');

      const messages = await response.json();
      if (messages.length === 0) {
        const emptyText = document.createElement('p');
        emptyText.className = 'muted';
        emptyText.textContent = 'Пока нет отзывов. Будьте первым!';
        list.append(emptyText);
        return;
      }

      messages.slice().reverse().forEach((message) => {
        const item = document.createElement('article');
        item.className = 'message-item';

        const author = document.createElement('strong');
        author.textContent = 'Гость';

        const text = document.createElement('p');
        // textContent не позволяет выполнить HTML или JavaScript из отзыва.
        text.textContent = message.text;

        item.append(author, text);
        list.append(item);
      });
    } catch (error) {
      const errorText = document.createElement('p');
      errorText.className = 'muted';
      errorText.textContent = 'Не удалось загрузить отзывы. Проверьте, запущен ли сервер.';
      list.append(errorText);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = input.value.trim();

    if (!text) {
      status.textContent = 'Сначала напишите отзыв.';
      status.className = 'form-status error';
      input.focus();
      return;
    }

    if (text.length > 500) {
      status.textContent = 'Максимальная длина отзыва — 500 символов.';
      status.className = 'form-status error';
      return;
    }

    sendButton.disabled = true;
    sendButton.textContent = 'Отправка...';

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Не удалось отправить отзыв');

      input.value = '';
      status.textContent = 'Отзыв добавлен.';
      status.className = 'form-status success';
      await loadMessages();
    } catch (error) {
      status.textContent = error.message || 'Ошибка соединения с сервером.';
      status.className = 'form-status error';
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Отправить';
    }
  });

  loadMessages();
}
