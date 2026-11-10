const features = [
  {
    icon: '✍️',
    title: '글쓰기',
    description: '떠오르는 생각을 자유롭게 글로 남기고, 언제든 수정하거나 삭제할 수 있어요.',
  },
  {
    icon: '💬',
    title: '댓글',
    description: '다른 사람의 글에 댓글을 남기고 이야기를 이어 가 보세요.',
  },
  {
    icon: '🔔',
    title: '좋아요와 알림',
    description: '마음에 드는 글에 좋아요를 누르고, 내 글의 새 소식을 알림으로 받아 보세요.',
  },
];

export function FeatureSection() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-24">
      <h2 className="mb-8 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        이런 걸 할 수 있어요
      </h2>
      <ul className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
          >
            <span className="text-3xl" aria-hidden="true">
              {feature.icon}
            </span>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {feature.title}
            </h3>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
