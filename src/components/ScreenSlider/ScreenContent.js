import styled from 'styled-components';

const ScreenContent = styled.div`
  width: 100%;
  height: 640px;
  /* max-width: 720px; */
  margin: 0 auto;
  overflow: hidden;
  /* background-color: ${props => props.theme.colorStyles.panels}; */
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;

  padding: 32px;
  text-align: center;
`;

export default ScreenContent;
