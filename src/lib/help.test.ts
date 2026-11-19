import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COMMANDS, HELP } from './help';
import { MEDIA_LISTS } from './media';
import { PLAYER_BUTTONS, PLAYER_STATES, QUEUE_BUTTONS, QUEUE_STATES } from './objects';

/** The commands `onMessage` in main.ts compares `obj.command` with */
function commandsOfMain(): string[] {
    const source = readFileSync(join(__dirname, '..', 'main.ts'), 'utf8');
    return [...source.matchAll(/obj\.command === '([^']+)'/g)].map(m => m[1]);
}

/**
 * The names of the writable states and of the buttons
 *
 * @param states the states of a channel
 * @param buttons the buttons of a channel
 */
function writable(states: Record<string, ioBroker.StateCommon>, buttons: Record<string, unknown>): string[] {
    return [
        ...Object.entries(states)
            .filter(([, common]) => common.write)
            .map(([key]) => key),
        ...Object.keys(buttons),
    ];
}

describe('help', () => {
    it('lists exactly the commands of onMessage, each once', () => {
        const names = COMMANDS.map(c => c.command);
        expect(new Set(names).size).to.equal(names.length);
        expect([...names].sort()).to.deep.equal([...new Set(commandsOfMain())].sort());
    });

    it('marks no command as writing: the players are controlled by their states', () => {
        expect(COMMANDS.filter(c => c.write)).to.deep.equal([]);
    });

    it('names every command, every list of getMedia and every writable state', () => {
        for (const name of COMMANDS.map(c => c.command).filter(n => n !== 'help')) {
            expect(HELP, name).to.contain(name);
        }
        for (const word of [
            ...MEDIA_LISTS,
            ...writable(PLAYER_STATES, PLAYER_BUTTONS),
            ...writable(QUEUE_STATES, QUEUE_BUTTONS),
            'sendTo music-assistant.0',
            'How to talk to the user:',
        ]) {
            expect(HELP, word).to.contain(word);
        }
    });

    it('keeps the lines short', () => {
        for (const line of HELP.split('\n')) {
            expect(line.length, line).to.be.at.most(120);
        }
    });
});
