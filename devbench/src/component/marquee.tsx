import gsap from 'gsap';
import { DyvixMarquee, DyvixMarqueeItem } from '../../../src';

export function MarqueeTest() {
  const tl = gsap.timeline();
  return (
    <>
      <DyvixMarquee
        theme={'Ember'}
        timeline={tl}
        repeat={1}
        items={[
          { label: 'Next.js', href: 'https://nextjs.org' },
          { label: 'GSAP Animations', href: 'https://gsap.com' },
          { label: 'Dyvix UI Headless', href: '/docs' },
          { label: 'Tailwind CSS' }
        ]}
      />
    </>
  );
}
