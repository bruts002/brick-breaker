import LevelI from '../../../interfaces/LevelI';

const Level: LevelI = {
    size: {
        width: 100,
        height: 50
    },
    blocks: [
        { point: { x: 11, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 14, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 17, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 20, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 23, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 26, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 29, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 32, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 32, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 35, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 38, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 41, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 44, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 47, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 50, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 53, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 56, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 59, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
    ],
    balls: [{
        trajectory: { x: 1, y: 1 },
        radius: 1,
        point: { x: 20, y: 9 }
    }, {
        trajectory: { x: 1, y: 1 },
        radius: 1,
        point: { x: 1, y: 1 }
    }]
};

export default Level;
