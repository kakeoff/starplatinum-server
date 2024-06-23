import { ApplicationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const daysFromTodayDate = (days: number): string => {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result.toISOString();
};

export const getMockPublications = () => {
  return [
    {
      name: 'Strategic Marketing Vision',
      description:
        "Журнал 'Strategic Marketing Vision' представляет собой источник вдохновения для маркетологов, стремящихся создать значимые и долгосрочные связи с клиентами. Мы предлагаем глубокие аналитические обзоры современных тенденций, стратегических подходов и инновационных идей, которые помогут вашему бренду выделиться на фоне конкурентов.",
      link: 'https://example.com/strategic-marketing-vision',
      cost: 125,
      imageUrl: '/uploads/default/pub-1.png',
    },
    {
      name: 'Brand Identity Evolution',
      description:
        "Журнал 'Brand Identity Evolution' - это исследование эволюции идентичности бренда в современном мире. Мы исследуем как бренды реагируют на изменяющиеся требования рынка, строят свои стратегии и создают узнаваемый образ. Подписывайтесь, чтобы узнать, как сделать ваш бренд еще более сильным и запоминающимся.",
      link: 'https://example.com/brand-identity-evolution',
      cost: 100,
      imageUrl: '/uploads/default/pub-2.png',
    },
    {
      name: 'Market Trends Navigator',
      description:
        "Журнал 'Market Trends Navigator' помогает навигировать по сложному миру маркетинговых тенденций. Мы предоставляем всесторонний анализ ключевых факторов, определяющих развитие рынка, и помогаем бизнесам понять, как эти тенденции могут повлиять на их стратегии. Наша миссия - помочь вам принимать обоснованные решения и успешно адаптироваться к изменяющимся условиям.",
      link: 'https://example.com/market-trends-navigator',
      cost: 150,
      imageUrl: '/uploads/default/pub-3.png',
    },
    {
      name: 'Consumer Behavior Chronicles',
      description:
        "Журнал 'Consumer Behavior Chronicles' предлагает увлекательное путешествие в мир поведенческой экономики и анализа потребительского поведения. Мы исследуем, что заставляет потребителей принимать решения, как формируются и меняются их предпочтения, и как бренды могут использовать эту информацию для создания эффективных маркетинговых стратегий.",
      link: 'https://example.com/consumer-behavior-chronicles',
      cost: 200,
      imageUrl: '/uploads/default/pub-4.png',
    },
    {
      name: 'Digital Marketing Insights Digest',
      description:
        "Журнал 'Digital Marketing Insights Digest' предлагает свежие и перспективные взгляды на мир цифрового маркетинга. Мы рассматриваем последние технологические инновации, стратегические подходы и лучшие практики в сфере цифрового маркетинга. Подписывайтесь, чтобы оставаться в курсе последних трендов и получать рекомендации от ведущих экспертов отрасли.",
      link: 'https://example.com/digital-marketing-insights-digest',
      cost: 175,
      imageUrl: '/uploads/default/pub-5.png',
    },
    {
      name: 'Brand Storytelling Quarterly',
      description:
        "Журнал 'Brand Storytelling Quarterly' посвящен искусству создания убедительных историй бренда. Мы анализируем, какие истории резонируют с аудиторией, как они воздействуют на восприятие бренда и какие стратегии помогают брендам выделиться на фоне шума рынка.",
      link: 'https://example.com/brand-storytelling-quarterly',
      cost: 165,
      imageUrl: '/uploads/default/pub-6.png',
    },
    {
      name: 'Advertising Creativity Chronicles',
      description:
        "Журнал 'Advertising Creativity Chronicles' предлагает вдохновение и инсайты для творческих маркетологов. Мы исследуем лучшие практики в области творчества, анализируем успешные кейсы и делимся советами, как создавать запоминающиеся и эффективные рекламные кампании.",
      link: 'https://example.com/advertising-creativity-chronicles',
      cost: 145,
      imageUrl: '/uploads/default/pub-7.png',
    },
    {
      name: 'Marketing Metrics Quarterly Review',
      description:
        "Журнал 'Marketing Metrics Quarterly Review' предлагает глубокий анализ ключевых маркетинговых метрик и их влияния на бизнес. Мы рассматриваем показатели эффективности рекламы, конверсии, вовлеченности аудитории и другие важные показатели, помогая брендам оптимизировать свои стратегии и достигать лучших результатов.",
      link: 'https://example.com/marketing-metrics-quarterly-review',
      cost: 165,
      imageUrl: '/uploads/default/pub-8.png',
    },
    {
      name: 'Brand Positioning Playbook',
      description:
        "Журнал 'Brand Positioning Playbook' предлагает практические руководства и инсайты для эффективного позиционирования бренда на рынке. Мы анализируем конкурентные преимущества, целевую аудиторию и каналы коммуникации, помогая брендам создать уникальное и запоминающееся положение.",
      link: 'https://example.com/brand-positioning-playbook',
      cost: 225,
      imageUrl: '/uploads/default/pub-9.png',
    },
  ];
};

export const getMockApplications = () => {
  return [
    {
      comment:
        'Здравствуйте, заинтересовало ваше агентство. Хотелось бы узнать больше о ваших услугах и возможностях сотрудничества. Буду рад получить подробную информацию о вашем агентстве и условиях работы. Пожалуйста, свяжитесь со мной для обсуждения деталей.',
      cost: 15600,
      status: ApplicationStatus.PENDING,
      userId: 2,
    },
    {
      comment:
        'Здравствуйте, свяжитесь со мной. Хочу обсудить возможное сотрудничество с вашим агентством. Меня заинтересовали ваши услуги и результаты работы. Готов обсудить дальнейшие шаги и сотрудничество с вашей командой. Просьба оставить контактные данные для связи.',
      cost: 7200,
      status: ApplicationStatus.PENDING,
      userId: 2,
    },
    {
      comment:
        'Здравствуйте, заинтересовало ваше агентство. Хотелось бы узнать больше о ваших услугах и возможностях сотрудничества. Буду рад получить подробную информацию о вашем агентстве и условиях работы. Пожалуйста, свяжитесь со мной для обсуждения деталей.',
      cost: 800,
      status: ApplicationStatus.PENDING,
      userId: 3,
    },
    {
      comment:
        'Здравствуйте, свяжитесь со мной. Хочу обсудить возможное сотрудничество с вашим агентством. Меня заинтересовали ваши услуги и результаты работы. Готов обсудить дальнейшие шаги и сотрудничество с вашей командой. Просьба оставить контактные данные для связи.',
      cost: 1500,
      status: ApplicationStatus.PENDING,
      userId: 4,
    },
    {
      comment:
        'Здравствуйте, заинтересовало ваше агентство. Хотелось бы узнать больше о ваших услугах и возможностях сотрудничества. Буду рад получить подробную информацию о вашем агентстве и условиях работы. Пожалуйста, свяжитесь со мной для обсуждения деталей.',
      cost: 900,
      status: ApplicationStatus.PENDING,
      userId: 5,
    },
    {
      comment:
        'Здравствуйте, свяжитесь со мной. Хочу обсудить возможное сотрудничество с вашим агентством. Меня заинтересовали ваши услуги и результаты работы. Готов обсудить дальнейшие шаги и сотрудничество с вашей командой. Просьба оставить контактные данные для связи.',
      cost: 1100,
      status: ApplicationStatus.PENDING,
      userId: 6,
    },
    {
      comment:
        'Здравствуйте, заинтересовало ваше агентство. Хотелось бы узнать больше о ваших услугах и возможностях сотрудничества. Буду рад получить подробную информацию о вашем агентстве и условиях работы. Пожалуйста, свяжитесь со мной для обсуждения деталей.',
      cost: 17400,
      status: ApplicationStatus.PENDING,
      userId: 2,
    },
    {
      comment:
        'Здравствуйте, свяжитесь со мной. Хочу обсудить возможное сотрудничество с вашим агентством. Меня заинтересовали ваши услуги и результаты работы. Готов обсудить дальнейшие шаги и сотрудничество с вашей командой. Просьба оставить контактные данные для связи.',
      cost: 1300,
      status: ApplicationStatus.PENDING,
      userId: 8,
    },
    {
      comment:
        'Здравствуйте, свяжитесь со мной. Хочу обсудить возможное сотрудничество с вашим агентством. Меня заинтересовали ваши услуги и результаты работы. Готов обсудить дальнейшие шаги и сотрудничество с вашей командой. Просьба оставить контактные данные для связи.',
      cost: 10800,
      status: ApplicationStatus.PENDING,
      userId: 2,
    },
    {
      comment:
        'Здравствуйте, заинтересовало ваше агентство. Хотелось бы узнать больше о ваших услугах и возможностях сотрудничества. Буду рад получить подробную информацию о вашем агентстве и условиях работы. Пожалуйста, свяжитесь со мной для обсуждения деталей.',
      cost: 1100,
      status: ApplicationStatus.PENDING,
      userId: 3,
    },
  ];
};

export const getMockApplicationPublications = () => {
  return [
    {
      applicationId: 1,
      publicationId: 1,
      publicationDate: daysFromTodayDate(3),
    },
    {
      applicationId: 1,
      publicationId: 2,
      publicationDate: daysFromTodayDate(5),
    },
    {
      applicationId: 2,
      publicationId: 2,
      publicationDate: daysFromTodayDate(4),
    },
    {
      applicationId: 3,
      publicationId: 3,
      publicationDate: daysFromTodayDate(6),
    },
    {
      applicationId: 4,
      publicationId: 4,
      publicationDate: daysFromTodayDate(7),
    },
    {
      applicationId: 5,
      publicationId: 5,
      publicationDate: daysFromTodayDate(4),
    },
    {
      applicationId: 6,
      publicationId: 6,
      publicationDate: daysFromTodayDate(8),
    },
    {
      applicationId: 7,
      publicationId: 7,
      publicationDate: daysFromTodayDate(6),
    },
    {
      applicationId: 8,
      publicationId: 8,
      publicationDate: daysFromTodayDate(9),
    },
    {
      applicationId: 9,
      publicationId: 9,
      publicationDate: daysFromTodayDate(3),
    },
    {
      applicationId: 10,
      publicationId: 9,
      publicationDate: daysFromTodayDate(10),
    },
  ];
};

export const getMockUsers = async () => {
  const password = await bcrypt.hash('12345678', 10);
  return [
    {
      login: 'admin',
      email: 'admin@gmail.com',
      fullName: 'Пантелеев Егор Евгеньевич',
      phone: '+7(342)-342-34-23',
      address: 'Ярославль, Тутаевское ш. 31А',
      companyName: 'STAR PLATINUM',
      lastVisitDate: new Date('2024-05-10T15:30:00Z'),
      role: 1,
      avatarUrl: '/uploads/default/user-1.jpg',
      password,
    },
    {
      login: 'kakeparake',
      email: 'kakeparake@gmail.com',
      fullName: 'Иванов Иван Иванович',
      phone: '+7(495)-123-45-67',
      address: 'Москва, Ленина 10',
      companyName: 'Ivanov Co',
      lastVisitDate: new Date('2024-05-12T12:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-2.jpg',
      password,
    },
    {
      login: 'petrov456',
      email: 'petrovsergey@gmail.com',
      fullName: 'Петров Сергей Сергеевич',
      phone: '+7(812)-987-65-43',
      address: 'Санкт-Петербург, Невский проспект 20',
      companyName: 'Petrov Consulting',
      lastVisitDate: new Date('2024-05-14T09:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-3.jpg',
      password,
    },
    {
      login: 'sergeev789',
      email: 'sergeevpavel@yandex.ru',
      fullName: 'Сергеев Павел Дмитриевич',
      phone: '+7(846)-543-21-00',
      address: 'Самара, Гагарина 5',
      companyName: 'Sergeev Services',
      lastVisitDate: new Date('2024-05-16T18:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-4.jpg',
      password,
    },
    {
      login: 'smirnov123',
      email: 'smirnovandrey@mail.ru',
      fullName: 'Смирнов Андрей Петрович',
      phone: '+7(495)-678-90-12',
      address: 'Москва, Арбат 15',
      companyName: 'Smirnov Industries',
      lastVisitDate: new Date('2024-05-18T10:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-5.jpg',
      password,
    },
    {
      login: 'novikov456',
      email: 'novikovigor@gmail.com',
      fullName: 'Новиков Игорь Александрович',
      phone: '+7(812)-765-43-21',
      address: 'Санкт-Петербург, Кронштадтский 30',
      companyName: 'Novikov Solutions',
      lastVisitDate: new Date('2024-05-19T14:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-6.jpg',
      password,
    },
    {
      login: 'popov789',
      email: 'popovsergey@yandex.ru',
      fullName: 'Попов Сергей Михайлович',
      phone: '+7(846)-432-10-00',
      address: 'Самара, Ленинградская 50',
      companyName: 'Popov Group',
      lastVisitDate: new Date('2024-05-20T08:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-7.jpg',
      password,
    },
    {
      login: 'sokolov123',
      email: 'sokolovalexey@mail.ru',
      fullName: 'Соколов Алексей Викторович',
      phone: '+7(495)-987-65-43',
      address: 'Москва, Пушкинская 25',
      companyName: 'Sokolov Technologies',
      lastVisitDate: new Date('2024-05-21T12:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-8.jpg',
      password,
    },
    {
      login: 'kuznetsov456',
      email: 'kuznetsovpashok@gmail.com',
      fullName: 'Кузнецов Павел Владимирович',
      phone: '+7(812)-654-32-10',
      address: 'Санкт-Петербург, Большой проспект 45',
      companyName: 'Kuznetsov Consulting',
      lastVisitDate: new Date('2024-05-22T16:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-9.jpg',
      password,
    },
    {
      login: 'morozov789',
      email: 'morozovviktor@yandex.ru',
      fullName: 'Морозов Виктор Николаевич',
      phone: '+7(846)-321-00-99',
      address: 'Самара, Московская 80',
      companyName: 'Morozov Enterprises',
      lastVisitDate: new Date('2024-05-23T09:00:00Z'),
      role: 0,
      avatarUrl: '/uploads/default/user-10.jpg',
      password,
    },
  ];
};
