import { useState, useEffect } from 'react';
import { checkCollision, createStage } from '../utilities/gameHelpers';

export const useStage = (player, resetPlayer) => {
    const[stage, setStage] = useState(createStage());
    const[rowsCleared, setRowsCleared] = useState(0);

    // const getShadowValue = (stage) => {
    //     let y_var = 1;
    //     while(!checkCollision(player, stage, {x:0, y:y_var})) {
    //         y_var+=1;
    //     }
    //     return y_var
    // };

    useEffect(() => {

        setRowsCleared(0);

        const sweepRows = newStage =>
            newStage.reduce((ack, row) => {
                if(row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, [])

        const updateStage = (prevStage) => {
            const newStage = prevStage.map(row => 
                row.map(
                    cell => { 
                        if(cell[1] === "clear" || cell[1] === "shadow") {
                            return [0, "clear"]
                        } else {
                            return cell
                        }
                    }
                ),
            );


            // let y_var = 1;
            // while(!checkCollision(player, newStage, {x:0, y:y_var})) {
            //     y_var+=1;
            // }

            // Draw the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if(value !== 0){
                        // console.log(y, x)
                        newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? 'merged' : 'clear'}`]
                        newStage[y + 14][x + player.pos.x] = [ value, 'shadow']
                    }
                })
            });

        
            if(player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }
            return newStage;
        };
        
        setStage(prev => {
            // const shadowValue = getShadowValue(prev)
            return updateStage(prev)
        })

    }, [player])

    return [stage, setStage, rowsCleared];
}