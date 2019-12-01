import React, { useContext, useState } from 'react';

import {AuthContext} from '../Auth'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 400,
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={`Item ${index + 1}`} />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default function AccountsComponent() {

   const classes = useStyles();

   const {currentUser} = useContext(AuthContext)
   const [accounts, setAccounts] = useState([])

  return (
     <div>
         <h1>Accounts</h1>
        <div className={classes.root}>
          <FixedSizeList height={400} width={360} itemSize={46} itemCount={200}>
            {renderRow}
          </FixedSizeList>
        </div>
     </div>
  );
}
