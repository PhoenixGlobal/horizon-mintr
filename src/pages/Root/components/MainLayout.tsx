import styled from 'styled-components';

import { FlexDiv } from 'styles/common';

const MainLayout = styled(FlexDiv)`
  flex-flow: column;
  width: 100%;
  min-width: 1200px;
  min-height: 100vh;
  position: relative;
  background: radial-gradient(#11263b, #120c1c);
`;

export default MainLayout;
