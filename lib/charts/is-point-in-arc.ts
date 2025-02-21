export const checkIfDistanceIsInsideArc = (args: {
  centerX: number;
  centerY: number;
  radius: number;
  strokeWidth: number;
  x: number;
  y: number;
}) => {
  "worklet";
  const { centerX, centerY, radius, strokeWidth, x, y } = args;

  const dx = x - centerX;
  const dy = y - centerY;

  // Calculate distance from center
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Add padding to the hit area
  const touchPadding = 15;
  const innerRadius = radius - strokeWidth / 2 - touchPadding;
  const outerRadius = radius + strokeWidth / 2 + touchPadding;

  return distance >= innerRadius && distance <= outerRadius;
};

export const calculateTouchAngle = (args: {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
}) => {
  "worklet";
  const { x, y, centerX, centerY } = args;
  const dx = x - centerX;
  const dy = y - centerY;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  return angle;
};

// Helper function to check if a point is within an arc's bounds
export const isPointInArc = (args: {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  radius: number;
  startAngle: number;
  endAngle: number;
}) => {
  "worklet";

  const {
    x,
    y,
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
  } = args;

  const angle = calculateTouchAngle({ x, y, centerX, centerY });
  // Check if angle is within arc bounds
  if (startAngle <= endAngle) {
    return angle >= startAngle && angle <= endAngle;
  } else {
    // If angle is less than endAngle, add 360 to it for proper comparison
    const normalizedAngle = angle <= endAngle ? angle + 360 : angle;
    return normalizedAngle >= startAngle && normalizedAngle <= endAngle + 360;
  }
};
