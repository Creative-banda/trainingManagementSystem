import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const data = [
  { value: 5, label: 'Robotics' },
  { value: 10, label: 'Computer Science' },
];

const size = {
  width: 470,
  height: 200,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function TrainingChart() {
  return (
    <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
      <PieCenterLabel>Trainings</PieCenterLabel>
    </PieChart>
  );
}