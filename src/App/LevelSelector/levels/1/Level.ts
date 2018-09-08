import LevelI from '../../../interfaces/LevelI';
import Reward from '../../../interfaces/Reward';

// TODO: build a step in webpack build to move these into dist folder

const Level: LevelI = {
    paddle: {
        size: { width: 9, height: 3 },
        position: { x: 47, y: 49 }
    },
    guy: {
        size: { width: 3, height: 3 },
        position: { x: 11, y: 17 }
    },
    size: {
        width: 100,
        height: 50
    },
    blocks: [
        { point: { x: 11, y: 20 }, size: { width: 3, height: 3 }, strength: 1, reward: Reward.rocket },
        { point: { x: 14, y: 20 }, size: { width: 3, height: 3 }, strength: 2, reward: Reward.wide },
        { point: { x: 17, y: 20 }, size: { width: 3, height: 3 }, strength: 3, reward: Reward.wide },
        { point: { x: 20, y: 20 }, size: { width: 3, height: 3 }, strength: 5 },
        { point: { x: 23, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 26, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 29, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 32, y: 20 }, size: { width: 3, height: 3 }, strength: 5, reward: Reward.machine },
        { point: { x: 32, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 35, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 38, y: 20 }, size: { width: 3, height: 3 }, strength: 6 },
        { point: { x: 41, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 44, y: 20 }, size: { width: 3, height: 3 }, strength: 3 },
        { point: { x: 47, y: 20 }, size: { width: 3, height: 3 }, strength: 4 },
        { point: { x: 50, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 53, y: 20 }, size: { width: 3, height: 3 }, strength: 2 },
        { point: { x: 56, y: 20 }, size: { width: 3, height: 3 }, strength: 4 },
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
