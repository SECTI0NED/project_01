import {useState, useCallback} from 'react';
import { checkCollision, checkShadowCollision, STAGE_HEIGHT, STAGE_WIDTH } from '../utilities/gameHelpers';
import { TETROMINOS, randomTetromino } from '../tetrominos/tetrominos';

export const usePlayer = () => {

    const[playerShadow, setPlayerShadow] = useState({
        pos: {x: 0, y: 0},
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });
    const[player, setPlayer] = useState({
        pos: {x: 0, y: 0},
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });

    const setShadow = (position) => {
        setPlayerShadow({  
            pos: {x: 0, y: position},
            tetromino: player.tetromino,
            collided: false,
        })
    }

    const updatePlayerShadow = (dir, stage) => {
        let yvar = 1
        while(!checkCollision(player, stage, {x: dir, y: yvar})){
            yvar+=1
        }
        let shadowPos = yvar-1
        setShadow(shadowPos)
    }

    const rotate = (tetromino, dir) => {
        // Make rows into cols
        const rotatedTetro = tetromino.map((_, index) => 
            tetromino.map(col => col[index]),
        );

        // Reverse each row to get rotated matrix
        if (dir > 0) return rotatedTetro.map(row => row.reverse());
        return rotatedTetro.reverse()
    }

    const rotateShadow = (stage, dir, pos, offset) => {
        const clonedShadow = JSON.parse(JSON.stringify(playerShadow))
        
        // Making sure it doesnt merge when its supposed to collide.
  
        while(checkShadowCollision(clonedShadow, stage, {x: 0, y:0})) {
            console.log("COLLIDED")
            clonedShadow.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if(offset > clonedShadow.tetromino[0].length) {
                rotate(clonedShadow.tetromino, -dir);
                clonedShadow.pos.x = pos;
                console.log("OFFSET LARGER THAN LENGTH")
                // shadow.pos.y -= 1
                // yvar -= 1               
            }   
        }
        setShadow(clonedShadow)
        // console.log(playerShadow)
        // console.log("Shadow", yvar)
    }

    const playerRotate = (stage, dir) => {

        const clonedPlayer = JSON.parse(JSON.stringify(player))
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);
        
        
        
        const pos = clonedPlayer.pos.x;
        let offset = 1;
        rotateShadow(stage, dir, pos, offset)
        
        // Making sure it doesnt merge when its supposed to collide.
        while(checkCollision(clonedPlayer, stage, {x: 0, y: 0})) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if(offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        setPlayer(clonedPlayer);
    }

    const updatePlayerPos = ({x, y, collided}) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
            collided,
        }))
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH/2 - 2, y: 0},
            tetromino: randomTetromino().shape,
            collided: false,
        })
    }, [])

    return [
            player, updatePlayerPos, 
            resetPlayer, playerRotate, 
            playerShadow, updatePlayerShadow, 
            setShadow
        ];
}