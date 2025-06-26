# Фильтр ошибок консоли

## 🎯 Назначение

Утилита для скрытия ошибок консоли, связанных с внешними сервисами (Яндекс.Метрика, Google Analytics и др.), которые не влияют на работу приложения.

## 🔧 Как это работает

Фильтр перехватывает:
- `console.error()` и `console.warn()`
- Необработанные ошибки (`window.error`)
- Необработанные промисы (`unhandledrejection`)

И скрывает сообщения, соответствующие заданным паттернам.

## 📋 Фильтруемые ошибки

### Яндекс.Метрика
- `mc.yandex.ru`
- `yandex.ru`
- CORS ошибки для Яндекс.Метрики
- Ошибки заголовков для Яндекс.Метрики

### Google Analytics
- `googletagmanager.com`
- `google-analytics.com`
- `analytics.google.com`

### Социальные сети
- Facebook Pixel
- VK
- Telegram

### Общие CORS ошибки
- `Access to fetch at... has been blocked by CORS policy`
- `Failed to fetch`
- `net::ERR_FAILED`

## 🚀 Использование

### Автоматическое подключение
Фильтр автоматически подключается при импорте:
```javascript
import './utils/consoleFilter';
```

### Ручное управление
```javascript
import consoleFilter from './utils/consoleFilter';

// Добавить новый фильтр
consoleFilter.addFilter('example.com');

// Удалить фильтр
consoleFilter.removeFilter('example.com');

// Получить список фильтров
const filters = consoleFilter.getFilters();

// Очистить все фильтры
consoleFilter.clearFilters();

// Восстановить оригинальные методы консоли
consoleFilter.restore();
```

### Глобальный доступ
В браузере доступен через `window.consoleFilter`:
```javascript
// В консоли браузера
window.consoleFilter.addFilter('new-domain.com');
window.consoleFilter.getFilters();
```

## ⚙️ Настройка

### Добавление новых доменов
```javascript
// Добавить домен
consoleFilter.addFilter('api.example.com');

// Добавить регулярное выражение
consoleFilter.addFilter(/api\.example\.com/);
```

### Удаление фильтров
```javascript
// Удалить конкретный фильтр
consoleFilter.removeFilter('mc.yandex.ru');

// Очистить все фильтры
consoleFilter.clearFilters();
```

## 🔍 Отладка

### Проверка активных фильтров
```javascript
console.log('Active filters:', consoleFilter.getFilters());
```

### Временное отключение
```javascript
// Восстановить оригинальные методы
consoleFilter.restore();

// Позже можно снова инициализировать
consoleFilter.init();
```

## 📊 Преимущества

1. **Чистая консоль** - не отвлекают ошибки внешних сервисов
2. **Лучшая отладка** - видны только релевантные ошибки
3. **Производительность** - меньше шума в логах
4. **Гибкость** - легко добавлять/удалять фильтры

## ⚠️ Важные моменты

1. **Не скрывает реальные ошибки** - фильтруются только известные паттерны
2. **Можно отключить** - всегда можно восстановить оригинальные методы
3. **Только для разработки** - в production ошибки должны логироваться
4. **Не влияет на функциональность** - только скрывает вывод в консоль

## 🛠️ Расширение

### Добавление новых паттернов
```javascript
// В consoleFilter.js добавить в массив filteredPatterns:
/your-pattern-here/,
```

### Создание кастомного фильтра
```javascript
class CustomConsoleFilter extends ConsoleFilter {
  constructor() {
    super();
    this.addFilter('your-domain.com');
  }
}
```

## 📝 Примеры использования

### В компоненте React
```javascript
import { useEffect } from 'react';
import consoleFilter from '../utils/consoleFilter';

function MyComponent() {
  useEffect(() => {
    // Добавить фильтр для конкретного компонента
    consoleFilter.addFilter('component-specific-error.com');
    
    return () => {
      // Удалить при размонтировании
      consoleFilter.removeFilter('component-specific-error.com');
    };
  }, []);
  
  return <div>My Component</div>;
}
```

### В сервисе
```javascript
import consoleFilter from '../utils/consoleFilter';

class ApiService {
  constructor() {
    // Фильтровать ошибки конкретного API
    consoleFilter.addFilter(/api\.external\.com/);
  }
}
``` 