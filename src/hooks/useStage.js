import { useState, useEffect } from 'react';
import { createStage, STAGE_HEIGHT } from '../utilities/gameHelpers';

export const useStage = (player, resetPlayer, shadow) => {
    const[stage, setStage] = useState(createStage());
    const[rowsCleared, setRowsCleared] = useState(0);

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
            // Clean stage
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

            // Draw the tetromino and shadow
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if(value !== 0){
                        // console.log(y, x)
                        // console.log(y + player.pos.y + shadow)
                        newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? 'merged' : 'clear'}`]

                        if(!player.collided){
                            if(y + player.pos.y + shadow < STAGE_HEIGHT){
                                newStage[y + player.pos.y + shadow][x + player.pos.x] = [ value, 'shadow']
                            }    
                        }
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
            return updateStage(prev)
        })

    }, [player])

    return [stage, setStage, rowsCleared];
}