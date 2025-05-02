import React from "react";

const RulesPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6 text-gray-800 space-y-4 text-lg leading-relaxed">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
          Правила сервиса Industro
        </h1>

        <p>
          Добро пожаловать в <strong>Industro</strong>! Мы ценим честность, профессионализм и уважение.
          Используя платформу, вы соглашаетесь соблюдать приведённые ниже правила.
        </p>

        <ol className="list-decimal list-inside space-y-2">
          <li>
            Уважайте других пользователей. Грубость, оскорбления, дискриминация и токсичное поведение запрещены.
          </li>
          <li>
            Размещайте только достоверную и актуальную информацию в объявлениях и резюме.
          </li>
          <li>
            Запрещается публикация спама, мошеннических предложений и рекламы, не связанной с тематикой сервиса.
          </li>
          <li>
            Администрация оставляет за собой право удалять материалы, нарушающие правила, без предварительного уведомления.
          </li>
          <li>
            За грубые или систематические нарушения может быть заблокирован доступ к аккаунту.
          </li>
        </ol>

        <p>
          Эти правила созданы, чтобы сделать Industro безопасной и надёжной платформой для заказчиков и исполнителей.
        </p>

        <p className="font-semibold mt-6 text-center text-blue-600">
          Спасибо, что выбрали Industro!
        </p>
      </div>
    </div>
  );
};

export default RulesPage;