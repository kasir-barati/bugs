import { Injectable } from '@nestjs/common';
import { map, Observable, ReplaySubject } from 'rxjs';
import { SumReq, SumRes } from '../proto/interfaces/calc.interface';
import { Dummy } from './dummy';

@Injectable()
export class CalcService {
  sum(request: Observable<SumReq>, subject: ReplaySubject<SumRes>) {
    const counter = new Dummy();

    request
      .pipe(
        map((data) => {
          counter.increment();
          return data.number + counter.getCount();
        }),
      )
      .subscribe({
        next: (incrementedNumber) => {
          subject.next({ result: incrementedNumber });
        },
        error: (err) => {
          subject.error(err);
        },
        complete: () => {
          console.log(counter.getCount());
          subject.complete();
        },
      });
  }
}
