interface TimeTableInterface {
  monFirst?: boolean;
  weeks?: string[];
}

interface SwipeInterface {
  initialSlide?: number;
  auto?: number;
  speed: number;
  loop?: boolean;
}

interface SlideInterface {
  className?: string;
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
  TimeTableInterface,
}
