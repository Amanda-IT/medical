import React from 'react';
import { Card,CardContent,Box,Typography,Chip } from '@mui/material';

interface ChooseOptionsProps {
  options: any[];
  onChoose: (option: any) => void;
  isLoading: boolean;
}

const ChooseOptions: React.FC<ChooseOptionsProps> = ({ options, onChoose, isLoading }) => {
  return (
    <div>
      <Typography sx={{ pl: 2,mx:2 }}>Which one would you like to choose?</Typography>
      <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3列
            gap: 2,
            width: "90%",
            mx: "auto",
          }}
        >
          {options.map((option, index) => (
          <Card sx={{ width: 300, minWidth: 300, mr: 2, borderRadius: 2 }}>
            <CardContent>
              {
                Object.entries(option).map(([key, item]) => (
                  <Box key={index} mb={1}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      {key}
                    </Typography>
                    <Typography variant="body2">{item as string}</Typography>
                  </Box>
                ))
              }
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Chip label="Make an appointment" size="small" color="primary" onClick={() => onChoose(index +1)} />
              </Box>
            </CardContent>
          </Card>
          
        ))}
      </Box>
    </div>
  );
}

export default ChooseOptions;