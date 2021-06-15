import React from 'react';
import { StyledStartButton } from './styles/StyledStartButton';

const StartButton = ({callback}) => (
    <StyledStartButton className="btn" onClick={callback}>Start Button</StyledStartButton>
)

export default StartButton;