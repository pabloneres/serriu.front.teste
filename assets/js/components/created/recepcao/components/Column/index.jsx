import React from 'react';

import { Column, Title, ContainerCards, Line } from '../../styles';

function ColumnComponent({title, children, background}) {
  return (
    <Column background={background}>
      <Line background={background}/>
      <Title>{title}</Title>
      <ContainerCards>
        {children}
      </ContainerCards>
    </Column>
  )
}

export default ColumnComponent;