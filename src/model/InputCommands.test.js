import InputCommands from './InputCommands.js';

describe('InputCommands', () => {
  it('should create an instance with command and token', () => {
    const cmd = new InputCommands('BALANCE', ['MC1', '100']);
    expect(cmd.getCommand()).toBe('BALANCE');
    expect(cmd.getToken()).toEqual(['MC1', '100']);
  });

  it('should set and get command', () => {
    const cmd = new InputCommands('BALANCE', []);
    cmd.setCommand('CHECK_IN');
    expect(cmd.getCommand()).toBe('CHECK_IN');
  });

  it('should set and get token', () => {
    const cmd = new InputCommands('BALANCE', []);
    cmd.setToken(['MC2', 'ADULT', 'CENTRAL']);
    expect(cmd.getToken()).toEqual(['MC2', 'ADULT', 'CENTRAL']);
  });

  it('should compare equality with another InputCommands instance', () => {
    const cmd1 = new InputCommands('BALANCE', ['MC1', '100']);
    const cmd2 = new InputCommands('BALANCE', ['MC1', '100']);
    expect(cmd1.equals(cmd2)).toBe(true);
  });

  it('should return false when compared with a different InputCommands instance', () => {
    const cmd1 = new InputCommands('BALANCE', ['MC1', '100']);
    const cmd2 = new InputCommands('BALANCE', ['MC2', '200']);
    expect(cmd1.equals(cmd2)).toBe(false);
  });

  it('should return false when compared with non-InputCommands object', () => {
    const cmd = new InputCommands('BALANCE', ['MC1', '100']);
    expect(cmd.equals({ command: 'BALANCE', token: ['MC1', '100'] })).toBe(false);
  });

  it('should return true when compared with itself', () => {
    const cmd = new InputCommands('BALANCE', ['MC1', '100']);
    expect(cmd.equals(cmd)).toBe(true);
  });

  it('should return false when compared with null', () => {
    const cmd = new InputCommands('BALANCE', ['MC1', '100']);
    expect(cmd.equals(null)).toBe(false);
  });
});