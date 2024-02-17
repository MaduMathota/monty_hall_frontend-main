import { Component } from '@angular/core';
import { MontyHallService } from '../MontyHallService/monty-hall.service';
import { DoorState } from '../DoorSate/Door-states';

@Component({
  selector: 'app-monty-hall',
  templateUrl: './monty-hall.component.html',
  styleUrls: ['./monty-hall.component.css']
})
export class MontyHallComponent {

  carImage: string = 'car';
  goatImage: string = 'goat';

  doors: { prize: string, revealed: boolean }[] = [
    { prize: this.goatImage, revealed: false },
    { prize: this.goatImage, revealed: false },
    { prize: this.goatImage, revealed: false }
  ];

  state: DoorState.PICK | DoorState.REVEAL = DoorState.PICK ;
  pickedDoor: number | null = null;
  switchButtonVisible = false;
  stayButtonVisible = false;
  playAgainVisible = false;
  outcome = '';

  totalSwitchPlays = 0;
  totalStayPlays = 0;
  totalSwitchWins = 0;
  totalStayWins = 0;

  manuallyswitchRate: number = 0;
  manuallystayRate: number = 0;

  simulations: number = 0;
  changeDoor: boolean = true;

  switchWinRate: number = 0;
  stayWinRate: number = 0;


  constructor(private montyHallService: MontyHallService) {
  }

  ngOnInit() {
    this.startOver();
  }

  startOver() {
    this.resetDoors();
    this.state = DoorState.PICK;
    this.pickedDoor = null;
    this.playAgainVisible = false;
    this.outcome = '';
  }

  resetDoors() {
    this.doors.forEach(door => door.revealed = false);
    const carIndex = Math.floor(Math.random() * this.doors.length);
    this.doors.forEach((door, index) => door.prize = index === carIndex ? this.carImage : this.goatImage);
  }

  pickDoor(index: number) {
    if (this.state === DoorState.PICK) {
      this.pickedDoor = index;
      this.state = DoorState.REVEAL;
      this.reveal();
    }
  }

  reveal() {
    const options = this.doors.filter((door, index) => index !== this.pickedDoor && door.prize === this.goatImage);
    const revealedDoorIndex = this.doors.indexOf(options[Math.floor(Math.random() * options.length)]);
    this.doors[revealedDoorIndex].revealed = true;
    this.switchButtonVisible = true;
    this.stayButtonVisible = true;
  }

  playerSwitch() {
    this.totalSwitchPlays++;
    const newPick = this.doors.findIndex((door, index) =>
      index !== this.pickedDoor && !door.revealed);
    this.pickedDoor = newPick;
    this.checkWin(true);
  }

  playerStay() {
    this.totalStayPlays++;
    this.checkWin(false);
  }

  checkWin(playerSwitch: boolean) {
    this.switchButtonVisible = false;
    this.stayButtonVisible = false;

    if (this.pickedDoor === null) {
      return;
    }

    const win = this.doors[this.pickedDoor].prize === this.carImage;
    if (win) {
      this.outcome = 'You win!';
      playerSwitch ? this.totalSwitchWins++ : this.totalStayWins++;
    } else {
      this.outcome = 'You lose!';
    }

    this.calculateWinRates();
    this.doors[this.pickedDoor].revealed = true;
    this.playAgainVisible = true;
  }

  calculateWinRates() {
    this.manuallyswitchRate = this.calculateWinRate(this.totalSwitchPlays, this.totalSwitchWins);
    this.manuallystayRate = this.calculateWinRate(this.totalStayPlays, this.totalStayWins);
  }

  calculateWinRate(totalPlays: number, totalWins: number): number {
    return totalPlays === 0 ? 0 : (totalWins / totalPlays) * 100;
  }

  runSimulations() {
    this.montyHallService.runMontyHallSimulations(this.simulations, this.changeDoor)
      .subscribe((result) => {
        this.switchWinRate = result.switchWinRate;
        this.stayWinRate = result.stayWinRate;
      });
  }
}
