import styled from "styled-components";
import bgImage from "../../img/background.jpg";

export const StyledTetrisWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: url(${bgImage}) #000;
    background-soze: cover;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
`

export const StyledTetris = styled.div`
    display: flex;
    align-items: flex-start;
    padding: 40px;
    margin: 0 auto;
    max-width: 900px;

    aside {
        width: 100%;
        max_width: 300px;
        display: block;
        padding 0 20px;
    }
`