// Функция для создания или очистки таймера
function updateReminder(interval, disabled) {
    chrome.alarms.clear("tweetReminder", () => {
      if (!disabled) {
        chrome.alarms.create("tweetReminder", { periodInMinutes: interval });
      }
    });
  }
  
  // Инициализация таймера при запуске расширения
  chrome.storage.sync.get(['reminderInterval', 'notificationsDisabled'], (data) => {
    const interval = data.reminderInterval || 30; // По умолчанию 30 минут
    const disabled = data.notificationsDisabled || false; // По умолчанию включено
    updateReminder(interval, disabled);
  });
  
  // Обработка изменения интервала или состояния уведомлений
  chrome.storage.onChanged.addListener((changes) => {
    chrome.storage.sync.get(['reminderInterval', 'notificationsDisabled'], (data) => {
      const interval = data.reminderInterval || 30;
      const disabled = data.notificationsDisabled || false;
      updateReminder(interval, disabled);
    });
  });
  
  // Список кастомных сообщений
  const messages = [
    "Kaito says: Time to tweet!",
    "Meow! Write something fun!",
    "Hey! Don’t forget your tweet!",
    "Kaito here: Tweet time!"
  ];
  
  // Обработка события напоминания
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "tweetReminder") {
      const timestamp = new Date().toLocaleTimeString(); // Текущее время
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]; // Случайное сообщение
  
      // Сохранение истории с лимитом 10 записей
      chrome.storage.local.get(['remindersHistory'], (data) => {
        const history = data.remindersHistory || [];
        history.push(`Reminder at ${timestamp}`);
        if (history.length > 10) history.shift(); // Удаляем старую запись
        chrome.storage.local.set({ remindersHistory: history });
      });
  
      // Уведомление
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Kaito Reminder",
        message: randomMessage
      });
    }
  });