import React from 'react';
import { Container, Spinner } from 'native-base';

const Loading = ({ size }) => {
  return (
    <Container style={styles.spinnerContainer}>
      <Spinner size={size}/>
    </Container>
  );
};

const styles = {
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  }
};

export { Loading };