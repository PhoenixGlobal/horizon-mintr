import React, { useMemo } from 'react';
import { connect } from 'react-redux';
// import { useTranslation } from 'react-i18next';
import { makeStyles, Typography } from '@material-ui/core';

import { getWalletBalances } from 'ducks/balances';
import { getCurrentTheme } from 'ducks/ui';
import { formatCurrency, shortenAddress } from 'helpers/formatters';

import Card from './Card';

// const TABLE_COLUMNS = ['HZN', 'zUSD', 'BNB', 'Zassets', 'Debt'];
// const TABLE_COLUMNS = ['HZN', 'zUSD'];
// const AGGREGATED_COLUMNS = ['Zassets', 'Debt'];

// const getBalance = (column, walletBalances, debtData) => {
//   if (!AGGREGATED_COLUMNS.includes(column)) {
//     return { balance: walletBalances[column] };
//   } else if (column === 'Zassets') {
//     return { ...walletBalances.totalSynths, tooltip: 'zassets' };
//   } else {
//     return {
//       balance: debtData.debtBalance,
//       tooltip: 'debt',
//     };
//   }
// };

// const mapBalanceData = (loading, walletBalances, debtData) => {
//   if (loading) {
//     return [];
//   }
//   const balances = { ...walletBalances.crypto, ...walletBalances };
//   return TABLE_COLUMNS.map(column => {
//     return {
//       name: AGGREGATED_COLUMNS.includes(column)
//         ? `dashboard.table.${column.toLowerCase()}`
//         : column,
//       icon: AGGREGATED_COLUMNS.includes(column) ? 'HZN' : column,
//       ...getBalance(column, balances, debtData),
//     };
//   });
// };

const useStyles = makeStyles(theme => ({
  network: {
    whiteSpace: 'nowrap',
    fontSize: 14,
  },
  dot: {
    marginRight: 6,
    display: 'inline-block',
    height: 12,
    width: 12,
    backgroundColor: '#3481B7',
    borderRadius: '50%',
  },
}));

const Network = ({ currentWallet }) => {
  const classes = useStyles();
  return (
    <Typography variant="body2" align="center" className={classes.network}>
      <i className={classes.dot} />
      {shortenAddress(currentWallet)}
    </Typography>
  );
};

const BalanceCard = ({ loading, currentWallet, walletBalances, debtData }) => {
  // const rows = mapBalanceData(loading, walletBalances, debtData).map(({ name, balance }) => ({
  //   name: `${name} Balance`,
  //   value: formatCurrency(balance || 0),
  // }));
  const rows = useMemo(
    () => [
      {
        name: 'HZN Balance',
        value: formatCurrency(debtData?.transferable),
      },
      {
        name: 'zUSD Balance',
        value: formatCurrency(walletBalances?.crypto?.zUSD),
      },
    ],
    [debtData, walletBalances]
  );

  return (
    <Card
      loading={loading}
      rows={rows}
      title={<Network currentWallet={currentWallet} />}
      style={{ marginLeft: 8 }}
    />
  );
};

const mapStateToProps = state => ({
  walletBalances: getWalletBalances(state),
  currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(BalanceCard);
