
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export type AppTab = 'manage' | 'raffle' | 'grouping';

export interface RaffleState {
  isRolling: boolean;
  currentName: string;
  winner: string | null;
  history: string[];
}
