import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import hznJSConnector from '../../../../helpers/hznJSConnector';

import { bigNumberFormatter, formatCurrency } from '../../../../helpers/formatters';
import TransactionPriceIndicator from '../../../../components/TransactionPriceIndicator';
import { getWalletDetails } from '../../../../ducks/wallet';

import { PageTitle, PLarge, ButtonTertiaryLabel } from '../../../../components/Typography';
import DataBox from '../../../../components/DataBox';
import { ButtonTertiary, ButtonPrimary } from '../../../../components/Button';

import CurvepoolActions from '../../../CurvepoolActions';

const TRANSACTION_DETAILS = {
	stake: {
		contractFunction: 'stake',
		gasLimit: 200000,
	},
	claim: {
		contractFunction: 'getReward',
		gasLimit: 200000,
	},
	unstake: {
		contractFunction: 'withdraw',
		gasLimit: 125000,
	},
	exit: {
		contractFunction: 'exit',
		gasLimit: 250000,
	},
};

const Stake = ({ walletDetails, goBack }) => {
	const { t } = useTranslation();
	const { curvepoolContract, oldCurvepoolContract } = hznJSConnector;
	const [balances, setBalances] = useState(null);
	const [gasLimit, setGasLimit] = useState(TRANSACTION_DETAILS.stake.gasLimit);
	const [currentScenario, setCurrentScenario] = useState({});
	const { currentWallet } = walletDetails;

	const fetchData = useCallback(async () => {
		if (!hznJSConnector.initialized) return;
		try {
			const { curveLPTokenContract, curvepoolContract } = hznJSConnector;
			const [univ1Held, univ1Staked, rewards, oldUniv1Staked, oldRewards] = await Promise.all([
				curveLPTokenContract.balanceOf(currentWallet),
				curvepoolContract.balanceOf(currentWallet),
				curvepoolContract.earned(currentWallet),
				oldCurvepoolContract.balanceOf(currentWallet),
				oldCurvepoolContract.earned(currentWallet),
			]);
			setBalances({
				univ1Held: bigNumberFormatter(univ1Held),
				univ1HeldBN: univ1Held,
				univ1Staked: bigNumberFormatter(univ1Staked),
				univ1StakedBN: univ1Staked,
				rewards: bigNumberFormatter(rewards),
				oldUniv1Staked: bigNumberFormatter(oldUniv1Staked),
				oldRewards: bigNumberFormatter(oldRewards),
			});
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet, hznJSConnector.initialized]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		if (!currentWallet) return;
		const { curvepoolContract } = hznJSConnector;

		curvepoolContract.on('Staked', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		curvepoolContract.on('Withdrawn', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		curvepoolContract.on('RewardPaid', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		return () => {
			if (hznJSConnector.initialized) {
				curvepoolContract.removeAllListeners('Staked');
				curvepoolContract.removeAllListeners('Withdrawn');
				curvepoolContract.removeAllListeners('RewardPaid');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<Container>
			<CurvepoolActions {...currentScenario} onDestroy={() => setCurrentScenario({})} />
			<Navigation>
				<ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://etherscan.io/address/${curvepoolContract.address}`}
				>
					{t('lpRewards.shared.buttons.goToContract')} ↗
				</ButtonTertiary>
			</Navigation>
			<PageTitle>{t('curvepool.title')}</PageTitle>
			<PLarge>{t('curvepool.unlocked.subtitle')}</PLarge>
			<PLarge>
				<Link href="https://blog.synthetix.io/new-curve-pool-launch/" target="_blank">
					<ButtonTertiaryLabel>{t('lpRewards.shared.unlocked.link')}</ButtonTertiaryLabel>
				</Link>
			</PLarge>
			<BoxRow>
				<DataBox
					heading={t('lpRewards.shared.data.balance')}
					body={`${balances ? formatCurrency(balances.univ1Held) : 0} Curve LP`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.staked')}
					body={`${balances ? formatCurrency(balances.univ1Staked) : 0} Curve LP`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.rewardsAvailable')}
					body={`${balances ? formatCurrency(balances.rewards) : 0} HZN`}
				/>
			</BoxRow>
			<ButtonBlock>
				<ButtonRow>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['stake'].gasLimit)}
						disabled={!balances || !balances.univ1Held}
						onClick={() =>
							setCurrentScenario({
								action: 'stake',
								label: t('lpRewards.shared.actions.staking'),
								amount: `${balances && formatCurrency(balances.univ1Held)} Curve LP`,
								param: balances && balances.univ1HeldBN,
								...TRANSACTION_DETAILS['stake'],
							})
						}
					>
						{t('lpRewards.shared.buttons.stake')}
					</ButtonAction>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['claim'].gasLimit)}
						disabled={!balances || !balances.rewards}
						onClick={() =>
							setCurrentScenario({
								action: 'claim',
								label: t('lpRewards.shared.actions.claiming'),
								amount: `${balances && formatCurrency(balances.rewards)} HZN`,
								...TRANSACTION_DETAILS['claim'],
							})
						}
					>
						{t('lpRewards.shared.buttons.claim')}
					</ButtonAction>
				</ButtonRow>
				<ButtonRow>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['unstake'].gasLimit)}
						disabled={!balances || !balances.univ1Staked}
						onClick={() =>
							setCurrentScenario({
								action: 'unstake',
								label: t('lpRewards.shared.actions.unstaking'),
								amount: `${balances && formatCurrency(balances.univ1Staked)} Curve LP`,
								param: balances && balances.univ1StakedBN,
								...TRANSACTION_DETAILS['unstake'],
							})
						}
					>
						{t('lpRewards.shared.buttons.unstake')}
					</ButtonAction>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['exit'].gasLimit)}
						disabled={!balances || (!balances.univ1Staked && !balances.rewards)}
						onClick={() =>
							setCurrentScenario({
								action: 'exit',
								label: t('lpRewards.shared.actions.exiting'),
								amount: `${balances && formatCurrency(balances.univ1Staked)} Curve LP & ${
									balances && formatCurrency(balances.rewards)
								} HZN`,
								...TRANSACTION_DETAILS['exit'],
							})
						}
					>
						{t('lpRewards.shared.buttons.exit')}
					</ButtonAction>
				</ButtonRow>
				<ButtonRow style={{ marginTop: '64px' }}>
					<ButtonActionFullRow
						disabled={!balances || (!balances.oldUniv1Staked && !balances.oldRewards)}
						onClick={() =>
							setCurrentScenario({
								action: 'exit-old',
								label: t('lpRewards.shared.actions.exiting'),
								amount: `${balances && formatCurrency(balances.oldUniv1Staked)} Curve LP & ${
									balances && formatCurrency(balances.oldRewards)
								} HZN`,
								...TRANSACTION_DETAILS['exit'],
							})
						}
					>
						{t('lpRewards.shared.buttons.exit-old')}
					</ButtonActionFullRow>
				</ButtonRow>
			</ButtonBlock>
			<TransactionPriceIndicator gasLimit={gasLimit} canEdit={true} />
		</Container>
	);
};

const Link = styled.a`
	text-decoration-color: ${props => props.theme.colorStyles.buttonTertiaryText};
`;

const Container = styled.div`
	min-height: 850px;
`;

const Navigation = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 40px;
`;

const BoxRow = styled.div`
	margin-top: 42px;
	display: flex;
`;

const ButtonBlock = styled.div`
	margin-top: 58px;
`;

const ButtonRow = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 28px;
	width: 100%;
`;

const ButtonAction = styled(ButtonPrimary)`
	flex: 1;
	width: 10px;
	height: 64px;
	&:first-child {
		margin-right: 34px;
	}
`;

const ButtonActionFullRow = styled(ButtonAction)`
	flex: none;
	width: 50%;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
