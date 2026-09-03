import { DyvixMarquee, DyvixMarqueeItem } from '../../../src';

export function MarqueeTest() {
  return (
    <>
      <DyvixMarquee repeat={1}>
        <DyvixMarqueeItem>hi</DyvixMarqueeItem>
        <DyvixMarqueeItem>hei</DyvixMarqueeItem>
        <DyvixMarqueeItem>hi2</DyvixMarqueeItem>
        <DyvixMarqueeItem>hi11</DyvixMarqueeItem>
      </DyvixMarquee>

      <DyvixMarquee
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
