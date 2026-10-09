import * as fs from 'fs';
import * as path from 'path';

// small file used to pass the user from Scenario A to Scenario B
const folder = path.join(__dirname, '..', 'shared-data');
const filePath = path.join(folder, 'scenarioA.json');

export type SharedData = {
  username: string;
  password: string;
  checkingId: string;
};

export function saveSharedData(data: SharedData) {
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function loadSharedData(): SharedData {
  if (!fs.existsSync(filePath)) {
    throw new Error('Run Scenario A first: shared-data/scenarioA.json was not found');
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}