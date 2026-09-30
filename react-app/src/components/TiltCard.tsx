import { useRef, type PointerEvent, type ReactNode } from 'react';

type Props = {
  icon: string;
  title: string;
  children: ReactNode;
};

// Card that tilts in 3D toward the pointer, with a moving glare highlight.
function TiltCard({ icon, title, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--rx', `${(0.5 - py) * 18}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 18}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div className="tilt-card" ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <div className="tilt-card__inner">
        <div className="tilt-card__icon">{icon}</div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

export default TiltCard;
