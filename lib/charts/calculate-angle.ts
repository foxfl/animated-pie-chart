export const calculateAngle = (args: {
  proportion: number;
  currentAngle: number;
  gap: number;
}) => {
  'worklet';
  const { proportion, currentAngle: _currentAngle, gap } = args;

  const sweepAngle = proportion * 360;

  const startAngle = (_currentAngle + 360) % 360; // Normalize to 0-360
  const endAngle = (startAngle + sweepAngle - gap + 360) % 360; // Normalize to 0-360
  const currentAngle = _currentAngle + sweepAngle;

  return {
    startAngle,
    endAngle,
    currentAngle,
  };
};
