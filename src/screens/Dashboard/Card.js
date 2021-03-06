import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  card: {
    height: props => props.height || 90,
    borderRadius: 16,
    padding: '8px 0',
  },
  title: {
    padding: '0 24px',
    height: 26,
  },
  cell: {
    border: 'none',
    padding: '4px 8px',
    fontSize: 12,
    whiteSpace: 'nowrap',
    '&:last-child': {
      paddingRight: 8,
    },
  },
  cellLabel: {
    color: '#88ABC3',
  },
}));

export default function HeaderCard({ loading = true, height, rows = [], title, style }) {
  const classes = useStyles({ height });

  return (
    <Card variant="outlined" className={classes.card} style={style}>
      {title && <Box className={classes.title}>{title}</Box>}
      <TableContainer>
        <Table size="small">
          <TableBody>
            {rows.map(({ name, value }) => (
              <TableRow key={name}>
                <TableCell align="right" className={classes.cell}>
                  {value}
                </TableCell>
                <TableCell align="right" className={clsx(classes.cell, classes.cellLabel)}>
                  {name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
