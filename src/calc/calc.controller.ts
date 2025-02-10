import { Controller } from '@nestjs/common';
import {
  CalcServiceController,
  CalcServiceControllerMethods,
  SumReq,
  SumRes,
} from '../proto/interfaces/calc.interface';
import { Observable, ReplaySubject } from 'rxjs';

@Controller('calc')
@CalcServiceControllerMethods()
export class CalcController implements CalcServiceController {
  sum(request: Observable<SumReq>): Observable<SumRes> {
    const subject = new ReplaySubject<SumRes>(1);
    let num: number;

    request.subscribe((req) => {
      num = req.number;
      subject.next({ result: num + 1 });
      subject.complete();
    });

    return subject.asObservable();
  }
}
