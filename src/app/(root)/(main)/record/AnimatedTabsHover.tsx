import { CalendarClock } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import Link from 'next/link';

export function AnimatedTabsHover() {
  const TABS = [
    {
      label: '週',
      icon: <CalendarClock className='h-5 w-5' />,
      href: '',
    },
    {
      label: '月',
      icon: <CalendarClock className='h-5 w-5' />,
      href: '',
    },
    {
      label: '年',
      icon: <CalendarClock className='h-5 w-5' />,
      href: '',
    },
  ];

  return (
    <div className='flex space-x-2 p-1 bg-slate-200 rounded-lg'>
      <AnimatedBackground
        defaultValue={TABS[0].label}
        className='rounded-lg bg-white'
        transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.3,
        }}
        enableHover
      >
        {TABS.map((tab) => (
          <button
            key={tab.label}
            data-id={tab.label}
            type='button'
            className='inline-flex h-9 w-full items-center justify-center transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 px-2'
          >
            <Link href={tab.href}>
              <p className='flex items-center justify-center gap-1'>
                <span>{tab.label}</span>
                <span className='hidden md:block'>{tab.icon}</span>
              </p>
            </Link>
          </button>
        ))}
      </AnimatedBackground>
    </div>
  );
}
