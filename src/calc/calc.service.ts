import { Injectable } from '@nestjs/common';
import { map, Observable, ReplaySubject } from 'rxjs';
import { SumReq, SumRes } from '../proto/interfaces/calc.interface';
import { CounterService } from './counter.service';

@Injectable()
export class CalcService {
  sum(request: Observable<SumReq>, subject: ReplaySubject<SumRes>) {
    // Why even though I can see this log multiple times but the counter keeps increasing?
    // Is not this line creating a new counter instance?
    console.log('Initialize counter...');
    const counterService = new CounterService();

    request
      .pipe(
        map((data) => {
          console.log('Initialize counter...');
          counterService.increment();
          return data.number + counterService.getCount();
        }),
      )
      .subscribe({
        next: (incrementedNumber) => {
          console.log('Next handler ' + incrementedNumber);
          console.log(
            'right now counter is ' + counterService.getCount(),
          );
          subject.next({ result: incrementedNumber });
        },
        error: (err) => {
          console.log('Error handler ' + err);
          subject.error(err);
        },
        complete: () => {
          // TODO: Will not be triggered!
          console.log('Complete handler...');
          console.log(counterService.getCount());
          subject.complete();
        },
      });
  }
}
