// Загрузка сохранённого интервала и истории при открытии
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['reminderInterval', 'notificationsDisabled'], (data) => {
    const interval = data.reminderInterval || 30; // По умолчанию 30 минут
    const disabled = data.notificationsDisabled || false; // По умолчанию включено
    document.getElementById('interval').value = interval;
    const disableButton = document.getElementById('disable-button');
    disableButton.textContent = disabled ? 'Enable' : 'Disable'; // Фиксированный текст на английском
  });

  // Загрузка истории напоминаний
  chrome.storage.local.get(['remindersHistory'], (data) => {
    const history = data.remindersHistory || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Очищаем список
    history.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      historyList.appendChild(li);
    });
  });
});

// Сохранение нового интервала при изменении
document.getElementById('interval').addEventListener('change', (event) => {
  const interval = parseInt(event.target.value, 10);
  chrome.storage.sync.set({ reminderInterval: interval }, () => {
    console.log(`New interval set: ${interval} minutes`);
  });
});

// Кнопка "Help"
document.getElementById('help-button').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://chat.openai.com/' });
});

// Кнопка "Clear History"
document.getElementById('clear-history').addEventListener('click', () => {
  chrome.storage.local.set({ remindersHistory: [] }, () => {
    document.getElementById('history-list').innerHTML = '';
    console.log('History cleared');
  });
});

// Кнопка "Disable/Enable"
document.getElementById('disable-button').addEventListener('click', () => {
  chrome.storage.sync.get(['notificationsDisabled'], (data) => {
    const disabled = !data.notificationsDisabled; // Переключаем состояние
    chrome.storage.sync.set({ notificationsDisabled: disabled }, () => {
      const disableButton = document.getElementById('disable-button');
      disableButton.textContent = disabled ? 'Enable' : 'Disable'; // Фиксированный текст на английском
      console.log(`Notifications ${disabled ? 'disabled' : 'enabled'}`);
    });
  });
});