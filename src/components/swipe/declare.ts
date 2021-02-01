interface SwipeInterface {
  initialSlide?: number;
  auto?: number;
  speed: number;
  timetableHeight?: number;
  loop?: boolean;
  useSwipe?: boolean;
}

interface SlideInterface {
  className?: string;
  useSwipe?: boolean;
}

type startType = {
  x: number;
  y: number;
  time: number;
}

type deltaType = {
  x: number;
  y: number;
}

export {
  SwipeInterface,
  SlideInterface,
  startType,
  deltaType,
}
