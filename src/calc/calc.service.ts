import { Injectable } from '@nestjs/common';
import { map, Observable, ReplaySubject } from 'rxjs';
import { SumReq, SumRes } from '../proto/interfaces/calc.interface';
import { Dummy } from './dummy';

@Injectable()
export class CalcService {
  sum(request: Observable<SumReq>, subject: ReplaySubject<SumRes>) {
    console.log('Initialize counter...');
    const counter = new Dummy();

    request
      .pipe(
        map((data) => {
          console.log('Initialize counter...');
          counter.increment();
          return data.number + counter.getCount();
        }),
      )
      .subscribe({
        next: (incrementedNumber) => {
          console.log('Next handler ' + incrementedNumber);
          subject.next({ result: incrementedNumber });
        },
        error: (err) => {
          console.log('Error handler ' + err);
          subject.error(err);
        },
        complete: () => {
          console.log('Complete handler...');
          console.log(counter.getCount());
          subject.complete();
        },
      });
  }
}
