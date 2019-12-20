import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { sizing } from '@material-ui/system';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function HomeComponent() {

  return (
    <div>
    <Box height="100%" width="100%">
       <Box height="25%" bgcolor="grey.300" mx={0.5} width={120} display="inline-block">
        Height 25%
       </Box>
       <Box height="50%" bgcolor="grey.300" mx={0.5} width={120} display="inline-block">
        Height 50%
       </Box>
       <Box height="75%" bgcolor="grey.300" mx={0.5} width={120} display="inline-block">
        Height 75%
       </Box>
       <Box height="100%" bgcolor="grey.300" mx={0.5} width={120} display="inline-block">
        Height 100%
       </Box>
    </Box>
    </div>
  );
}
